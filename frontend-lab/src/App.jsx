import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Layout from "./Layouts/Layout";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Dashboard from "./pages/Dashboard";
import CadastroTransition from "./pages/CadastroTransition";
import ListagemTransition from "./pages/ListagemTransition";
import Erro404 from "./pages/Erro404";

function RotaProtegida({ children }) {
  const { usuarioLogado, carregandoSessao } = useAuth();

  if (carregandoSessao) return null;

  return usuarioLogado ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RotaProtegida>
            <Layout />
          </RotaProtegida>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="cadastro-transacao" element={<CadastroTransition />} />
        <Route path="listagem" element={<ListagemTransition />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="*" element={<Erro404 />} />
    </Routes>
  );
}

export default App;