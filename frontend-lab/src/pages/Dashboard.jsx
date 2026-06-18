import Main from "../components/Main";
import Card from "../components/Card";
import GraficoPizza from "../components/GraficoPizza";
import GraficoSaldo from "../components/GraficoSaldo";
import { useFinance } from "../hooks/useFinance";
import ResumoTransition from "../components/ResumoTrasition";

function Dashboard() {
  const {
    transacoes,
    percentualReceitas,
    percentualDespesas,
    percentualSaldo,
  } = useFinance();

  const totalReceitas = transacoes
    .filter((t) => t.tipo === "receita")
    .reduce((acc, t) => acc + t.valor, 0);

  const totalDespesas = transacoes
    .filter((t) => t.tipo === "despesa")
    .reduce((acc, t) => acc + t.valor, 0);

  const saldo = totalReceitas - totalDespesas;

  // ícones por categoria
  
  return (
    <Main
      titulo="Olá, Usuário! 👋"
      subtitulo="Aqui está o resumo da sua vida financeira"
    >
      {/* Cards de resumo */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-6">
        <Card
          titulo="Receitas"
          valor={`R$ ${totalReceitas.toLocaleString("pt-BR")}`}
          info={`${percentualReceitas}% vs mês anterior`}
          color="text-green-600"
          arrowColor="text-green-500"
          bgIcon="bg-green-100"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#16a34a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 1v22" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14.5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          }
        />

        <Card
          titulo="Despesas"
          valor={`R$ ${totalDespesas.toLocaleString("pt-BR")}`}
          info={`${percentualDespesas}% vs mês anterior`}
          color="text-red-600"
          arrowColor="text-red-500"
          bgIcon="bg-red-100"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#dc2626"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 1v22" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14.5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          }
        />

        <Card
          titulo="Saldo"
          valor={`R$ ${saldo.toLocaleString("pt-BR")}`}
          info={`${percentualSaldo}% vs mês anterior`}
          color="text-blue-600"
          arrowColor="text-blue-500"
          bgIcon="bg-blue-100"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 3v18h18" />
              <path d="M18 9l-5 5-3-3-4 4" />
            </svg>
          }
        />

        <Card
          titulo="Transações"
          valor={transacoes.length}
          info="Últimos 30 dias"
          color="text-green-600"
          arrowColor="text-green-500"
          bgIcon="bg-green-100"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#16a34a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M7 8h10" />
              <path d="M7 12h10" />
              <path d="M7 16h6" />
            </svg>
          }
        />
      </section>

      {/* Gráficos */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
        <GraficoSaldo />
        <GraficoPizza />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-1 gap-5 mt-5">
        <ResumoTransition />
      </section>

      
    </Main>
  );
}

export default Dashboard; 
