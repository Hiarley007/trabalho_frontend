const API_URL = 'http://localhost:3001';

function gerarTokenSimulado(usuario) {
  const payload = {
    sub: usuario.id,
    email: usuario.email,
    nome: usuario.nome,
    iat: Date.now(),
  };
  const payloadCodificado = btoa(JSON.stringify(payload));
  return `simulado.${payloadCodificado}.token`;
}

function decodificarToken(token) {
  try {
    const [, payloadCodificado] = token.split('.');
    return JSON.parse(atob(payloadCodificado));
  } catch {
    return null;
  }
}

async function entrar({ email, senha }) {
  let resposta;
  try {
    resposta = await fetch(
      `${API_URL}/usuarios?email=${encodeURIComponent(email)}`
    );
  } catch {
    return {
      token: null,
      usuario: null,
      mensagem: 'Não foi possível conectar ao servidor. Verifique se o json-server está rodando.',
    };
  }

  if (!resposta.ok) {
    return { token: null, usuario: null, mensagem: 'Falha ao conectar com o servidor.' };
  }

  const usuarios = await resposta.json();
  const usuario = usuarios.find((u) => u.senha === senha);

  if (!usuario) {
    return { token: null, usuario: null, mensagem: 'E-mail ou senha incorretos.' };
  }

  const { senha: _senha, ...usuarioSemSenha } = usuario;
  const token = gerarTokenSimulado(usuarioSemSenha);

  return { token, usuario: usuarioSemSenha, mensagem: 'Login realizado com sucesso.' };
}

async function cadastrar(dados) {
  let verifica;
  try {
    verifica = await fetch(`${API_URL}/usuarios?email=${encodeURIComponent(dados.email)}`);
  } catch {
    return {
      sucesso: false,
      mensagem: 'Não foi possível conectar ao servidor. Verifique se o json-server está rodando.',
    };
  }

  if (!verifica.ok) {
    return { sucesso: false, mensagem: 'Falha ao conectar com o servidor.' };
  }

  const existentes = await verifica.json();
  if (existentes.length > 0) {
    return { sucesso: false, mensagem: 'Já existe uma conta com esse e-mail.' };
  }

  const resposta = await fetch(`${API_URL}/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });

  if (!resposta.ok) {
    return { sucesso: false, mensagem: 'Falha ao cadastrar usuário.' };
  }

  return { sucesso: true, mensagem: 'Cadastro realizado com sucesso.' };
}

export { entrar, cadastrar, decodificarToken };