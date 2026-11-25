import { AnimatePresence, motion, useAnimate, useReducedMotion } from 'motion/react'
import { useEffect, useId, useState } from 'react'
import { createPortal } from 'react-dom'

// Leitores de tela ouvem o motivo por esta região (fica no App, sempre presente).
function anunciar(texto) {
  const regiao = document.getElementById('anuncios')
  if (!regiao) return
  regiao.textContent = ''
  setTimeout(() => {
    regiao.textContent = texto
  }, 50)
}

// Botão que a regra da estrutura pode bloquear. Bloqueado, ele continua clicável
// (aria-disabled em vez de disabled): o clique não faz a ação, mas o botão balança
// e um balão explica o motivo. Sem motivo, funciona como um botão comum.
// `dica`: texto mostrado ao clicar quando o botão não tem ação própria (só informa).
export default function BotaoBloqueavel({ motivo, dica, onClick, className = '', children, type = 'button', ...resto }) {
  const [escopo, animar] = useAnimate()
  const semMovimento = useReducedMotion()
  const [balao, setBalao] = useState(null)
  const idMotivo = useId()
  const texto = motivo ?? (onClick ? null : dica)

  function clicar(e) {
    if (!texto) return onClick?.(e)
    e.preventDefault() // também segura o envio do formulário (Enter num campo dispara este clique)
    const caixa = escopo.current.getBoundingClientRect()
    setBalao({ texto, x: caixa.left + caixa.width / 2, topo: caixa.top, base: caixa.bottom, chave: Date.now() })
    anunciar(texto)
    if (motivo && !semMovimento) animar(escopo.current, { x: [0, -6, 6, -4, 4, 0] }, { duration: 0.4 })
  }

  // O balão some sozinho em alguns segundos, ao rolar a página ou com Esc.
  useEffect(() => {
    if (!balao) return undefined
    const fechar = () => setBalao(null)
    const tecla = (e) => e.key === 'Escape' && fechar()
    const relogio = setTimeout(fechar, 4500)
    window.addEventListener('scroll', fechar, true)
    window.addEventListener('keydown', tecla)
    return () => {
      clearTimeout(relogio)
      window.removeEventListener('scroll', fechar, true)
      window.removeEventListener('keydown', tecla)
    }
  }, [balao])

  return (
    <>
      <button
        ref={escopo}
        type={type}
        {...resto}
        aria-disabled={motivo ? true : undefined}
        aria-describedby={texto ? idMotivo : undefined}
        onClick={clicar}
        className={`${className} ${motivo ? 'cursor-not-allowed opacity-40' : ''}`}
      >
        {children}
      </button>
      {texto && (
        <span id={idMotivo} hidden>
          {texto}
        </span>
      )}
      {createPortal(
        <AnimatePresence>{balao && <Balao key={balao.chave} {...balao} aviso={!!motivo} />}</AnimatePresence>,
        document.body,
      )}
    </>
  )
}

const LARGURA = 272

// Balão preso ao botão: em cima dele (ou embaixo, se não couber), sem sair da tela.
function Balao({ texto, x, topo, base, aviso }) {
  const largura = Math.min(LARGURA, window.innerWidth - 24)
  const esquerda = Math.min(Math.max(x - largura / 2, 12), window.innerWidth - largura - 12)
  const embaixo = topo < 140
  const setaX = Math.min(Math.max(x - esquerda, 14), largura - 14)

  return (
    <motion.div
      data-testid="balao-motivo"
      initial={{ opacity: 0, y: embaixo ? -6 : 6, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={{ type: 'spring', stiffness: 500, damping: 32 }}
      style={{ left: esquerda, width: largura, top: embaixo ? base + 10 : undefined, bottom: embaixo ? undefined : window.innerHeight - topo + 10 }}
      className={`pointer-events-none fixed z-[60] rounded-xl px-3.5 py-2.5 text-sm leading-snug font-medium shadow-xl shadow-black/50 ${
        aviso ? 'bg-marfim text-nogueira' : 'bg-veio text-marfim'
      }`}
    >
      {texto}
      <span
        aria-hidden
        className={`absolute size-2.5 rotate-45 ${aviso ? 'bg-marfim' : 'bg-veio'} ${embaixo ? '-top-1' : '-bottom-1'}`}
        style={{ left: setaX - 5 }}
      />
    </motion.div>
  )
}
