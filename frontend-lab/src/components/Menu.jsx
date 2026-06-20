import { Link, NavLink } from "react-router";
import { useAuth } from "../context/AuthContext";

function Menu() {
  const { usuarioLogado } = useAuth();

  return (
    <nav className="flex flex-col justify-between h-full p-3">
      <ul className="list-none">
        <li className="px-3 py-2 rounded-lg hover:bg-green-600 cursor-pointer text-white">
          <NavLink to="/" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Dashboard
          </NavLink>
        </li>
        <li className="px-3 py-2 rounded-lg hover:bg-green-600 cursor-pointer text-white mt-1">
          <NavLink to="/cadastro-transacao" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            Cadastro
          </NavLink>
        </li>
        <li className="px-3 py-2 rounded-lg hover:bg-green-600 cursor-pointer text-white mt-1">
          <NavLink to="/listagem" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            Listagem
          </NavLink>
        </li>
      </ul>

      <footer className="border-t border-white/10 pt-3">
        <address className="flex items-center gap-3 px-3 py-2 mb-1 not-italic">
          <figure className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center m-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </figure>
          <section>
            <strong className="text-white text-sm block">Olá, {usuarioLogado?.nome}!</strong>
          </section>
        </address>

        <ul className="list-none">
          <li className="px-3 py-2 rounded-lg hover:bg-green-600 cursor-pointer text-white">
            <Link to="/login" className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sair
            </Link>
          </li>
        </ul>
      </footer>
    </nav>
  );
}

export default Menu;