import { MotionConfig } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { apagarPlaylist, listarPlaylists } from './api'
import Player from './components/Player'
import TelaInicial from './components/TelaInicial'
import Trilho from './components/Trilho'

// Cada playlist tem endereço próprio (#/playlist/<id>): o botão Voltar do
// navegador funciona e dá para abrir uma playlist direto pelo link.
const lerEndereco = () => window.location.hash.match(/^#\/playlist\/([\w-]+)/)?.[1] ?? null
const irPara = (id) => {
  window.location.hash = id ? `#/playlist/${id}` : '#/'
}

export default function App() {
  const [aberta, setAberta] = useState(lerEndereco)
  const [playlists, setPlaylists] = useState([])
  const [erro, setErro] = useState(null)
  const [pedidoNova, setPedidoNova] = useState(0)
  const telaAnterior = useRef(aberta)

  useEffect(() => {
    const aoMudar = () => setAberta(lerEndereco())
    window.addEventListener('hashchange', aoMudar)
    return () => window.removeEventListener('hashchange', aoMudar)
  }, [])

  const recarregar = useCallback(async () => {
    try {
      setPlaylists(await listarPlaylists())
      setErro(null)
    } catch (err) {
      setErro(err.message)
    }
  }, [])

  useEffect(() => {
    recarregar()
  }, [recarregar, aberta])

  // Ao trocar de tela, volta ao topo e o foco vai para o conteúdo novo (quem usa leitor
  // de tela sabe que mudou). Compara com a tela anterior: no carregamento não mexe em nada.
  useEffect(() => {
    if (telaAnterior.current === aberta) return
    telaAnterior.current = aberta
    window.scrollTo({ top: 0 })
    document.getElementById('conteudo')?.focus({ preventScroll: true })
  }, [aberta])

  async function apagar(id) {
    try {
      await apagarPlaylist(id)
      await recarregar()
    } catch (err) {
      setErro(err.message)
    }
  }

  function novaPlaylist() {
    irPara(null)
    setPedidoNova((n) => n + 1)
  }

  function pularParaConteudo(e) {
    e.preventDefault() // um href="#conteudo" trocaria o endereço da playlist
    document.getElementById('conteudo')?.focus()
  }

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#conteudo"
        onClick={pularParaConteudo}
        className="sr-only z-50 rounded-full bg-marfim px-4 py-2 font-semibold text-nogueira focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Pular para o conteúdo
      </a>
      {/* onde os motivos de botões bloqueados são lidos para quem usa leitor de tela */}
      <div id="anuncios" aria-live="polite" className="sr-only" />
      <div className={`min-h-dvh lg:grid lg:grid-cols-[auto_1fr] lg:gap-2 lg:p-2 ${aberta ? 'pb-36 lg:pb-28' : ''}`}>
        <Trilho playlists={playlists} aberta={aberta} onAbrir={irPara} onInicio={() => irPara(null)} onNova={novaPlaylist} />
        <div className="min-w-0">
          {aberta ? (
            <Player key={aberta} playlistId={aberta} onVoltar={() => irPara(null)} onMudou={recarregar} />
          ) : (
            <TelaInicial playlists={playlists} erro={erro} onAbrir={irPara} onApagar={apagar} pedidoNova={pedidoNova} />
          )}
        </div>
      </div>
    </MotionConfig>
  )
}
