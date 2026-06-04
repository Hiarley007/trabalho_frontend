import { createContext, useState, useEffect, useMemo } from "react";

const FinanceContext = createContext();

const API_URL = "http://localhost:3000";

function FinanceProvider({ children }) {

  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading]       = useState(true);

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

  // ✅ Corrigido: usa split para evitar bug de fuso horário
  const getMes = (dataStr) => {
    const [, mes] = dataStr.split("-");
    return parseInt(mes, 10) - 1; // mês base 0 igual ao Date
  };

  const categorias = useMemo(() => {
    const mapa = {
      Moradia:     { cor: "#2563eb" },
      Alimentação: { cor: "#f59e0b" },
      Transporte:  { cor: "#7c3aed" },
      Lazer:       { cor: "#0891b2" },
      Saúde:       { cor: "#ff0505" },
      Outros:      { cor: "#16a34a" },
    };

    transacoes
      .filter(t => t.tipo === "despesa")
      .forEach(t => {
        if (mapa[t.categoria]) {
          mapa[t.categoria].total = (mapa[t.categoria].total || 0) + t.valor;
        }
      });

    const totalGeral = Object.values(mapa)
      .reduce((soma, c) => soma + (c.total || 0), 0);

    return Object.entries(mapa).map(([nome, c]) => ({
      nome,
      cor: c.cor,
      valor: totalGeral > 0
        ? parseFloat(((c.total || 0) / totalGeral * 100).toFixed(1))
        : 0,
    }));
  }, [transacoes]);

  const somarPorTipo = (tipo) =>
    transacoes
      .filter(t => t.tipo === tipo)
      .reduce((soma, t) => soma + t.valor, 0);

  const somarPorTipoMes = (tipo, mes) =>
    transacoes
      .filter(t => t.tipo === tipo && getMes(t.data) === mes)
      .reduce((soma, t) => soma + t.valor, 0);

  const calcularPercentual = (atual, anterior) => {
    if (anterior === 0) return "0.0";
    return (((atual - anterior) / Math.abs(anterior)) * 100).toFixed(1);
  };

  const totalReceitas = useMemo(() => somarPorTipo("receita"), [transacoes]);
  const totalDespesas = useMemo(() => somarPorTipo("despesa"), [transacoes]);
  const saldo         = useMemo(() => totalReceitas - totalDespesas, [totalReceitas, totalDespesas]);

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

export { FinanceProvider, FinanceContext }