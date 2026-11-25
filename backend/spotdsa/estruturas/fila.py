from .base import EstruturaCheia, EstruturaVazia, No


class FilaVetor:
    # Fila Circular em vetor fixo
    PERMITE = {"anterior": False, "escolher": False, "remover": False, "inserir_em_posicao": False}

    def __init__(self, capacidade):
        self.capacidade = capacidade
        self.vetor = [None] * capacidade
        self.inicio = 0
        self.fim = 0
        self.quantidade = 0

    def vazia(self):
        return self.quantidade == 0

    def cheia(self):
        return self.quantidade == self.capacidade

    def enfileirar(self, musica):
        if not self.cheia():
            self.vetor[self.fim] = musica
            self.fim = (self.fim + 1) % self.capacidade
            self.quantidade += 1
        else:
            raise EstruturaCheia(f"A playlist está cheia (capacidade {self.capacidade}).")

    def desenfileirar(self):
        if not self.vazia():
            musica = self.vetor[self.inicio]
            self.vetor[self.inicio] = None
            self.inicio = (self.inicio + 1) % self.capacidade
            self.quantidade -= 1
            return musica
        else:
            raise EstruturaVazia("A playlist está vazia.")

    def tocando(self):
        if self.vazia():
            return None
        else:
            return self.vetor[self.inicio]

    def em_ordem(self):
        lista = []
        for i in range(self.quantidade):
            pos = (self.inicio + i) % self.capacidade
            lista.append(self.vetor[pos])
        return lista

    def marcadores(self):
        return {"inicio": self.inicio, "fim": self.fim, "quantidade": self.quantidade}

    # No player: adicionar = enfileirar, pular = desenfileirar
    adicionar = enfileirar
    proxima = desenfileirar


class FilaEncadeada:
    # Fila Encadeada: guarda o inicio e o fim
    PERMITE = {"anterior": False, "escolher": False, "remover": False, "inserir_em_posicao": False}

    def __init__(self):
        self.inicio = None
        self.fim = None

    def vazia(self):
        return self.inicio is None

    def enfileirar(self, musica):
        novo = No(musica)
        if self.vazia():
            self.inicio = novo
        else:
            self.fim.proximo = novo
        self.fim = novo

    def desenfileirar(self):
        if not self.vazia():
            musica = self.inicio.musica
            self.inicio = self.inicio.proximo
            if self.inicio is None:
                self.fim = None  # se ficou vazia, zera o fim também
            return musica
        else:
            raise EstruturaVazia("A playlist está vazia.")

    def tocando(self):
        if self.vazia():
            return None
        else:
            return self.inicio.musica

    def nos(self):
        lista = []
        no = self.inicio
        while no is not None:
            lista.append(no)
            no = no.proximo
        return lista

    def em_ordem(self):
        lista = []
        for no in self.nos():
            lista.append(no.musica)
        return lista

    def marcadores(self):
        return {"inicio": self.inicio, "fim": self.fim}

    # No player: adicionar = enfileirar, pular = desenfileirar
    adicionar = enfileirar
    proxima = desenfileirar
