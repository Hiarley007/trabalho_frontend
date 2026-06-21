import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { useFinance } from "../hooks/useFinance";

function TooltipCustomizado({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  const transacao = payload[0].payload;
  const isReceita = transacao.tipo === "receita";

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 p-3">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`font-bold ${isReceita ? "text-green-600" : "text-red-600"}`}>
        R$ {transacao.valor.toLocaleString("pt-BR")}
      </p>
      <p className="text-xs text-gray-400 capitalize">{transacao.tipo}</p>
    </div>
  );
}

function GraficoSaldo() {
  const { transacoes, loading } = useFinance();

  if (loading) return <p>Carregando...</p>;

  const dadosFormatados = transacoes.map(t => ({
    ...t,
    data: new Date(t.data + "T00:00:00").toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    }).replace(".", ""),
  }));

  return (
    <article className="bg-white rounded-2xl p-6 shadow-sm">
      <header className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg">Evolução do saldo</h2>
        <select className="text-sm text-gray-500 border border-gray-200 rounded-lg px-2 py-1">
          <option>Este mês</option>
          <option>Último mês</option>
        </select>
      </header>

      <section aria-label="Gráfico de evolução do saldo">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={dadosFormatados}>
            <defs>
              <linearGradient id="gradiente" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="data"
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `R$ ${v / 1000}k`}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<TooltipCustomizado />} />
            <Area
              type="monotone"
              dataKey="valor"
              stroke="#16a34a"
              strokeWidth={2}
              fill="url(#gradiente)"
              dot={{ fill: "#16a34a", r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </section> 
    </article>
  );
}

export default GraficoSaldo;