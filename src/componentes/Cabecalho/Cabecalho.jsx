import React from 'react';
import './cabecalho.css';

const Cabecalho = ({ titulo, subtitulo, estiloContainer }) => {
  return (
    <div style={estiloContainer}>
      <h2
        className="titulo-cabecalho"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {titulo}
      </h2>
      {subtitulo && <p className="subtitulo-cabecalho">{subtitulo}</p>}
    </div>
  );
};

export default Cabecalho;
