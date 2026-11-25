// Traduz cada ação do player no que aconteceu dentro da estrutura de dados.
// explicar(acao, antes, depois) -> { titulo, linhas[] }
// acao = { tipo: 'adicionar' | 'proxima' | 'anterior' | 'tocar' | 'remover', musica?, posicao? }

const q = (m) => `"${m.titulo}"`
const plural = (n, um, varios) => `${n} ${n === 1 ? um : varios}`
const deslocadas = (n, lado) =>
  n === 0
    ? 'Nenhuma música precisou ser deslocada.'
    : `${plural(n, 'música foi deslocada', 'músicas foram deslocadas')} uma posição para a ${lado}.`

function tocaAgora(depois, vazio) {
  return depois.tocando ? `Agora toca ${q(depois.tocando)}.` : vazio
}

function indice(estado, musica) {
  return musica ? estado.musicas.findIndex((x) => x.id === musica.id) : -1
}

// --- Pilha ---------------------------------------------------------------
function pilha(acao, antes, depois) {
  const vetor = antes.versao === 'vetor'
  const ma = antes.snapshot.marcadores
  const md = depois.snapshot.marcadores
  if (acao.tipo === 'adicionar') {
    return {
      titulo: `Empilhou ${q(acao.musica)}`,
      linhas: [
        vetor
          ? `Entrou na posição [${md.topo}] do vetor e o topo foi de ${ma.topo} para ${md.topo}.`
          : `Foi criado um nó para ela apontando para ${antes.tocando ? `o antigo topo, ${q(antes.tocando)}` : 'null (a pilha estava vazia)'}; o ponteiro topo agora aponta para esse nó.`,
        'Na pilha a última que entra é a primeira a tocar (LIFO), então ela já está tocando.',
      ],
    }
  }
  if (acao.tipo === 'proxima') {
    return {
      titulo: `Desempilhou ${q(antes.tocando)}`,
      linhas: [
        `${q(antes.tocando)} saiu da pilha: na pilha, a música tocada é removida.`,
        vetor
          ? `O topo voltou de ${ma.topo} para ${md.topo}; nenhuma música foi deslocada, a posição só ficou livre.`
          : 'O ponteiro topo passou para o nó de baixo e o nó antigo foi liberado.',
        depois.tocando ? `Agora toca ${q(depois.tocando)}, que estava logo abaixo.` : 'A pilha ficou vazia.',
      ],
    }
  }
  return null
}

// --- Fila ----------------------------------------------------------------
function fila(acao, antes, depois) {
  const vetor = antes.versao === 'vetor'
  const ma = antes.snapshot.marcadores
  const md = depois.snapshot.marcadores
  if (acao.tipo === 'adicionar') {
    const linhas = []
    if (vetor) {
      linhas.push(`Entrou na posição [${ma.fim}], que era o fim da fila; o fim avançou para ${md.fim}.`)
      if (ma.fim < ma.inicio) {
        linhas.push('Essa posição já tinha sido liberada por uma música tocada: a fila circular reaproveita o começo do vetor.')
      } else if (md.fim === 0 && depois.capacidade) {
        linhas.push('O fim chegou à última posição do vetor e deu a volta para a posição 0 (fila circular).')
      }
    } else {
      linhas.push(
        antes.musicas.length
          ? `O último nó, ${q(antes.musicas[antes.musicas.length - 1])}, passou a apontar para ela, que virou o novo fim.`
          : 'A fila estava vazia: o novo nó virou início e fim ao mesmo tempo.',
      )
    }
    linhas.push(
      antes.musicas.length
        ? `Ela só toca depois ${plural(antes.musicas.length, 'da música', 'das músicas')} que já ${antes.musicas.length === 1 ? 'estava' : 'estavam'} na fila (FIFO).`
        : 'Como é a única, já começa a tocar.',
    )
    return { titulo: `Enfileirou ${q(acao.musica)}`, linhas }
  }
  if (acao.tipo === 'proxima') {
    return {
      titulo: `Desenfileirou ${q(antes.tocando)}`,
      linhas: [
        `${q(antes.tocando)} era a primeira da fila: tocou e saiu.`,
        vetor
          ? `O início avançou de ${ma.inicio} para ${md.inicio}${md.inicio < ma.inicio ? ' (deu a volta no vetor)' : ''}; nenhuma música foi deslocada.`
          : 'O ponteiro início passou para o próximo nó e o nó antigo foi liberado.',
        tocaAgora(depois, 'A fila ficou vazia.'),
      ],
    }
  }
  return null
}

