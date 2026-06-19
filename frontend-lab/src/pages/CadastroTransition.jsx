import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import Main from "../components/Main";
import { criar, obter, atualizar } from "../services/transacaoService";

const CATEGORIAS = [
  "Moradia",
  "Alimentação",
  "Transporte",
  "Lazer",
  "Saúde",
  "Outros",
  "Receitas",
];

const TRANSACAO_VAZIA = {
  desc: "",
  valor: "",
  categoria: "",
  tipo: "",
  data: "",
};

function CadastroTransition() {
  const [transacao, setTransacao] = useState(TRANSACAO_VAZIA);
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const modoEdicao = Boolean(id);

  // ─── Carregar transação ao editar ────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;

    const carregar = async () => {
      const dados = await obter({ id });
      setTransacao({
        desc: dados.desc ?? "",
        valor: dados.valor ?? "",
        categoria: dados.categoria ?? "",
        tipo: dados.tipo ?? "",
        data: dados.data ?? "",
      });
    };

    carregar();
  }, [id]);

  // ─── Atualizar campos ─────────────────────────────────────────────────────────
  const handleChange = (campo, valor) => {
    setTransacao((prev) => ({ ...prev, [campo]: valor }));
  };

  // ─── Validação ────────────────────────────────────────────────────────────────
  const validar = () => {
    const novosErros = {};

    if (!transacao.desc.trim()) {
      novosErros.desc = "A descrição é obrigatória.";
    }
    if (!transacao.valor || Number(transacao.valor) <= 0) {
      novosErros.valor = "Informe um valor válido.";
    }
    if (!transacao.categoria) {
      novosErros.categoria = "Selecione uma categoria.";
    }
    if (!transacao.tipo) {
      novosErros.tipo = "Selecione o tipo.";
    }
    if (!transacao.data) {
      novosErros.data = "A data é obrigatória.";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  // ─── Limpar formulário ────────────────────────────────────────────────────────
  const handleLimpar = () => {
    setTransacao(TRANSACAO_VAZIA);
    setErros({});
  };

  // ─── Salvar (criar ou atualizar) ──────────────────────────────────────────────
  const handleSalvar = async (e) => {
    e.preventDefault();

    if (!validar()) return;

    setSalvando(true);

    const payload = {
      ...transacao,
      valor: Number(transacao.valor),
      usuarioId: 1,
    };

    try {
      if (modoEdicao) {
        await atualizar({ ...payload, id });
      } else {
        await criar(payload);
      }
      navigate("/listagem");
    } catch (erro) {
      console.error("Erro ao salvar transação:", erro);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Main
      titulo="Cadastrar Transação"
      subtitulo="Preencha os dados da sua receita ou despesa."
    >
      <form
        onSubmit={handleSalvar}
        className="bg-white rounded-xl shadow-sm p-6 md:p-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ex.: Salário, Aluguel, Mercado..."
              value={transacao.desc}
              onChange={(e) => handleChange("desc", e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                erros.desc ? "border-red-400" : "border-gray-300"
              }`}
            />
            {erros.desc && (
              <p className="text-xs text-red-500 mt-1">{erros.desc}</p>
            )}
          </div>

          {/* Valor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor (R$) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={transacao.valor}
              onChange={(e) => handleChange("valor", e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                erros.valor ? "border-red-400" : "border-gray-300"
              }`}
            />
            {erros.valor && (
              <p className="text-xs text-red-500 mt-1">{erros.valor}</p>
            )}
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria <span className="text-red-500">*</span>
            </label>
            <select
              value={transacao.categoria}
              onChange={(e) => handleChange("categoria", e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 ${
                erros.categoria ? "border-red-400" : "border-gray-300"
              }`}
            >
              <option value="">Selecione uma categoria</option>
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {erros.categoria && (
              <p className="text-xs text-red-500 mt-1">{erros.categoria}</p>
            )}
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo <span className="text-red-500">*</span>
            </label>
            <select
              value={transacao.tipo}
              onChange={(e) => handleChange("tipo", e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 ${
                erros.tipo ? "border-red-400" : "border-gray-300"
              }`}
            >
              <option value="">Selecione o tipo</option>
              <option value="receita">Receita</option>
              <option value="despesa">Despesa</option>
            </select>
            {erros.tipo && (
              <p className="text-xs text-red-500 mt-1">{erros.tipo}</p>
            )}
          </div>

          {/* Data */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={transacao.data}
              onChange={(e) => handleChange("data", e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                erros.data ? "border-red-400" : "border-gray-300"
              }`}
            />
            {erros.data && (
              <p className="text-xs text-red-500 mt-1">{erros.data}</p>
            )}
          </div>
        </div>

        {/* Aviso de campos obrigatórios */}
        <div className="flex items-center gap-2 bg-green-50 text-green-700 text-sm rounded-lg px-4 py-3 mt-6">
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
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          Campos marcados com <span className="text-red-500 font-medium">*</span> são obrigatórios.
        </div>

        {/* Ações */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={handleLimpar}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Limpar
          </button>
          <button
            type="submit"
            disabled={salvando}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors disabled:opacity-60"
          >
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
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>

      {/* Dicas */}
      <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mt-6">
        <h3 className="font-semibold text-gray-800 mb-3">Dicas</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            Descreva sua transação de forma clara.
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            Escolha a categoria correta para melhor controle.
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            Mantenha seus registros sempre atualizados!
          </li>
        </ul>
      </div>
    </Main>
  );
}

export default CadastroTransition;