import { createContext, useContext, useState, useEffect } from 'react';
import { autenticar, buscarPorEmail, cadastrar } from '../services/authService';

const AuthContext = createContext();

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
      const usuarios = await autenticar(email, senha);

      if (usuarios.length === 0) {
        return { sucesso: false, erro: 'E-mail ou senha incorretos.' };
      }

      const usuario = usuarios[0];
      const { senha: _senha, ...usuarioSemSenha } = usuario;

      setUsuarioLogado(usuarioSemSenha);
      localStorage.setItem('usuarioLogado', JSON.stringify(usuarioSemSenha));

      return { sucesso: true };
    } catch (error) {
      return { sucesso: false, erro: error.message };
    }
  }

  async function cadastrarUsuario(dados) {
    try {
      // Verifica se já existe um usuário com esse e-mail
      const existentes = await buscarPorEmail(dados.email);
      if (existentes.length > 0) {
        return { sucesso: false, erro: 'Já existe uma conta com esse e-mail.' };
      }

      await cadastrar(dados);

      return { sucesso: true };
    } catch (error) {
      return { sucesso: false, erro: error.message };
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