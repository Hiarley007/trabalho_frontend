import Topbar from "./Topbar";

function Main(props) {
  return (
    <main className="flex-1 bg-gray-100">
      <Topbar titulo={props.titulo} />
      <h2 className="text-lg px-8 md:px-10 mb-8">{props.subtitulo}</h2>

      <section className="px-8 md:px-10 pb-8">{props.children}</section>
    </main>
  );
}

export default Main;
