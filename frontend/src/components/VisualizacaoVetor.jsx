import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import Marcador, { MARCADORES_POSICAO } from './Marcador'

const mola = { type: 'spring', stiffness: 380, damping: 32 }

export default function VisualizacaoVetor({ snapshot }) {
  const { posicoes, marcadores } = snapshot
  const nomesEm = (i) => MARCADORES_POSICAO.filter((nome) => marcadores[nome] === i)
  const contadores = ['quantidade', 'tamanho'].filter((c) => c in marcadores)
  const pilhaVazia = marcadores.topo === -1

  return (
    <LayoutGroup>
      <div className="grid gap-3">
        <ol className="flex flex-wrap gap-2">
          {posicoes.map((musica, i) => (
            <li key={i} data-testid={`posicao-${i}`} className="grid w-[6.25rem] gap-1.5">
              <span className="font-mono text-xs text-poeira">[{i}]</span>
              <div
                className={`relative h-16 overflow-hidden rounded-lg ${musica ? 'bg-painel ring-1 ring-cor/45' : 'border border-dashed border-veio'}`}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {musica ? (
                    <motion.div
                      key={musica.id}
                      layoutId={`musica-${musica.id}`}
                      initial={{ opacity: 0, y: -16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 16, backgroundColor: 'rgba(255,106,61,0.35)' }}
                      transition={mola}
                      className="absolute inset-0 grid content-center px-2"
                    >
                      <span className="truncate text-sm font-semibold">{musica.titulo}</span>
                      <span className="truncate text-xs text-poeira">{musica.artista}</span>
                    </motion.div>
                  ) : (
                    <motion.span key="vazia" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 grid place-items-center text-xs text-poeira">
                      vazia
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <div className="flex min-h-5 flex-wrap gap-1">
                {nomesEm(i).map((nome) => (
                  <Marcador key={nome} nome={nome} />
                ))}
              </div>
            </li>
          ))}
        </ol>
        <p className="font-mono text-xs text-poeira">
          {[pilhaVazia && 'topo = -1 (pilha vazia)', ...contadores.map((c) => `${c} = ${marcadores[c]}`), `capacidade = ${snapshot.capacidade}`]
            .filter(Boolean)
            .join('   ')}
        </p>
      </div>
    </LayoutGroup>
  )
}
