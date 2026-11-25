// Cliente da API do back-end (Flask). Em desenvolvimento o Vite repassa /api para a porta 5000.

const BASE = '/api'

export class ErroApi extends Error {
  constructor(mensagem, status) {
    super(mensagem)
    this.name = 'ErroApi'
    this.status = status
  }
}

async function requisitar(caminho, { method = 'GET', corpo } = {}) {
  const opcoes = { method, headers: {} }
  if (corpo !== undefined) {
    opcoes.headers['Content-Type'] = 'application/json'
    opcoes.body = JSON.stringify(corpo)
  }
  let resposta
  try {
    resposta = await fetch(`${BASE}${caminho}`, opcoes)
  } catch {
    throw new ErroApi('Não foi possível falar com o servidor.', 0)
  }
  if (resposta.status === 204) return null
  let dados = null
  try {
    dados = await resposta.json()
  } catch {
    dados = null
  }
  if (!resposta.ok) {
    throw new ErroApi(dados?.erro ?? `Erro ${resposta.status}`, resposta.status)
  }
  return dados
}

export const listarPlaylists = () => requisitar('/playlists')
export const criarPlaylist = (dados) => requisitar('/playlists', { method: 'POST', corpo: dados })
export const obterPlaylist = (id) => requisitar(`/playlists/${id}`)
export const apagarPlaylist = (id) => requisitar(`/playlists/${id}`, { method: 'DELETE' })
export const adicionarMusica = (id, musica) => requisitar(`/playlists/${id}/musicas`, { method: 'POST', corpo: musica })
export const removerMusica = (id, posicao) => requisitar(`/playlists/${id}/musicas/${posicao}`, { method: 'DELETE' })
export const proxima = (id) => requisitar(`/playlists/${id}/proxima`, { method: 'POST' })
export const anterior = (id) => requisitar(`/playlists/${id}/anterior`, { method: 'POST' })
export const tocar = (id, posicao) => requisitar(`/playlists/${id}/tocar/${posicao}`, { method: 'POST' })
export const buscarDeezer = (q) => requisitar(`/busca?q=${encodeURIComponent(q)}`)
export const previewDeezer = async (deezerId) => (await requisitar(`/deezer/${deezerId}/preview`)).preview_url
