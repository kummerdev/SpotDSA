# SpotDSA-Projeto De Estudo Acadêmico

Player interativo de playlists desenvolvido para demonstrar, na prática e em tempo real, o funcionamento de **8 estruturas de dados** clássicas (em versões com vetor e encadeadas).

Cada playlist escolhida no player obedece às regras reais da sua estrutura (por exemplo, voltar música ou escolher uma posição só funciona nas estruturas que permitem a operação), com visualização ao vivo dos índices do vetor ou dos nós e ponteiros, além de busca e prévia de 30s de músicas via API pública da Deezer.

---

## Estruturas implementadas

| Família | Versão com Vetor | Versão Encadeada |
| --- | --- | --- |
| **Pilha (LIFO)** | `PilhaVetor` | `PilhaEncadeada` |
| **Fila (FIFO)** | `FilaVetor` (circular) | `FilaEncadeada` |
| **Lista** | `ListaVetor` | `ListaSimples`, `ListaDupla`, `ListaCircular` |

---

## Pré-requisitos

- **Python 3.12+**
- **Node.js 20+** e **npm**

---

## Como rodar localmente

Abra **dois terminais** na raiz do projeto.

### 1. Backend (Flask — porta `5000`)

**Windows (PowerShell):**
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\pip install -e .
.\.venv\Scripts\python -m flask --app spotdsa.app:create_app run --port 5000
```

**Linux / macOS:**
```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -e .
.venv/bin/python -m flask --app spotdsa.app:create_app run --port 5000
```

> **Dica:** caso `pip install -e .` falhe em uma máquina sem ferramentas de build, basta rodar `pip install flask` dentro da `.venv` e executar o comando do Flask a partir da pasta `backend/`.

### 2. Frontend (React + Vite — porta `5173`)

```bash
cd frontend
npm install
npm run dev
```

Depois, acesse **http://localhost:5173/** no navegador.  
Em desenvolvimento, o Vite redireciona automaticamente todas as requisições `/api` para `http://127.0.0.1:5000`.

---

## Slides da apresentação

O arquivo [`apresentacao.html`](apresentacao.html) contém os slides do projeto em um único arquivo HTML — basta abri-lo diretamente no navegador, sem precisar de servidor.

---

## Estrutura do projeto

```text
SpotDSA-apresentacao/
├── apresentacao.html          # Slides da apresentação
├── backend/
│   ├── pyproject.toml         # Configuração e dependências Python (Flask)
│   └── spotdsa/
│       ├── app.py             # API REST Flask (/api/playlists, /api/busca, etc.)
│       ├── playlist.py        # Regras de validação, fábrica de estruturas e snapshots
│       ├── armazenamento.py   # Persistência das playlists em backend/data/playlists.json
│       ├── deezer.py          # Integração com a API pública da Deezer (sem chave)
│       └── estruturas/
│           ├── base.py        # No, NoDuplo, exceções e validação de posição
│           ├── pilha.py       # PilhaVetor, PilhaEncadeada
│           ├── fila.py        # FilaVetor, FilaEncadeada
│           └── lista.py       # ListaVetor, ListaSimples, ListaDupla, ListaCircular
└── frontend/
    ├── package.json           # React 19, Vite, Tailwind CSS v4, Motion
    ├── vite.config.js         # Proxy /api -> http://127.0.0.1:5000
    └── src/
        ├── App.jsx            # Roteamento por hash e estado principal
        ├── api.js             # Cliente HTTP para o backend Flask
        └── components/        # Player, visualizações de vetor/encadeada, busca Deezer, etc.
```
