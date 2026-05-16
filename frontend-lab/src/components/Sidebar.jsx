import logo from "../assets/logo_site_02.svg"
import Menu from "./Menu";

function Sidebar() {
  return (
    <>
      <aside>
        <header>
          <img src={logo} alt="imagem do logo"/>
        </header>

        <div>
          <Menu/>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;