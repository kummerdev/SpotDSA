import { AnimatePresence, motion } from 'motion/react'
import { LINHA, mola } from '../estilo'
import { GLIFO, IconeFechado, IconeLixeira, IconeSetaBaixo, IconeSetaCima, IconeTocar } from './Icones'

const TITULO = {
  pilha: 'Na pilha, o topo toca primeiro',
  fila: 'Na fila, o início toca primeiro',
  lista: 'Na lista, toque qualquer uma',
}

// O desenho do recipiente já diz por onde as músicas passam:
// pilha = balde (aberto em cima, fundo fechado); fila = tubo (aberto nas duas pontas);
// lista = prateleira (entra em qualquer posição).
const RECIPIENTE = {
  pilha: 'rounded-b-2xl border-x-2 border-b-4 border-cor/45 px-2 pb-2',
  fila: 'border-x-2 border-cor/45 px-2',
  lista: 'rounded-2xl border-2 border-cor/25 p-2',
}

const PORTAS = {
  pilha: {
    cima: { texto: 'Topo: entra e sai por aqui', icones: [IconeSetaBaixo, IconeSetaCima], entrada: true },
    baixo: { texto: 'Base: fechada, nada passa por aqui', icones: [IconeFechado], fechada: true },
  },
  fila: {
    cima: { texto: 'Início: sai por aqui', icones: [IconeSetaCima] },
    baixo: { texto: 'Fim: entra por aqui', icones: [IconeSetaCima], entrada: true },
  },
  lista: {
    cima: { texto: 'Entra na posição que você escolher (ou no fim)', icones: [IconeSetaBaixo], entrada: true },
  },
}

// Rótulo do papel de cada música na estrutura (o que o ponteiro marcaria).
function papel(estrutura, i, total) {
  if (estrutura === 'pilha' && i === 0) return 'topo'
  if (estrutura === 'fila' && i === 0) return 'início'
  if (estrutura === 'fila' && i === total - 1 && total > 1) return 'fim'
  return null
}

// Onde a próxima música vai entrar: a regra da estrutura decide (na lista, a posição escolhida).
export function posicaoDeEntrada(estrutura, total, escolhida) {
  if (estrutura === 'pilha') return 0
  if (estrutura === 'fila') return total
  return Number.isInteger(escolhida) && escolhida >= 0 && escolhida <= total ? escolhida : total
}

