import { Routes, Route } from "react-router";
import Layout from "./Layouts/Layout";
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard";
import CadastroTransition from "./pages/CadastroTransition"
import ListagemTransition from "./pages/ListagemTransition"
import Erro404 from "./pages/Erro404";

function App () {
  return (
    <Routes>
     <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />}/>
        <Route path="cadastro" element={<CadastroTransition />}/>
        <Route path="listagem" element={<ListagemTransition />}/> 
     </Route>
        
    <Route path="/login" element={<Login />} />
    <Route path="*" element={<Erro404 />}/>
    </Routes>
  ) 
}
 
export default App;