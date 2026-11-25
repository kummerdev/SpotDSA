import { comCor } from '../estilo'
import Capa from './Capa'
import { IconeCasa, IconeMais } from './Icones'

const botao =
  'grid size-12 shrink-0 place-items-center rounded-lg text-poeira transition-colors hover:bg-veio/60 hover:text-marfim aria-[current=page]:bg-veio aria-[current=page]:text-marfim'

// Barra de playlists sempre à mão: na lateral no computador, no topo no celular.
export default function Trilho({ playlists, aberta, onAbrir, onInicio, onNova }) {
  return (
    <nav
      aria-label="Navegação"
      className="sticky top-0 z-20 flex items-center gap-2 overflow-x-auto bg-nogueira/95 px-3 py-2 backdrop-blur lg:top-2 lg:max-h-[calc(100dvh-7.5rem)] lg:flex-col lg:overflow-x-visible lg:overflow-y-auto lg:rounded-xl lg:bg-painel lg:px-2 lg:py-3"
    >
      <button onClick={onInicio} aria-label="Início" title="Início" aria-current={aberta ? undefined : 'page'} className={botao}>
        <IconeCasa />
      </button>
      <button onClick={onNova} aria-label="Nova playlist" title="Nova playlist" className={botao}>
        <IconeMais />
      </button>
      <span aria-hidden className="mx-1 h-8 w-px shrink-0 bg-veio lg:mx-0 lg:my-1 lg:h-px lg:w-8" />
      {playlists.map((p) => {
        const ativa = p.id === aberta
        return (
          <button
            key={p.id}
            onClick={() => onAbrir(p.id)}
            aria-label={`Abrir ${p.nome}`}
            aria-current={ativa ? 'page' : undefined}
            title={p.nome}
            style={comCor(p.estrutura)}
            className={`relative shrink-0 rounded-lg p-0.5 transition-shadow ${ativa ? 'ring-2 ring-cor' : 'hover:ring-2 hover:ring-veio'}`}
          >
            <Capa estrutura={p.estrutura} capas={p.capas} className="size-11" />
          </button>
        )
      })}
    </nav>
  )
}
