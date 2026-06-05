import React, { useContext, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { User, MapPin, Heart, Gift, PawPrint, X, Clock, Check, Trash2, Edit2 } from 'lucide-react';
import { AppContext } from '../../context/AppContext.jsx';
import CabecalhoPagina from '../../componentes/CabecalhoPagina/CabecalhoPagina.jsx';

const Dashboard = ({ setView, excluirResgate, editarResgate }) => {
  const { activeUsers, pets, adocoes, resgates, doacoes = [], donationTotal, usuarioAtual } = useContext(AppContext);
  const [modalResgateAberto, setModalResgateAberto] = useState(false);
  const [modalDoacoesAberto, setModalDoacoesAberto] = useState(false);
  const [editandoResgate, setEditandoResgate] = useState(null);
  const [editDesc, setEditDesc] = useState('');
  const [editLoc, setEditLoc] = useState('');

  const iniciarEdicao = (res, desc, loc) => {
    setEditandoResgate(res.id);
    setEditDesc(desc);
    setEditLoc(loc);
  };

  const salvarEdicao = () => {
    if (editarResgate && editandoResgate) {
      editarResgate(editandoResgate, editDesc, editLoc);
      setEditandoResgate(null);
    }
  };
  
  // Estado puramente frontend para não mexer na API/Banco
  const [resgatesResolvidos, setResgatesResolvidos] = useState(() => {
    try {
      const salvo = localStorage.getItem('petmatch_resgates_resolvidos');
      return salvo ? JSON.parse(salvo) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('petmatch_resgates_resolvidos', JSON.stringify(resgatesResolvidos));
  }, [resgatesResolvidos]);

  const marcarComoResolvido = (id) => {
    setResgatesResolvidos(prev => [...prev, id]);
  };

  const adocoesConcluidas = adocoes.filter(a => a.status === 'aprovada').length;
  const petsDisponiveis = pets.filter(p => p.ativo).length;
  
  // Filtra apenas os que ainda não foram resolvidos
  const resgatesAtivos = resgates.filter(r => !resgatesResolvidos.includes(r.id));

  // Soma de doações por categoria (A API retorna tipoDoacaoId em camelCase, mas o payload local envia tipo_doacao_id)
  const doacoesDinheiro = doacoes.filter(d => (d.tipoDoacaoId || d.tipo_doacao_id) === 1).reduce((acc, curr) => acc + (parseFloat(curr.quantidade) || 0), 0);
  const doacoesRacao = doacoes.filter(d => (d.tipoDoacaoId || d.tipo_doacao_id) === 2).reduce((acc, curr) => acc + (parseFloat(curr.quantidade) || 0), 0);
  const doacoesRemedio = doacoes.filter(d => (d.tipoDoacaoId || d.tipo_doacao_id) === 3).reduce((acc, curr) => acc + (parseFloat(curr.quantidade) || 0), 0);
  const doacoesBrinquedo = doacoes.filter(d => (d.tipoDoacaoId || d.tipo_doacao_id) === 4).reduce((acc, curr) => acc + (parseFloat(curr.quantidade) || 0), 0);

  const stats = [
    { label: 'Pets Disponíveis',     value: petsDisponiveis,                      icon: <PawPrint size={20} />, color: '#d16b47', bg: '#fdf4f0' },
    { label: 'Adoções Concluídas',   value: adocoesConcluidas,                    icon: <Heart size={20} />,    color: '#be4a8b', bg: '#f9f0f5' },
    { label: 'Resgates Pendentes',   value: resgatesAtivos.length,                icon: <MapPin size={20} />,   color: '#eab308', bg: '#fefce8' },
  ];

  return (
    <div className="fade-in">
      <CabecalhoPagina titulo="Bem-vindo de volta!" subtitulo="Aqui está o resumo da sua plataforma PetMatch." />

      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card-premium" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: stat.bg, color: stat.color, padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</p>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '2px' }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Card Unificado de Doações Arrecadadas */}
      <div className="premium-card" style={{ marginBottom: '32px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: '#f0f5f9', color: '#4a8bbe', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Gift size={20} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>
              {usuarioAtual?.isOng ? 'Total de Doações Arrecadadas' : 'Doações Feitas por Mim'}
            </h3>
          </div>
          <button className="btn-texto" onClick={() => setModalDoacoesAberto(true)} style={{ color: '#d16b47', fontWeight: 600 }}>
            {usuarioAtual?.isOng ? 'Ver mais' : 'Histórico Recente'}
          </button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '14px', borderRadius: '12px', background: '#f9fafb', border: '1px solid #e5e7eb' }}>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dinheiro</p>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginTop: '4px' }}>R$ {doacoesDinheiro.toLocaleString('pt-BR')}</h3>
          </div>
          <div style={{ padding: '14px', borderRadius: '12px', background: '#f9fafb', border: '1px solid #e5e7eb' }}>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ração</p>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginTop: '4px' }}>{doacoesRacao.toLocaleString('pt-BR')} kg</h3>
          </div>
          <div style={{ padding: '14px', borderRadius: '12px', background: '#f9fafb', border: '1px solid #e5e7eb' }}>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Remédios</p>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginTop: '4px' }}>{doacoesRemedio.toLocaleString('pt-BR')} un.</h3>
          </div>
          <div style={{ padding: '14px', borderRadius: '12px', background: '#f9fafb', border: '1px solid #e5e7eb' }}>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Brinquedos</p>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginTop: '4px' }}>{doacoesBrinquedo.toLocaleString('pt-BR')} un.</h3>
          </div>
        </div>
        
      </div>

      <div className="dashboard-cols">
        {/* Últimas Adoções */}
        <div className="premium-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>Últimas Solicitações</h3>
            <button className="btn-texto" onClick={() => setView('adoption')}>Ver todas</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {adocoes.slice(0, 4).map(ado => {
              const petEncontrado = pets.find(p => p.id === (ado.petId || ado.pet_id));
              return (
              <div key={ado.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '16px', background: '#f9fafb' }}>
                <img src={ado.img || petEncontrado?.img || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800'} alt={ado.petName || petEncontrado?.name} style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700 }}>{ado.petName || petEncontrado?.name || 'Pet'}</p>
                  <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                    {usuarioAtual?.isOng 
                      ? `Solicitado por ${ado.applicant || ado.usuario_nome || 'Usuário'}`
                      : `ONG Responsável: ${(ado.institutionName || ado.instituicao || petEncontrado?.instituicao_nome || petEncontrado?.owner_name || 'Desconhecida').charAt(0).toUpperCase() + (ado.institutionName || ado.instituicao || petEncontrado?.instituicao_nome || petEncontrado?.owner_name || 'Desconhecida').slice(1)}`
                    }
                  </p>
                </div>
                <span
                  className={`badge ${ado.status === 'aprovada' ? 'verde' : ado.status === 'recusada' ? 'cinza' : 'laranja'}`}
                  style={{ textTransform: 'capitalize' }}
                >
                  {ado.status}
                </span>
              </div>
            )})}
            {adocoes.length === 0 && (
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Nenhuma adoção recente.</p>
            )}
          </div>
        </div>

        {/* Resgates em foco */}
        <div className="premium-card" style={{ background: '#1f3024', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>
              Resgates em Foco
            </h3>
            <button className="btn-texto" style={{ color: 'white', opacity: 0.8 }} onClick={() => setModalResgateAberto(true)}>Ver Todos</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {resgatesAtivos.slice(0, 2).map(res => {
              const partes = res.descricao ? res.descricao.split('|') : [];
              const descricaoExibicao = partes[0] ? partes[0].trim() : res.descricao;
              const localizacaoExibicao = partes[1] ? partes[1].replace('Local:', '').trim() : res.localizacao;
              return (
              <div key={res.id} style={{ padding: '20px', borderRadius: '20px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Descrição da Situação:</p>
                <p style={{ fontWeight: 700, marginBottom: '12px' }}>{descricaoExibicao}</p>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Localização Exata:</p>
                <p style={{ fontSize: '0.85rem', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                  <MapPin size={14} /> {localizacaoExibicao}
                </p>
                <button 
                  onClick={() => marcarComoResolvido(res.id)}
                  style={{ 
                    background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', 
                    padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, width: '100%', justifyContent: 'center'
                  }}
                >
                  <Check size={14} /> Marcar Resolvido
                </button>
              </div>
            )})}
            {resgatesAtivos.length === 0 && (
              <p style={{ opacity: 0.7 }}>Nenhum resgate pendente.</p>
            )}
            <button
              className="btn-submit-premium"
              style={{ marginTop: '16px', background: 'white', color: '#1f3024' }}
              onClick={() => setView('resgate')}
            >
              Reportar novo resgate
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Todos os Resgates */}
      {modalResgateAberto && createPortal(
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setModalResgateAberto(false); }}
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
            background: 'rgba(0,0,0,0.6)', zIndex: 99999, display: 'flex', 
            alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
          }}
        >
          <div className="fade-in" style={{
            background: 'white', width: '90%', maxWidth: '800px', maxHeight: '85vh', 
            borderRadius: '24px', padding: '32px', overflowY: 'auto', position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
          }}>
            <button 
              onClick={() => setModalResgateAberto(false)}
              style={{ position: 'absolute', top: '24px', right: '24px', background: '#f3f4f6', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer' }}
            >
              <X size={20} color="#4b5563" />
            </button>
            
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '24px', color: '#1f2937' }}>Todos os Alertas de Resgate</h2>
            
            {resgates.length === 0 ? (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px 0' }}>Nenhum histórico de resgate reportado.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {resgates.map(res => {
                  const estaResolvido = resgatesResolvidos.includes(res.id);
                  const partes = res.descricao ? res.descricao.split('|') : [];
                  const descricaoExibicao = partes[0] ? partes[0].trim() : res.descricao;
                  const localizacaoExibicao = partes[1] ? partes[1].replace('Local:', '').trim() : res.localizacao;
                  return (
                  <div key={res.id} style={{ 
                    padding: '24px', borderRadius: '20px', border: '1px solid',
                    borderColor: estaResolvido ? '#d1fae5' : '#e5e7eb',
                    borderLeft: estaResolvido ? '6px solid #10b981' : (res.status === 'urgente' ? '6px solid #ef4444' : '6px solid #eab308'),
                    background: estaResolvido ? 'linear-gradient(145deg, #f0fdf4 0%, #ffffff 100%)' : '#ffffff',
                    opacity: estaResolvido ? 0.85 : 1,
                    boxShadow: estaResolvido ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={`badge ${estaResolvido ? 'verde' : (res.status === 'urgente' ? 'laranja' : 'azul')}`} style={{ textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px' }}>
                          {estaResolvido && <Check size={14} />} {estaResolvido ? 'Resolvido' : res.status}
                        </span>
                        {JSON.parse(localStorage.getItem('petmatch_meus_resgates') || '[]').includes(res.id) && (
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button 
                              onClick={() => iniciarEdicao(res, descricaoExibicao, localizacaoExibicao)}
                              style={{ background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
                              title="Editar minha solicitação"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => excluirResgate && excluirResgate(res.id)}
                              style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
                              title="Excluir minha solicitação"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                      <span style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                        <Clock size={14} /> {res.data ? new Date(res.data).toLocaleDateString('pt-BR') : 'Recente'}
                      </span>
                    </div>
                    {editandoResgate === res.id ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '8px 0' }} className="fade-in">
                        <input 
                          value={editDesc} 
                          onChange={e => setEditDesc(e.target.value)} 
                          style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.95rem' }} 
                          placeholder="Descrição" 
                        />
                        <input 
                          value={editLoc} 
                          onChange={e => setEditLoc(e.target.value)} 
                          style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.95rem' }} 
                          placeholder="Localização" 
                        />
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                          <button onClick={salvarEdicao} style={{ background: '#10b981', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, flex: 1 }}>Salvar Alterações</button>
                          <button onClick={() => setEditandoResgate(null)} style={{ background: '#f3f4f6', color: '#4b5563', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, flex: 1 }}>Cancelar</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h4 style={{ 
                          fontWeight: 700, fontSize: '1.15rem', marginBottom: '10px', 
                          color: estaResolvido ? '#374151' : '#111827',
                        }}>
                          {descricaoExibicao}
                        </h4>
                        <p style={{ 
                          fontSize: '0.95rem', color: estaResolvido ? '#9ca3af' : '#4b5563', 
                          display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500
                        }}>
                          <MapPin size={18} color={estaResolvido ? "#d1d5db" : "#9ca3af"} /> {localizacaoExibicao}
                        </p>
                      </>
                    )}
                  </div>
                )})}
              </div>
            )}
          </div>
        </div>, document.body
      )}

      {/* Modal Histórico Doações */}
      {modalDoacoesAberto && createPortal(
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setModalDoacoesAberto(false); }}
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
            background: 'rgba(0,0,0,0.6)', zIndex: 99999, display: 'flex', 
            alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
          }}
        >
          <div className="fade-in" style={{
            background: 'white', width: '90%', maxWidth: '600px', maxHeight: '85vh', 
            borderRadius: '24px', padding: '32px', overflowY: 'auto', position: 'relative'
          }}>
            <button 
              onClick={() => setModalDoacoesAberto(false)}
              style={{ position: 'absolute', top: '24px', right: '24px', background: '#f3f4f6', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer' }}
            >
              <X size={20} color="#4b5563" />
            </button>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>
              {usuarioAtual?.isOng ? 'Histórico de Doações Recebidas' : 'Doações Feitas por Mim'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {doacoes.length === 0 ? (
                <p style={{ color: '#6b7280' }}>
                  {usuarioAtual?.isOng ? 'Nenhuma doação recebida ainda.' : 'Nenhuma doação feita ainda.'}
                </p>
              ) : (
                doacoes.map((d, idx) => (
                  <div key={idx} style={{ padding: '16px', borderRadius: '12px', background: '#f9fafb', border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {usuarioAtual?.isOng 
                          ? (d.usuarioNome || d.usuario_nome || 'Doador Anônimo').charAt(0).toUpperCase() + (d.usuarioNome || d.usuario_nome || 'Doador Anônimo').slice(1)
                          : (
                            <>
                              <span style={{ fontSize: '0.7rem', background: '#d16b47', color: 'white', padding: '2px 8px', borderRadius: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                ONG
                              </span>
                              <span>{(d.instituicaoNome || d.instituicao_nome || 'ONG Anônima').charAt(0).toUpperCase() + (d.instituicaoNome || d.instituicao_nome || 'ONG Anônima').slice(1)}</span>
                            </>
                          )}
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                        {d.tipoDoacaoId === 1 || d.tipo_doacao_id === 1 ? `Valor: R$ ${parseFloat(d.quantidade).toLocaleString('pt-BR')}` : `Quantidade: ${parseFloat(d.quantidade).toLocaleString('pt-BR')} ${d.tipoDoacaoId === 2 || d.tipo_doacao_id === 2 ? 'kg' : 'un.'}`}
                      </p>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} /> {(d.dataDoacao || d.data_doacao) ? new Date(d.dataDoacao || d.data_doacao).toLocaleDateString('pt-BR') : 'Recente'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>, document.body
      )}
    </div>
  );
};

export default Dashboard;
