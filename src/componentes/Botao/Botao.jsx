import React from 'react';
import './botao.css';

const Botao = ({
  tipo = 'button',
  variante = 'primario',
  children,
  aoClicar,
  estilo = {},
  desabilitado = false,
}) => {
  const classe = variante === 'primario' ? 'botao-primario' : 'botao-secundario';

  return (
    <button
      type={tipo}
      className={classe}
      onClick={aoClicar}
      style={estilo}
      disabled={desabilitado}
    >
      {children}
    </button>
  );
};

export default Botao;
