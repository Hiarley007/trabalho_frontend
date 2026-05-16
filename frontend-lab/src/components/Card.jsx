function Card({ titulo, valor, info, color, arrowColor, bgIcon, icon }) {
  return (
    <article>
      {/* ÍCONE */}
      <figure
        className={`
          ${bgIcon}
        `}
      >
        {icon}
      </figure>

      {/* CONTEÚDO */}
      <section>
        {/* TÍTULO */}
        <header>
          <h3>{titulo}</h3>
        </header>

        {/* VALOR */}
        <strong
          className={`
            ${color}
          `}
        >
          {valor}
        </strong>

        {/* INFORMAÇÃO */}
        <footer>
          <span className={`${arrowColor}`}>↑</span>

          {info}
        </footer>
      </section>
    </article>
  );
}

export default Card;
