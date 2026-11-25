// Por que um botão está bloqueado: o texto que aparece quando a pessoa clica nele mesmo assim.
// Cada função devolve o motivo (texto) ou null quando a ação é permitida.

const NOME = { pilha: 'Pilha', fila: 'Fila', lista: 'Lista' }

const CHEIA = {
  pilha: (n) => `Pilha cheia: impossível adicionar no topo. As ${n} posições do vetor estão ocupadas; pule uma música para liberar o topo.`,
  fila: (n) => `Fila cheia: impossível entrar no fim da fila. As ${n} posições do vetor estão ocupadas; pule uma música para liberar espaço.`,
  lista: (n) => `Lista cheia: impossível inserir. As ${n} posições do vetor estão ocupadas; remova uma música para abrir espaço.`,
}

const SEM_VOLTAR = {
  pilha: 'Pilha não volta: a música anterior já foi desempilhada e saiu da pilha.',
  fila: 'Fila não volta: a música anterior já saiu pelo início da fila.',
  simples: 'Lista simples não volta: cada nó só aponta para o próximo.',
  circular: 'Lista circular não volta: os nós só apontam para a frente (e o último para o primeiro).',
}

export function motivoAdicionar({ cheia, estrutura, capacidade }) {
  return cheia ? CHEIA[estrutura](capacidade) : null
}

export function motivoAnterior({ tocando, permite, estrutura, tipo }) {
  if (!permite.anterior) return SEM_VOLTAR[tipo ?? estrutura]
  if (!tocando) return 'Nada tocando: não há música para voltar.'
  return null
}

export function motivoProxima({ tocando }) {
  return tocando ? null : 'Playlist vazia: não há música para pular. Adicione uma primeiro.'
}

export function motivoAleatorio({ estrutura }) {
  return `Aleatório indisponível: na ${NOME[estrutura].toLowerCase()} a ordem de tocar é a própria regra da estrutura.`
}

// Repetir não é um botão de ligar/desligar: na circular está sempre ligado, nas outras nunca.
export function motivoRepetir({ tipo }) {
  return tipo === 'circular' ? null : 'Repetir indisponível: só a lista circular recomeça, porque o último nó aponta para o primeiro.'
}

export const DICA_REPETIR_CIRCULAR = 'Repetir sempre ligado: na lista circular o último nó aponta para o primeiro, então a playlist recomeça sozinha.'

export const MOTIVO_NADA_TOCANDO = 'Nada tocando: adicione uma música para tocar.'
