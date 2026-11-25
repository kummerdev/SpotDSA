import { useState } from 'react'
import { buscarDeezer } from '../api'
import BotaoBloqueavel from './BotaoBloqueavel'

export default function BuscaDeezer({ onEscolher, bloqueio = null }) {
  const [texto, setTexto] = useState('')
  const [resultados, setResultados] = useState(null)
  const [erro, setErro] = useState(null)
  const [buscando, setBuscando] = useState(false)

  async function buscar(e) {
    e.preventDefault()
    if (!texto.trim()) return
    setErro(null)
    setBuscando(true)
    try {
      setResultados(await buscarDeezer(texto.trim()))
    } catch (err) {
      setErro(err.message)
      setResultados(null)
    } finally {
      setBuscando(false)
    }
  }

  return (
    <div className="grid gap-3">
      <form onSubmit={buscar} className="flex gap-2">
        <label className="sr-only" htmlFor="busca-deezer">
          Buscar música
        </label>
        <input
          id="busca-deezer"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Artista ou música"
          className="min-w-0 flex-1 rounded-full bg-nogueira px-4 py-2 text-base ring-1 ring-poeira/60 outline-none placeholder:text-poeira focus:ring-2 focus:ring-cor"
        />
        <button type="submit" disabled={buscando} className="rounded-full bg-marfim px-5 py-2 text-sm font-bold text-nogueira transition hover:brightness-110 active:scale-95 disabled:opacity-50">
          Buscar
        </button>
      </form>
      {erro && (
        <p role="alert" className="text-sm text-brasa">
          {erro}
        </p>
      )}
      {resultados?.length === 0 && <p className="text-sm text-poeira">Nenhum resultado</p>}
      {resultados?.length > 0 && (
        <ul className="grid max-h-72 gap-1 overflow-y-auto pr-1">
          {resultados.map((r) => (
            <li key={r.deezer_id} className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-veio/40">
              {r.capa ? <img src={r.capa} alt="" loading="lazy" width={40} height={40} className="size-10 rounded" /> : <div className="size-10 rounded bg-veio" />}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold" title={r.titulo}>
                  {r.titulo}
                </p>
                <p className="truncate text-xs text-poeira">{r.artista}</p>
              </div>
              <BotaoBloqueavel
                onClick={() => onEscolher(r)}
                motivo={bloqueio}
                aria-label={`Adicionar ${r.titulo}`}
                className={`rounded-full px-3 py-1 text-sm font-semibold text-cor ring-1 ring-cor/60 transition ${bloqueio ? '' : 'hover:bg-cor hover:text-nogueira active:scale-95'}`}
              >
                Adicionar
              </BotaoBloqueavel>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
