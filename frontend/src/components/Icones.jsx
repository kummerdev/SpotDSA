// Ícones em SVG inline; herdam a cor do texto.
const cheio = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': true }
const traco = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

// --- transporte ---------------------------------------------------------------
export const IconeAnterior = () => (
  <svg {...cheio}>
    <path d="M6 5h2v14H6zM20 5v14L9 12z" />
  </svg>
)

export const IconeProxima = () => (
  <svg {...cheio}>
    <path d="M16 5h2v14h-2zM4 5v14l11-7z" />
  </svg>
)

export const IconePausar = () => (
  <svg {...cheio}>
    <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
  </svg>
)

export const IconeTocar = () => (
  <svg {...cheio}>
    <path d="M8 4.5v15l12-7.5z" />
  </svg>
)

export const IconeAleatorio = () => (
  <svg {...traco}>
    <path d="M3 7h3c4.5 0 6.5 10 11 10h3M17 14l3 3-3 3M3 17h3c1.5 0 2.7-1.1 3.6-2.6M14 7h6M17 4l3 3-3 3" />
  </svg>
)

export const IconeRepetir = () => (
  <svg {...traco}>
    <path d="M4 11V9a3 3 0 0 1 3-3h13M17 3l3 3-3 3M20 13v2a3 3 0 0 1-3 3H4M7 21l-3-3 3-3" />
  </svg>
)

export const IconeVolume = ({ mudo }) => (
  <svg {...traco}>
    <path d="M4 9.5h3l5-4v13l-5-4H4z" fill="currentColor" />
    {mudo ? <path d="M16 9.5l5 5M21 9.5l-5 5" /> : <path d="M16 9a4.5 4.5 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" />}
  </svg>
)

export const IconePainel = () => (
  <svg {...traco}>
    <rect x="3" y="4" width="18" height="16" rx="2.5" />
    <path d="M14.5 4v16" />
  </svg>
)

// --- navegação -----------------------------------------------------------------
export const IconeCasa = () => (
  <svg {...traco}>
    <path d="M4 11l8-7 8 7v9h-5.5v-6h-5v6H4z" />
  </svg>
)

export const IconeMais = () => (
  <svg {...traco}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const IconeLixeira = () => (
  <svg {...traco} width={18} height={18}>
    <path d="M4 7h16M10 7V4.5h4V7M6.5 7l1 13h9l1-13" />
  </svg>
)

export const IconeBusca = () => (
  <svg {...traco}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4 4" />
  </svg>
)

// --- o que aconteceu ---------------------------------------------------------------
export const IconeEntrou = () => (
  <svg {...traco}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8.5v7M8.5 12h7" />
  </svg>
)

export const IconeSaiu = () => (
  <svg {...traco}>
    <circle cx="12" cy="12" r="8" />
    <path d="M8.5 12h7" />
  </svg>
)

export const IconeAgulha = () => (
  <svg {...traco}>
    <circle cx="9" cy="15" r="6" />
    <circle cx="9" cy="15" r="1.2" fill="currentColor" />
    <path d="M20 3l-6 9" />
  </svg>
)

export const IconeAlerta = () => (
  <svg {...traco}>
    <path d="M12 3.5l9.5 16.5h-19z" />
    <path d="M12 10v4.5M12 17.5v.01" />
  </svg>
)

// --- estruturas: o desenho já diz como as músicas ficam guardadas ----------------------
// Pilha: discos um sobre o outro, o de cima destacado (é o que toca).
export const GlifoPilha = ({ tamanho = 24 }) => (
  <svg {...traco} width={tamanho} height={tamanho}>
    <rect x="4" y="4" width="16" height="4" rx="2" fill="currentColor" />
    <rect x="4" y="10" width="16" height="4" rx="2" />
    <rect x="4" y="16" width="16" height="4" rx="2" />
  </svg>
)

// Fila: discos em fila, o primeiro destacado (é o que toca e o próximo a sair).
export const GlifoFila = ({ tamanho = 24 }) => (
  <svg {...traco} width={tamanho} height={tamanho}>
    <circle cx="5.5" cy="12" r="3" fill="currentColor" />
    <circle cx="12" cy="12" r="3" />
    <circle cx="18.5" cy="12" r="3" />
  </svg>
)

// Lista: faixas em linhas, com a agulha numa do meio (qualquer uma pode tocar).
export const GlifoLista = ({ tamanho = 24 }) => (
  <svg {...traco} width={tamanho} height={tamanho}>
    <path d="M10 6h10M10 12h10M10 18h10" />
    <circle cx="5" cy="12" r="2.2" fill="currentColor" />
  </svg>
)

export const GLIFO = { pilha: GlifoPilha, fila: GlifoFila, lista: GlifoLista }

// Versões: posições lado a lado (vetor) ou nós ligados por setas (encadeada).
export const GlifoVetor = () => (
  <svg {...traco} width={28} height={20} viewBox="0 0 28 20">
    <rect x="1.5" y="5" width="6" height="10" rx="1" />
    <rect x="8.5" y="5" width="6" height="10" rx="1" />
    <rect x="15.5" y="5" width="6" height="10" rx="1" />
    <rect x="22.5" y="5" width="4" height="10" rx="1" strokeDasharray="2 2" />
  </svg>
)

export const GlifoEncadeada = () => (
  <svg {...traco} width={28} height={20} viewBox="0 0 28 20">
    <circle cx="4" cy="10" r="3" />
    <circle cx="16" cy="10" r="3" />
    <path d="M7.5 10h4.5M10.5 8l1.8 2-1.8 2M19.5 10h4.5M22.5 8l1.8 2-1.8 2" />
  </svg>
)

// Tipos de lista encadeada.
export const GlifoSimples = () => (
  <svg {...traco} width={28} height={20} viewBox="0 0 28 20">
    <circle cx="5" cy="10" r="3" />
    <circle cx="23" cy="10" r="3" />
    <path d="M9 10h9.5M16 7.5l2.5 2.5-2.5 2.5" />
  </svg>
)

export const GlifoDupla = () => (
  <svg {...traco} width={28} height={20} viewBox="0 0 28 20">
    <circle cx="5" cy="10" r="3" />
    <circle cx="23" cy="10" r="3" />
    <path d="M9 8h10M17 6l2 2-2 2M19 12H9M11 10l-2 2 2 2" />
  </svg>
)

export const GlifoCircular = () => (
  <svg {...traco} width={28} height={20} viewBox="0 0 28 20">
    <circle cx="6" cy="8" r="3" />
    <circle cx="22" cy="8" r="3" />
    <path d="M9.5 8h8.5M16 5.8l2.2 2.2-2.2 2.2M22 11.5c0 5-16 5-16 0M8.3 13.2L6 11.5l-1.6 2.4" />
  </svg>
)

// --- portas da lista: por onde a música entra e sai -------------------------------
export const IconeSetaCima = () => (
  <svg {...traco} width={18} height={18}>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </svg>
)

export const IconeSetaBaixo = () => (
  <svg {...traco} width={18} height={18}>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </svg>
)

export const IconeFechado = () => (
  <svg {...traco} width={18} height={18}>
    <path d="M4 16h16M4 20h16" />
  </svg>
)
