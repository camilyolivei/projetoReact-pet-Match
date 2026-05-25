import React from 'react';
import { PawPrint, Home, Heart, List, User, Menu } from 'lucide-react';

const ITENS_NAV_MOBILE = [
  { id: 'painel',    icone: <Home size={22} />,  rotulo: 'Início' },
  { id: 'descobrir', icone: <Heart size={22} />, rotulo: 'Match' },
  { id: 'pets',      icone: <List size={22} />,  rotulo: 'Pets' },
  { id: 'perfil',    icone: <User size={22} />,  rotulo: 'Perfil' },
];

const Layout = ({ children, tela, setTela, aoAbrirMenu }) => (
  <main className="main-content-premium">
    {/* Topbar mobile */}
    <header className="mobile-topbar-premium">
      <div className="brand-logo-topo" style={{ fontSize: '1.1rem', color: '#1f3024' }}>
        <PawPrint size={22} fill="#1f3024" strokeWidth={0} />
        <span>PetMatch</span>
      </div>
      <button onClick={aoAbrirMenu} style={{ background: 'none', border: 'none', color: '#1f3024', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
        <Menu size={26} />
      </button>
    </header>

    {/* Área scrollável */}
    <div className="area-scroll-pagina">{children}</div>

    {/* Navegação inferior mobile */}
    <nav className="mobile-bottom-nav-premium">
      {ITENS_NAV_MOBILE.map(item => (
        <button
          key={item.id}
          className={`mobile-nav-btn ${tela === item.id || (item.id === 'pets' && tela === 'formulario_pet') ? 'ativo' : ''}`}
          onClick={() => setTela(item.id)}
        >
          {item.icone}
          <span>{item.rotulo}</span>
        </button>
      ))}
    </nav>
  </main>
);

export default Layout;
