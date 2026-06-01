import React from 'react';
import { PawPrint, Trash2, Pencil, Syringe, Scissors } from 'lucide-react';
import CabecalhoPagina from '../../componentes/CabecalhoPagina/CabecalhoPagina.jsx';

const ListaPets = ({ pets, usuarioAtual, setTela, setPetEditando, removerPet, exibirNotificacao }) => {
  const meusPets = pets.filter(p => p.owner_id === (usuarioAtual?.isOng ? usuarioAtual?.instituicao_id : usuarioAtual?.id));

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '20px' }}>
        <CabecalhoPagina titulo="Meus Pets" subtitulo="Cadastre e gerencie seus animais para adoção" />
        {usuarioAtual?.isOng && (
          <button className="btn-submit-premium" style={{ width: 'auto', padding: '0 32px', marginTop: 0 }}
            onClick={() => { setPetEditando(null); setTela('formulario_pet'); }}>
            <PawPrint size={20} fill="white" /> Cadastrar Novo Pet
          </button>
        )}
      </div>

      <div className="cards-grid-premium">
        {meusPets.map(pet => (
          <div key={pet.id} className="premium-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative' }}>
              <img src={pet.img} alt={pet.name} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
              <span
                className={`badge ${pet.ativo ? 'verde' : 'cinza'}`}
                style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '0.75rem', padding: '4px 12px', borderRadius: '999px', fontWeight: 700, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
              >
                {pet.ativo ? '✔ Disponível' : 'Adotado'}
              </span>
            </div>

            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Nome */}
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#111827' }}>{pet.name}</h3>

              {/* Grade de informações com labels */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '10px 12px' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>Espécie / Raça</p>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111827' }}>{pet.type || 'N/A'}</p>
                </div>
                <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '10px 12px' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>Idade</p>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111827' }}>{pet.age || 'N/A'}</p>
                </div>
                {pet.cor && (
                  <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '10px 12px' }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>Cor</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111827' }}>{pet.cor}</p>
                  </div>
                )}
              </div>

              {/* Badges de saúde */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  background: '#f9fafb',
                  color: '#4b5563',
                  border: '1px solid #e5e7eb',
                  borderRadius: '999px', padding: '4px 12px', fontSize: '0.78rem', fontWeight: 600
                }}>
                  <Syringe size={13} />
                  {pet.vacinado ? 'Vacinado' : 'Não vacinado'}
                </span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  background: '#f9fafb',
                  color: '#4b5563',
                  border: '1px solid #e5e7eb',
                  borderRadius: '999px', padding: '4px 12px', fontSize: '0.78rem', fontWeight: 600
                }}>
                  <Scissors size={13} />
                  {pet.castrado ? 'Castrado' : 'Não castrado'}
                </span>
              </div>

              {/* Botões */}
              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                <button
                  className="btn-outline-premium"
                  style={{ height: '44px', flex: 1, fontSize: '0.9rem', marginTop: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  onClick={() => { setPetEditando(pet); setTela('formulario_pet'); }}
                >
                  <Pencil size={15} /> Editar
                </button>
                <button
                  className="btn-outline-premium"
                  style={{ height: '44px', width: '44px', color: '#ef4444', borderColor: '#fca5a5', marginTop: 0, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onClick={async () => { await removerPet(pet.id); exibirNotificacao('Pet removido.'); }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {meusPets.length === 0 && <p style={{ color: '#6b7280' }}>Nenhum pet cadastrado. {usuarioAtual?.isOng ? 'Adicione um!' : 'Apenas ONGs podem cadastrar pets.'}</p>}
      </div>
    </div>
  );
};

export default ListaPets;
