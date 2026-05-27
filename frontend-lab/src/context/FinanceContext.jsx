import { createContext, useContext, useState, useEffect, useMemo } from "react";

const FinanceContext = createContext();

const API_URL = "http://localhost:3000";

export function FinanceProvider({ children }) {

  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading]       = useState(true);

  // Busca as transações do usuário na API
  // trocar o 1 pelo id do usuário logado quando o AuthContext estiver pronto
  useEffect(() => {
    async function fetchTransacoes() {
      try {
        const res  = await fetch(`${API_URL}/transacoes?usuarioId=1`);
        const data = await res.json();
        setTransacoes(data);
      } catch (error) {
        console.error("Erro ao buscar transações:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTransacoes();
  }, []);

  // Categorias calculadas com base nas transações reais
  const categorias = useMemo(() => {
    const mapa = {
      Moradia:     { cor: "#2563eb" },
      Alimentação: { cor: "#f59e0b" },
      Transporte:  { cor: "#7c3aed" },
      Lazer:       { cor: "#0891b2" },
      Saúde:       { cor: "#ff0505" },
      Outros:      { cor: "#16a34a" },
    };

    // soma os gastos de cada categoria
    transacoes
      .filter(t => t.tipo === "despesa")
      .forEach(t => {
        if (mapa[t.categoria]) {
          mapa[t.categoria].total = (mapa[t.categoria].total || 0) + t.valor;
        }
      });

    const totalGeral = Object.values(mapa)
      .reduce((soma, c) => soma + (c.total || 0), 0);

    // retorna array com percentual calculado automaticamente
    return Object.entries(mapa).map(([nome, c]) => ({
      nome,
      cor: c.cor,
      valor: totalGeral > 0
        ? parseFloat(((c.total || 0) / totalGeral * 100).toFixed(1))
        : 0,
    }));
  }, [transacoes]);

  // Funções auxiliares
  const somarPorTipo = (tipo) =>
    transacoes
      .filter(t => t.tipo === tipo)
      .reduce((soma, t) => soma + t.valor, 0);

  const somarPorTipoMes = (tipo, mes) =>
    transacoes
      .filter(t => t.tipo === tipo && new Date(t.data).getMonth() === mes)
      .reduce((soma, t) => soma + t.valor, 0);

  const calcularPercentual = (atual, anterior) => {
    if (anterior === 0) return "0.0";
    return (((atual - anterior) / Math.abs(anterior)) * 100).toFixed(1);
  };

  // Totais gerais
  const totalReceitas = useMemo(() => somarPorTipo("receita"), [transacoes]);
  const totalDespesas = useMemo(() => somarPorTipo("despesa"), [transacoes]);
  const saldo         = useMemo(() => totalReceitas - totalDespesas, [totalReceitas, totalDespesas]);

  // Percentuais vs mês anterior
  const percentualReceitas = useMemo(() => {
    const mes = new Date().getMonth();
    return calcularPercentual(somarPorTipoMes("receita", mes), somarPorTipoMes("receita", mes - 1));
  }, [transacoes]);

  const percentualDespesas = useMemo(() => {
    const mes = new Date().getMonth();
    return calcularPercentual(somarPorTipoMes("despesa", mes), somarPorTipoMes("despesa", mes - 1));
  }, [transacoes]);

  const percentualSaldo = useMemo(() => {
    const mes = new Date().getMonth();
    const saldoAtual    = somarPorTipoMes("receita", mes)     - somarPorTipoMes("despesa", mes);
    const saldoAnterior = somarPorTipoMes("receita", mes - 1) - somarPorTipoMes("despesa", mes - 1);
    return calcularPercentual(saldoAtual, saldoAnterior);
  }, [transacoes]);

  return (
    <FinanceContext.Provider value={{
      transacoes,
      categorias,
      setTransacoes,
      totalReceitas,
      totalDespesas,
      saldo,
      percentualReceitas,
      percentualDespesas,
      percentualSaldo,
      loading,
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  return useContext(FinanceContext);
}