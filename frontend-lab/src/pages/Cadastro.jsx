import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setErroGeral(resultado.erro);
      setEtapa(2);
    }
  };

  const forcaSenha = () => {
    if (form.senha.length === 0) return null;
    if (form.senha.length < 8) return { label: 'Fraca', cor: 'bg-red-400', w: 'w-1/3' };
    if (form.senha.length < 12) return { label: 'Média', cor: 'bg-yellow-400', w: 'w-2/3' };
    return { label: 'Forte', cor: 'bg-green-500', w: 'w-full' };
  };

  const forca = forcaSenha();

  const inputClass = (campo) =>
    `w-full px-3 py-2.5 border rounded-lg text-sm text-gray-900 bg-white transition focus:outline-none focus:ring-2 ${
      erros[campo] ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-400'
    }`;

  if (sucesso) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <article className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-sm w-full">
          <span className="text-6xl block mb-4">✅</span>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Cadastro realizado!</h2>
          <p className="text-gray-500 text-sm mb-6">Redirecionando para o login...</p>
          <progress
            className="w-full rounded-full [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-green-500 h-1.5"
            max="100" value="100"
          />
        </article>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto">
      <article className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

        {/* Cabeçalho */}
        <header className="mb-7">
          <h1 className="text-2xl font-bold text-gray-900">Novo Cadastro</h1>
          <p className="text-sm text-gray-500 mt-1">Preencha os dados abaixo com atenção</p>
        </header>

        {/* Erro geral (ex: e-mail já cadastrado, servidor fora) */}
        {erroGeral && (
          <output role="alert" className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-lg px-4 py-3 mb-5">
            <span>⚠️</span>
            <span>{erroGeral}</span>
          </output>
        )}

        {/* Indicador de etapas */}
        <nav aria-label="Etapas do cadastro" className="flex items-center gap-2 mb-8">
          <span className={`flex items-center gap-2 text-sm font-medium ${etapa >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
              etapa > 1 ? 'bg-green-500 border-green-500 text-white'
              : etapa === 1 ? 'bg-blue-600 border-blue-600 text-white'
              : 'border-gray-300 text-gray-400'
            }`}>
              {etapa > 1 ? '✓' : '1'}
            </span>
            <span className="hidden sm:inline">Dados Pessoais</span>
          </span>

          <hr className="flex-1 border-t border-gray-200" />

          <span className={`flex items-center gap-2 text-sm font-medium ${etapa >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
              etapa === 2 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-400'
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
                    <input type="text" name="nome" value={form.nome} onChange={handleChange}
                      placeholder="Seu nome completo" autoComplete="name" className={inputClass('nome')} />
                    {erros.nome && <span className="text-xs text-red-500">{erros.nome}</span>}
                  </fieldset>
                </li>

                <li className="sm:col-span-2">
                  <fieldset className="flex flex-col gap-1 border-none p-0 m-0">
                    <label className="text-sm font-semibold text-gray-700">E-mail *</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange}
                      placeholder="seu@email.com" autoComplete="email" className={inputClass('email')} />
                    {erros.email && <span className="text-xs text-red-500">{erros.email}</span>}
                  </fieldset>
                </li>

                <li>
                  <fieldset className="flex flex-col gap-1 border-none p-0 m-0">
                    <label className="text-sm font-semibold text-gray-700">Telefone *</label>
                    <input type="tel" name="telefone" value={form.telefone} onChange={handleChange}
                      placeholder="(00) 00000-0000" maxLength={15} className={inputClass('telefone')} />
                    {erros.telefone && <span className="text-xs text-red-500">{erros.telefone}</span>}
                  </fieldset>
                </li>

                <li>
                  <fieldset className="flex flex-col gap-1 border-none p-0 m-0">
                    <label className="text-sm font-semibold text-gray-700">Data de Nascimento *</label>
                    <input type="date" name="dataNascimento" value={form.dataNascimento} onChange={handleChange}
                      max={new Date().toISOString().split('T')[0]} className={inputClass('dataNascimento')} />
                    {erros.dataNascimento && <span className="text-xs text-red-500">{erros.dataNascimento}</span>}
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
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg px-6 py-2.5 transition active:scale-[0.98]">
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
                    <input type="text" name="cidade" value={form.cidade} onChange={handleChange}
                      placeholder="Sua cidade" className={inputClass('cidade')} />
                    {erros.cidade && <span className="text-xs text-red-500">{erros.cidade}</span>}
                  </fieldset>
                </li>

                <li>
                  <fieldset className="flex flex-col gap-1 border-none p-0 m-0">
                    <label className="text-sm font-semibold text-gray-700">Estado *</label>
                    <select name="estado" value={form.estado} onChange={handleChange} className={inputClass('estado')}>
                      <option value="">Selecione...</option>
                      {ESTADOS_BR.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
                    </select>
                    {erros.estado && <span className="text-xs text-red-500">{erros.estado}</span>}
                  </fieldset>
                </li>

                <li className="sm:col-span-2">
                  <fieldset className="flex flex-col gap-1 border-none p-0 m-0">
                    <label className="text-sm font-semibold text-gray-700">Senha *</label>
                    <input type="password" name="senha" value={form.senha} onChange={handleChange}
                      placeholder="Mín. 8 caracteres, 1 maiúscula, 1 número"
                      autoComplete="new-password" className={inputClass('senha')} />
                    {erros.senha && <span className="text-xs text-red-500">{erros.senha}</span>}
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
                    <input type="password" name="confirmarSenha" value={form.confirmarSenha} onChange={handleChange}
                      placeholder="Repita a senha" autoComplete="new-password" className={inputClass('confirmarSenha')} />
                    {erros.confirmarSenha && <span className="text-xs text-red-500">{erros.confirmarSenha}</span>}
                  </fieldset>
                </li>

                <li className="sm:col-span-2">
                  <fieldset className="flex flex-col gap-1 border-none p-0 m-0">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" name="aceitaTermos" checked={form.aceitaTermos} onChange={handleChange}
                        className="mt-0.5 w-4 h-4 accent-blue-600 cursor-pointer" />
                      <span className="text-sm text-gray-700">
                        Li e aceito os{' '}
                        <a href="#termos" className="text-blue-600 font-semibold hover:underline">Termos de Uso</a>
                        {' '}e a{' '}
                        <a href="#privacidade" className="text-blue-600 font-semibold hover:underline">Política de Privacidade</a>
                      </span>
                    </label>
                    {erros.aceitaTermos && <span className="text-xs text-red-500">{erros.aceitaTermos}</span>}
                  </fieldset>
                </li>
              </ol>

              <footer className="flex justify-between pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setEtapa(1)}
                  className="border border-gray-300 hover:border-blue-400 hover:text-blue-600 text-gray-700 font-semibold text-sm rounded-lg px-6 py-2.5 transition">
                  ← Voltar
                </button>
                <button type="submit" disabled={carregando}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg px-6 py-2.5 transition active:scale-[0.98]">
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
      </article>
    </main>
  );
}

export default Cadastro;