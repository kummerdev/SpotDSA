import { useEffect, useRef, useState } from 'react'
import BotaoBloqueavel from './BotaoBloqueavel'
import { IconePausar, IconeTocar } from './Icones'

export function formatarTempo(s) {
  const t = Math.max(0, Math.floor(s))
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`
}

// Botão redondo de tocar/pausar, igual para as duas formas de reprodução.
// Com `motivo`, fica bloqueado e explica por quê ao ser clicado.
export function BotaoTocar({ rodando, onClick, motivo = null }) {
  return (
    <BotaoBloqueavel
      onClick={onClick}
      motivo={motivo}
      aria-label={rodando ? 'Pausar' : 'Continuar'}
      className={`grid size-10 shrink-0 place-items-center rounded-full bg-marfim text-nogueira transition ${motivo ? '' : 'hover:scale-105 active:scale-95'}`}
    >
      {rodando ? <IconePausar /> : <IconeTocar />}
    </BotaoBloqueavel>
  )
}

// Linha do tempo: decorrido, barra (clicável para pular para um ponto) e duração.
export function Trilha({ segundos, duracao, onBuscar }) {
  const fracao = duracao ? Math.min(segundos / duracao, 1) : 0
  function buscar(e) {
    if (!onBuscar || !duracao) return
    const caixa = e.currentTarget.getBoundingClientRect()
    onBuscar(((e.clientX - caixa.left) / caixa.width) * duracao)
  }
  return (
    <div className="flex items-center gap-2 text-xs text-poeira">
      <span className="w-9 text-right">{formatarTempo(segundos)}</span>
      <div
        role="progressbar"
        aria-label="Progresso da música"
        aria-valuemin={0}
        aria-valuemax={duracao}
        aria-valuenow={Math.floor(segundos)}
        aria-valuetext={`${formatarTempo(segundos)} de ${formatarTempo(duracao)}`}
        onClick={buscar}
        className="group flex h-4 flex-1 cursor-pointer items-center"
      >
        <div className="h-1 w-full overflow-hidden rounded-full bg-veio">
          <div
            className="h-full origin-left rounded-full bg-marfim transition-transform duration-1000 ease-linear group-hover:bg-cor motion-reduce:transition-none"
            style={{ transform: `scaleX(${fracao})` }}
          />
        </div>
      </div>
      <span className="w-9">{formatarTempo(duracao)}</span>
    </div>
  )
}

// Disposição padrão quando ninguém escolhe outra (a barra do player escolhe).
export const layoutPadrao = ({ botao, trilha, volume }) => (
  <div className="flex items-center gap-3">
    {botao}
    <div className="flex-1">{trilha}</div>
    {volume}
  </div>
)

// Reprodução simulada (músicas adicionadas à mão): um relógio de 1 em 1 segundo.
export default function BarraProgresso({ musica, onFim, onRodando, layout = layoutPadrao }) {
  // o progresso fica "carimbado" com o id da música: trocar de música zera sem efeito extra
  const [progresso, setProgresso] = useState({ id: musica.id, s: 0 })
  const [pausadoEm, setPausadoEm] = useState(null)
  const avisou = useRef(false)

  const segundos = progresso.id === musica.id ? progresso.s : 0
  const pausado = pausadoEm === musica.id
  const rodando = !pausado && segundos < musica.duracao

  useEffect(() => {
    avisou.current = false
  }, [musica.id])

  useEffect(() => {
    onRodando?.(rodando)
  }, [rodando, onRodando])

  useEffect(() => {
    if (pausado) return undefined
    const relogio = setInterval(() => {
      setProgresso((p) => ({ id: musica.id, s: Math.min((p.id === musica.id ? p.s : 0) + 1, musica.duracao) }))
    }, 1000)
    return () => clearInterval(relogio)
  }, [pausado, musica.id, musica.duracao])

  // Só conta como "avisado" quando havia para onde ir: se a música acabou sem
  // próxima e depois alguém adiciona uma, o onFim chega e a playlist avança.
  useEffect(() => {
    if (segundos >= musica.duracao && !avisou.current && onFim) {
      avisou.current = true
      onFim()
    }
  }, [segundos, musica.duracao, onFim])

  return layout({
    botao: <BotaoTocar rodando={!pausado} onClick={() => setPausadoEm(pausado ? null : musica.id)} />,
    trilha: (
      <Trilha
        segundos={segundos}
        duracao={musica.duracao}
        onBuscar={(s) => {
          avisou.current = false
          setProgresso({ id: musica.id, s: Math.floor(s) })
        }}
      />
    ),
    volume: null,
  })
}
