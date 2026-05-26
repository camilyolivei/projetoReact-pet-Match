import React from 'react';
import { PawPrint, Trash2 } from 'lucide-react';
import CabecalhoPagina from '../../componentes/CabecalhoPagina/CabecalhoPagina.jsx';

const ListaPets = ({ pets, usuarioAtual, setTela, setPetEditando, removerPet, exibirNotificacao }) => {
  const meusPets = pets.filter(p => p.owner_id === usuarioAtual?.id);

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '20px' }}>
        <CabecalhoPagina titulo="Meus Pets" subtitulo="Cadastre e gerencie seus animais para adoção" />
        <button className="btn-submit-premium" style={{ width: 'auto', padding: '0 32px', marginTop: 0 }}
          onClick={() => { setPetEditando(null); setTela('formulario_pet'); }}>
          <PawPrint size={20} fill="white" /> Cadastrar Novo Pet
        </button>
      </div>

      <div className="cards-grid-premium">
        {meusPets.map(pet => (
          <div key={pet.id} className="premium-card" style={{ padding: 0, overflow: 'hidden' }}>
            <img src={pet.img} alt={pet.name} style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
            <div style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{pet.name}</h3>
                <span className={`badge ${pet.ativo ? 'verde' : 'cinza'}`}>{pet.ativo ? 'Disponível' : 'Adotado'}</span>
              </div>
              <p style={{ color: '#6b7280', marginBottom: '24px' }}>{pet.type} • {pet.age}</p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-outline-premium" style={{ height: '48px', flex: 1, fontSize: '0.95rem', marginTop: 0 }}
                  onClick={() => { setPetEditando(pet); setTela('formulario_pet'); }}>
                  Editar
                </button>
                <button className="btn-outline-premium" style={{ height: '48px', width: '48px', color: '#ef4444', marginTop: 0, padding: 0 }}
                  onClick={async () => { await removerPet(pet.id); exibirNotificacao('Pet removido.'); }}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {meusPets.length === 0 && <p style={{ color: '#6b7280' }}>Nenhum pet cadastrado. Adicione um!</p>}
      </div>
    </div>
  );
};

export default ListaPets;
