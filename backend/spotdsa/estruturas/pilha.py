from .base import EstruturaCheia, EstruturaVazia, No


class PilhaVetor:
    # Pilha em vetor fixo (topo = -1 significa vazia)
    PERMITE = {"anterior": False, "escolher": False, "remover": False, "inserir_em_posicao": False}

    def __init__(self, capacidade):
        self.capacidade = capacidade
        self.vetor = [None] * capacidade
        self.topo = -1

    def vazia(self):
        return self.topo == -1

    def cheia(self):
        return self.topo == self.capacidade - 1

    def empilhar(self, musica):
        if not self.cheia():
            self.topo += 1
            self.vetor[self.topo] = musica
        else:
            raise EstruturaCheia(f"A playlist está cheia (capacidade {self.capacidade}).")

    def desempilhar(self):
        if not self.vazia():
            musica = self.vetor[self.topo]
            self.vetor[self.topo] = None
            self.topo -= 1
            return musica
        else:
            raise EstruturaVazia("A playlist está vazia.")

    def tocando(self):
        if self.vazia():
            return None
        else:
            return self.vetor[self.topo]

    def em_ordem(self):
        # Do topo até a base
        lista = []
        for i in range(self.topo, -1, -1):
            lista.append(self.vetor[i])
        return lista

    def marcadores(self):
        return {"topo": self.topo}

    # No player: adicionar = empilhar, pular = desempilhar
    adicionar = empilhar
    proxima = desempilhar


class PilhaEncadeada:
    # Pilha Encadeada: cada nó aponta para o de baixo
    PERMITE = {"anterior": False, "escolher": False, "remover": False, "inserir_em_posicao": False}

    def __init__(self):
        self.topo = None

    def vazia(self):
        return self.topo is None

    def empilhar(self, musica):
        novo = No(musica)
        novo.proximo = self.topo
        self.topo = novo

    def desempilhar(self):
        if not self.vazia():
            musica = self.topo.musica
            self.topo = self.topo.proximo
            return musica
        else:
            raise EstruturaVazia("A playlist está vazia.")

    def tocando(self):
        if self.vazia():
            return None
        else:
            return self.topo.musica

    def nos(self):
        # Percorre do topo até a base
        lista = []
        no = self.topo
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
        return {"topo": self.topo}

    # No player: adicionar = empilhar, pular = desempilhar
    adicionar = empilhar
    proxima = desempilhar
