import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', senha: '' });
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const validar = () => {
    const novosErros = {};
    if (!form.email.trim()) {
      novosErros.email = 'O e-mail é obrigatório.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      novosErros.email = 'Informe um e-mail válido.';
    }
    if (!form.senha) {
      novosErros.senha = 'A senha é obrigatória.';
    } else if (form.senha.length < 6) {
      novosErros.senha = 'A senha deve ter ao menos 6 caracteres.';
    }
    return novosErros;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (erros[name]) setErros((prev) => ({ ...prev, [name]: '' }));
    setErroGeral('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const novosErros = validar();
    if (Object.keys(novosErros).length > 0) { setErros(novosErros); return; }

    setCarregando(true);
    const resultado = await login(form.email, form.senha);
    setCarregando(false);

    if (resultado.sucesso) {
      navigate('/');
    } else {
      setErroGeral(resultado.erro);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-950 via-green-900 to-emerald-800 flex items-center justify-center px-4 py-12 relative overflow-hidden">

      {/* Círculos decorativos */}
      <span className="absolute top-[-80px] left-[-60px] w-72 h-72 rounded-full bg-white/10 pointer-events-none" aria-hidden="true" />
      <span className="absolute bottom-[-40px] right-[-40px] w-56 h-56 rounded-full bg-white/10 pointer-events-none" aria-hidden="true" />
      <span className="absolute bottom-1/3 left-[8%] w-36 h-36 rounded-full bg-white/10 pointer-events-none" aria-hidden="true" />

      {/* Card */}
      <article className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">

        {/* Cabeçalho */}
        <header className="text-center mb-7">
          <span className="text-5xl block mb-3">⚡</span>
          <h1 className="text-2xl font-bold text-gray-900">Bem-vindo de volta</h1>
          <p className="text-sm text-gray-500 mt-1">Acesse sua conta para continuar</p>
        </header>

        {/* Erro geral */}
        {erroGeral && (
          <output role="alert" className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-lg px-4 py-3 mb-5">
            <span>⚠️</span>
            <span>{erroGeral}</span>
          </output>
        )}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

          {/* E-mail */}
          <fieldset className="flex flex-col gap-1 border-none p-0 m-0">
            <label htmlFor="email" className="text-sm font-semibold text-gray-700">E-mail</label>
            <span className="relative flex items-center">
              <span className="absolute left-3 text-base pointer-events-none">✉️</span>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                autoComplete="email"
                className={`w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm text-gray-900 bg-white transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  erros.email ? 'border-red-400 focus:ring-red-300' : 'border-gray-300'
                }`}
              />
            </span>
            {erros.email && <span className="text-xs text-red-500 font-medium">{erros.email}</span>}
          </fieldset>

          {/* Senha */}
          <fieldset className="flex flex-col gap-1 border-none p-0 m-0">
            <label htmlFor="senha" className="text-sm font-semibold text-gray-700">Senha</label>
            <span className="relative flex items-center">
              <span className="absolute left-3 text-base pointer-events-none">🔒</span>
              <input
                id="senha"
                type={mostrarSenha ? 'text' : 'password'}
                name="senha"
                value={form.senha}
                onChange={handleChange}
                placeholder="Sua senha"
                autoComplete="current-password"
                className={`w-full pl-9 pr-10 py-2.5 border rounded-lg text-sm text-gray-900 bg-white transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  erros.senha ? 'border-red-400 focus:ring-red-300' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                className="absolute right-3 text-gray-400 hover:text-gray-700 transition"
              >
                {mostrarSenha ? '🙈' : '👁️'}
              </button>
            </span>
            {erros.senha && <span className="text-xs text-red-500 font-medium">{erros.senha}</span>}
          </fieldset>

          {/* Botão submit */}
          <button
            type="submit"
            disabled={carregando}
            className="mt-1 w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold text-base rounded-lg py-2.5 transition active:scale-[0.98]"
          >
            {carregando ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Entrando...
              </>
            ) : 'Entrar'}
          </button>
        </form>

        {/* Rodapé */}
        <footer className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Não tem conta?{' '}
            <Link to="/cadastro" className="text-emerald-700 font-semibold hover:underline">
              Crie uma agora.
            </Link>
          </p>
        </footer>
      </article>
    </main>
  );
}

export default Login;