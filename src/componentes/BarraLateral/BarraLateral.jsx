import React from 'react';
import { PawPrint, List, User, LogOut, Heart, CheckCircle, LayoutDashboard, Gift, AlertCircle } from 'lucide-react';

export const ITENS_NAV = [
  { id: 'painel',     icone: <LayoutDashboard size={20} />, rotulo: 'Dashboard' },
  { id: 'descobrir',  icone: <Heart size={20} />,       rotulo: 'Match' },
  { id: 'adocao',     icone: <CheckCircle size={20} />, rotulo: 'Adoções' },
  { id: 'doacoes',    icone: <Gift size={20} />,        rotulo: 'Doações' },
  { id: 'resgate',    icone: <AlertCircle size={20} />, rotulo: 'Resgate' },
  { id: 'pets',       icone: <List size={20} />,        rotulo: 'Meus Pets' },
  { id: 'perfil',     icone: <User size={20} />,        rotulo: 'Perfil' },
];

const BarraLateral = ({ tela, setTela, aoSair, usuarioAtual }) => (
  <aside className="sidebar-premium">
    <div className="brand-logo-topo" style={{ marginBottom: '48px', fontSize: '1.5rem' }}>
      <PawPrint size={28} fill="white" strokeWidth={0} />
      <span>PetMatch</span>
    </div>
    <nav style={{ flex: 1 }}>
      {ITENS_NAV.filter(item => item.id !== 'pets' || usuarioAtual?.isOng).map(item => (
        <button
          key={item.id}
          className={`nav-item-premium ${tela === item.id || (item.id === 'pets' && tela === 'formulario_pet') ? 'ativo' : ''}`}
          onClick={() => setTela(item.id)}
        >
          {item.icone} {item.rotulo}
        </button>
      ))}
    </nav>
    <button className="nav-item-premium" onClick={aoSair} style={{ color: '#ef4444', marginTop: 'auto' }}>
      <LogOut size={20} /> Sair
    </button>
  </aside>
);

export default BarraLateral;
