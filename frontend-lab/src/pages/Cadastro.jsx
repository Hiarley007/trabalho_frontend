import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo_site(3).svg';
import login from '../pages/Login'

const ESTADO_INICIAL = {
  nome: '', email: '', telefone: '', dataNascimento: '',
  genero: '', cidade: '', estado: '', senha: '', confirmarSenha: '', aceitaTermos: false,
};

const ESTADOS_BR = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
  'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
  'RS','RO','RR','SC','SP','SE','TO',
];

function Cadastro() {
  const { cadastrarUsuario } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(ESTADO_INICIAL);
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [etapa, setEtapa] = useState(1);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const formatarTelefone = (valor) => {
    const n = valor.replace(/\D/g, '');
    if (n.length <= 10) return n.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim();
    return n.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let v = type === 'checkbox' ? checked : value;
    if (name === 'telefone') v = formatarTelefone(value);
    setForm((prev) => ({ ...prev, [name]: v }));
    if (erros[name]) setErros((prev) => ({ ...prev, [name]: '' }));
    setErroGeral('');
  };

  const validarEtapa1 = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = 'O nome é obrigatório.';
    else if (form.nome.trim().length < 3) e.nome = 'Mínimo 3 caracteres.';
    if (!form.email.trim()) e.email = 'O e-mail é obrigatório.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'E-mail inválido.';
    if (!form.telefone.trim()) e.telefone = 'O telefone é obrigatório.';
    else if (form.telefone.replace(/\D/g, '').length < 10) e.telefone = 'Telefone inválido.';
    if (!form.dataNascimento) { e.dataNascimento = 'Data obrigatória.'; }
    else {
      const nasc = new Date(form.dataNascimento);
      const hoje = new Date();
      if (nasc > hoje) e.dataNascimento = 'Data inválida.';
      else if (hoje.getFullYear() - nasc.getFullYear() < 13) e.dataNascimento = 'Mínimo 13 anos.';
    }
    return e;
  };

  const validarEtapa2 = () => {
    const e = {};
    if (!form.cidade.trim()) e.cidade = 'A cidade é obrigatória.';
    if (!form.estado) e.estado = 'Selecione um estado.';
    if (!form.senha) e.senha = 'A senha é obrigatória.';
    else if (form.senha.length < 8) e.senha = 'Mínimo 8 caracteres.';
    else if (!/(?=.*[A-Z])(?=.*[0-9])/.test(form.senha)) e.senha = 'Use 1 maiúscula e 1 número.';
    if (!form.confirmarSenha) e.confirmarSenha = 'Confirme sua senha.';
    else if (form.senha !== form.confirmarSenha) e.confirmarSenha = 'As senhas não coincidem.';
    if (!form.aceitaTermos) e.aceitaTermos = 'Aceite os termos para continuar.';
    return e;
  };

  const avancarEtapa = () => {
    const e = validarEtapa1();
    if (Object.keys(e).length > 0) { setErros(e); return; }
    setEtapa(2);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validarEtapa2();
    if (Object.keys(e).length > 0) { setErros(e); return; }

    setCarregando(true);
    const { confirmarSenha, aceitaTermos, ...dados } = form;
    const resultado = await cadastrarUsuario(dados);
    setCarregando(false);

    if (resultado.sucesso) {
      setSucesso(true);
      setTimeout(() => navigate({login}, { replace: true }), 2000);
    } else {
      setErroGeral(resultado.erro);
      setEtapa(2);
    }
  };

  const forcaSenha = () => {
    if (form.senha.length === 0) return null;
    if (form.senha.length < 8) return { label: 'Fraca', cor: 'bg-red-400', w: 'w-1/3' };
    if (form.senha.length < 12) return { label: 'Média', cor: 'bg-yellow-400', w: 'w-2/3' };
    return { label: 'Forte', cor: 'bg-emerald-600', w: 'w-full' };
  };

  const forca = forcaSenha();

  const inputClass = (campo, comIcone = false) =>
    `w-full ${comIcone ? 'pl-9 pr-4' : 'px-3.5 pr-4'} py-2.5 border rounded-lg text-sm text-gray-900 bg-white transition focus:outline-none focus:ring-2 ${
      erros[campo] ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-emerald-500'
    }`;

  if (sucesso) {
    return (
      <main className="fixed inset-0 bg-gradient-to-br from-emerald-950 via-green-900 to-emerald-800 flex items-center justify-center px-4 py-12 overflow-hidden">
        <article className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-sm w-full">
          <span className="text-6xl block mb-4">✅</span>
          <h2 className="text-2xl font-bold text-emerald-700 mb-2">Cadastro realizado!</h2>
          <p className="text-gray-500 text-sm mb-6">Redirecionando para o login...</p>
          <progress
            className="w-full rounded-full [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-emerald-600 h-1.5"
            max="100" value="100"
          />
        </article>
      </main>
    );
  }

  return (
    <main className="fixed inset-0 bg-gradient-to-br from-emerald-950 via-green-900 to-emerald-800 flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Círculos decorativos */}
      <span
        className="absolute top-[-80px] left-[-60px] w-72 h-72 rounded-full bg-white/10 pointer-events-none"
        aria-hidden="true"
      />
      <span
        className="absolute bottom-[-40px] right-[-40px] w-56 h-56 rounded-full bg-white/10 pointer-events-none"
        aria-hidden="true"
      />
      <span
        className="absolute bottom-1/3 left-[8%] w-36 h-36 rounded-full bg-white/10 pointer-events-none"
        aria-hidden="true"
      />

      {/* Card */}
      <article className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8">

        {/* Cabeçalho */}
        <header className="text-center mb-7">
          <img src={logo} alt="Logo" className="w-80 h-20 mx-auto mb-4 object-contain" />
          <h1 className="text-2xl font-bold text-gray-900">Novo Cadastro</h1>
          <p className="text-sm text-gray-500 mt-1">Preencha os dados abaixo com atenção</p>
        </header>

        {/* Erro geral (ex: e-mail já cadastrado, servidor fora) */}
        {erroGeral && (
          <output
            role="alert"
            className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-lg px-4 py-3 mb-5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 mt-0.5"
            >
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>{erroGeral}</span>
          </output>
        )}

        {/* Indicador de etapas */}
        <nav aria-label="Etapas do cadastro" className="flex items-center gap-2 mb-8">
          <span className={`flex items-center gap-2 text-sm font-medium ${etapa >= 1 ? 'text-emerald-700' : 'text-gray-400'}`}>
            <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
              etapa > 1 ? 'bg-emerald-700 border-emerald-700 text-white'
              : etapa === 1 ? 'bg-emerald-700 border-emerald-700 text-white'
              : 'border-gray-300 text-gray-400'
            }`}>
              {etapa > 1 ? '✓' : '1'}
            </span>
            <span className="hidden sm:inline">Dados Pessoais</span>
          </span>

          <hr className="flex-1 border-t border-gray-200" />

          <span className={`flex items-center gap-2 text-sm font-medium ${etapa >= 2 ? 'text-emerald-700' : 'text-gray-400'}`}>
            <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
              etapa === 2 ? 'bg-emerald-700 border-emerald-700 text-white' : 'border-gray-300 text-gray-400'
            }`}>
              2
            </span>
            <span className="hidden sm:inline">Localização e Acesso</span>
          </span>
        </nav>

        <form onSubmit={handleSubmit} noValidate>

          {/* ETAPA 1 */}
          {etapa === 1 && (
            <section className="flex flex-col gap-5">
              <ol className="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none p-0 m-0">

                <li className="sm:col-span-2">
                  <fieldset className="flex flex-col gap-1 border-none p-0 m-0">
                    <label className="text-sm font-semibold text-gray-700">Nome completo *</label>
                    <span className="relative flex items-center">
                      <span className="absolute left-3 text-gray-400 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="7" r="4" />
                          <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                        </svg>
                      </span>
                      <input type="text" name="nome" value={form.nome} onChange={handleChange}
                        placeholder="Seu nome completo" autoComplete="name" className={inputClass('nome', true)} />
                    </span>
                    {erros.nome && <span className="text-xs text-red-500 font-medium">{erros.nome}</span>}
                  </fieldset>
                </li>

                <li className="sm:col-span-2">
                  <fieldset className="flex flex-col gap-1 border-none p-0 m-0">
                    <label className="text-sm font-semibold text-gray-700">E-mail *</label>
                    <span className="relative flex items-center">
                      <span className="absolute left-3 text-gray-400 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="4" width="20" height="16" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                      </span>
                      <input type="email" name="email" value={form.email} onChange={handleChange}
                        placeholder="seu@email.com" autoComplete="email" className={inputClass('email', true)} />
                    </span>
                    {erros.email && <span className="text-xs text-red-500 font-medium">{erros.email}</span>}
                  </fieldset>
                </li>

                <li>
                  <fieldset className="flex flex-col gap-1 border-none p-0 m-0">
                    <label className="text-sm font-semibold text-gray-700">Telefone *</label>
                    <span className="relative flex items-center">
                      <span className="absolute left-3 text-gray-400 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
                        </svg>
                      </span>
                      <input type="tel" name="telefone" value={form.telefone} onChange={handleChange}
                        placeholder="(00) 00000-0000" maxLength={15} className={inputClass('telefone', true)} />
                    </span>
                    {erros.telefone && <span className="text-xs text-red-500 font-medium">{erros.telefone}</span>}
                  </fieldset>
                </li>

                <li>
                  <fieldset className="flex flex-col gap-1 border-none p-0 m-0">
                    <label className="text-sm font-semibold text-gray-700">Data de Nascimento *</label>
                    <span className="relative flex items-center">
                      <span className="absolute left-3 text-gray-400 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </span>
                      <input type="date" name="dataNascimento" value={form.dataNascimento} onChange={handleChange}
                        max={new Date().toISOString().split('T')[0]} className={inputClass('dataNascimento', true)} />
                    </span>
                    {erros.dataNascimento && <span className="text-xs text-red-500 font-medium">{erros.dataNascimento}</span>}
                  </fieldset>
                </li>

                <li>
                  <fieldset className="flex flex-col gap-1 border-none p-0 m-0">
                    <label className="text-sm font-semibold text-gray-700">Gênero</label>
                    <select name="genero" value={form.genero} onChange={handleChange} className={inputClass('genero')}>
                      <option value="">Prefiro não informar</option>
                      <option value="masculino">Masculino</option>
                      <option value="feminino">Feminino</option>
                      <option value="nao-binario">Não-binário</option>
                      <option value="outro">Outro</option>
                    </select>
                  </fieldset>
                </li>
              </ol>

              <footer className="flex justify-end pt-4 border-t border-gray-100">
                <button type="button" onClick={avancarEtapa}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-lg px-6 py-2.5 transition active:scale-[0.98]">
                  Próximo →
                </button>
              </footer>
            </section>
          )}

          {/* ETAPA 2 */}
          {etapa === 2 && (
            <section className="flex flex-col gap-5">
              <ol className="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none p-0 m-0">

                <li>
                  <fieldset className="flex flex-col gap-1 border-none p-0 m-0">
                    <label className="text-sm font-semibold text-gray-700">Cidade *</label>
                    <span className="relative flex items-center">
                      <span className="absolute left-3 text-gray-400 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </span>
                      <input type="text" name="cidade" value={form.cidade} onChange={handleChange}
                        placeholder="Sua cidade" className={inputClass('cidade', true)} />
                    </span>
                    {erros.cidade && <span className="text-xs text-red-500 font-medium">{erros.cidade}</span>}
                  </fieldset>
                </li>

                <li>
                  <fieldset className="flex flex-col gap-1 border-none p-0 m-0">
                    <label className="text-sm font-semibold text-gray-700">Estado *</label>
                    <select name="estado" value={form.estado} onChange={handleChange} className={inputClass('estado')}>
                      <option value="">Selecione...</option>
                      {ESTADOS_BR.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
                    </select>
                    {erros.estado && <span className="text-xs text-red-500 font-medium">{erros.estado}</span>}
                  </fieldset>
                </li>

                <li className="sm:col-span-2">
                  <fieldset className="flex flex-col gap-1 border-none p-0 m-0">
                    <label className="text-sm font-semibold text-gray-700">Senha *</label>
                    <span className="relative flex items-center">
                      <span className="absolute left-3 text-gray-400 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </span>
                      <input type={mostrarSenha ? 'text' : 'password'} name="senha" value={form.senha} onChange={handleChange}
                        placeholder="Mín. 8 caracteres, 1 maiúscula, 1 número"
                        autoComplete="new-password" className={`${inputClass('senha', true)} pr-10`} />
                      <button
                        type="button"
                        onClick={() => setMostrarSenha(!mostrarSenha)}
                        aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                        className="absolute right-3 text-gray-400 hover:text-gray-700 transition"
                      >
                        {mostrarSenha ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                            <line x1="2" y1="2" x2="22" y2="22" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </span>
                    {erros.senha && <span className="text-xs text-red-500 font-medium">{erros.senha}</span>}
                    {forca && !erros.senha && (
                      <span className="flex items-center gap-2 mt-1">
                        <span className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                          <span className={`block h-1.5 rounded-full transition-all duration-300 ${forca.cor} ${forca.w}`} />
                        </span>
                        <span className="text-xs text-gray-500">{forca.label}</span>
                      </span>
                    )}
                  </fieldset>
                </li>

                <li className="sm:col-span-2">
                  <fieldset className="flex flex-col gap-1 border-none p-0 m-0">
                    <label className="text-sm font-semibold text-gray-700">Confirmar Senha *</label>
                    <span className="relative flex items-center">
                      <span className="absolute left-3 text-gray-400 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </span>
                      <input type={mostrarConfirmarSenha ? 'text' : 'password'} name="confirmarSenha" value={form.confirmarSenha} onChange={handleChange}
                        placeholder="Repita a senha" autoComplete="new-password" className={`${inputClass('confirmarSenha', true)} pr-10`} />
                      <button
                        type="button"
                        onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                        aria-label={mostrarConfirmarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                        className="absolute right-3 text-gray-400 hover:text-gray-700 transition"
                      >
                        {mostrarConfirmarSenha ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                            <line x1="2" y1="2" x2="22" y2="22" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </span>
                    {erros.confirmarSenha && <span className="text-xs text-red-500 font-medium">{erros.confirmarSenha}</span>}
                  </fieldset>
                </li>

                <li className="sm:col-span-2">
                  <fieldset className="flex flex-col gap-1 border-none p-0 m-0">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" name="aceitaTermos" checked={form.aceitaTermos} onChange={handleChange}
                        className="mt-0.5 w-4 h-4 accent-emerald-700 cursor-pointer" />
                      <span className="text-sm text-gray-700">
                        Li e aceito os{' '}
                        <a href="#termos" className="text-emerald-700 font-semibold hover:underline">Termos de Uso</a>
                        {' '}e a{' '}
                        <a href="#privacidade" className="text-emerald-700 font-semibold hover:underline">Política de Privacidade</a>
                      </span>
                    </label>
                    {erros.aceitaTermos && <span className="text-xs text-red-500 font-medium">{erros.aceitaTermos}</span>}
                  </fieldset>
                </li>
              </ol>

              <footer className="flex justify-between pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setEtapa(1)}
                  className="border border-gray-300 hover:border-emerald-600 hover:text-emerald-700 text-gray-700 font-semibold text-sm rounded-lg px-6 py-2.5 transition">
                  ← Voltar
                </button>
                <button type="submit" disabled={carregando}
                  className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg px-6 py-2.5 transition active:scale-[0.98]">
                  {carregando ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Salvando...
                    </>
                  ) : 'Cadastrar'}
                </button>
              </footer>
            </section>
          )}
        </form>

        {/* Rodapé */}
        <footer className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Já tem conta?{' '}
            <Link to="/login" className="text-emerald-700 font-semibold hover:underline">
              Faça login.
            </Link>
          </p>
        </footer>
      </article>
    </main>
  );
}

export default Cadastro;