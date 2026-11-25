import { comCor } from '../estilo'
import { GLIFO } from './Icones'

// Capa de playlist feita das capas das primeiras músicas, arrumadas como a
// estrutura guarda: pilha uma sobre a outra, fila uma atrás da outra, lista em grade.
export default function Capa({ estrutura, capas = [], className = '' }) {
  const reais = capas.filter(Boolean)
  const Glifo = GLIFO[estrutura]

  return (
    <div className={`relative isolate aspect-square overflow-hidden rounded-lg bg-cor/15 ${className}`} style={comCor(estrutura)}>
      {reais.length === 0 && (
        <div className="grid size-full place-items-center text-cor">
          <Glifo tamanho={40} />
        </div>
      )}
      {reais.length > 0 && estrutura === 'pilha' && (
        // o topo (primeira do array) fica por cima e mais alto
        <div className="absolute inset-0">
          {reais.slice(0, 3).map((url, i) => (
            <img
              key={i}
              src={url}
              alt=""
              className="absolute left-1/2 w-[68%] -translate-x-1/2 rounded-md shadow-lg shadow-black/50"
              style={{ top: `${10 + i * 11}%`, zIndex: 3 - i, scale: 1 - i * 0.08 }}
            />
          ))}
        </div>
      )}
      {reais.length > 0 && estrutura === 'fila' && (
        // o início (primeira) fica na frente, à esquerda
        <div className="absolute inset-0">
          {reais.slice(0, 3).map((url, i) => (
            <img
              key={i}
              src={url}
              alt=""
              className="absolute top-1/2 w-[58%] -translate-y-1/2 rounded-md shadow-lg shadow-black/50"
              style={{ left: `${6 + i * 15}%`, zIndex: 3 - i, scale: 1 - i * 0.08 }}
            />
          ))}
        </div>
      )}
      {reais.length > 0 && estrutura === 'lista' && reais.length < 4 && (
        // com menos de 4 capas a grade ficaria com buracos: a primeira ocupa tudo
        <img src={reais[0]} alt="" className="size-full object-cover" />
      )}
      {estrutura === 'lista' && reais.length >= 4 && (
        <div className="grid size-full grid-cols-2">
          {reais.slice(0, 4).map((url, i) => (
            <img key={i} src={url} alt="" className="size-full object-cover" />
          ))}
        </div>
      )}
    </div>
  )
}
