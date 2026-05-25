import React from 'react';
import './campo-formulario.css';

const CampoFormulario = ({
  rotulo,
  tipo = 'text',
  placeholder,
  valor,
  aoMudar,
  icone: Icone,
  acaoDireita,
  obrigatorio = false,
  tamanhoMinimo,
  estiloRotulo,
}) => {
  return (
    <div className="campo-wrapper">
      {rotulo && (
        <label className="campo-rotulo" style={estiloRotulo}>
          {rotulo}
        </label>
      )}
      <div className="campo-grupo">
        {Icone && <Icone className="campo-icone" size={17} />}
        <input
          type={tipo}
          placeholder={placeholder}
          className="campo-entrada"
          value={valor}
          onChange={aoMudar}
          required={obrigatorio}
          minLength={tamanhoMinimo}
        />
        {acaoDireita && (
          <button type="button" className="campo-acao" onClick={acaoDireita.aoClicar}>
            {acaoDireita.icone}
          </button>
        )}
      </div>
    </div>
  );
};

export default CampoFormulario;
