import React from 'react';
import { PawPrint, Home, Heart, List, Check, AlertCircle, Gift, User, LogOut } from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'dashboard',  icon: <Home size={20} />,         label: 'Dashboard' },
  { id: 'discover',   icon: <Heart size={20} />,        label: 'Match' },
  { id: 'pets',       icon: <List size={20} />,         label: 'Meus Pets' },
  { id: 'adoption',   icon: <Check size={20} />,        label: 'Adoções' },
  { id: 'rescue',     icon: <AlertCircle size={20} />,  label: 'Resgates' },
  { id: 'donations',  icon: <Gift size={20} />,         label: 'Doações' },
  { id: 'profile',    icon: <User size={20} />,         label: 'Perfil' },
];

const Sidebar = ({ view, setView, onLogout }) => (
  <aside className="sidebar-premium">
    <div className="brand-logo-topo" style={{ marginBottom: '48px', fontSize: '1.5rem' }}>
      <PawPrint size={28} fill="white" strokeWidth={0} />
      <span>PetMatch</span>
    </div>

    <nav style={{ flex: 1 }}>
      {NAV_ITEMS.map(item => (
        <button
          key={item.id}
          className={`nav-item-premium ${
            view === item.id || (item.id === 'pets' && view === 'pet_form') ? 'ativo' : ''
          }`}
          onClick={() => setView(item.id)}
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
  </aside>
);

export default Sidebar;
