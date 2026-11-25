import { AnimatePresence, motion, useAnimate, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { adicionarMusica, anterior, obterPlaylist, proxima, removerMusica, tocar } from '../api'
import { descreverEstrutura } from '../descrever'
import { comCor, gesto, mola } from '../estilo'
import { explicar, explicarErro, regra } from '../explicacoes'
import { motivoAdicionar } from '../motivos'
import AdicionarMusica from './AdicionarMusica'
import BarraPlayer from './BarraPlayer'
import { GLIFO, IconeAlerta } from './Icones'
import ListaMusicas from './ListaMusicas'
import Narrador from './Narrador'
import PainelLateral from './PainelLateral'
import Vinil, { Braco } from './Vinil'

const SAIU = { pilha: 'desempilhada', fila: 'desenfileirada', lista: 'removida' }

function temProxima({ estrutura, tipo, tocando, musicas }) {
  if (!tocando || musicas.length < 2) return false
  if (estrutura !== 'lista' || tipo === 'circular') return true
  return musicas.findIndex((m) => m.id === tocando.id) < musicas.length - 1
}

const TREMOR = { x: [0, -9, 9, -6, 6, -2, 0] }

// No computador o painel "Ver estrutura" já começa aberto ao lado.
const telaLarga = () => window.matchMedia?.('(min-width: 1024px)')?.matches ?? false

export default function Player({ playlistId, onVoltar, onMudou }) {
  const [estado, setEstado] = useState(null)
  const [erro, setErro] = useState(null)
  const [painelAberto, setPainelAberto] = useState(telaLarga)
  const [narracao, setNarracao] = useState([])
  const [saidas, setSaidas] = useState([])
  const [ultimaAcao, setUltimaAcao] = useState(null)
  const [rodando, setRodando] = useState(false)
  // Prévia de onde a próxima música entra: liga quando a pessoa mira em "Adicionar música"
  // (mouse ou foco) e só desliga quando o mouse sai da área lista + seção, para a lista
  // crescer sem "empurrar" o mouse para fora e piscar. Depois de adicionar, descansa.
  const [mira, setMira] = useState({ mouse: false, foco: false, pausada: false })
  const [posicaoEscolhida, setPosicaoEscolhida] = useState(null)
  const mirar = useCallback((tipo, sim) => setMira((m) => ({ ...m, [tipo]: sim, pausada: sim ? false : m.pausada })), [])
  const [nova, setNova] = useState(null) // { id, chave } da música que acabou de entrar
  const [escopoControles, animarControles] = useAnimate()
  const [escopoAdicionar, animarAdicionar] = useAnimate()
  const semMovimento = useReducedMotion()
  const ocupado = useRef(false)

  useEffect(() => {
    let vivo = true
    obterPlaylist(playlistId)
      .then((e) => vivo && setEstado(e))
      .catch((err) => vivo && setErro(err.message))
    return () => {
      vivo = false
    }
  }, [playlistId])

  const narrar = useCallback((item) => {
    setNarracao((h) => [{ ...item, chave: `${Date.now()}-${Math.random()}` }, ...h].slice(0, 6))
  }, [])

  // Erro também se vê: o controle que falhou balança, como quem diz "não".
  function tremer(acao) {
    if (semMovimento) return
    const alvo = acao.tipo === 'adicionar' ? escopoAdicionar.current : escopoControles.current
    if (!alvo) return
    if (acao.tipo === 'adicionar') animarAdicionar(alvo, TREMOR, { duration: 0.45 })
    else animarControles(alvo, TREMOR, { duration: 0.45 })
  }

  // Chama a API, troca o estado e explica o que a estrutura fez (ou por que não fez).
  async function executar(chamar, acao) {
    // um clique de cada vez: dois "Próxima" seguidos não podem virar duas requisições cruzadas
    if (ocupado.current) return
    ocupado.current = true
    const antes = estado
    setErro(null)
    try {
      const depois = await chamar()
      setUltimaAcao(acao)
      setEstado(depois)
      if (acao.tipo === 'adicionar') {
        setMira((m) => ({ ...m, pausada: true }))
        const entrou = depois.musicas.find((m) => !antes.musicas.some((a) => a.id === m.id))
        if (entrou) setNova({ id: entrou.id, chave: Date.now() })
      }
      narrar({ ...explicar(acao, antes, depois), tipo: acao.tipo })
      const saiu = acao.tipo === 'remover' ? antes.musicas[acao.posicao] : acao.tipo === 'proxima' && antes.estrutura !== 'lista' ? antes.tocando : null
      if (saiu) setSaidas((s) => [{ musica: saiu, como: SAIU[antes.estrutura], chave: `${Date.now()}` }, ...s].slice(0, 20))
      onMudou?.()
    } catch (err) {
      setErro(err.message)
      narrar({ ...explicarErro(acao, err, antes), erro: true, tipo: acao.tipo })
      tremer(acao)
    } finally {
      ocupado.current = false
    }
  }

  const alerta = erro && (
    <p role="alert" className="flex items-center gap-2 rounded-lg bg-brasa/12 px-3 py-2 text-sm text-brasa">
      <IconeAlerta />
      {erro}
    </p>
  )

  const voltar = (
    <button onClick={onVoltar} className="justify-self-start rounded-full text-sm font-semibold text-poeira hover:text-marfim">
      Voltar para as playlists
    </button>
  )

  if (!estado) {
    return (
      <main id="conteudo" tabIndex={-1} aria-busy={!alerta} className="grid content-start gap-6 px-4 py-6 outline-none lg:rounded-xl lg:bg-painel/50 lg:px-8 lg:py-8">
        {voltar}
        {alerta ?? (
          // esqueleto no lugar de "carregando": a tela já tem a forma do que vem
          <div aria-label="Carregando playlist" className="grid animate-pulse gap-6 motion-reduce:animate-none">
            <div className="h-16 w-2/3 rounded-lg bg-veio/50" />
            <div className="grid items-center gap-6 sm:grid-cols-[14rem_1fr]">
              <div className="mx-auto aspect-square w-48 rounded-full bg-veio/50 sm:w-full" />
              <div className="grid gap-3">
                <div className="h-10 w-3/4 rounded-lg bg-veio/50" />
                <div className="h-5 w-1/3 rounded bg-veio/50" />
              </div>
            </div>
          </div>
        )}
      </main>
    )
  }

  const { tocando, musicas, permite } = estado
  const indiceAtual = tocando ? musicas.findIndex((m) => m.id === tocando.id) : -1
  const pular = () => executar(() => proxima(playlistId), { tipo: 'proxima' })
  const aoFim = temProxima(estado) ? pular : undefined
  const g = gesto(estado.estrutura, ultimaAcao)
  const Glifo = GLIFO[estado.estrutura]
  const girando = rodando && !!tocando
  const previa = (mira.mouse || mira.foco) && !mira.pausada ? { posicao: posicaoEscolhida } : null

  return (
    <div style={comCor(estado.estrutura)} className={`grid gap-2 ${painelAberto ? 'lg:grid-cols-[minmax(0,1fr)_24rem]' : ''}`}>
      <main id="conteudo" tabIndex={-1} className="grid content-start gap-8 px-4 py-6 outline-none sm:px-6 lg:rounded-xl lg:bg-painel/50 lg:px-8 lg:py-8">
        <header className="grid gap-3">
          {voltar}
          <p className="flex items-center gap-2 text-sm text-poeira">
            <span className="text-cor">
              <Glifo tamanho={18} />
            </span>
            {descreverEstrutura(estado)}
          </p>
          <h1 className="capa-titulo text-6xl break-words sm:text-7xl">{estado.nome}</h1>
          <p className="max-w-[62ch] text-poeira">{regra(estado)}</p>
        </header>

        {/* o toca-discos: o disco gira enquanto toca e troca com o gesto da estrutura */}
        <motion.section
          data-testid="tocando"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={mola}
          className="grid items-center gap-6 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-10"
        >
          <div className="relative mx-auto w-48 sm:w-full">
            <div className="relative aspect-square">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-veio" />
              <AnimatePresence mode="popLayout" initial={false} custom={g}>
                {tocando && (
                  <motion.div
                    key={tocando.id}
                    custom={g}
                    variants={{ entra: (gg) => gg.entra, centro: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 }, sai: (gg) => gg.sai }}
                    initial="entra"
                    animate="centro"
                    exit="sai"
                    transition={mola}
                    className="absolute inset-0"
                  >
                    <Vinil capa={tocando.capa} alt={`Capa de ${tocando.titulo}`} girando={girando} className="size-full" />
                  </motion.div>
                )}
              </AnimatePresence>
              <Braco tocando={girando} />
            </div>
          </div>
          <div className="grid min-w-0 gap-2 text-center sm:text-left">
            {tocando ? (
              <>
                <p className="text-sm font-semibold text-cor">{girando ? 'Tocando agora' : 'Pausada'}</p>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div key={tocando.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={mola}>
                    <p className="capa-titulo text-4xl break-words sm:text-5xl">{tocando.titulo}</p>
                    <p className="mt-1 text-lg text-poeira">{tocando.artista}</p>
                  </motion.div>
                </AnimatePresence>
              </>
            ) : (
              <>
                <p className="capa-titulo text-4xl text-poeira sm:text-5xl">Nada tocando</p>
                <p className="text-poeira">Adicione uma música para pôr um disco no prato.</p>
              </>
            )}
            {estado.capacidade != null && <Medidor ocupadas={musicas.length} capacidade={estado.capacidade} cheia={estado.cheia} />}
          </div>
        </motion.section>

        {estado.cheia && (
          <div className="flex items-start gap-3 rounded-xl bg-brasa/10 p-4 ring-1 ring-brasa/40">
            <span className="mt-0.5 text-brasa">
              <IconeAlerta />
            </span>
            <p className="text-sm">
              Playlist cheia: todas as {estado.capacidade} posições do vetor estão ocupadas. Pule ou remova uma música para liberar espaço.
            </p>
          </div>
        )}
        {alerta}

        <Narrador itens={narracao} />

        {/* área da prévia: o mouse entrar em "Adicionar música" liga; sair da área toda desliga */}
        <div className="grid gap-8" onPointerLeave={() => mirar('mouse', false)}>
          <ListaMusicas
            estado={estado}
            girando={girando}
            previa={previa}
            nova={nova}
            onTocar={(i) => executar(() => tocar(playlistId, i), { tipo: 'tocar', posicao: i, paraTras: i < indiceAtual })}
            onRemover={(i) => executar(() => removerMusica(playlistId, i), { tipo: 'remover', posicao: i })}
          />

          <div ref={escopoAdicionar}>
            <AdicionarMusica
              permitePosicao={permite.inserir_em_posicao}
              tamanho={musicas.length}
              bloqueio={motivoAdicionar(estado)}
              ativa={previa != null}
              onMirar={mirar}
              onPosicao={setPosicaoEscolhida}
              onAdicionar={(musica) => executar(() => adicionarMusica(playlistId, musica), { tipo: 'adicionar', musica, posicao: musica.posicao })}
            />
          </div>
        </div>
      </main>

      <AnimatePresence initial={false}>
        {painelAberto && (
          <motion.div key="painel" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }} transition={mola}>
            <PainelLateral estado={estado} saidas={saidas} />
          </motion.div>
        )}
      </AnimatePresence>

      <BarraPlayer
        estado={estado}
        rodando={girando}
        onRodando={setRodando}
        onAnterior={() => executar(() => anterior(playlistId), { tipo: 'anterior' })}
        onProxima={pular}
        onFim={aoFim}
        painelAberto={painelAberto}
        onPainel={() => setPainelAberto((v) => !v)}
        escopoControles={escopoControles}
      />
    </div>
  )
}

// Vetor de tamanho fixo visto de fora: uma casa por posição, acesas as ocupadas.
function Medidor({ ocupadas, capacidade, cheia }) {
  return (
    <div className="mt-3 grid gap-1.5">
      <div aria-hidden className="flex flex-wrap justify-center gap-1 sm:justify-start">
        {Array.from({ length: capacidade }, (_, i) => (
          <span
            key={i}
            className={`h-5 w-2.5 rounded-sm transition-colors duration-300 ${i < ocupadas ? (cheia ? 'bg-brasa' : 'bg-cor') : 'bg-veio/70'}`}
          />
        ))}
      </div>
      <p className={`text-sm ${cheia ? 'text-brasa' : 'text-poeira'}`}>
        {ocupadas} de {capacidade} posições ocupadas
      </p>
    </div>
  )
}
