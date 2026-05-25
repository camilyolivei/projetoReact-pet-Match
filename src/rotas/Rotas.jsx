
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from '../../paginas/Login/Login.js';
import Cadastro from '../paginas/Cadastro/Cadastro.jsx';
import AppInterno from '../../paginas/AppInterno/AppInterno.js';

const RotaProtegida = ({ conteudo }) => {
  const usuarioSalvo = (() => {
    try {
      const valorSalvo = localStorage.getItem('petmatch_current_user');
      return valorSalvo ? JSON.parse(valorSalvo) : null;
    } catch { return null; }
  })();

  return usuarioSalvo ? conteudo : <Navigate to="/login" replace />;
};

const Rotas = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login"   element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/app"     element={<RotaProtegida><AppInterno /></RotaProtegida>} />
      <Route path="*"        element={<Navigate to="/login" replace />} />
    </Routes>
  </BrowserRouter>
);

export default Rotas;
