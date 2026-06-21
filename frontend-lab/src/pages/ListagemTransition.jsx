import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Main from "../components/Main";
import { listar, remover } from "../services/transacaoService";
import { useAuth } from "../context/AuthContext";

const ITENS_POR_PAGINA = 7;

const CATEGORIAS = [
  "Moradia",
  "Alimentação",
  "Transporte",
  "Lazer",
  "Saúde",
  "Outros",
  "Receitas",
];

function ListagemTransition() {
  const { usuarioLogado } = useAuth();
  const [transacoes, setTransacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [busca, setBusca] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [paginaAtual, setPaginaAtual] = useState(1);

  const navigate = useNavigate();

  // ─── Carregar transações ao montar ───────────────────────────────────────────
  useEffect(() => {
    const carregar = async () => {
      if (!usuarioLogado) {
        setTransacoes([]);
        setCarregando(false);
        return;
      }

      try {
        const dados = await listar(usuarioLogado.id);
        setTransacoes(Array.isArray(dados) ? dados : []);
      } catch (erro) {
        console.error("Erro ao buscar transações:", erro);
        setTransacoes([]);
      } finally {
        setCarregando(false);
      }
    };
    carregar();
  }, [usuarioLogado]);

  // ─── Remover transação ────────────────────────────────────────────────────────
  const trataRemover = async (transacao) => {
    if (!confirm(`Deseja excluir "${transacao.desc}"?`)) return;

    try {
      await remover(transacao);
      setTransacoes(transacoes.filter((item) => item.id !== transacao.id));
    } catch (erro) {
      console.error("Erro ao remover transação:", erro);
    }
  };

  // ─── Filtros ──────────────────────────────────────────────────────────────────

  const transacoesFiltradas = transacoes.filter((t) => {
    const buscaOk = t.desc.toLowerCase().includes(busca.toLowerCase());
    const categoriaOk =
      filtroCategoria === "todas" || t.categoria === filtroCategoria;
    const tipoOk = filtroTipo === "todos" || t.tipo === filtroTipo;
    return buscaOk && categoriaOk && tipoOk;
  });

  // ─── Paginação ────────────────────────────────────────────────────────────────
  const totalPaginas = Math.ceil(transacoesFiltradas.length / ITENS_POR_PAGINA);
  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const transacoesPagina = transacoesFiltradas.slice(
    inicio,
    inicio + ITENS_POR_PAGINA,
  );

  const mudarPagina = (novaPagina) => {
    setPaginaAtual(novaPagina);
  };

  // ─── Helpers de formatação ────────────────────────────────────────────────────
  const formatarData = (dataStr) => {
    const [ano, mes, dia] = dataStr.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const formatarValor = (valor, tipo) => {
    const formatado = valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    return tipo === "despesa" ? `-${formatado}` : formatado;
  };

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <Main
      titulo="Listagem de Transações"
      subtitulo="Veja todas as suas receitas e despesas."
    >
      {/* Barra de filtros */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6 mt-2">
        {/* Busca */}
        <div className="relative flex-1 sm:max-w-xs">
          <input
            type="text"
            placeholder="Buscar descrição..."
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setPaginaAtual(1);
            }}
            className="w-full pl-4 pr-10 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
        </div>

        {/* Filtros de categoria e tipo lado a lado, mesmo em telas pequenas */}
        <div className="flex gap-3">
          <select
            value={filtroCategoria}
            onChange={(e) => {
              setFiltroCategoria(e.target.value);
              setPaginaAtual(1);
            }}
            className="flex-1 sm:flex-none py-2 px-3 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="todas">Todas as categorias</option>
            {CATEGORIAS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={filtroTipo}
            onChange={(e) => {
              setFiltroTipo(e.target.value);
              setPaginaAtual(1);
            }}
            className="flex-1 sm:flex-none py-2 px-3 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="todos">Todos os tipos</option>
            <option value="receita">Receita</option>
            <option value="despesa">Despesa</option>
          </select>
        </div>

        {/* Botão Nova Transação */}
        <button
          onClick={() => navigate("/cadastro-transacao")}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors w-full sm:w-auto sm:ml-auto"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nova Transação
        </button>
      </div>

      {/* Conteúdo: tabela (telas médias+) ou cards (mobile) */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {carregando ? (
          <p className="text-center py-16 text-gray-400 text-sm">
            Carregando transações...
          </p>
        ) : transacoesPagina.length === 0 ? (
          <p className="text-center py-12 text-gray-400">
            Nenhuma transação encontrada.
          </p>
        ) : (
          <>
            {/* ─── Versão tabela: visível a partir de sm ─────────────────────── */}
            <table className="hidden sm:table w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left font-semibold text-gray-700 px-6 py-4">
                    Descrição
                  </th>
                  <th className="text-left font-semibold text-gray-700 px-4 py-4 hidden md:table-cell">
                    Categoria
                  </th>
                  <th className="text-left font-semibold text-gray-700 px-4 py-4">
                    Tipo
                  </th>
                  <th className="text-left font-semibold text-gray-700 px-4 py-4">
                    Valor
                  </th>
                  <th className="text-left font-semibold text-gray-700 px-4 py-4 hidden lg:table-cell">
                    Data
                  </th>
                  <th className="text-left font-semibold text-gray-700 px-6 py-4">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {transacoesPagina.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-800 font-medium">
                      {item.desc}
                    </td>
                    <td className="px-4 py-4 text-gray-600 hidden md:table-cell">
                      {item.categoria}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`font-semibold ${item.tipo === "receita" ? "text-green-600" : "text-red-500"}`}
                      >
                        {item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`font-medium ${item.tipo === "receita" ? "text-green-600" : "text-red-500"}`}
                      >
                        {formatarValor(item.valor, item.tipo)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-600 hidden lg:table-cell">
                      {formatarData(item.data)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => navigate(`/cadastro-transacao?id=${item.id}`)}
                          className="text-gray-400 hover:text-green-600 transition-colors"
                          title="Editar"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => trataRemover(item)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title="Remover"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ─── Versão cards: visível só em telas < sm (mobile) ──────────── */}
            <div className="sm:hidden divide-y divide-gray-100">
              {transacoesPagina.map((item) => (
                <div key={item.id} className="px-4 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-gray-800 font-medium truncate">
                        {item.desc}
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        {item.categoria} · {formatarData(item.data)}
                      </p>
                    </div>
                    <span
                      className={`font-semibold whitespace-nowrap ${item.tipo === "receita" ? "text-green-600" : "text-red-500"}`}
                    >
                      {formatarValor(item.valor, item.tipo)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        item.tipo === "receita"
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-500"
                      }`}
                    >
                      {item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)}
                    </span>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => navigate(`/cadastro-transacao?id=${item.id}`)}
                        className="text-gray-400 hover:text-green-600 transition-colors"
                        title="Editar"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => trataRemover(item)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Remover"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Rodapé com paginação */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-gray-100">
              <span className="text-sm text-gray-500 text-center sm:text-left">
                {transacoesFiltradas.length === 0
                  ? "Nenhum registro encontrado"
                  : `Mostrando ${inicio + 1} a ${Math.min(inicio + ITENS_POR_PAGINA, transacoesFiltradas.length)} de ${transacoesFiltradas.length} registros`}
              </span>

              {totalPaginas > 1 && (
                <div className="flex items-center gap-1 flex-wrap justify-center">
                  <button
                    onClick={() => mudarPagina(paginaAtual - 1)}
                    disabled={paginaAtual === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>

                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
                    (num) => (
                      <button
                        key={num}
                        onClick={() => mudarPagina(num)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                          paginaAtual === num
                            ? "bg-green-600 text-white"
                            : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {num}
                      </button>
                    ),
                  )}

                  <button
                    onClick={() => mudarPagina(paginaAtual + 1)}
                    disabled={paginaAtual === totalPaginas}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              )}
            </div> 
          </>
        )}
      </div>
    </Main>
  );
}

export default ListagemTransition;