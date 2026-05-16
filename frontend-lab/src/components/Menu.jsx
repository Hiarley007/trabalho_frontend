import { Link, NavLink } from "react-router";

function Menu() {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/">Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/cadastro">Cadastro</NavLink>
        </li>
        <li>
          <NavLink to="/listagem">Listagem</NavLink>
        </li>
      </ul>

      <address>
        <figure>
          <svg>
            <path />
            <circle />
          </svg>
        </figure>
        <section>
          <strong>Olá, Usuário!</strong>
        </section>
      </address>

      <li>
        <Link to="/login">Sair</Link>
      </li>
    </nav>
  );
}

export default Menu;
