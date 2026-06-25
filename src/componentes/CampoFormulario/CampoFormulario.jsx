import React from 'react';
import './campo-formulario.css';

const CampoFormulario = ({
  rotulo,
  tipo = 'text',
  placeholder,
  valor,
  aoMudar,
  aoBlur,
  icone: Icone,
  acaoDireita,
  obrigatorio = false,
  tamanhoMinimo,
  estiloRotulo,
  erro,
  name,
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
          name={name}
          type={tipo}
          placeholder={placeholder}
          className={`campo-entrada ${erro ? 'campo-entrada-erro' : ''}`}
          value={valor}
          onChange={aoMudar}
          onBlur={aoBlur}
          required={obrigatorio}
          minLength={tamanhoMinimo}
        />
        {acaoDireita && (
          <button type="button" className="campo-acao" onClick={acaoDireita.aoClicar}>
            {acaoDireita.icone}
          </button>
        )}
      </div>
      {erro && <span className="campo-erro-mensagem">{erro}</span>}
    </div>
  );
};

export default CampoFormulario;
