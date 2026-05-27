import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useFinance } from "../context/FinanceContext";
import { useNavigate } from "react-router";

function GraficoPizza() {
  const { categorias, loading } = useFinance();

   const navigate = useNavigate();

  if (loading) return <p>Carregando...</p>;

  return (
    <article className="bg-white rounded-2xl p-4 shadow-sm">
      <header className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg m-1">Gastos por categoria</h2>
        <select className="text-sm text-gray-500 border border-gray-200 rounded-lg px-2 py-1">
          <option>Este mês</option>
          <option>Último mês</option>
        </select>
      </header>

      <section className="flex items-center gap-6">
        <ResponsiveContainer width={200} height={200}>
          <PieChart>
            <Pie
              data={categorias}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              dataKey="valor"
              nameKey="nome"
            >
              {categorias.map((item, index) => (
                <Cell key={index} fill={item.cor} />
              ))}
            </Pie>
            <Tooltip formatter={(v, name) => [`${v}%`, name]} />
          </PieChart>
        </ResponsiveContainer>

        <ul className="list-none flex flex-col gap-2 flex-1">
          {categorias.map((item, index) => (
            <li key={index} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-3">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ background: item.cor }}
                />
                {item.nome}
              </span>
              <strong className="m-2">{item.valor}%</strong>
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-4">
        <button onClick={() => navigate("/listagem")} className="w-full border border-gray-200 text-green-600 font-medium py-2 rounded-xl hover:bg-gray-50 transition">
          Ver todas
        </button>
      </footer>
    </article>
  );
}

export default GraficoPizza;