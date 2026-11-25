import { useEffect, useState } from 'react'
import BotaoBloqueavel from './BotaoBloqueavel'
import BuscaDeezer from './BuscaDeezer'

const campo = 'w-full rounded-lg bg-nogueira px-3 py-2 text-base ring-1 ring-poeira/60 outline-none focus:ring-2 focus:ring-cor'
const rotulo = 'grid gap-1 text-sm text-poeira'

// `bloqueio`: motivo para não poder adicionar agora (ex.: vetor cheio). Dá para buscar e
// digitar, mas o botão Adicionar explica o motivo em vez de adicionar.
// `onMirar(tipo, sim)`: avisa quando o mouse entra aqui ou o foco entra/sai ('mouse' | 'foco'),
// e `onPosicao` a posição escolhida: o Player abre na lista o espaço onde a música vai entrar.
export default function AdicionarMusica({ permitePosicao, tamanho, bloqueio = null, ativa = false, onAdicionar, onMirar, onPosicao }) {
  const [aba, setAba] = useState('deezer')
  const [posicao, setPosicao] = useState('')
  const [titulo, setTitulo] = useState('')
  const [artista, setArtista] = useState('')
  const [duracao, setDuracao] = useState('180')

  const posicaoEscolhida = () => (permitePosicao && posicao !== '' ? Number(posicao) : null)

  // conta ao Player onde a próxima música entraria (ele desenha a prévia na lista)
  const escolhida = posicaoEscolhida()
  useEffect(() => {
    onPosicao?.(escolhida)
  }, [escolhida, onPosicao])

  function adicionar(musica) {
    onAdicionar(musica)
  }

  function adicionarManual(e) {
    e.preventDefault()
    adicionar({ titulo, artista, duracao: Number(duracao), posicao: posicaoEscolhida() })
    setTitulo('')
    setArtista('')
  }

  const botaoAba = (id, texto) => (
    <button
      type="button"
      onClick={() => setAba(id)}
      aria-pressed={aba === id}
      className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${aba === id ? 'bg-marfim text-nogueira' : 'bg-veio/50 text-marfim hover:bg-veio'}`}
    >
      {texto}
    </button>
  )

  return (
    <section
      onPointerEnter={() => onMirar?.('mouse', true)}
      onFocus={() => onMirar?.('foco', true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && onMirar?.('foco', false)}
      className={`grid gap-4 rounded-2xl bg-painel p-5 ring-1 transition-shadow sm:p-6 ${ativa ? 'ring-2 ring-cor/60' : 'ring-veio/60'}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">Adicionar música</h2>
        <div className="flex gap-1">
          {botaoAba('deezer', 'Buscar na Deezer')}
          {botaoAba('manual', 'Manual')}
        </div>
      </div>
      <div className="grid gap-4">
        {permitePosicao && (
          <label className={`${rotulo} max-w-48`}>
            Posição
            <input
              type="number"
              min="0"
              max={tamanho}
              value={posicao}
              onChange={(e) => {
                setPosicao(e.target.value)
                onMirar?.('foco', true)
              }}
              placeholder={`no fim (${tamanho})`}
              className={`${campo} font-mono`}
            />
          </label>
        )}
        {aba === 'deezer' ? (
          <BuscaDeezer bloqueio={bloqueio} onEscolher={(r) => adicionar({ ...r, posicao: posicaoEscolhida() })} />
        ) : (
          <form onSubmit={adicionarManual} className="grid gap-3 sm:grid-cols-[2fr_2fr_1fr_auto] sm:items-end">
            <label className={rotulo}>
              Título
              <input className={campo} value={titulo} onChange={(e) => setTitulo(e.target.value)} />
            </label>
            <label className={rotulo}>
              Artista
              <input className={campo} value={artista} onChange={(e) => setArtista(e.target.value)} />
            </label>
            <label className={rotulo}>
              Duração (s)
              <input className={campo} type="number" min="1" value={duracao} onChange={(e) => setDuracao(e.target.value)} />
            </label>
            <BotaoBloqueavel
              type="submit"
              motivo={bloqueio}
              className={`rounded-full bg-cor px-5 py-2 text-sm font-bold text-nogueira transition ${bloqueio ? '' : 'hover:brightness-110 active:scale-95'}`}
            >
              Adicionar
            </BotaoBloqueavel>
          </form>
        )}
      </div>
    </section>
  )
}
