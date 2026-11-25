import { useCallback, useEffect, useRef, useState } from 'react'
import { previewDeezer } from '../api'
import { lerVolume, salvarVolume } from '../volume'
import { BotaoTocar, layoutPadrao, Trilha } from './BarraProgresso'
import { IconeVolume } from './Icones'

// Trecho real de 30 s da Deezer. O link expira em ~15 min, então é pedido
// de novo toda vez que a música muda (nunca é guardado).
export default function AudioDeezer({ musica, onFim, onRodando, layout = layoutPadrao }) {
  const [trecho, setTrecho] = useState({ id: null, url: null, falhou: false })
  const [rodando, setRodando] = useState(false)
  const [tempo, setTempo] = useState({ s: 0, total: musica.duracao })
  const [volume, setVolume] = useState(lerVolume)
  const audio = useRef(null)
  const volumeAntesDoMudo = useRef(null)

  useEffect(() => {
    let vivo = true
    setRodando(false)
    setTempo({ s: 0, total: musica.duracao })
    previewDeezer(musica.deezer_id)
      .then((url) => vivo && setTrecho({ id: musica.id, url, falhou: false }))
      .catch(() => vivo && setTrecho({ id: musica.id, url: null, falhou: true }))
    return () => {
      vivo = false
    }
  }, [musica.id, musica.deezer_id, musica.duracao])

  useEffect(() => {
    onRodando?.(rodando)
  }, [rodando, onRodando])

  // Aplica o volume guardado assim que o <audio> aparece (antes do autoplay começar alto).
  const ligar = useCallback((el) => {
    audio.current = el
    if (el) el.volume = lerVolume()
  }, [])

  function mudarVolume(v) {
    if (audio.current) audio.current.volume = v // o evento volumechange salva
    else {
      setVolume(v)
      salvarVolume(v)
    }
  }

  function alternarMudo() {
    if (volume > 0) {
      volumeAntesDoMudo.current = volume
      mudarVolume(0)
    } else {
      mudarVolume(volumeAntesDoMudo.current || lerVolume() || 0.15)
    }
  }

  function alternar() {
    const el = audio.current
    if (!el) return
    if (el.paused) el.play()?.catch?.(() => {})
    else el.pause()
  }

  const atual = trecho.id === musica.id ? trecho : { url: null, falhou: false }
  const aviso = atual.falhou ? (
    <p className="text-center text-sm text-brasa">Trecho indisponível</p>
  ) : (
    <p className="text-center text-sm text-poeira">Carregando trecho…</p>
  )

  const controleVolume = (
    <div className="flex items-center gap-2">
      <button onClick={alternarMudo} aria-label={volume > 0 ? 'Silenciar' : 'Ligar o som'} className="text-poeira hover:text-marfim">
        <IconeVolume mudo={volume === 0} />
      </button>
      <input
        type="range"
        aria-label="Volume"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={(e) => mudarVolume(Number(e.target.value))}
        className="w-24"
      />
    </div>
  )

  return (
    <>
      {atual.url && !atual.falhou && (
        <audio
          ref={ligar}
          data-testid="audio-deezer"
          src={atual.url}
          autoPlay
          onPlay={() => setRodando(true)}
          onPause={() => setRodando(false)}
          onEnded={() => {
            setRodando(false)
            onFim?.()
          }}
          onTimeUpdate={(e) => setTempo({ s: e.currentTarget.currentTime, total: e.currentTarget.duration || musica.duracao })}
          onError={() => setTrecho({ id: musica.id, url: null, falhou: true })}
          onVolumeChange={(e) => {
            setVolume(e.currentTarget.volume)
            salvarVolume(e.currentTarget.volume)
          }}
        />
      )}
      {layout({
        botao: (
          <BotaoTocar
            rodando={rodando}
            onClick={alternar}
            motivo={atual.falhou ? 'Trecho indisponível: a Deezer não entregou o áudio desta música. Pule para a próxima.' : !atual.url ? 'Carregando o trecho da Deezer…' : null}
          />
        ),
        trilha: atual.url ? (
          <Trilha
            segundos={tempo.s}
            duracao={tempo.total}
            onBuscar={(s) => {
              if (audio.current) audio.current.currentTime = s
            }}
          />
        ) : (
          aviso
        ),
        volume: controleVolume,
      })}
    </>
  )
}
