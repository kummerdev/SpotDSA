import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { Fragment } from 'react'
import Marcador, { MARCADORES_POSICAO } from './Marcador'

const mola = { type: 'spring', stiffness: 380, damping: 32 }

export default function VisualizacaoEncadeada({ snapshot }) {
  const { nos, marcadores, circular } = snapshot
  const nomesEm = (id) => MARCADORES_POSICAO.filter((nome) => marcadores[nome] === id)
  const dupla = nos.some((n) => n.anterior !== null)

  if (nos.length === 0) {
    const ponteiros = Object.keys(marcadores).map((nome) => `${nome === 'inicio' ? 'início' : nome} → null`)
    return <p className="font-mono text-sm text-poeira">Nenhum nó. {ponteiros.join(', ')}</p>
  }

  return (
    <LayoutGroup>
      <ol className="flex flex-wrap items-end gap-x-1 gap-y-4">
        <AnimatePresence initial={false}>
          {nos.map((no, i) => (
            <Fragment key={no.id}>
              <motion.li
                layout
                data-testid={`no-${no.id}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, backgroundColor: 'rgba(255,106,61,0.35)' }}
                transition={mola}
                className="grid w-28 gap-1.5"
              >
                <div className="flex min-h-5 flex-wrap gap-1">
                  {nomesEm(no.id).map((nome) => (
                    <Marcador key={nome} nome={nome} />
                  ))}
                </div>
                <div className="grid rounded-lg bg-painel px-2 py-2 ring-1 ring-cor/45">
                  <span className="truncate text-sm font-semibold">{no.musica.titulo}</span>
                  <span className="truncate text-xs text-poeira">{no.musica.artista}</span>
                  <span className="mt-1 font-mono text-[10px] text-poeira">nó {no.id}</span>
                </div>
              </motion.li>
              {i < nos.length - 1 && (
                <motion.li layout aria-hidden className="self-center px-1 pb-1 font-mono text-lg text-cor">
                  {dupla ? '↔' : '→'}
                </motion.li>
              )}
            </Fragment>
          ))}
        </AnimatePresence>
        <motion.li layout className="self-center px-1 pb-1 font-mono text-sm text-poeira">
          {circular ? (
            <span>
              <span className="text-lg text-cor">↺</span> volta para "{nos[0].musica.titulo}"
            </span>
          ) : (
            <span>
              <span className="text-lg text-cor">→</span> <span>null</span>
            </span>
          )}
        </motion.li>
      </ol>
    </LayoutGroup>
  )
}
