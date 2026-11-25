"""API REST do SpotDSA.

Rodar (dentro de backend/):
    .venv/Scripts/python -m flask --app spotdsa.app:create_app run --port 5000
"""
    
from pathlib import Path

from flask import Flask, abort, jsonify, request

from . import armazenamento, deezer
from .estruturas.base import EstruturaCheia, EstruturaVazia
from .playlist import estado, exigir, nova_musica, nova_playlist, resumo

ARQUIVO_PADRAO = Path(__file__).resolve().parents[1] / "data" / "playlists.json"


def corpo():
    c = request.get_json(silent=True)
    if not isinstance(c, dict):
        raise ValueError("Envie um objeto JSON no corpo da requisição.")
    return c


def create_app(arquivo=ARQUIVO_PADRAO):
    app = Flask(__name__)
    app.json.ensure_ascii = False
    playlists = armazenamento.carregar(arquivo)  # {id: playlist}, em memória enquanto o servidor roda

    def achar(pid):
        if pid not in playlists:
            abort(404, "Playlist não encontrada.")
        return playlists[pid]

    def salvar_e_responder(playlist):
        armazenamento.salvar(arquivo, playlists)
        return jsonify(estado(playlist))

    # --- erros -----------------------------------------------------------
    @app.errorhandler(404)
    def nao_encontrado(e):
        return jsonify(erro=e.description), 404

    @app.errorhandler(ValueError)
    def invalido(e):
        return jsonify(erro=str(e)), 400

    @app.errorhandler(EstruturaCheia)
    @app.errorhandler(EstruturaVazia)
    def cheia_ou_vazia(e):
        return jsonify(erro=str(e)), 409

    @app.errorhandler(deezer.ErroDeezer)
    def deezer_fora(e):
        return jsonify(erro="Não foi possível falar com a Deezer."), 502

    # playlists
    @app.get("/api/playlists")
    def listar():
        return jsonify([resumo(p) for p in playlists.values()])

    @app.post("/api/playlists")
    def criar():
        p = nova_playlist(corpo())
        playlists[p["id"]] = p
        return salvar_e_responder(p), 201

    @app.get("/api/playlists/<pid>")
    def obter(pid):
        return jsonify(estado(achar(pid)))

    @app.delete("/api/playlists/<pid>")
    def apagar(pid):
        achar(pid)
        del playlists[pid]
        armazenamento.salvar(arquivo, playlists)
        return "", 204

    #músicas e player
    @app.post("/api/playlists/<pid>/musicas")
    def adicionar(pid):
        p = achar(pid)
        c = corpo()
        musica = nova_musica(c)
        posicao = c.get("posicao")
        if posicao is None:
            p["dados"].adicionar(musica)
        else:
            exigir(p, "inserir_em_posicao")
            p["dados"].inserir(posicao, musica)
        return salvar_e_responder(p)

    @app.delete("/api/playlists/<pid>/musicas/<int:posicao>")
    def remover(pid, posicao):
        p = achar(pid)
        exigir(p, "remover")
        p["dados"].remover(posicao)
        return salvar_e_responder(p)

    @app.post("/api/playlists/<pid>/proxima")
    def proxima(pid):
        p = achar(pid)
        p["dados"].proxima()
        return salvar_e_responder(p)

    @app.post("/api/playlists/<pid>/anterior")
    def anterior(pid):
        p = achar(pid)
        exigir(p, "anterior")
        p["dados"].anterior()
        return salvar_e_responder(p)

    @app.post("/api/playlists/<pid>/tocar/<int:posicao>")
    def tocar(pid, posicao):
        p = achar(pid)
        exigir(p, "escolher")
        p["dados"].tocar(posicao)
        return salvar_e_responder(p)

    #Deezer
    @app.get("/api/busca")
    def busca():
        q = (request.args.get("q") or "").strip()
        if not q:
            raise ValueError("Digite o que buscar.")
        return jsonify(deezer.buscar(q))

    @app.get("/api/deezer/<int:deezer_id>/preview")
    def preview(deezer_id):
        url = deezer.preview(deezer_id)
        if url is None:
            return jsonify(erro="Trecho indisponível."), 404
        return jsonify(preview_url=url)

    return app
