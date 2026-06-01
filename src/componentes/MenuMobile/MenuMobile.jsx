import React from 'react';
import { PawPrint, X, LogOut } from 'lucide-react';
import { ITENS_NAV } from '../BarraLateral/BarraLateral.jsx';

const MenuMobile = ({ aberto, tela, setTela, aoSair, aoFechar, usuarioAtual }) => {
  if (!aberto) return null;

  return (
    <div className="mobile-overlay fade-in" onClick={aoFechar}>
      <div className="mobile-drawer" onClick={e => e.stopPropagation()}>
        <div className="mobile-drawer-header">
          <div className="brand-logo-topo" style={{ fontSize: '1.3rem' }}>
            <PawPrint size={24} fill="white" strokeWidth={0} />
            <span>PetMatch</span>
          </div>
          <button onClick={aoFechar} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
            <X size={28} />
          </button>
        </div>
        <nav style={{ flex: 1 }}>
          {ITENS_NAV.filter(item => item.id !== 'pets' || usuarioAtual?.isOng).map(item => (
            <button
              key={item.id}
              className={`nav-item-premium ${tela === item.id || (item.id === 'pets' && tela === 'formulario_pet') ? 'ativo' : ''}`}
              onClick={() => { setTela(item.id); aoFechar(); }}
            >
              {item.icone} {item.rotulo}
            </button>
          ))}
        </nav>
        <button className="nav-item-premium" onClick={aoSair} style={{ color: '#ef4444', marginTop: 'auto' }}>
          <LogOut size={20} /> Sair
        </button>
      </div>
    </div>
  );
};

export default MenuMobile;
