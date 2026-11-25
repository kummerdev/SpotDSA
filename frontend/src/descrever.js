const NOMES = { pilha: 'Pilha', fila: 'Fila', lista: 'Lista' }

// "Pilha com arranjo", "Fila encadeada", "Lista encadeada dupla"
export function descreverEstrutura({ estrutura, versao, tipo }) {
  const v = versao === 'vetor' ? 'com arranjo' : 'encadeada'
  return [NOMES[estrutura], v, tipo].filter(Boolean).join(' ')
}
