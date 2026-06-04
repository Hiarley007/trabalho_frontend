import logo from "../assets/logo_site_02.svg";
import Menu from "./Menu";
import { useNavigate } from "react-router";

function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen bg-green-950 overflow-hidden">
      <header className="flex items-center p-6 border-b border-white/10">
        <button
          onClick={() => navigate("/")}
          className="w-full transition-all duration-300 hover:scale-105 hover:opacity-80 active:scale-95"
        >
          <img src={logo} alt="Logo" className="w-full h-10 object-contain" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto">
        <Menu />
      </div>
    </aside>
  );
}

export default Sidebar;