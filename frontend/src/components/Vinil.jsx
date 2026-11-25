import { motion } from 'motion/react'

// Disco de vinil na cor da estrutura. A capa da música vira o selo do centro.
// `girando`: gira a 33⅓ rpm; parado, fica onde estava (não volta ao zero).
export default function Vinil({ capa, alt = '', girando = false, className = '' }) {
  return (
    <div className={`relative aspect-square ${className}`} style={{ '--disco': 'var(--cor)' }}>
      <div className="vinil-disco gira absolute inset-0 rounded-full" data-girando={girando}>
        <div className="absolute inset-[31%] overflow-hidden rounded-full bg-cor ring-2 ring-black/40">
          {capa && <img src={capa} alt={alt} className="size-full object-cover" />}
        </div>
        <div className="absolute top-1/2 left-1/2 size-[4%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-nogueira" />
      </div>
      <div className="vinil-brilho pointer-events-none absolute inset-0 rounded-full" />
    </div>
  )
}

// Braço do toca-discos: pousa a agulha no disco quando toca e recua quando para.
// Fica fora do disco: os discos trocam por baixo e o braço continua no lugar.
export function Braco({ tocando }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute -top-[6%] -right-[16%] h-[78%] w-[56%]"
      style={{ transformOrigin: '86% 10%' }}
      initial={{ rotate: -32 }}
      animate={{ rotate: tocando ? 0 : -32 }}
      transition={{ type: 'spring', stiffness: 90, damping: 16 }}
    >
      <svg viewBox="0 0 60 80" className="size-full overflow-visible">
        <line x1="52" y1="8" x2="16" y2="62" stroke="var(--color-poeira)" strokeWidth="2.4" strokeLinecap="round" />
        <rect x="9" y="58" width="11" height="7" rx="1.5" transform="rotate(-34 14 62)" fill="var(--color-marfim)" />
        <circle cx="52" cy="8" r="6.5" fill="var(--color-painel)" stroke="var(--color-poeira)" strokeWidth="2" />
        <circle cx="52" cy="8" r="2" fill="var(--color-poeira)" />
      </svg>
    </motion.div>
  )
}
