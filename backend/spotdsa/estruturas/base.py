class No:
    #No Simples 

    def __init__(self, musica):
        self.musica=musica
        self.proximo=None


class NoDuplo(No):
    #No Duplo Para Listas Duplamente Encadeadas

    def __init__(self, musica):
        super().__init__(musica)#Chama a classe pai e passa musica para seu init
        self.anterior=None



class EstruturaCheia(Exception):
    """Não há mais posições livres no vetor (overflow)."""


class EstruturaVazia(Exception):
    """A operação precisa de pelo menos uma música (underflow)."""


def validar_posicao(posicao, maximo):
    """Garante que 0 <= posicao <= maximo."""
    if type(posicao) is not int or posicao > maximo or posicao < 0:
        if maximo < 0:
            raise ValueError(f"Posição {posicao} inválida: a playlist está vazia.")
        raise ValueError(f"Posição {posicao} inválida (de 0 a {maximo}).")
   