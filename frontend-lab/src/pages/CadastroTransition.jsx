import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

const esquema = z.object({
  descricao: z
    .string()
    .min(3, "Descrição deve ter pelo menos 3 caracteres")
    .max(100, "Descrição muito longa"),
  valor: z
    .number({ invalid_type_error: "Informe um valor numérico" })
    .positive("O valor deve ser positivo"),
  tipo: z.enum(["receita", "despesa"], {
    errorMap: () => ({ message: "Selecione receita ou despesa" }),
  }),
  categoria: z.string().min(1, "Selecione uma categoria"),
  data: z.string().min(1, "Informe a data"),
});

export default function CadastroTransition() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(esquema),
  });

  const salvar = async (data) => {
    try {
      const response = await fetch("http://localhost:3001/transacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, id: Date.now() }),
      });

      if (!response.ok) throw new Error("Erro ao salvar");

      reset();
      navigate("/listagem");
    } catch (error) {
      console.error("Erro ao cadastrar transação:", error);
      alert("Não foi possível salvar. Verifique o json-server.");
    }
  };

  return (
    <div className="cadastro-container">
      <h2>Nova Transação</h2>

      <form onSubmit={handleSubmit(salvar)} noValidate>
        {/* Descrição */}
        <div className="campo">
          <label htmlFor="descricao">Descrição</label>
          <input
            id="descricao"
            type="text"
            placeholder="Ex: Salário, Aluguel..."
            {...register("descricao")}
          />
          {errors.descricao && (
            <span className="erro">{errors.descricao.message}</span>
          )}
        </div>

        {/* Valor */}
        <div className="campo">
          <label htmlFor="valor">Valor (R$)</label>
          <input
            id="valor"
            type="number"
            step="0.01"
            placeholder="0,00"
            {...register("valor", { valueAsNumber: true })}
          />
          {errors.valor && (
            <span className="erro">{errors.valor.message}</span>
          )}
        </div>

        {/* Tipo */}
        <div className="campo">
          <label htmlFor="tipo">Tipo</label>
          <select id="tipo" {...register("tipo")}>
            <option value="">Selecione...</option>
            <option value="receita">Receita</option>
            <option value="despesa">Despesa</option>
          </select>
          {errors.tipo && (
            <span className="erro">{errors.tipo.message}</span>
          )}
        </div>

        {/* Categoria */}
        <div className="campo">
          <label htmlFor="categoria">Categoria</label>
          <select id="categoria" {...register("categoria")}>
            <option value="">Selecione...</option>
            <option value="alimentacao">Alimentação</option>
            <option value="transporte">Transporte</option>
            <option value="saude">Saúde</option>
            <option value="lazer">Lazer</option>
            <option value="salario">Salário</option>
            <option value="outros">Outros</option>
          </select>
          {errors.categoria && (
            <span className="erro">{errors.categoria.message}</span>
          )}
        </div>

        {/* Data */}
        <div className="campo">
          <label htmlFor="data">Data</label>
          <input id="data" type="date" {...register("data")} />
          {errors.data && (
            <span className="erro">{errors.data.message}</span>
          )}
        </div>

        <div className="acoes">
          <button type="button" onClick={() => navigate("/listagem")}>
            Cancelar
          </button>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar Transação"}
          </button>
        </div>
      </form>
    </div>
  );
}
