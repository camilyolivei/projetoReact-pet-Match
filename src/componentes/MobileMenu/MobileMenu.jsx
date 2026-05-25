import React from 'react';
import { PawPrint, X, LogOut } from 'lucide-react';
import { NAV_ITEMS } from '../Sidebar/Sidebar.jsx';

const MobileMenu = ({ aberto, view, setView, onLogout, onFechar }) => {
  if (!aberto) return null;

  return (
    <div className="mobile-overlay fade-in" onClick={onFechar}>
      <div className="mobile-drawer" onClick={e => e.stopPropagation()}>
        <div className="mobile-drawer-header">
          <div className="brand-logo-topo" style={{ fontSize: '1.3rem' }}>
            <PawPrint size={24} fill="white" strokeWidth={0} />
            <span>PetMatch</span>
          </div>
          <button
            onClick={onFechar}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
          >
            <X size={28} />
          </button>
        </div>

        <nav style={{ flex: 1 }}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`nav-item-premium ${
                view === item.id || (item.id === 'pets' && view === 'pet_form') ? 'ativo' : ''
              }`}
              onClick={() => { setView(item.id); onFechar(); }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <button
          className="nav-item-premium"
          onClick={onLogout}
          style={{ color: '#ef4444', marginTop: 'auto' }}
        >
          <LogOut size={20} />
          Sair
        </button>
      </div>
    </div>
  );
};

export default MobileMenu;
