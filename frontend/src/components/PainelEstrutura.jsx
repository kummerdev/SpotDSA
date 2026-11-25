import VisualizacaoEncadeada from './VisualizacaoEncadeada'
import VisualizacaoVetor from './VisualizacaoVetor'

// O que cada marcador significa, no vetor e na encadeada.
const LEGENDA = {
  vetor: {
    topo: 'topo: posição da última música adicionada, que é a que toca.',
    inicio: 'início: posição da primeira da fila, que é a que toca e a próxima a sair.',
    fim: 'fim: próxima posição livre, onde entra a próxima música.',
    atual: 'atual: posição da música tocando.',
    quantidade: 'quantidade: quantas posições estão ocupadas; diferencia fila cheia de vazia quando início = fim.',
    tamanho: 'tamanho: quantas posições estão ocupadas, do começo do vetor em diante.',
  },
  encadeada: {
    topo: 'topo: ponteiro para o nó da última música adicionada, que é a que toca.',
    inicio: 'início: ponteiro para o primeiro nó.',
    fim: 'fim: ponteiro para o último nó, onde a próxima música é ligada.',
    atual: 'atual: ponteiro para o nó que está tocando.',
  },
}

export default function PainelEstrutura({ snapshot }) {
  const legenda = Object.keys(snapshot.marcadores)
    .map((nome) => LEGENDA[snapshot.tipo][nome])
    .filter(Boolean)

  return (
    <section data-testid="painel-estrutura" className="grid gap-4">
      <div>
        <h3 className="text-lg font-bold">{snapshot.tipo === 'vetor' ? 'Por dentro: o vetor' : 'Por dentro: os nós e ponteiros'}</h3>
        <p className="text-sm text-poeira">
          {snapshot.tipo === 'vetor'
            ? `Um bloco de ${snapshot.capacidade} posições reservado na criação. As músicas ficam em posições numeradas.`
            : 'Cada música é um nó guardado em qualquer lugar da memória; o que dá a ordem são as setas (ponteiros).'}
        </p>
      </div>
      <div className="prancheta rounded-xl p-3 ring-1 ring-veio">
        {snapshot.tipo === 'vetor' ? <VisualizacaoVetor snapshot={snapshot} /> : <VisualizacaoEncadeada snapshot={snapshot} />}
      </div>
      <ul className="grid gap-1 text-sm text-poeira">
        {legenda.map((texto) => {
          const [nome, resto] = texto.split(/:(.*)/s)
          return (
            <li key={nome}>
              <span className="font-mono text-cor">{nome}</span>:{resto}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
