import { createContext, useContext, useState, useEffect } from 'react';
import { entrar, cadastrar } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [token, setToken] = useState(null);
  const [carregandoSessao, setCarregandoSessao] = useState(true);

  // Restaura a sessão ao recarregar a página
  useEffect(() => {
    const tokenSalvo = localStorage.getItem('token');
    const usuarioSalvo = localStorage.getItem('usuarioLogado');

    if (tokenSalvo && usuarioSalvo) {
      try {
        setToken(tokenSalvo);
        setUsuarioLogado(JSON.parse(usuarioSalvo));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('usuarioLogado');
      }
    }
    setCarregandoSessao(false);
  }, []);

  async function login(email, senha) {
    const resultado = await entrar({ email, senha });

    if (!resultado.token) {
      return { sucesso: false, erro: resultado.mensagem };
    }

    setToken(resultado.token);
    setUsuarioLogado(resultado.usuario);
    localStorage.setItem('token', resultado.token);
    localStorage.setItem('usuarioLogado', JSON.stringify(resultado.usuario));

    return { sucesso: true };
  }

  async function cadastrarUsuario(dados) {
    const resultado = await cadastrar(dados);

    if (!resultado.sucesso) {
      return { sucesso: false, erro: resultado.mensagem };
    }

    return { sucesso: true };
  }

  function logout() {
    setUsuarioLogado(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioLogado');
  }

  return (
    <AuthContext.Provider
      value={{ usuarioLogado, token, carregandoSessao, login, cadastrarUsuario, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}