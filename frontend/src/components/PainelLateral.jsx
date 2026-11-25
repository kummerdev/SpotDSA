import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { mola } from '../estilo'
import { GLIFO } from './Icones'
import PainelEstrutura from './PainelEstrutura'

const VAZIO_SAIRAM = {
  pilha: 'Nenhuma música saiu ainda. Na pilha, pular tira a do topo, e ela vem parar aqui.',
  fila: 'Nenhuma música saiu ainda. Na fila, pular tira a do início, e ela vem parar aqui.',
  lista: 'Nenhuma música saiu ainda. Na lista, pular não tira nada: só remover tira uma música.',
}

// Painel ao lado do player: a estrutura por dentro e o que já saiu dela.
export default function PainelLateral({ estado, saidas }) {
  const [aba, setAba] = useState('dentro')
  const Glifo = GLIFO[estado.estrutura]

  const abas = [
    { id: 'dentro', texto: 'Por dentro' },
    { id: 'sairam', texto: saidas.length ? `Saíram (${saidas.length})` : 'Saíram' },
  ]

  return (
    <aside aria-label="Estrutura" className="grid content-start gap-4 bg-painel px-4 py-5 lg:sticky lg:top-2 lg:max-h-[calc(100dvh-7.5rem)] lg:overflow-y-auto lg:rounded-xl">
      <div role="tablist" aria-label="Painel da estrutura" className="flex gap-5 border-b border-veio">
        {abas.map(({ id, texto }) => (
          <button
            key={id}
            role="tab"
            id={`aba-${id}`}
            aria-selected={aba === id}
            aria-controls={`painel-${id}`}
            onClick={() => setAba(id)}
            className={`relative pb-2.5 text-sm font-bold transition-colors ${aba === id ? 'text-marfim' : 'text-poeira hover:text-marfim'}`}
          >
            {texto}
            {aba === id && <motion.span layoutId="aba-sublinhado" transition={mola} className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-cor" />}
          </button>
        ))}
      </div>

      {aba === 'dentro' ? (
        <div role="tabpanel" id="painel-dentro" aria-labelledby="aba-dentro">
          <PainelEstrutura snapshot={estado.snapshot} />
        </div>
      ) : (
        <div role="tabpanel" id="painel-sairam" aria-labelledby="aba-sairam" className="grid gap-2">
          {saidas.length === 0 && <p className="text-sm text-poeira">{VAZIO_SAIRAM[estado.estrutura]}</p>}
          <ol className="grid gap-1">
            <AnimatePresence initial={false}>
              {saidas.map(({ musica, como, chave }) => (
                <motion.li
                  key={chave}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={mola}
                  className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-3 rounded-lg px-1 py-1.5"
                >
                  {musica.capa ? (
                    <img src={musica.capa} alt="" className="size-10 rounded opacity-60 grayscale" />
                  ) : (
                    <span className="grid size-10 place-items-center rounded bg-veio/50 text-poeira">
                      <Glifo tamanho={16} />
                    </span>
                  )}
                  <span className="grid min-w-0">
                    <span className="truncate font-semibold text-poeira line-through decoration-brasa/70">{musica.titulo}</span>
                    <span className="truncate text-sm text-poeira">
                      {musica.artista}, {como}
                    </span>
                  </span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ol>
        </div>
      )}
    </aside>
  )
}
