import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { criarPlaylist } from '../api'
import { comCor, mola } from '../estilo'
import { GlifoCircular, GlifoDupla, GlifoEncadeada, GlifoFila, GlifoLista, GlifoPilha, GlifoSimples, GlifoVetor } from './Icones'

const campo =
  'w-full rounded-lg bg-nogueira px-3 py-2.5 text-base text-marfim outline-none ring-1 ring-poeira/60 placeholder:text-poeira focus:ring-2 focus:ring-cor aria-invalid:ring-2 aria-invalid:ring-brasa'

const ESTRUTURAS = [
  { valor: 'pilha', titulo: 'Pilha', detalhe: 'A última que entra toca primeiro', Glifo: GlifoPilha },
  { valor: 'fila', titulo: 'Fila', detalhe: 'A primeira que entra toca primeiro', Glifo: GlifoFila },
  { valor: 'lista', titulo: 'Lista', detalhe: 'Toque qualquer uma, em qualquer ordem', Glifo: GlifoLista },
]

const VERSOES = [
  { valor: 'vetor', titulo: 'Com arranjo (vetor)', detalhe: 'Tamanho fixo, escolhido agora', Glifo: GlifoVetor },
  { valor: 'encadeada', titulo: 'Encadeada', detalhe: 'Começa vazia e cresce sem limite', Glifo: GlifoEncadeada },
]

const TIPOS = [
  { valor: 'simples', titulo: 'Simples', detalhe: 'Só avança', Glifo: GlifoSimples },
  { valor: 'dupla', titulo: 'Dupla', detalhe: 'Avança e volta', Glifo: GlifoDupla },
  { valor: 'circular', titulo: 'Circular', detalhe: 'Da última volta à primeira', Glifo: GlifoCircular },
]

