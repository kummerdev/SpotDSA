// Linguagem visual de cada estrutura: a cor do vinil e o gesto de entrar e sair.
// Pilha empilha por cima e tira por cima; fila entra pela direita e sai pela
// esquerda; lista escolhe qualquer disco da estante.

export const COR = {
  pilha: 'var(--color-pilha)',
  fila: 'var(--color-fila)',
  lista: 'var(--color-lista)',
}

// `style` para a raiz de uma tela: define --cor para os utilitários *-cor.
export const comCor = (estrutura) => ({ '--cor': COR[estrutura] })

export const mola = { type: 'spring', stiffness: 380, damping: 32 }

// Para onde o disco do deck vai (sai) e de onde o próximo vem (entra), por ação.
const GESTOS = {
  pilha: {
    adicionar: { entra: { y: -90, opacity: 0 }, sai: { y: 30, scale: 0.85, opacity: 0 } }, // cai por cima
    proxima: { entra: { y: 30, scale: 0.9, opacity: 0 }, sai: { y: -120, opacity: 0 } }, // a do topo é tirada para cima
  },
  fila: {
    adicionar: { entra: { x: 140, opacity: 0 }, sai: { x: -140, opacity: 0 } },
    proxima: { entra: { x: 140, opacity: 0 }, sai: { x: -160, opacity: 0 } }, // anda na esteira: sai pela esquerda
  },
  lista: {
    proxima: { entra: { x: 120, opacity: 0 }, sai: { x: -120, opacity: 0 } },
    anterior: { entra: { x: -120, opacity: 0 }, sai: { x: 120, opacity: 0 } },
    remover: { entra: { scale: 0.85, opacity: 0 }, sai: { y: 80, rotate: 25, opacity: 0 } },
  },
}

const PADRAO = { entra: { scale: 0.85, opacity: 0 }, sai: { scale: 0.85, opacity: 0 } }

export function gesto(estrutura, acao) {
  if (!acao) return PADRAO
  if (estrutura === 'lista' && acao.tipo === 'tocar') {
    return acao.paraTras ? GESTOS.lista.anterior : GESTOS.lista.proxima
  }
  return GESTOS[estrutura]?.[acao.tipo] ?? PADRAO
}

// Como uma linha da lista de músicas entra e sai, pela "porta" de cada estrutura:
// pilha entra e sai por cima; fila entra por baixo (fim) e sai por cima (início);
// lista abre espaço no meio e a removida sai de lado.
export const LINHA = {
  pilha: { entra: { y: -56, scale: 0.92, opacity: 0 }, sai: { y: -56, opacity: 0 } },
  fila: { entra: { y: 56, scale: 0.92, opacity: 0 }, sai: { y: -56, opacity: 0 } },
  lista: { entra: { scaleY: 0.2, opacity: 0 }, sai: { x: 48, opacity: 0 } },
}