// --- Lista ---------------------------------------------------------------

// O que muda nos ponteiros ao tirar o nó da posição p (lista encadeada).
function ligacaoRemocao(tipo, musicas, p) {
  const n = musicas.length
  if (n === 1) return 'Era o único nó: a lista ficou vazia (início aponta para null).'
  const seguinte = musicas[p + 1]
  if (p === 0) {
    return (
      `O início passou para o nó seguinte, ${q(seguinte)}; nenhuma música mudou de lugar.` +
      (tipo === 'circular' ? ` O último nó também passou a apontar para ${q(seguinte)}, para manter o laço.` : '') +
      (tipo === 'dupla' ? ` O ponteiro anterior de ${q(seguinte)} passou a ser null.` : '')
    )
  }
  const anterior = musicas[p - 1]
  const depois = seguinte ?? (tipo === 'circular' ? musicas[0] : null)
  let texto = `O nó anterior, ${q(anterior)}, passou a apontar direto para ${depois ? q(depois) : 'null'}; nenhuma música mudou de lugar.`
  if (tipo === 'dupla' && seguinte) texto += ` E o ponteiro anterior de ${q(seguinte)} passou a ser ${q(anterior)}.`
  if (!seguinte && tipo !== 'simples') texto += ` O fim agora é ${q(anterior)}.`
  return texto
}

function lista(acao, antes, depois) {
  const vetor = antes.versao === 'vetor'
  const tipo = antes.tipo
  const n = antes.musicas.length

  if (acao.tipo === 'adicionar') {
    const p = acao.posicao ?? n
    if (vetor) {
      return {
        titulo: `Inseriu ${q(acao.musica)} na posição [${p}]`,
        linhas: [
          p === n ? 'Entrou no fim do vetor. ' + deslocadas(0) : deslocadas(n - p, 'direita') + ' No vetor, abrir espaço no meio custa mover as seguintes.',
        ],
      }
    }
    const titulo = `Inseriu ${q(acao.musica)} na posição ${p}`
    if (n === 0) {
      return {
        titulo,
        linhas: [
          tipo === 'circular'
            ? 'A lista estava vazia: o novo nó virou início e fim, e o próximo dele aponta para ele mesmo (o laço da lista circular).'
            : 'A lista estava vazia: o novo nó virou o início.',
        ],
      }
    }
    const anterior = antes.musicas[p - 1]
    // depois do novo nó: o seguinte; no fim, null (ou a primeira, na circular)
    const seguinte = antes.musicas[p] ?? (tipo === 'circular' ? antes.musicas[0] : null)
    const ligacao = [anterior && q(anterior), q(acao.musica), seguinte ? q(seguinte) : 'null'].filter(Boolean).join(' → ')
    const linhas = [`Só os ponteiros mudaram: ${ligacao}${tipo === 'dupla' ? ' (e os ponteiros anterior no sentido contrário)' : ''}.`]
    if (tipo === 'circular' && p === 0) linhas.push('O último nó também passou a apontar para o novo início, para manter o laço.')
    if (tipo === 'dupla' && p === n) {
      linhas.push('Nenhuma música mudou de lugar. Não precisou percorrer nada: usou o ponteiro fim para chegar direto ao último nó.')
    } else {
      linhas.push(`Nenhuma música mudou de lugar na memória.${p > 0 ? ` Para achar a posição, percorreu ${plural(p, 'nó', 'nós')} desde o início.` : ''}`)
    }
    return { titulo, linhas }
  }

  if (acao.tipo === 'remover') {
    const p = acao.posicao
    const removida = antes.musicas[p]
    const linhas = [vetor ? deslocadas(n - p - 1, 'esquerda') + ' A última posição ocupada ficou vazia.' : ligacaoRemocao(tipo, antes.musicas, p)]
    if (antes.tocando?.id === removida.id) linhas.push(`Ela estava tocando. ${tocaAgora(depois, 'A lista ficou vazia.')}`)
    return { titulo: `Removeu ${q(removida)}`, linhas }
  }

  if (acao.tipo === 'tocar') {
    const p = acao.posicao
    return {
      titulo: `Tocando ${q(depois.tocando)}`,
      linhas: [
        vetor
          ? `Foi direto à posição [${p}]: no vetor, acessar por índice é imediato.`
          : `Percorreu ${plural(p, 'nó', 'nós')} desde o início até chegar nela: na lista encadeada não há acesso direto.`,
        'Na lista, tocar não remove: a música continua no mesmo lugar.',
      ],
    }
  }

  const mesma = antes.tocando?.id === depois.tocando?.id
  if (acao.tipo === 'proxima') {
    if (mesma && tipo === 'circular') {
      return { titulo: `Continua em ${q(antes.tocando)}`, linhas: ['Ela é o único nó: na lista circular, o próximo dele é ele mesmo.'] }
    }
    if (mesma) {
      return {
        titulo: 'Já está na última música',
        linhas: [vetor ? `Não há posição depois de [${n - 1}]: ela é a última ocupada do vetor.` : 'Não existe próxima: o próximo do último nó é null.'],
      }
    }
    const voltou = indice(depois, depois.tocando) < indice(antes, antes.tocando)
    return {
      titulo: `Avançou para ${q(depois.tocando)}`,
      linhas: [
        voltou
          ? 'Estava na última: na lista circular, a última aponta para a primeira, então a playlist volta para a primeira.'
          : vetor
            ? 'Foi para a posição seguinte do vetor.'
            : `Seguiu o ponteiro próximo de ${q(antes.tocando)}.`,
        `${q(antes.tocando)} continua na lista: na lista nada é removido ao tocar.`,
      ],
    }
  }
  if (acao.tipo === 'anterior') {
    if (mesma) return { titulo: 'Já está na primeira música', linhas: ['Não existe anterior à primeira.'] }
    return {
      titulo: `Voltou para ${q(depois.tocando)}`,
      linhas: [vetor ? 'Foi para a posição anterior do vetor (acesso direto).' : 'Seguiu o ponteiro anterior: só a lista dupla guarda esse ponteiro.'],
    }
  }
  return null
}

