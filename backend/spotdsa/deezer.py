"""API pública da Deezer (sem chave).

O link do trecho (preview) vem assinado e expira em ~15 minutos, por isso
nunca é salvo: o player pede um link novo a cada música.
"""

import json
import urllib.parse
import urllib.request

API = "https://api.deezer.com"
DURACAO_TRECHO = 30


class ErroDeezer(Exception):
    """Deezer fora do ar, lenta ou com resposta inesperada."""


def _get(caminho):
    try:
        with urllib.request.urlopen(API + caminho, timeout=10) as resposta:
            dados = json.loads(resposta.read())
    except (OSError, ValueError) as e:  # rede/timeout são OSError; JSON inválido é ValueError
        raise ErroDeezer(str(e)) from e
    if not isinstance(dados, dict) or "error" in dados:
        raise ErroDeezer(f"Resposta inesperada da Deezer: {dados!r:.200}")
    return dados


def buscar(q, limite=10):
    dados = _get(f"/search?q={urllib.parse.quote(q)}&limit={limite}")
    return [
        {
            "deezer_id": item["id"],
            "titulo": item["title"],
            "artista": item.get("artist", {}).get("name") or "Desconhecido",
            "duracao": DURACAO_TRECHO,
            "capa": (item.get("album") or {}).get("cover_medium"),
        }
        for item in dados.get("data", [])
        if item.get("preview")
    ]


def preview(deezer_id):
    return _get(f"/track/{deezer_id}").get("preview") or None
