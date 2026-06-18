import { Navigate } from "react-router";
import avatar from "../assets/logo_site(3).svg";

function Topbar(props) {
  return (
    <>
      <header className="flex items-center justify-between md:px-6 mt-6 p-6 w-full">
        <h1 className="text-4xl pl-4 font-semibold text-black">
          {props.titulo}
        </h1>
        <button onClick={() => Navigate("/")}>
        <img src={avatar} alt="imagem do avatar" className="w-50 h-10" />
        </button>
      </header>
    </>
  );
}

export default Topbar;
