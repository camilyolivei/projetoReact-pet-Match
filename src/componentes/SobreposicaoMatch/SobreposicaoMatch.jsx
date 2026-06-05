import React from 'react';
import { Heart, User, X } from 'lucide-react';
import { createPortal } from 'react-dom';

export const AvatarUsuario = ({ usuario, tamanho = 150, estilo = {} }) => {
  if (usuario?.avatar) {
    return (
      <img
        src={usuario.avatar}
        alt="Foto de perfil"
        style={{ width: tamanho, height: tamanho, borderRadius: '50%', objectFit: 'cover', ...estilo }}
      />
    );
  }
  return (
    <div style={{ width: tamanho, height: tamanho, borderRadius: '50%', background: '#1f3024', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fdfcf9', flexShrink: 0, ...estilo }}>
      <User size={tamanho * 0.4} />
    </div>
  );
};

const SobreposicaoMatch = ({ petMatch, usuarioAtual, aoAdotar, aoContinuar }) => {
  return createPortal(
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
      background: 'rgba(31, 48, 36, 0.65)', zIndex: 99999, display: 'flex', 
      alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)'
    }} className="fade-in">
      <div style={{
        background: '#fdfcf9', width: '90%', maxWidth: '440px', borderRadius: '32px',
        padding: '48px 32px 32px 32px', position: 'relative', display: 'flex', flexDirection: 'column',
        alignItems: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        border: '1px solid rgba(31, 48, 36, 0.15)'
      }}>
        
        <button 
          onClick={aoContinuar}
          style={{ position: 'absolute', top: '20px', right: '20px', background: '#f3f4f6', border: 'none', borderRadius: '50%', padding: '10px', cursor: 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onMouseOver={e => e.currentTarget.style.background = '#e5e7eb'}
          onMouseOut={e => e.currentTarget.style.background = '#f3f4f6'}
        >
          <X size={20} color="#4b5563" />
        </button>

        <h2 style={{ fontSize: '2.4rem', fontFamily: "'Poppins', sans-serif", fontWeight: 800, color: '#1f3024', margin: '0 0 12px 0', textAlign: 'center' }}>
          Deu Match!
        </h2>
        <p style={{ fontSize: '1.1rem', color: '#6b7280', textAlign: 'center', marginBottom: '40px', maxWidth: '90%', lineHeight: '1.5' }}>
          Você e <strong style={{ color: '#3a5c42', fontWeight: 700 }}>{petMatch.name}</strong> combinam perfeitamente.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: '100%', marginBottom: '48px' }}>
          <div style={{ zIndex: 2, marginRight: '-15px' }}>
            <AvatarUsuario usuario={usuarioAtual} tamanho={120} estilo={{ 
              border: '6px solid #fdfcf9', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' 
            }} />
          </div>
          
          <div style={{ zIndex: 1, marginLeft: '-15px' }}>
            <img src={petMatch.img} alt={petMatch.name} style={{ 
              width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', 
              border: '6px solid #fdfcf9', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' 
            }} />
          </div>

          <div style={{ 
            width: '48px', height: '48px', borderRadius: '50%', 
            background: '#1f3024', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 16px rgba(31, 48, 36, 0.3)', 
            position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 10,
            border: '4px solid #fdfcf9'
          }}>
            <Heart size={20} color="#fdfcf9" fill="#fdfcf9" />
          </div>
        </div>

        <button 
          style={{ 
            width: '100%', height: '56px', fontSize: '1.05rem', fontWeight: 600, borderRadius: '28px',
            background: '#1f3024', color: 'white', border: 'none', cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(31, 48, 36, 0.2)', transition: 'transform 0.2s, background 0.2s',
            marginBottom: '12px'
          }} 
          onClick={aoAdotar}
          onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = '#3a5c42'; }}
          onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = '#1f3024'; }}
        >
          Quero Adotar
        </button>
        
        <button 
          style={{ 
            width: '100%', height: '56px', fontSize: '1.05rem', fontWeight: 600, borderRadius: '28px',
            background: 'transparent', color: '#6b7280', border: 'none', cursor: 'pointer',
            transition: 'color 0.2s, background 0.2s'
          }} 
          onClick={aoContinuar}
          onMouseOver={e => { e.currentTarget.style.color = '#1f3024'; e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; }}
          onMouseOut={e => { e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.background = 'transparent'; }}
        >
          Continuar deslizando
        </button>

      </div>
    </div>,
    document.body
  );
};

export default SobreposicaoMatch;
