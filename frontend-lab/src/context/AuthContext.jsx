import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
const API_URL = 'http://localhost:3001';

export function AuthProvider({ children }) {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [carregandoSessao, setCarregandoSessao] = useState(true);

  // Mantém o usuário logado ao recarregar a página (sessão simples via localStorage)
  useEffect(() => {
    const salvo = localStorage.getItem('usuarioLogado');
    if (salvo) {
      try {
        setUsuarioLogado(JSON.parse(salvo));
      } catch {
        localStorage.removeItem('usuarioLogado');
      }
    }
    setCarregandoSessao(false);
  }, []);

  async function login(email, senha) {
    try {
      const res = await fetch(
        `${API_URL}/usuarios?email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}`
      );
      if (!res.ok) throw new Error('Falha ao conectar com o servidor.');

      const usuarios = await res.json();

      if (usuarios.length === 0) {
        return { sucesso: false, erro: 'E-mail ou senha incorretos.' };
      }

      const usuario = usuarios[0];
      const { senha: _senha, ...usuarioSemSenha } = usuario;

      setUsuarioLogado(usuarioSemSenha);
      localStorage.setItem('usuarioLogado', JSON.stringify(usuarioSemSenha));

      return { sucesso: true };
    } catch (error) {
      return {
        sucesso: false,
        erro: 'Não foi possível conectar ao servidor. Verifique se o json-server está rodando (npm run server).',
      };
    }
  }

  async function cadastrarUsuario(dados) {
    try {
      // Verifica se já existe um usuário com esse e-mail
      const verifica = await fetch(`${API_URL}/usuarios?email=${encodeURIComponent(dados.email)}`);
      if (!verifica.ok) throw new Error('Falha ao conectar com o servidor.');

      const existentes = await verifica.json();
      if (existentes.length > 0) {
        return { sucesso: false, erro: 'Já existe uma conta com esse e-mail.' };
      }

      const res = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });

      if (!res.ok) throw new Error('Falha ao cadastrar usuário.');

      return { sucesso: true };
    } catch (error) {
      return {
        sucesso: false,
        erro: 'Não foi possível conectar ao servidor. Verifique se o json-server está rodando (npm run server).',
      };
    }
  }

  function logout() {
    setUsuarioLogado(null);
    localStorage.removeItem('usuarioLogado');
  }
 
  return (
    <AuthContext.Provider
      value={{ usuarioLogado, carregandoSessao, login, cadastrarUsuario, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}