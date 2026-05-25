import React from 'react';
import { Heart } from 'lucide-react';

/**
 * UserAvatar — exibe foto do usuário ou avatar emoji padrão.
 * Reutilizável em Perfil, MatchOverlay, etc.
 */
const UserAvatar = ({ usuario, tamanho = 150, estilo = {} }) => {
  if (usuario?.avatar) {
    return (
      <img
        src={usuario.avatar}
        alt="Foto de perfil"
        style={{
          width: tamanho,
          height: tamanho,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '4px solid #f4f5f1',
          ...estilo,
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: tamanho,
        height: tamanho,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #1f3024 0%, #3a5c42 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: tamanho * 0.4,
        border: '4px solid #f4f5f1',
        userSelect: 'none',
        flexShrink: 0,
        ...estilo,
      }}
    >
      🐾
    </div>
  );
};

/**
 * MatchOverlay — exibido quando ocorre um match durante o swipe.
 */
const MatchOverlay = ({ matchedPet, currentUser, onAdotar, onContinuar }) => (
  <div className="match-overlay fade-in">
    <h1 className="match-titulo">Deu Match! 🎉</h1>
    <p style={{ fontSize: '1.2rem', marginBottom: '48px', color: 'rgba(255,255,255,0.9)' }}>
      Você e {matchedPet.name} combinaram!
    </p>

    <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '64px' }}>
      <UserAvatar
        usuario={currentUser}
        tamanho={140}
        estilo={{ border: '6px solid white', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
      />
      <Heart size={48} color="#d16b47" fill="#d16b47" />
      <img
        src={matchedPet.img}
        alt={matchedPet.name}
        style={{
          width: 140,
          height: 140,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '6px solid white',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        }}
      />
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <button
        className="btn-submit-premium"
        style={{ background: 'white', color: '#1f3024', marginTop: 0 }}
        onClick={onAdotar}
      >
        Adotar Agora
      </button>
      <button
        className="btn-outline-premium"
        style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white', background: 'transparent', marginTop: 0 }}
        onClick={onContinuar}
      >
        Continuar navegando
      </button>
    </div>
  </div>
);

export { UserAvatar };
export default MatchOverlay;
