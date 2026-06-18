import { useNavigate } from "react-router";
import { useFinance } from "../hooks/useFinance";

function ResumoTransition() {
  const { transacoes } = useFinance();
  const navigate = useNavigate();

  const ultimasTransacoes = [...transacoes]
    .sort((a, b) => new Date(b.data + "T00:00:00") - new Date(a.data + "T00:00:00"))
    .slice(0, 7);

  const icones = {
    Receitas: {
      bg: "bg-green-600",
      icone: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1v22" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14.5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    Moradia: {
      bg: "bg-blue-400",
      icone: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    Alimentação: {
      bg: "bg-yellow-500",
      icone: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2v20" />
          <path d="M18 2v20" />
          <path d="M6 12h12" />
        </svg>
      ),
    },
    Transporte: {
      bg: "bg-purple-500",
      icone: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13" rx="2" />
          <path d="M16 8h4l3 5v3h-7V8z" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
    },
    Lazer: {
      bg: "bg-blue-700",
      icone: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12h8" />
          <path d="M12 8v8" />
        </svg>
      ),
    },
    Saúde: {
      bg: "bg-green-600",
      icone: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
    },
    Outros: {
      bg: "bg-gray-500",
      icone: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
    },
  };

  return (
    <section className="bg-white rounded-2xl p-5 shadow-sm mt-5">
      <header className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg">Últimas transações</h2>
        <button
          onClick={() => navigate("/listagem")}
          className="text-green-600 text-sm font-medium hover:underline"
        >
          Ver todas
        </button>
      </header>

      <ul className="flex flex-col divide-y divide-gray-100">
        {ultimasTransacoes.length === 0 ? (
          <li className="text-gray-400 text-sm py-4 text-center">
            Nenhuma transação encontrada.
          </li>
        ) : (
          ultimasTransacoes.map((t) => {
            const cat = icones[t.categoria] || { bg: "bg-gray-400", icone: "💸" };
            return (
              <li key={t.id} className="flex items-center gap-4 py-3">
                <figure className={`w-9 h-9 rounded-xl ${cat.bg} flex items-center justify-center text-white text-sm flex-shrink-0 m-0`}>
                  {cat.icone}
                </figure>
                <span className="flex-1 text-sm font-medium text-gray-800">
                  {t.desc}
                </span>
                <span className={`text-xs font-semibold ${t.tipo === "receita" ? "text-green-600" : "text-red-500"}`}>
                  {t.tipo === "receita" ? "Receita" : "Despesa"}
                </span>
                <span className="text-xs text-gray-400 w-24 text-center">
                  {new Date(t.data + "T00:00:00").toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                  }).replace(".", "")}
                </span>
                <span className={`text-sm font-bold w-28 text-right font-mono ${t.tipo === "receita" ? "text-green-600" : "text-red-500"}`}>
                  {t.tipo === "despesa" ? "-" : ""}R${" "}
                  {t.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </li>
            );
          })
        )}
      </ul>
    </section>
  );
}

export default ResumoTransition;