from .base import EstruturaCheia, EstruturaVazia, No, NoDuplo, validar_posicao


class ListaVetor:
    # Lista em vetor fixo: inserir/remover desloca os elementos seguintes
    PERMITE = {"anterior": True, "escolher": True, "remover": True, "inserir_em_posicao": True}

    def __init__(self, capacidade):
        self.capacidade = capacidade
        self.vetor = [None] * capacidade
        self.tamanho = 0
        self.atual = None

    def vazia(self):
        return self.tamanho == 0

    def cheia(self):
        return self.tamanho == self.capacidade

    def inserir(self, posicao, musica):
        if not self.cheia():
            validar_posicao(posicao, self.tamanho)
            # Abre espaço deslocando para a direita (de trás para frente)
            for i in range(self.tamanho, posicao, -1):
                self.vetor[i] = self.vetor[i - 1]
            self.vetor[posicao] = musica
            self.tamanho += 1
            if self.atual is None:
                self.atual = 0
            elif posicao <= self.atual:
                self.atual += 1  # a música tocando foi empurrada para a direita
        else:
            raise EstruturaCheia(f"A playlist está cheia (capacidade {self.capacidade}).")

    def remover(self, posicao):
        validar_posicao(posicao, self.tamanho - 1)
        musica = self.vetor[posicao]
        # Fecha o buraco deslocando para a esquerda
        for i in range(posicao, self.tamanho - 1):
            self.vetor[i] = self.vetor[i + 1]
        self.vetor[self.tamanho - 1] = None
        self.tamanho -= 1
        if self.tamanho == 0:
            self.atual = None
        elif posicao < self.atual:
            self.atual -= 1
        elif self.atual == self.tamanho:
            self.atual -= 1  # a música tocando era a última: volta para a anterior
        return musica

    def adicionar(self, musica):
        self.inserir(self.tamanho, musica)

    def tocar(self, posicao):
        validar_posicao(posicao, self.tamanho - 1)
        self.atual = posicao

    def proxima(self):
        if not self.vazia():
            if self.atual < self.tamanho - 1:
                self.atual += 1
        else:
            raise EstruturaVazia("A playlist está vazia.")

    def anterior(self):
        if not self.vazia():
            if self.atual > 0:
                self.atual -= 1
        else:
            raise EstruturaVazia("A playlist está vazia.")

    def tocando(self):
        if self.vazia():
            return None
        else:
            return self.vetor[self.atual]

    def em_ordem(self):
        lista = []
        for i in range(self.tamanho):
            lista.append(self.vetor[i])
        return lista

    def marcadores(self):
        return {"tamanho": self.tamanho, "atual": self.atual}


class ListaSimples:
    # Lista Encadeada Simples: cada nó aponta só para o próximo
    PERMITE = {"anterior": False, "escolher": True, "remover": True, "inserir_em_posicao": True}

    def __init__(self):
        self.inicio = None
        self.atual = None
        self.tamanho = 0

    def vazia(self):
        return self.tamanho == 0

    def no_na_posicao(self, posicao):
        # Anda de nó em nó a partir do inicio
        no = self.inicio
        for _ in range(posicao):
            no = no.proximo
        return no

    def inserir(self, posicao, musica):
        validar_posicao(posicao, self.tamanho)
        novo = No(musica)
        if posicao == 0:
            novo.proximo = self.inicio
            self.inicio = novo
        else:
            anterior = self.no_na_posicao(posicao - 1)
            novo.proximo = anterior.proximo
            anterior.proximo = novo
        self.tamanho += 1
        if self.atual is None:
            self.atual = novo

    def remover(self, posicao):
        validar_posicao(posicao, self.tamanho - 1)
        if posicao == 0:
            anterior = None
            alvo = self.inicio
            self.inicio = alvo.proximo
        else:
            anterior = self.no_na_posicao(posicao - 1)
            alvo = anterior.proximo
            anterior.proximo = alvo.proximo
        self.tamanho -= 1
        if alvo is self.atual:
            if alvo.proximo is not None:
                self.atual = alvo.proximo
            else:
                self.atual = anterior
        return alvo.musica

    def adicionar(self, musica):
        self.inserir(self.tamanho, musica)

    def tocar(self, posicao):
        validar_posicao(posicao, self.tamanho - 1)
        self.atual = self.no_na_posicao(posicao)

    def proxima(self):
        if not self.vazia():
            if self.atual.proximo is not None:
                self.atual = self.atual.proximo
        else:
            raise EstruturaVazia("A playlist está vazia.")

    def tocando(self):
        if self.vazia():
            return None
        else:
            return self.atual.musica

    def posicao_atual(self):
        if self.atual is None:
            return None
        no = self.inicio
        i = 0
        while no is not self.atual:
            no = no.proximo
            i += 1
        return i

    def nos(self):
        # Anda `tamanho` passos (funciona também na ListaCircular sem loop infinito)
        lista = []
        no = self.inicio
        for _ in range(self.tamanho):
            lista.append(no)
            no = no.proximo
        return lista

    def em_ordem(self):
        lista = []
        for no in self.nos():
            lista.append(no.musica)
        return lista

    def marcadores(self):
        return {"inicio": self.inicio, "atual": self.atual}


