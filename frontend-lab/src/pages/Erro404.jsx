import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

function Erro404() {
  return (
    <div className="flex min-h-screen w-full bg-white-950">
      <Sidebar />

      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <span className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500">
          Erro
        </span>

        <h1 className="mt-2 text-8xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-400 to-lime-400 sm:text-9xl">
          404
        </h1>

        <p className="mt-6 text-lg text-slate-300 sm:text-xl">
          Página não encontrada
        </p>
        <p className="mt-2 max-w-md text-sm text-slate-500">
          O endereço que você tentou acessar não existe ou foi movido.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-green-500 px-6 py-3 text-sm font-semibold text-white shadow-lg  transition hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          Voltar para o início
        </Link>
      </main>
    </div>
  )
}

export default Erro404