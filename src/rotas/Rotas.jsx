import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from '../paginas/Login/Login.jsx';
import Cadastro from '../paginas/Cadastro/Cadastro.jsx';
import AppInterno from '../paginas/AppInterno/AppInterno.jsx';

/**
 * Rota protegida — redireciona para /login se não há sessão salva.
 * Usa apenas localStorage (sem useContext).
 */
const RotaProtegida = ({ children }) => {
  const usuario = (() => {
    try {
      const v = localStorage.getItem('petmatch_current_user');
      return v ? JSON.parse(v) : null;
    } catch { return null; }
  })();

  return usuario ? children : <Navigate to="/login" replace />;
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
