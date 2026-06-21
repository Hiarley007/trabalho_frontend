import { createContext, useState, useEffect, useMemo } from "react";
import { useAuth } from "./AuthContext";
import { API_URL } from "../services/api";

const FinanceContext = createContext();

function FinanceProvider({ children }) {
  const { usuarioLogado } = useAuth();

  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    async function fetchTransacoes() {
      // Sem usuário logado: não há o que buscar.
      if (!usuarioLogado) {
        setTransacoes([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res  = await fetch(`${API_URL}/transacoes?usuarioId=${usuarioLogado.id}`);
        const data = await res.json();
        setTransacoes(data);
      } catch (error) {
        console.error("Erro ao buscar transações:", error);
        setTransacoes([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTransacoes();
  }, [usuarioLogado]);

  const getMes = (dataStr) => {
    const [, mes] = dataStr.split("-");
    return parseInt(mes, 10) - 1;
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

  const totalReceitas = useMemo(() =>
    transacoes
      .filter(t => t.tipo === "receita")
      .reduce((soma, t) => soma + t.valor, 0)
  , [transacoes]);

  const totalDespesas = useMemo(() =>
    transacoes
      .filter(t => t.tipo === "despesa")
      .reduce((soma, t) => soma + t.valor, 0)
  , [transacoes]);

  const saldo = useMemo(() => totalReceitas - totalDespesas, [totalReceitas, totalDespesas]);

  const calcularPercentual = (atual, anterior) => {
    if (anterior === 0) return "0.0";
    return (((atual - anterior) / Math.abs(anterior)) * 100).toFixed(1);
  };

  const percentualReceitas = useMemo(() => {
    const mes = new Date().getMonth();
    const somarMes = (tipo, m) =>
      transacoes
        .filter(t => t.tipo === tipo && getMes(t.data) === m)
        .reduce((soma, t) => soma + t.valor, 0);
    return calcularPercentual(somarMes("receita", mes), somarMes("receita", mes - 1));
  }, [transacoes]);

  const percentualDespesas = useMemo(() => {
    const mes = new Date().getMonth();
    const somarMes = (tipo, m) =>
      transacoes
        .filter(t => t.tipo === tipo && getMes(t.data) === m)
        .reduce((soma, t) => soma + t.valor, 0);
    return calcularPercentual(somarMes("despesa", mes), somarMes("despesa", mes - 1));
  }, [transacoes]);

  const percentualSaldo = useMemo(() => {
    const mes = new Date().getMonth();
    const somarMes = (tipo, m) =>
      transacoes
        .filter(t => t.tipo === tipo && getMes(t.data) === m)
        .reduce((soma, t) => soma + t.valor, 0);
    const saldoAtual    = somarMes("receita", mes)     - somarMes("despesa", mes);
    const saldoAnterior = somarMes("receita", mes - 1) - somarMes("despesa", mes - 1);
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

export { FinanceProvider, FinanceContext };