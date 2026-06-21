<div align="center">

<h6>TRABALHO FINAL — DISCIPLINA DE CONSTRUÇÃO DE FRONTEND</h6>

# 🧪 Frontend Lab - FinanControl

Aplicação de **gestão financeira** construída com React + Vite.
Visualize saldos, gerencie transações e acompanhe seus gastos com gráficos interativos.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white&labelColor=20232A)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white&labelColor=1a1a2e)
![json-server](https://img.shields.io/badge/json--server-API-yellow?style=flat-square&logo=json&logoColor=white&labelColor=1a1a2e)
![ESLint](https://img.shields.io/badge/ESLint-configured-4B32C3?style=flat-square&logo=eslint&logoColor=white&labelColor=1a1a2e)

### 👥 Equipe

| [Breno Rocha](https://github.com/brenobran) | [Káthia Faria](https://github.com/kathiamf) | [Hiarley Rabêlo](https://github.com/Hiarley007) | [Ricardo Wesgueber](https://github.com/ricardowgb) |
|:---:|:---:|:---:|:---:|

</div>

---

## ⚡ Início rápido

> Precisa de: **Node.js 18+** e **Git** instalados.

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/frontend-lab.git

# Entre na pasta e instale as dependências
cd frontend-lab && npm install
```

A aplicação precisa de **dois terminais abertos ao mesmo tempo**: um para a API simulada (`json-server`) e outro para o servidor de desenvolvimento do Vite.

```bash
# Terminal 1 — inicia a API simulada (json-server lendo o db.json)
npm run server
```

```bash
# Terminal 2 — inicia o servidor de desenvolvimento do Vite
npm run dev
```

✅ Acesse a aplicação em **http://localhost:5173**
✅ A API estará disponível em **http://localhost:3000** (ou na porta configurada no script `server`)

> ⚠️ Se a tela de listagem ou o dashboard aparecerem vazios, confira se o terminal do `npm run server` está rodando — sem ele, a aplicação não consegue buscar nem salvar dados.

---

## 📁 Estrutura do projeto

```
frontend-lab/
│
├── 📂 src/
│   ├── 📂 assets/                # Imagens e recursos estáticos
│   │
│   ├── 📂 components/            # Componentes reutilizáveis
│   │   ├── Card.jsx              # Card genérico de conteúdo
│   │   ├── GraficoPizza.jsx      # Gráfico de distribuição por categoria
│   │   ├── GraficoSaldo.jsx      # Gráfico de evolução do saldo
│   │   ├── Main.jsx              # Container principal da página
│   │   ├── Menu.jsx              # Menu de navegação
│   │   ├── ResumoTrasition.jsx   # Resumo animado de transações
│   │   ├── Sidebar.jsx           # Barra lateral de navegação
│   │   └── Topbar.jsx            # Barra superior com ações globais
│   │
│   ├── 📂 context/
│   │   ├── AuthContext.jsx       # Estado global de autenticação (login/logout)
│   │   └── FinanceContext.jsx    # Estado global das finanças (Context API)
│   │
│   ├── 📂 hooks/                 # Hooks customizados (ex: useFinance)
│   │
│   ├── 📂 Layouts/
│   │   └── Layout.jsx            # Layout base com Sidebar + Topbar
│   │
│   ├── 📂 pages/                 # Telas da aplicação
│   │   ├── Login.jsx             # Autenticação
│   │   ├── Cadastro.jsx          # Cadastro de usuário
│   │   ├── Dashboard.jsx         # Visão geral com gráficos
│   │   ├── CadastroTransition.jsx    # Cadastro de transação
│   │   ├── ListagemTransition.jsx    # Listagem de transações
│   │   └── Erro404.jsx           # Página de erro
│   │
│   ├── 📂 services/              # Chamadas à API / json-server
│   │   └── transacaoService.js   # CRUD de transações
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── db.json                       # Banco de dados local (json-server)
├── eslint.config.js
├── index.html
├── package.json
└── vite.config.js
```

---

## 🌿 Padrão de branches

> Cada desenvolvedor cria sua branch de acordo com a **tela que está construindo**.

### Formato

```
feature/tela-<nome-da-tela>
```

### Exemplos práticos

| Branch | O que é |
|---|---|
| `feature/tela-login` | Tela de autenticação |
| `feature/tela-cadastro` | Cadastro de usuário |
| `feature/tela-dashboard` | Dashboard com gráficos |
| `feature/tela-listagem` | Listagem de transações |
| `feature/tela-cadastrolistagem` | Cadastro + listagem combinados |

### Como criar sua branch

```bash
# 1. Sempre parta da develop atualizada
git checkout develop
git pull origin develop

# 2. Crie e acesse a nova branch
git checkout -b feature/tela-dashboard
```

---

## ✅ Padrão de commits

> Mensagens de commit devem ser **curtas, no imperativo e com um prefixo de tipo**.

### Formato

```
<tipo>: mensagem curta descrevendo o que foi feito
```

### Tipos disponíveis

| Tipo | Quando usar | Exemplo |
|---|---|---|
| `feat` | Nova tela ou funcionalidade | `feat: cria tela de login` |
| `fix` | Corrigiu um bug | `fix: corrige redirecionamento após login` |
| `style` | Mudança visual sem afetar lógica | `style: ajusta responsividade da sidebar` |
| `refactor` | Reorganizou código sem mudar comportamento | `refactor: move lógica para o contexto` |
| `chore` | Configurações, dependências, scripts | `chore: atualiza versão do vite` |
| `docs` | Alterou documentação | `docs: atualiza README com padrão de commits` |

---

## 🔁 Fluxo completo de trabalho

```
develop (estável)
  │
  ├─── feature/tela-login      
  ├─── feature/tela-dashboard
  └─── feature/tela-listagem
```

```bash
# ① Atualize a develop
git checkout develop
git pull origin develop

# ② Crie sua branch
git checkout -b feature/tela-<nome>

# ③ Desenvolva, adicione e faça commit
git add .
git commit -m "feat: descreva o que foi feito"

# ④ Suba sua branch
git push origin feature/tela-<nome>

# ⑤ Abra um Pull Request → develop no GitHub
```

---

## 🛠️ Tecnologias

| Tecnologia | Função |
|---|---|
| [React 18](https://react.dev/) | Interface e componentização |
| [Vite](https://vitejs.dev/) | Build e servidor de desenvolvimento |
| [React Router](https://reactrouter.com/) | Navegação entre telas |
| [Context API](https://react.dev/reference/react/createContext) | Gerenciamento de estado global (autenticação e finanças) |
| [json-server](https://github.com/typicode/json-server) | API simulada via `db.json` |
| [ESLint](https://eslint.org/) | Qualidade e padronização de código |

---

## 📄 Licença

Distribuído sob a licença **MIT**. Veja o arquivo `LICENSE` para mais detalhes.

---

<div align="center">

Desenvolvido no **Centro Universitário IESB**
Disciplina de Construção de Frontend · 2026

</div> 