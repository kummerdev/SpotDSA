import { motion } from 'motion/react'

const NOMES = { topo: 'topo', inicio: 'início', fim: 'fim', atual: 'atual' }
export const MARCADORES_POSICAO = Object.keys(NOMES)

// Etiqueta amarela de ponteiro. layoutId faz ela deslizar até a nova posição.
export default function Marcador({ nome }) {
  return (
    <motion.span
      layoutId={`marcador-${nome}`}
      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
      className="rounded bg-cor px-1.5 py-0.5 font-mono text-[11px] font-semibold leading-none text-nogueira"
    >
      {NOMES[nome]}
    </motion.span>
  )
}
