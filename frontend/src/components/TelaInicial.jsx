import { useState } from 'react'
import { descreverEstrutura } from '../descrever'
import { comCor } from '../estilo'
import Capa from './Capa'
import CriarPlaylist from './CriarPlaylist'
import { GLIFO, IconeLixeira, IconeTocar } from './Icones'

const FILTROS = [
  { valor: null, texto: 'Todas' },
  { valor: 'pilha', texto: 'Pilhas' },
  { valor: 'fila', texto: 'Filas' },
  { valor: 'lista', texto: 'Listas' },
]

export default function TelaInicial({ playlists, erro, onAbrir, onApagar, pedidoNova }) {
  const [filtro, setFiltro] = useState(null)
  const [confirmando, setConfirmando] = useState(null)
  const visiveis = filtro ? playlists.filter((p) => p.estrutura === filtro) : playlists

  return (
    <main id="conteudo" tabIndex={-1} className="grid gap-10 px-4 py-6 outline-none sm:px-6 lg:rounded-xl lg:bg-painel/50 lg:px-8 lg:py-8">
      <header className="grid gap-2">
        <h1 className="capa-titulo text-6xl sm:text-7xl">SpotDSA</h1>
        <p className="max-w-[58ch] text-poeira">
          Cada playlist é uma pilha, uma fila ou uma lista. Toque, pule e veja a estrutura mudar por dentro.
        </p>
      </header>

      <section aria-labelledby="titulo-playlists" className="grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="titulo-playlists" className="text-2xl font-bold">
            Suas playlists
          </h2>
          <div role="group" aria-label="Filtrar por estrutura" className="flex flex-wrap gap-2">
            {FILTROS.map(({ valor, texto }) => {
              const Glifo = valor && GLIFO[valor]
              const ativo = filtro === valor
              return (
                <button
                  key={texto}
                  onClick={() => setFiltro(valor)}
                  aria-pressed={ativo}
                  style={valor ? comCor(valor) : undefined}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                    ativo ? 'bg-marfim text-nogueira' : 'bg-veio/50 text-marfim hover:bg-veio'
                  }`}
                >
                  {Glifo && (
                    <span className={ativo ? '' : 'text-cor'}>
                      <Glifo tamanho={16} />
                    </span>
                  )}
                  {texto}
                </button>
              )
            })}
          </div>
        </div>

        {erro && (
          <p role="alert" className="text-sm text-brasa">
            {erro}
          </p>
        )}
        {playlists.length === 0 && !erro && (
          <p className="text-poeira">Nenhuma playlist ainda. Monte a primeira abaixo, escolhendo como as músicas vão ficar guardadas.</p>
        )}
        {playlists.length > 0 && visiveis.length === 0 && <p className="text-poeira">Nenhuma playlist com essa estrutura.</p>}

        <ul className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {visiveis.map((p) => (
            <li key={p.id} style={comCor(p.estrutura)} className="group relative rounded-xl p-2 transition-colors hover:bg-painel">
              <button onClick={() => onAbrir(p.id)} aria-label={`Abrir ${p.nome}`} className="grid w-full gap-2.5 rounded-lg text-left">
                <span className="relative block">
                  <Capa estrutura={p.estrutura} capas={p.capas} className="w-full shadow-lg shadow-black/40" />
                  <span
                    aria-hidden
                    className="absolute right-2 bottom-2 z-10 grid size-11 translate-y-1 place-items-center rounded-full bg-cor text-nogueira opacity-0 shadow-lg shadow-black/50 transition group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    <IconeTocar />
                  </span>
                </span>
                <span className="grid min-w-0">
                  <span className="truncate font-bold" title={p.nome}>
                    {p.nome}
                  </span>
                  <span className="truncate text-sm text-poeira" title={`${descreverEstrutura(p)}, ${p.quantidade} músicas`}>
                    {descreverEstrutura(p)}, {p.quantidade} {p.quantidade === 1 ? 'música' : 'músicas'}
                  </span>
                </span>
              </button>
              {confirmando === p.id ? (
                // apagar uma playlist inteira não tem volta: pede confirmação no próprio cartão
                <div
                  role="group"
                  aria-label={`Confirmar apagar ${p.nome}`}
                  className="absolute inset-x-2 top-2 z-20 grid aspect-square content-center gap-3 rounded-lg bg-nogueira/95 p-4 text-center ring-2 ring-brasa backdrop-blur-sm"
                >
                  <p className="font-semibold">Apagar “{p.nome}” e todas as músicas?</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      autoFocus
                      onClick={() => setConfirmando(null)}
                      className="rounded-full bg-veio px-4 py-2 text-sm font-semibold hover:bg-veio/70"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => {
                        setConfirmando(null)
                        onApagar(p.id)
                      }}
                      aria-label={`Apagar ${p.nome}`}
                      className="rounded-full bg-brasa px-4 py-2 text-sm font-bold text-nogueira hover:brightness-110"
                    >
                      Apagar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmando(p.id)}
                  aria-label={`Apagar ${p.nome}…`}
                  title="Apagar playlist"
                  className="absolute top-3.5 right-3.5 z-10 grid size-9 place-items-center rounded-full bg-nogueira/85 text-poeira transition hover:text-brasa focus:opacity-100 pode-pairar:opacity-0 pode-pairar:group-hover:opacity-100"
                >
                  <IconeLixeira />
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <CriarPlaylist onCriada={(p) => onAbrir(p.id)} focar={pedidoNova} />
    </main>
  )
}
