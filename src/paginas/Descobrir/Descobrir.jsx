import React, { useState, useEffect } from 'react';
import { Heart, X } from 'lucide-react';
import CabecalhoPagina from '../../componentes/CabecalhoPagina/CabecalhoPagina.jsx';
import { apiMatches } from '../../servicos/api.js';
import SobreposicaoMatch from '../../componentes/SobreposicaoMatch/SobreposicaoMatch.jsx';

const Descobrir = ({ pets, adocoes = [], usuarioAtual, exibirNotificacao, setTela, criarAdocao }) => {
  const [indicePet, setIndicePet] = useState(0);
  const [petMatch, setPetMatch] = useState(null);
  const [petsDisponiveis, setPetsDisponiveis] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Busca pets disponíveis da API de Matches
  useEffect(() => {
    const buscarPetsDiscover = async () => {
      if (!usuarioAtual?.id) return;
      setCarregando(true);
      try {
        const res = await apiMatches.discover(usuarioAtual.id);
        if (res.ok && Array.isArray(res.dados)) {
          setPetsDisponiveis(res.dados);
        } else {
          // Caso a API falhe
          const filtrados = pets.filter(pet => {
            const naoEhMeu = pet.owner_id !== usuarioAtual?.instituicao_id && pet.owner_id !== usuarioAtual?.id;
            return naoEhMeu && pet.ativo;
          });
          setPetsDisponiveis(filtrados);
        }
      } catch (erro) {
        console.error(erro);
      } finally {
        setCarregando(false);
      }
    };
    buscarPetsDiscover();
  }, [usuarioAtual?.id]); // Removido pets e adocoes para evitar oscilações visuais durante a busca periódica de 5 segundos

  const petAtual = petsDisponiveis[0];

  const avancarPet = () => {
    setPetsDisponiveis(petsAnteriores => petsAnteriores.slice(1));
  };

  const darLike = async () => {
    if (petAtual) {
      setPetMatch(petAtual);
      exibirNotificacao('Você curtiu o pet!');
      
      // Remove da lista em segundo plano para o próximo aparecer atrás da janela de match
      avancarPet();

      // Envia a ação de curtir/passar para a API
      await apiMatches.swipeUsuario({
        usuario_id: usuarioAtual.id,
        pet_id: petAtual.id,
        tipo: 'like'
      });
    }
  };

  const darDislike = async () => {
    if (petAtual) {
      avancarPet();
      exibirNotificacao('Você passou deste pet.');
      await apiMatches.swipeUsuario({
        usuario_id: usuarioAtual.id,
        pet_id: petAtual.id,
        tipo: 'pass'
      });
    }
  };

  const aoContinuar = () => {
    setPetMatch(null);
  };

  const aoAdotar = () => {
    if (petMatch) {
      criarAdocao(petMatch.id);
      setPetMatch(null);
    }
  };

  if (carregando) {
    return (
      <div className="fade-in">
        <CabecalhoPagina titulo="Encontre seu Match" subtitulo="Deslize para encontrar seu novo melhor amigo" />
        <div style={{ textAlign: 'center', padding: '100px 40px', color: '#6b7280' }}>
          <Heart size={48} color="#d16b47" style={{ margin: '0 auto 16px', animation: 'pulse 1.5s infinite' }} />
          <p style={{ fontWeight: 600, fontSize: '1.2rem', color: '#111827' }}>Buscando pets na sua região...</p>
          <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>Aguarde um momento, estamos preparando tudo para você!</p>
        </div>
      </div>
    );
  }

  if (petsDisponiveis.length === 0) {
    return (
      <div className="fade-in">
        <CabecalhoPagina titulo="Encontre seu Match" subtitulo="Deslize para encontrar seu novo melhor amigo" />
        <div style={{ textAlign: 'center', padding: '60px 40px', color: '#6b7280' }}>
          <Heart size={48} color="#e5e7eb" style={{ margin: '0 auto 16px' }} />
          <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>Você viu todos os pets disponíveis!</p>
          <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>Volte mais tarde para encontrar novos amigos.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {petMatch && (
        <SobreposicaoMatch
          petMatch={petMatch}
          usuarioAtual={usuarioAtual}
          aoAdotar={aoAdotar}
          aoContinuar={aoContinuar}
        />
      )}

      <CabecalhoPagina titulo="Encontre seu Match" subtitulo="Deslize para encontrar seu novo melhor amigo" />

      {petAtual && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '500px', marginBottom: '40px' }}>
          <div className="premium-card" style={{ maxWidth: '500px', width: '100%', textAlign: 'center' }}>
            <img
              src={petAtual.img}
              alt={petAtual.name}
              style={{ width: '100%', height: '300px', borderRadius: '24px', objectFit: 'cover', marginBottom: '24px' }}
            />
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '20px' }}>
              {petAtual.name}
            </h2>

            {/* Grade de informações com labels */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px', textAlign: 'left' }}>
              <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '10px 12px' }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>ONG Responsável</p>
                <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111827' }}>{petAtual.instituicao_nome || 'Não informada'}</p>
              </div>
              <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '10px 12px' }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>Espécie / Raça</p>
                <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111827' }}>{petAtual.type || 'Não informado'}</p>
              </div>
              <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '10px 12px' }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>Idade</p>
                <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111827' }}>{petAtual.age || 'Não informada'}</p>
              </div>
              {petAtual.cor && (
                <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '10px 12px' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>Cor</p>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111827' }}>{petAtual.cor}</p>
                </div>
              )}
            </div>

            <div style={{ textAlign: 'left', marginBottom: '32px' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Sobre o pet</p>
              <p style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: 1.6 }}>
                {petAtual.desc || 'Nenhuma descrição fornecida.'}
              </p>
            </div>

            {/* Botões de ação ou Aviso de Pet Próprio */}
            {(petAtual.instituicao_id === usuarioAtual.instituicao_id || (petAtual.owner_id && (petAtual.owner_id === usuarioAtual.id || petAtual.owner_id === usuarioAtual.instituicao_id))) ? (
              <div style={{ background: '#f0fdf4', color: '#166534', padding: '20px', borderRadius: '16px', border: '1px solid #bbf7d0' }}>
                <p style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '16px' }}>
                  Este pet pertence à sua ONG.
                </p>
                <button
                  onClick={avancarPet}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    border: 'none',
                    background: '#22c55e',
                    color: 'white',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(evento) => { evento.currentTarget.style.background = '#16a34a'; }}
                  onMouseLeave={(evento) => { evento.currentTarget.style.background = '#22c55e'; }}
                >
                  Ver próximo
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <button
                  onClick={darDislike}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    border: '2px solid #ef4444',
                    background: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(evento) => {
                    evento.currentTarget.style.background = '#fef2f2';
                    evento.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(evento) => {
                    evento.currentTarget.style.background = 'white';
                    evento.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <X size={28} color="#ef4444" />
                </button>
                <button
                  onClick={darLike}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    border: 'none',
                    background: '#1f3024',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(evento) => {
                    evento.currentTarget.style.transform = 'scale(1.1)';
                    evento.currentTarget.style.boxShadow = '0 12px 28px rgba(31, 48, 36, 0.3)';
                  }}
                  onMouseLeave={(evento) => {
                    evento.currentTarget.style.transform = 'scale(1)';
                    evento.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Heart size={28} color="#d16b47" fill="#d16b47" />
                </button>
              </div>
            )}

            {/* Indicador de progresso */}
            <div style={{ marginTop: '32px', fontSize: '0.85rem', color: '#6b7280' }}>
              Restam {petsDisponiveis.length} pets disponíveis na sua região
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Descobrir;