const POR_ESTRUTURA = { pilha, fila, lista }

export function explicar(acao, antes, depois) {
  return POR_ESTRUTURA[antes.estrutura](acao, antes, depois) ?? { titulo: 'Feito', linhas: [] }
}

export function explicarErro(acao, erro, antes) {
  if (erro.status === 409 && acao.tipo === 'adicionar') {
    return {
      titulo: 'Não coube',
      linhas: [
        `O vetor foi criado com ${antes.capacidade} posições e não pode crescer.`,
        'Pule ou remova uma música para liberar espaço. Na versão encadeada esse limite não existe.',
      ],
    }
  }
  if (erro.status === 409) return { titulo: 'Nada para tocar', linhas: ['A estrutura está vazia: adicione uma música primeiro.'] }
  return { titulo: 'Não foi possível', linhas: [erro.message] }
}

const REGRAS = {
  pilha: 'LIFO: a última música que entra é a primeira a tocar. Pular remove a do topo, e não dá para voltar.',
  fila: 'FIFO: a primeira música que entra é a primeira a tocar. Pular remove a do início, e não dá para voltar.',
  vetor: 'As músicas ficam em posições do vetor: dá para ir direto a qualquer uma, mas inserir ou remover no meio desloca as seguintes.',
  simples: 'Cada música aponta só para a próxima: dá para avançar, mas não para voltar.',
  dupla: 'Cada música aponta para a próxima e para a anterior: dá para andar nos dois sentidos.',
  circular: 'A última música aponta para a primeira: ao chegar no fim, a playlist recomeça.',
}

export function regra({ estrutura, versao, tipo, capacidade }) {
  const base = estrutura === 'lista' ? REGRAS[versao === 'vetor' ? 'vetor' : tipo] : REGRAS[estrutura]
  const tamanho =
    versao === 'vetor'
      ? `Tamanho fixo: ${capacidade} posições, definidas na criação.`
      : 'Sem limite de tamanho: cada música é um nó criado na hora.'
  return `${base} ${tamanho}`
}
