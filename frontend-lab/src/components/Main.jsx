import Topbar from "./Topbar";

function Main(props) {
  return (
    <main>
      <Topbar titulo={props.titulo} />
      <h2>
        {props.subtitulo}
      </h2>

      <section>
        {props.children}
      </section>
    </main>
  );
}

export default Main;