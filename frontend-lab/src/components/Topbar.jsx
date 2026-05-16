import avatar from "../assets/logo_site.svg";

function Topbar(props) {
  return (
    <>
      <header>
        <h1>{props.titulo}</h1>
        <img src={avatar} alt="imagem do avatar"/>
      </header>
    </>
  );
}

export default Topbar;