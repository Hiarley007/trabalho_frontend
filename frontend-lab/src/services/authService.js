import { API_URL } from "./api";

const url = `${API_URL}/usuarios`;

const ERRO_CONEXAO =
  "Não foi possível conectar ao servidor. Verifique se o json-server está rodando (npm run server).";

// GET /usuarios?email=...&senha=...
async function autenticar(email, senha) {
  try {
    const resposta = await fetch(
      `${url}?email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}`
    );
    if (!resposta.ok) throw new Error("Falha ao conectar com o servidor.");
    return await resposta.json();
  } catch (error) {
    throw new Error(ERRO_CONEXAO, { cause: error });
  }
}

// GET /usuarios?email=...  (usado para checar duplicidade no cadastro)
async function buscarPorEmail(email) {
  try {
    const resposta = await fetch(`${url}?email=${encodeURIComponent(email)}`);
    if (!resposta.ok) throw new Error("Falha ao conectar com o servidor.");
    return await resposta.json();
  } catch (error) {
    throw new Error(ERRO_CONEXAO, { cause: error });
  }
}

// POST /usuarios
async function cadastrar(dados) {
  try {
    const resposta = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    if (!resposta.ok) throw new Error("Falha ao cadastrar usuário.");
    return await resposta.json();
  } catch (error) {
    throw new Error(ERRO_CONEXAO, { cause: error });
  }
}

export { autenticar, buscarPorEmail, cadastrar };