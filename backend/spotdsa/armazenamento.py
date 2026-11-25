"""Playlists salvas num arquivo JSON.

Para trocar por um banco de dados, basta reescrever `carregar` e `salvar`.
"""

import json
import os
from pathlib import Path

from .playlist import cabecalho, criar_estrutura


def para_json(playlist):
    e = playlist["dados"]
    if playlist["versao"] == "vetor":
        # o vetor cru e os índices: preserva a "volta" da fila circular
        dados = {"capacidade": e.capacidade, "posicoes": e.vetor, **e.marcadores()}
    else:
        # as músicas na ordem dos nós (+ qual toca, nas listas)
        atual = e.posicao_atual() if playlist["estrutura"] == "lista" else None
        dados = {"nos": [{"id": m["id"], "musica": m} for m in e.em_ordem()], "atual": atual}
    return {**cabecalho(playlist), "dados": dados}


def de_json(d):
    dados = d["dados"]
    e = criar_estrutura(d["estrutura"], d["versao"], d["tipo"], dados.get("capacidade"))
    if d["versao"] == "vetor":
        e.vetor = dados["posicoes"]
        for nome in e.marcadores():  # topo | inicio, fim, quantidade | tamanho, atual
            setattr(e, nome, dados[nome])
    else:
        musicas = [n["musica"] for n in dados["nos"]]
        if d["estrutura"] == "pilha":
            musicas = musicas[::-1]  # foi salva do topo para a base: empilha a base primeiro
        for m in musicas:
            e.adicionar(m)
        if dados.get("atual") is not None:
            e.tocar(dados["atual"])
    return {**cabecalho(d), "dados": e}


def carregar(arquivo):
    """{id: playlist} a partir do arquivo (vazio se ele ainda não existe)."""
    arquivo = Path(arquivo)
    if not arquivo.exists():
        return {}
    salvas = json.loads(arquivo.read_text(encoding="utf-8"))["playlists"]
    return {pid: de_json(d) for pid, d in salvas.items()}


def salvar(arquivo, playlists):
    arquivo = Path(arquivo)
    arquivo.parent.mkdir(parents=True, exist_ok=True)
    conteudo = {"playlists": {pid: para_json(p) for pid, p in playlists.items()}}
    # grava num .tmp e depois troca: o arquivo nunca fica pela metade
    tmp = arquivo.with_suffix(".tmp")
    tmp.write_text(json.dumps(conteudo, ensure_ascii=False, indent=2), encoding="utf-8")
    os.replace(tmp, arquivo)
