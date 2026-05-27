function Card({ titulo, valor, info, color, arrowColor, bgIcon, icon }) {
  return (
    <article
      className="
      bg-white
      rounded-2xl
      p-5
      shadow-sm
      flex
      items-center
      gap-4
      transition
      duration-300
      hover:shadow-md
      "
    >
      {/* ÍCONE */}
      <figure
        className={`
        w-14
        h-14
        rounded-2xl
        flex
        items-center
        justify-center
        m-0
        ${bgIcon}
        `}
      >
        {icon}
      </figure>

      {/* CONTEÚDO */}
      <section className="flex flex-col">
        {/* TÍTULO */}
        <header>
          <h3
            className="
            text-sm
            text-gray-500
            font-medium
            "
          >
            {titulo}
          </h3>
        </header>

        {/* VALOR */}
        <strong
          className={`
          text-2xl
          md:text-3xl
          font-bold
          font-mono
          mt-1
          ${color}
          `}
        >
          {valor}
        </strong>

        {/* INFORMAÇÃO */}
        <footer
          className="
          text-xs
          text-gray-400
          mt-2
          flex
          items-center
          gap-1
          "
        >
          <span className={`font-semibold ${arrowColor}`}>↑</span>

          {info}
        </footer>
      </section>
    </article>
  );
}

export default Card;
