"""Playlist = nome + uma das 8 estruturas.

Uma playlist é um dicionário: {"id", "nome", "estrutura", "versao", "tipo", "dados"},
em que "dados" é o objeto da estrutura. Uma música também é um dicionário.
Aqui ficam a validação do que chega pela API e o estado que o player desenha.
"""

from uuid import uuid4

from .estruturas.fila import FilaEncadeada, FilaVetor
from .estruturas.lista import ListaCircular, ListaDupla, ListaSimples, ListaVetor
from .estruturas.pilha import PilhaEncadeada, PilhaVetor

# O painel desenha uma caixa por posição do vetor; acima disso não cabe na tela.
CAPACIDADE_MAXIMA = 50

CLASSES = {
    ("pilha", "vetor", None): PilhaVetor,
    ("pilha", "encadeada", None): PilhaEncadeada,
    ("fila", "vetor", None): FilaVetor,
    ("fila", "encadeada", None): FilaEncadeada,
    ("lista", "vetor", None): ListaVetor,
    ("lista", "encadeada", "simples"): ListaSimples,
    ("lista", "encadeada", "dupla"): ListaDupla,
    ("lista", "encadeada", "circular"): ListaCircular,
}

PROIBIDO = {
    "anterior": "não permite voltar para a música anterior.",
    "escolher": "não permite escolher qual música tocar.",
    "remover": "não permite remover músicas escolhidas; só pular.",
    "inserir_em_posicao": "não permite escolher a posição ao adicionar.",
}


def novo_id():
    return uuid4().hex[:8]


def texto(valor):
    return valor.strip() if isinstance(valor, str) else ""


def criar_estrutura(estrutura, versao, tipo=None, capacidade=None):
    try:
        classe = CLASSES[(estrutura, versao, tipo)]
    except (KeyError, TypeError):
        raise ValueError("Combinação inválida de estrutura, versão e tipo.")

    if versao == "encadeada":
        if capacidade is not None:
            raise ValueError("A versão encadeada não tem capacidade: cresce sem limite.")
        return classe()

    if type(capacidade) is not int or not 1 <= capacidade <= CAPACIDADE_MAXIMA:
        raise ValueError(f"A versão com vetor precisa de uma capacidade inteira entre 1 e {CAPACIDADE_MAXIMA}.")
    return classe(capacidade)


def nova_playlist(corpo):
    nome = texto(corpo.get("nome"))
    if not nome:
        raise ValueError("O nome da playlist é obrigatório.")
    estrutura, versao, tipo = corpo.get("estrutura"), corpo.get("versao"), corpo.get("tipo")
    dados = criar_estrutura(estrutura, versao, tipo, corpo.get("capacidade"))
    return {"id": novo_id(), "nome": nome, "estrutura": estrutura, "versao": versao, "tipo": tipo, "dados": dados}


def nova_musica(corpo):
    titulo = texto(corpo.get("titulo"))
    duracao, deezer_id, capa = corpo.get("duracao"), corpo.get("deezer_id"), corpo.get("capa")
    if not titulo:
        raise ValueError("O título da música é obrigatório.")
    if type(duracao) is not int or duracao <= 0:
        raise ValueError("A duração deve ser um número inteiro de segundos maior que zero.")
    if deezer_id is not None and type(deezer_id) is not int:
        raise ValueError("deezer_id deve ser um número inteiro.")
    if capa is not None and not isinstance(capa, str):
        raise ValueError("capa deve ser um texto (URL).")
    return {
        "id": novo_id(),
        "titulo": titulo,
        "artista": texto(corpo.get("artista")) or "Desconhecido",
        "duracao": duracao,
        "deezer_id": deezer_id,
        "capa": capa or None,
    }


def exigir(playlist, operacao):
    """Barra a operação que a estrutura não permite (ex.: voltar numa Pilha)."""
    if not playlist["dados"].PERMITE[operacao]:
        raise ValueError(f"A {playlist['estrutura'].capitalize()} {PROIBIDO[operacao]}")


def cabecalho(playlist):
    return {chave: playlist[chave] for chave in ("id", "nome", "estrutura", "versao", "tipo")}


def resumo(playlist):
    musicas = playlist["dados"].em_ordem()
    return {**cabecalho(playlist), "quantidade": len(musicas), "capas": [m["capa"] for m in musicas[:4]]}


def id_do_no(no):
    return None if no is None else no.musica["id"]


def snapshot(playlist):
    """O que o painel "Ver estrutura" desenha: o vetor com seus índices,
    ou os nós com ponteiros (trocados pelo id de cada nó)."""
    e = playlist["dados"]
    if playlist["versao"] == "vetor":
        return {"tipo": "vetor", "capacidade": e.capacidade, "posicoes": e.vetor, "marcadores": e.marcadores()}
    return {
        "tipo": "encadeada",
        "circular": playlist["tipo"] == "circular",
        "nos": [
            {
                "id": id_do_no(no),
                "musica": no.musica,
                "proximo": id_do_no(no.proximo),
                "anterior": id_do_no(getattr(no, "anterior", None)),  # só o NoDuplo tem
            }
            for no in e.nos()
        ],
        "marcadores": {nome: id_do_no(no) for nome, no in e.marcadores().items()},
    }


def estado(playlist):
    """Tudo o que o player precisa para desenhar a tela."""
    e = playlist["dados"]
    vetor = playlist["versao"] == "vetor"
    return {
        **cabecalho(playlist),
        "tocando": e.tocando(),
        "musicas": e.em_ordem(),
        "permite": e.PERMITE,
        "cheia": e.cheia() if vetor else False,
        "capacidade": e.capacidade if vetor else None,
        "snapshot": snapshot(playlist),
    }
