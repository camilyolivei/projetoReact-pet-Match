import React from 'react';

/** Cabeçalho padrão reutilizável para todas as páginas internas */
const CabecalhoPagina = ({ titulo, subtitulo }) => (
  <div className="fade-in" style={{ marginBottom: '48px' }}>
    <h1 style={{ fontSize: '2.5rem', color: '#1f3024', fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
      {titulo}
    </h1>
    {subtitulo && (
      <p style={{ fontSize: '1.1rem', color: '#6b7280', marginTop: '8px' }}>{subtitulo}</p>
    )}
  </div>
);

export default CabecalhoPagina;
