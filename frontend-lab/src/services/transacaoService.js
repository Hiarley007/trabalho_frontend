import { API_URL } from "./api";

const url = `${API_URL}/transacoes`;

// POST /
async function criar(transacao) {
  try {
    const resposta = await fetch(url, {
      method: "POST",
      body: JSON.stringify(transacao),
      headers: { "content-type": "application/json" },
    });
    return await resposta.json();
  } catch (error) {
    return { message: `Deu ruim! ${error.code}-${error.message}` };
  }
}

// GET /id
async function obter(transacao) {
  try {
    const resposta = await fetch(`${url}/${transacao.id}`);
    return await resposta.json();
  } catch (error) {
    return { message: `Deu ruim! ${error.code}-${error.message}` };
  }
}

// GET /?usuarioId=
async function listar(usuarioId) {
  try {
    const query = usuarioId ? `?usuarioId=${usuarioId}` : "";
    const resposta = await fetch(`${url}${query}`);
    return await resposta.json();
  } catch (error) {
    return { message: `Deu ruim! ${error.code}-${error.message}` };
  }
}

// PUT /id
async function atualizar(transacao) {
  try {
    const resposta = await fetch(`${url}/${transacao.id}`, {
      method: "PUT",
      body: JSON.stringify(transacao),
      headers: { "content-type": "application/json" },
    });
    return await resposta.json();
  } catch (error) {
    return { message: `Deu ruim! ${error.code}-${error.message}` };
  }
}

// DELETE /id
async function remover(transacao) {
  try {
    const resposta = await fetch(`${url}/${transacao.id}`, {
      method: "DELETE",
    });
    return await resposta.json();
  } catch (error) {
    return { message: `Deu ruim! ${error.code}-${error.message}` };
  }
}

export { criar, obter, listar, atualizar, remover };