function Porta({ texto, icones, entrada, fechada, acesa, cheia }) {
  const destaque = acesa && entrada
  return (
    <div
      className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold transition-colors ${
        destaque ? (cheia ? 'bg-brasa/15 text-brasa' : 'bg-cor/15 text-cor') : fechada ? 'text-poeira' : 'text-cor'
      }`}
    >
      <motion.span
        aria-hidden
        className="flex"
        animate={destaque && !cheia ? { y: [0, 3, 0] } : { y: 0 }}
        transition={destaque && !cheia ? { duration: 0.9, repeat: Infinity, ease: 'easeInOut' } : mola}
      >
        {icones.map((Icone, i) => (
          <Icone key={i} />
        ))}
      </motion.span>
      {texto}
    </div>
  )
}

// Lista de músicas desenhada como o recipiente da estrutura, com a prévia de onde a
// próxima vai entrar (`previa`) e um destaque na música que acabou de entrar (`nova`).
export default function ListaMusicas({ estado, girando, previa, nova, onTocar, onRemover }) {
  const { estrutura, musicas, tocando, permite, cheia } = estado
  const Glifo = GLIFO[estrutura]
  const linha = LINHA[estrutura]
  const portas = PORTAS[estrutura]
  const acesa = previa != null
  const indicePrevia = acesa ? posicaoDeEntrada(estrutura, musicas.length, previa.posicao) : -1
  const nome = { pilha: 'pilha', fila: 'fila', lista: 'lista' }[estrutura]

  const lacuna = (
    <motion.li
      key="previa"
      layout
      initial={{ opacity: 0, scaleY: 0.3 }}
      animate={{ opacity: 1, scaleY: 1 }}
      exit={{ opacity: 0, scaleY: 0.3, transition: { duration: 0.15 } }}
      transition={mola}
      aria-hidden
      className={`my-1 flex h-12 items-center justify-center gap-2 rounded-lg border-2 border-dashed text-sm font-semibold ${
        cheia ? 'border-brasa/70 bg-brasa/10 text-brasa' : 'border-cor/70 bg-cor/10 text-cor'
      }`}
    >
      {cheia ? `Não cabe: a ${nome} está cheia` : 'A nova música entra aqui'}
    </motion.li>
  )

  const linhas = musicas.map((m, i) => {
    const ehAtual = tocando?.id === m.id
    const ehNova = nova?.id === m.id
    const rotulo = papel(estrutura, i, musicas.length)
    return (
      <motion.li
        key={m.id}
        layout
        initial={linha.entra}
        animate={{ x: 0, y: 0, scale: 1, scaleY: 1, opacity: 1 }}
        exit={{ ...linha.sai, backgroundColor: 'rgba(255,106,61,0.25)' }}
        transition={mola}
        className={`group relative grid grid-cols-[2rem_2.75rem_minmax(0,1fr)_auto] items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-veio/40 ${ehAtual ? 'bg-cor/10' : ''}`}
      >
        {ehNova && (
          // brilho que some devagar: "esta é a que acabou de entrar"
          <motion.span
            key={nova.chave}
            aria-hidden
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.8, delay: 0.9, ease: 'easeOut' }}
            className="pointer-events-none absolute inset-0 rounded-lg bg-cor/20 ring-2 ring-cor"
          />
        )}
        <span className="relative grid h-8 place-items-center text-sm text-poeira">
          {ehAtual ? (
            <Equalizador girando={girando} />
          ) : permite.escolher ? (
            <>
              <span aria-hidden className="group-focus-within:opacity-0 pode-pairar:group-hover:opacity-0 [@media(hover:none)]:opacity-0">
                {i}
              </span>
              {/* o número vira botão de tocar ao passar o mouse; pelo teclado continua alcançável */}
              <button
                onClick={() => onTocar(i)}
                aria-label={`Tocar ${m.titulo}`}
                className="absolute inset-0 grid place-items-center text-marfim focus:opacity-100 pode-pairar:opacity-0 pode-pairar:group-hover:opacity-100"
              >
                <IconeTocar />
              </button>
            </>
          ) : (
            i
          )}
        </span>
        {m.capa ? (
          <img src={m.capa} alt="" loading="lazy" width={44} height={44} className="size-11 rounded" />
        ) : (
          <span className="grid size-11 place-items-center rounded bg-cor/15 text-cor">
            <Glifo tamanho={18} />
          </span>
        )}
        <span className="grid min-w-0">
          <span title={m.titulo} className={`truncate font-semibold ${ehAtual ? 'text-cor' : ''}`}>
            {m.titulo}
          </span>
          <span className="truncate text-sm text-poeira">{m.artista}</span>
        </span>
        <span className="flex items-center gap-2">
          {ehNova && (
            <motion.span
              key={`selo-${nova.chave}`}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.6, 1, 1, 1] }}
              transition={{ duration: 2.8, times: [0, 0.1, 0.8, 1] }}
              className="rounded-full bg-marfim px-2 py-0.5 text-xs font-bold text-nogueira"
            >
              nova
            </motion.span>
          )}
          {rotulo && <span className="rounded-full bg-cor px-2 py-0.5 text-xs font-bold text-nogueira">{rotulo}</span>}
          {permite.remover && (
            <button
              onClick={() => onRemover(i)}
              aria-label={`Remover ${m.titulo}`}
              title="Remover"
              className="grid size-9 place-items-center rounded-full text-poeira transition hover:text-brasa focus:opacity-100 pode-pairar:opacity-0 pode-pairar:group-hover:opacity-100"
            >
              <IconeLixeira />
            </button>
          )}
        </span>
      </motion.li>
    )
  })

  if (indicePrevia >= 0) linhas.splice(indicePrevia, 0, lacuna)

  return (
    <section className="grid gap-3" aria-labelledby="titulo-musicas">
      <h2 id="titulo-musicas" className="text-2xl font-bold">
        {TITULO[estrutura]}
      </h2>
      <div className="grid">
        {portas.cima && <Porta {...portas.cima} acesa={acesa} cheia={cheia} />}
        <div data-testid="recipiente" className={`grid min-h-16 ${RECIPIENTE[estrutura]}`}>
          {musicas.length === 0 && !acesa && <p className="px-2 py-4 text-poeira">Nenhuma música. Adicione a primeira abaixo.</p>}
          <motion.ol layout className="grid">
            <AnimatePresence initial={false}>{linhas}</AnimatePresence>
          </motion.ol>
        </div>
        {portas.baixo && <Porta {...portas.baixo} acesa={acesa} cheia={cheia} />}
      </div>
    </section>
  )
}

// Barrinhas que pulsam ao lado da música tocando (param quando pausa).
function Equalizador({ girando }) {
  return (
    <span data-girando={girando} aria-label={girando ? 'Tocando' : 'Pausada'} role="img" className="flex h-4 items-end gap-[3px] text-cor">
      {[0, 1, 2].map((i) => (
        <span key={i} className="eq-barra h-full w-[3px] rounded-sm bg-current" style={{ animationDelay: `${-i * 0.3}s` }} />
      ))}
    </span>
  )
}
