import React, { useState } from 'react';
import { Heart, PawPrint, Check, X } from 'lucide-react';
import CabecalhoPagina from '../../componentes/CabecalhoPagina/CabecalhoPagina.jsx';

const Adocao = ({ adocoes, pets, usuarioAtual, atualizarStatusAdocao, exibirNotificacao }) => {
  const [abaAtiva, setAbaAtiva] = useState('enviadas');

  const adocoesEnviadas = adocoes.filter(a => a.usuario_id === usuarioAtual?.id);
  const adocoesRecebidas = adocoes.filter(a => {
    const pet = pets.find(p => p.id === a.pet_id);
    return pet && pet.owner_id === usuarioAtual?.id;
  });

  const corBadge = (status) => status === 'aprovada' ? 'verde' : status === 'recusada' ? 'cinza' : 'laranja';

  const estiloAba = (id) => ({
    padding: '12px 28px', borderRadius: '12px', border: 'none', cursor: 'pointer',
    fontWeight: 600, fontSize: '0.95rem', fontFamily: "'Inter', sans-serif",
    background: abaAtiva === id ? '#1f3024' : 'transparent',
    color: abaAtiva === id ? 'white' : '#6b7280',
    transition: 'all 0.2s ease',
  });

  const contadorAba = (lista, aba) => lista.length > 0 && (
    <span style={{ marginLeft: '8px', background: abaAtiva === aba ? 'rgba(255,255,255,0.2)' : '#d16b47', color: 'white', borderRadius: '20px', padding: '2px 8px', fontSize: '0.8rem' }}>
      {lista.length}
    </span>
  );

  return (
    <div className="fade-in">
      <CabecalhoPagina titulo="Adoções" subtitulo="Acompanhe suas solicitações e as que recebeu" />

      <div style={{ display: 'flex', gap: '12px', marginBottom: '40px', background: '#f3f4f6', padding: '6px', borderRadius: '16px', width: 'fit-content' }}>
        <button onClick={() => setAbaAtiva('enviadas')} style={estiloAba('enviadas')}>
          Minhas Solicitações {contadorAba(adocoesEnviadas, 'enviadas')}
        </button>
        <button onClick={() => setAbaAtiva('recebidas')} style={estiloAba('recebidas')}>
          Solicitações Recebidas {contadorAba(adocoesRecebidas, 'recebidas')}
        </button>
      </div>

      {abaAtiva === 'enviadas' && (
        <>
          <div style={{ marginBottom: '24px', padding: '20px 24px', background: 'rgba(209,107,71,0.06)', borderLeft: '4px solid #d16b47', borderRadius: '0 12px 12px 0' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#1f3024', marginBottom: '4px', fontWeight: 600 }}>Pedidos que você fez</h3>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.5 }}>Acompanhe o status dos pets que você demonstrou interesse em adotar pelo Match.</p>
          </div>
          <div className="cards-grid-premium">
            {adocoesEnviadas.map(a => (
              <div key={a.id} className="premium-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <span className={`badge ${corBadge(a.status)}`} style={{ textTransform: 'capitalize' }}>{a.status}</span>
                  <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>{a.time}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <img src={a.img} alt={a.petName} style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #f4f5f1' }} />
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{a.petName}</h3>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '4px' }}>
                      {a.status === 'pendente' && '⏳ Aguardando resposta do tutor'}
                      {a.status === 'aprovada' && '🎉 Sua adoção foi aprovada!'}
                      {a.status === 'recusada' && '😔 Solicitação não aprovada.'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {adocoesEnviadas.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 40px', color: '#6b7280' }}>
                <Heart size={48} color="#e5e7eb" style={{ margin: '0 auto 16px' }} />
                <p style={{ fontWeight: 600 }}>Nenhuma solicitação enviada ainda.</p>
                <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>Vá para a aba Match e encontre seu novo amigo!</p>
              </div>
            )}
          </div>
        </>
      )}

      {abaAtiva === 'recebidas' && (
        <>
          <div style={{ marginBottom: '24px', padding: '20px 24px', background: 'rgba(31,48,36,0.05)', borderLeft: '4px solid #1f3024', borderRadius: '0 12px 12px 0' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#1f3024', marginBottom: '4px', fontWeight: 600 }}>Pedidos para seus pets</h3>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.5 }}>Gerencie as solicitações de pessoas que desejam adotar seus animais.</p>
          </div>
          <div className="cards-grid-premium">
            {adocoesRecebidas.map(a => (
              <div key={a.id} className="premium-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <span className={`badge ${corBadge(a.status)}`} style={{ textTransform: 'capitalize' }}>{a.status}</span>
                  <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>{a.time}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                  <img src={a.img} alt={a.petName} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{a.petName}</h3>
                    <p style={{ color: '#6b7280' }}>Solicitante: {a.applicant}</p>
                  </div>
                </div>
                {a.status === 'pendente' && (
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn-submit-premium" style={{ height: '48px', marginTop: 0, flex: 1 }}
                      onClick={() => { atualizarStatusAdocao(a.id, 'aprovada', a.pet_id); exibirNotificacao('Adoção aprovada!'); }}>
                      <Check size={18} /> Aprovar
                    </button>
                    <button className="btn-outline-premium" style={{ height: '48px', marginTop: 0, width: '48px', color: '#ef4444', padding: 0 }}
                      onClick={() => { atualizarStatusAdocao(a.id, 'recusada', a.pet_id); exibirNotificacao('Solicitação recusada.', 'erro'); }}>
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>
            ))}
            {adocoesRecebidas.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 40px', color: '#6b7280' }}>
                <PawPrint size={48} color="#e5e7eb" style={{ margin: '0 auto 16px' }} />
                <p style={{ fontWeight: 600 }}>Nenhuma solicitação recebida.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Adocao;