// Grupo de escolhas desenhadas: o desenho mostra como as músicas ficam guardadas.
function Escolha({ nome, legenda, opcoes, valor, onMudar, corPorOpcao = false, colunas }) {
  return (
    <fieldset className="grid gap-2">
      <legend className="mb-2 text-sm font-semibold text-poeira">{legenda}</legend>
      <div className={`grid gap-2 ${colunas}`}>
        {opcoes.map(({ valor: v, titulo, detalhe, Glifo }) => (
          <label
            key={v}
            style={corPorOpcao ? comCor(v) : undefined}
            className="flex cursor-pointer items-center gap-3 rounded-xl bg-nogueira/70 px-3.5 py-3 ring-1 ring-veio transition-colors hover:bg-nogueira has-checked:bg-cor/12 has-checked:ring-2 has-checked:ring-cor has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-cor"
          >
            <input type="radio" name={nome} value={v} checked={valor === v} onChange={() => onMudar(v)} className="sr-only" />
            <span className="text-cor">
              <Glifo />
            </span>
            <span className="grid">
              <span className="font-semibold">{titulo}</span>
              <span className="text-sm text-poeira">{detalhe}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export default function CriarPlaylist({ onCriada, focar = 0 }) {
  const [nome, setNome] = useState('')
  const [erroNome, setErroNome] = useState(null)
  const campoNome = useRef(null)
  const [estrutura, setEstrutura] = useState('pilha')
  const [versao, setVersao] = useState('vetor')
  const [tipo, setTipo] = useState('simples')
  const [capacidade, setCapacidade] = useState('5')
  const [erro, setErro] = useState(null)
  const [enviando, setEnviando] = useState(false)

  const pedeTipo = estrutura === 'lista' && versao === 'encadeada'
  const pedeCapacidade = versao === 'vetor'
  const posicoes = Math.min(Math.max(Number.parseInt(capacidade, 10) || 0, 0), 50)

  // O "+" da barra lateral traz o formulário para a vista e põe o cursor no nome.
  useEffect(() => {
    if (!focar) return
    campoNome.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    campoNome.current?.focus({ preventScroll: true })
  }, [focar])

  async function enviar(e) {
    e.preventDefault()
    setErro(null)
    if (!nome.trim()) {
      setErroNome('Dê um nome à playlist para criá-la.')
      campoNome.current?.focus()
      return
    }
    setErroNome(null)
    setEnviando(true)
    try {
      const criada = await criarPlaylist({
        nome,
        estrutura,
        versao,
        tipo: pedeTipo ? tipo : null,
        capacidade: pedeCapacidade ? Number(capacidade) : null,
      })
      setNome('')
      onCriada(criada)
    } catch (err) {
      setErro(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form
      onSubmit={enviar}
      aria-labelledby="titulo-nova"
      style={comCor(estrutura)}
      className="grid gap-6 rounded-2xl bg-painel p-5 ring-1 ring-veio/60 sm:p-7"
    >
      <div className="grid gap-1">
        <h2 id="titulo-nova" className="capa-titulo text-4xl sm:text-5xl">
          Nova playlist
        </h2>
        <p className="max-w-[60ch] text-poeira">Escolha como as músicas vão ficar guardadas. Isso decide o que o player deixa fazer.</p>
      </div>

      <div className="grid max-w-md gap-1.5">
      <label className="grid gap-1.5 text-sm font-semibold text-poeira">
        Nome
        <input
          ref={campoNome}
          id="nome-playlist"
          className={campo}
          value={nome}
          onChange={(e) => {
            setNome(e.target.value)
            if (erroNome && e.target.value.trim()) setErroNome(null)
          }}
          placeholder="Minha playlist"
          aria-invalid={erroNome ? true : undefined}
          aria-describedby={erroNome ? 'erro-nome' : undefined}
        />
      </label>
      {erroNome && (
        <p id="erro-nome" role="alert" className="text-sm text-brasa">
          {erroNome}
        </p>
      )}
      </div>

      <Escolha nome="estrutura" legenda="Estrutura" opcoes={ESTRUTURAS} valor={estrutura} onMudar={setEstrutura} corPorOpcao colunas="sm:grid-cols-3" />
      <Escolha nome="versao" legenda="Versão" opcoes={VERSOES} valor={versao} onMudar={setVersao} colunas="sm:grid-cols-2" />

      <AnimatePresence initial={false} mode="popLayout">
        {pedeTipo && (
          <motion.div key="tipo" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={mola}>
            <Escolha nome="tipo" legenda="Tipo" opcoes={TIPOS} valor={tipo} onMudar={setTipo} colunas="sm:grid-cols-3" />
          </motion.div>
        )}
        {pedeCapacidade && (
          <motion.div key="capacidade" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={mola} className="grid gap-3">
            <label className="grid max-w-40 gap-1.5 text-sm font-semibold text-poeira">
              Capacidade
              <input className={campo} type="number" min="1" max="50" value={capacidade} onChange={(e) => setCapacidade(e.target.value)} />
            </label>
            {/* prévia do vetor que será reservado */}
            <div aria-hidden className="flex flex-wrap gap-1">
              <AnimatePresence initial={false}>
                {Array.from({ length: posicoes }, (_, i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={mola}
                    className="h-6 w-4 rounded-sm border border-dashed border-cor/70"
                  />
                ))}
              </AnimatePresence>
            </div>
            <p className="text-sm text-poeira">
              {posicoes} {posicoes === 1 ? 'posição reservada' : 'posições reservadas'} na criação. Depois não cresce.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {erro && (
        <p role="alert" className="text-sm text-brasa">
          {erro}
        </p>
      )}
      <button
        type="submit"
        disabled={enviando}
        className="justify-self-start rounded-full bg-cor px-6 py-3 font-bold text-nogueira transition hover:brightness-110 active:scale-[0.97] disabled:opacity-50"
      >
        {enviando ? 'Criando…' : 'Criar playlist'}
      </button>
    </form>
  )
}
