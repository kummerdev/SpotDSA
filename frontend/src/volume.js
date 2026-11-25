// Volume do player: começa baixo e lembra o que a pessoa escolheu (neste navegador).
// Os trechos da Deezer vêm masterizados altos e o ouvido percebe volume em escala
// logarítmica: 15% de amplitude soa mais ou menos como "metade do volume".
export const VOLUME_PADRAO = 0.15
// v2: descarta o 0.35 que a versão anterior gravava sem a pessoa ter escolhido.
const CHAVE = 'spotdsa-volume-v2'

export function lerVolume() {
  try {
    const salvo = Number.parseFloat(localStorage.getItem(CHAVE))
    return Number.isFinite(salvo) && salvo >= 0 && salvo <= 1 ? salvo : VOLUME_PADRAO
  } catch {
    return VOLUME_PADRAO
  }
}

// Só grava quando o volume mudou de verdade (aplicar o padrão também dispara o evento).
export function salvarVolume(volume) {
  if (Math.abs(volume - lerVolume()) < 0.001) return
  try {
    localStorage.setItem(CHAVE, String(volume))
  } catch {
    // sem armazenamento (ex.: janela privada): só não lembra entre visitas
  }
}