class ListaCircular(ListaSimples):
    # Lista Circular: o último nó aponta de volta para o primeiro
    def __init__(self):
        super().__init__()  # Chama o init da ListaSimples
        self.fim = None

    def inserir(self, posicao, musica):
        validar_posicao(posicao, self.tamanho)
        novo = No(musica)
        if self.vazia():
            novo.proximo = novo  # um nó sozinho aponta para si mesmo
            self.inicio = novo
            self.fim = novo
        elif posicao == 0:
            novo.proximo = self.inicio
            self.inicio = novo
            self.fim.proximo = novo  # mantém o ciclo fechado
        else:
            anterior = self.no_na_posicao(posicao - 1)
            novo.proximo = anterior.proximo
            anterior.proximo = novo
            if anterior is self.fim:
                self.fim = novo
        self.tamanho += 1
        if self.atual is None:
            self.atual = novo

    def remover(self, posicao):
        validar_posicao(posicao, self.tamanho - 1)
        if self.tamanho == 1:
            alvo = self.inicio
            self.inicio = None
            self.fim = None
        elif posicao == 0:
            alvo = self.inicio
            self.inicio = alvo.proximo
            self.fim.proximo = self.inicio  # mantém o ciclo fechado
        else:
            anterior = self.no_na_posicao(posicao - 1)
            alvo = anterior.proximo
            anterior.proximo = alvo.proximo
            if alvo is self.fim:
                self.fim = anterior
        self.tamanho -= 1
        if alvo is self.atual:
            if self.vazia():
                self.atual = None
            else:
                self.atual = alvo.proximo  # depois da última volta para a primeira
        return alvo.musica

    def marcadores(self):
        return {"inicio": self.inicio, "fim": self.fim, "atual": self.atual}


class ListaDupla(ListaSimples):
    # Lista Duplamente Encadeada: cada nó aponta para o próximo e para o anterior
    PERMITE = {"anterior": True, "escolher": True, "remover": True, "inserir_em_posicao": True}

    def __init__(self):
        super().__init__()  # Chama o init da ListaSimples
        self.fim = None

    def inserir(self, posicao, musica):
        validar_posicao(posicao, self.tamanho)
        novo = NoDuplo(musica)
        if self.vazia():
            self.inicio = novo
            self.fim = novo
        elif posicao == 0:
            novo.proximo = self.inicio
            self.inicio.anterior = novo
            self.inicio = novo
        elif posicao == self.tamanho:
            novo.anterior = self.fim
            self.fim.proximo = novo
            self.fim = novo
        else:
            seguinte = self.no_na_posicao(posicao)
            novo.anterior = seguinte.anterior
            novo.proximo = seguinte
            seguinte.anterior.proximo = novo
            seguinte.anterior = novo
        self.tamanho += 1
        if self.atual is None:
            self.atual = novo

    def remover(self, posicao):
        validar_posicao(posicao, self.tamanho - 1)
        alvo = self.no_na_posicao(posicao)
        # Religação pelo lado esquerdo
        if alvo.anterior is None:
            self.inicio = alvo.proximo
        else:
            alvo.anterior.proximo = alvo.proximo
        # Religação pelo lado direito
        if alvo.proximo is None:
            self.fim = alvo.anterior
        else:
            alvo.proximo.anterior = alvo.anterior
        self.tamanho -= 1
        if alvo is self.atual:
            if alvo.proximo is not None:
                self.atual = alvo.proximo
            else:
                self.atual = alvo.anterior
        return alvo.musica

    def anterior(self):
        if not self.vazia():
            if self.atual.anterior is not None:
                self.atual = self.atual.anterior
        else:
            raise EstruturaVazia("A playlist está vazia.")

    def marcadores(self):
        return {"inicio": self.inicio, "fim": self.fim, "atual": self.atual}
