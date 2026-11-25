import { AnimatePresence, motion } from 'motion/react'
import { mola } from '../estilo'
import { IconeAgulha, IconeAlerta, IconeAnterior, IconeEntrou, IconeProxima, IconeSaiu } from './Icones'

// Cada ação tem seu desenho: entrou, pulou, voltou, agulha movida, saiu, erro.
const ICONE = {
  adicionar: IconeEntrou,
  proxima: IconeProxima,
  anterior: IconeAnterior,
  tocar: IconeAgulha,
  remover: IconeSaiu,
}

// "O que aconteceu": a explicação da última ação em destaque e as anteriores logo abaixo.
export default function Narrador({ itens }) {
  const [ultimo, ...anteriores] = itens
  const Icone = ultimo && (ultimo.erro ? IconeAlerta : (ICONE[ultimo.tipo] ?? IconeEntrou))

  return (
    <section aria-live="polite" className="grid gap-3 border-t border-veio pt-6">
      <h2 className="text-2xl font-bold">O que aconteceu</h2>
      {!ultimo && <p className="max-w-[60ch] text-poeira">Adicione, pule ou escolha uma música: aqui aparece o que a estrutura fez por dentro e por quê.</p>}
      <AnimatePresence mode="popLayout" initial={false}>
        {ultimo && (
          <motion.div
            key={ultimo.chave}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={mola}
            className={`grid grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-xl p-4 ${ultimo.erro ? 'bg-brasa/10' : 'bg-cor/10'}`}
          >
            <motion.span
              initial={{ scale: 0.4, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 18 }}
              className={`grid size-9 place-items-center rounded-full ${ultimo.erro ? 'bg-brasa text-nogueira' : 'bg-cor text-nogueira'}`}
            >
              <Icone />
            </motion.span>
            <div className="grid max-w-[64ch] gap-1">
              <p className={`text-lg font-bold ${ultimo.erro ? 'text-brasa' : 'text-cor'}`}>{ultimo.titulo}</p>
              {ultimo.linhas.map((linha) => (
                <p key={linha}>{linha}</p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {anteriores.length > 0 && (
        <details className="text-sm text-poeira">
          <summary className="cursor-pointer font-semibold hover:text-marfim">Ações anteriores</summary>
          <ol className="mt-2 grid max-w-[70ch] gap-2">
            {anteriores.map((item) => (
              <li key={item.chave} className={item.erro ? 'text-brasa/90' : ''}>
                <span className="font-semibold text-marfim">{item.titulo}.</span> {item.linhas.join(' ')}
              </li>
            ))}
          </ol>
        </details>
      )}
    </section>
  )
}
