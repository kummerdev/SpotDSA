import { comCor } from '../estilo'
import { DICA_REPETIR_CIRCULAR, MOTIVO_NADA_TOCANDO, motivoAleatorio, motivoAnterior, motivoProxima, motivoRepetir } from '../motivos'
import AudioDeezer from './AudioDeezer'
import BarraProgresso, { BotaoTocar, Trilha } from './BarraProgresso'
import { IconeAleatorio, IconeAnterior, IconePainel, IconeProxima, IconeRepetir } from './Icones'
import BotaoBloqueavel from './BotaoBloqueavel'
import Vinil from './Vinil'

const botaoPequeno = 'relative grid size-9 place-items-center rounded-full text-poeira transition hover:text-marfim active:scale-90'

// Barra fixa embaixo, como num player de música: o que toca, o transporte e os ajustes.
export default function BarraPlayer({ estado, rodando, onRodando, onAnterior, onProxima, onFim, painelAberto, onPainel, escopoControles }) {
  const { tocando } = estado
  const circular = estado.tipo === 'circular'

  const layout = ({ botao, trilha, volume }) => (
    <>
      <div className="grid gap-0.5 [grid-area:centro]">
        <div ref={escopoControles} className="flex items-center justify-center gap-2 sm:gap-4">
          <BotaoBloqueavel aria-label="Aleatório desligado" motivo={motivoAleatorio(estado)} className={botaoPequeno}>
            <IconeAleatorio />
          </BotaoBloqueavel>
          <BotaoBloqueavel aria-label="Anterior" motivo={motivoAnterior(estado)} onClick={onAnterior} className={botaoPequeno}>
            <IconeAnterior />
          </BotaoBloqueavel>
          {botao}
          <BotaoBloqueavel aria-label="Próxima" motivo={motivoProxima(estado)} onClick={onProxima} className={botaoPequeno}>
            <IconeProxima />
          </BotaoBloqueavel>
          <BotaoBloqueavel
            aria-label={circular ? 'Repetir ligado' : 'Repetir desligado'}
            motivo={motivoRepetir(estado)}
            dica={DICA_REPETIR_CIRCULAR}
            className={`${botaoPequeno} ${circular ? 'text-cor hover:text-cor' : ''}`}
          >
            <IconeRepetir />
            {circular && <span className="absolute bottom-0.5 size-1 rounded-full bg-cor" />}
          </BotaoBloqueavel>
        </div>
        {trilha}
      </div>
      <div className="flex items-center justify-end gap-3 [grid-area:direita]">
        <div className="hidden md:block">{volume}</div>
        <button
          onClick={onPainel}
          aria-pressed={painelAberto}
          aria-label="Ver estrutura"
          title="Ver estrutura"
          className={`relative grid size-9 place-items-center rounded-full transition ${painelAberto ? 'text-cor' : 'text-poeira hover:text-marfim'}`}
        >
          <IconePainel />
          {painelAberto && <span className="absolute bottom-0 size-1 rounded-full bg-cor" />}
        </button>
      </div>
    </>
  )

  return (
    <footer
      style={comCor(estado.estrutura)}
      className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 border-t border-veio/70 bg-nogueira/95 px-3 py-2 backdrop-blur [grid-template-areas:'info_direita''centro_centro'] lg:grid-cols-[minmax(0,1fr)_minmax(0,38rem)_minmax(0,1fr)] lg:px-4 lg:py-3 lg:[grid-template-areas:'info_centro_direita']"
    >
      <div className="flex min-w-0 items-center gap-3 [grid-area:info]">
        {tocando ? (
          <>
            {tocando.capa ? (
              <img src={tocando.capa} alt="" className="size-12 shrink-0 rounded-md" />
            ) : (
              <Vinil girando={rodando} className="size-12 shrink-0" />
            )}
            <div className="min-w-0">
              <p className="truncate font-semibold" title={tocando.titulo}>
                {tocando.titulo}
              </p>
              <p className="truncate text-sm text-poeira">{tocando.artista}</p>
            </div>
          </>
        ) : (
          <p className="text-sm text-poeira">Nada tocando</p>
        )}
      </div>

      {tocando?.deezer_id ? (
        <AudioDeezer musica={tocando} onFim={onFim} onRodando={onRodando} layout={layout} />
      ) : tocando ? (
        <BarraProgresso musica={tocando} onFim={onFim} onRodando={onRodando} layout={layout} />
      ) : (
        layout({ botao: <BotaoTocar rodando={false} motivo={MOTIVO_NADA_TOCANDO} />, trilha: <Trilha segundos={0} duracao={0} />, volume: null })
      )}
    </footer>
  )
}
