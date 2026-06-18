import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ListagemTransition() {
  const [transacoes, setTransacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();

  // Busca as transações da API (json-server) ao montar o componente
  useEffect(() => {
    const controller = new AbortController();

    const buscarTransacoes = async () => {
      try {
        const response = await fetch("http://localhost:3001/transacoes", {
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("Erro ao buscar transações");

        const dados = await response.json();
        setTransacoes(dados);
      } catch (error) {
        if (error.name !== "AbortError") {
          setErro("Não foi possível carregar as transações.");
        }
      } finally {
        setCarregando(false);
      }
    };

    buscarTransacoes();

    // Cleanup: cancela a requisição se o componente desmontar
    return () => controller.abort();
  }, []);

  const excluir = async (id) => {
    if (!confirm("Deseja excluir esta transação?")) return;

    try {
      await fetch(`http://localhost:3001/transacoes/${id}`, {
        method: "DELETE",
      });
      setTransacoes((prev) => prev.filter((t) => t.id !== id));
    } catch {
      alert("Erro ao excluir. Tente novamente.");
    }
  };

  const formatarValor = (valor) =>
    Number(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const formatarData = (data) =>
    new Date(data + "T00:00:00").toLocaleDateString("pt-BR");

  // --- Estados de tela ---

  if (carregando) {
    return <p className="listagem-info">Carregando transações...</p>;
  }

  if (erro) {
    return <p className="listagem-info listagem-erro">{erro}</p>;
  }

  return (
    <div className="listagem-container">
      <div className="listagem-header">
        <h2>Transações</h2>
        <button onClick={() => navigate("/cadastro-transacao")}>
          + Nova Transação
        </button>
      </div>

      {transacoes.length === 0 ? (
        <p className="listagem-info">Nenhuma transação cadastrada.</p>
      ) : (
        <table className="listagem-tabela">
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Tipo</th>
              <th>Valor</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {transacoes.map((transacao) => (
              <tr
                key={transacao.id}
                className={transacao.tipo === "receita" ? "receita" : "despesa"}
              >
                <td>{formatarData(transacao.data)}</td>
                <td>{transacao.descricao}</td>
                <td>{transacao.categoria}</td>
                <td>{transacao.tipo}</td>
                <td>{formatarValor(transacao.valor)}</td>
                <td>
                  <button
                    className="btn-excluir"
                    onClick={() => excluir(transacao.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
