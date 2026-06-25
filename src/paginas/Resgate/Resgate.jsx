import React, { useState, useContext } from 'react';
import { AlertCircle, MapPin, Clock } from 'lucide-react';
import CabecalhoPagina from '../../componentes/CabecalhoPagina/CabecalhoPagina.jsx';
import CampoFormulario from '../../componentes/CampoFormulario/CampoFormulario.jsx';
import { AppContext } from '../../context/AppContext.jsx';
import { useForm } from '../../hooks/useForm.js';

const regrasValidacaoResgate = {
  localizacao: {
    required: true,
    mensagemErroObrigatorio: 'A localização exata é obrigatória.'
  },
  descricao: {
    required: true,
    mensagemErroObrigatorio: 'A descrição da situação é obrigatória.'
  }
};

const Resgate = ({ setTela, reportarResgate, exibirNotificacao }) => {
  const { resgates } = useContext(AppContext);
  const [enviando, setEnviando] = useState(false);

  const {
    valores: dados,
    erros,
    handleChange,
    handleBlur,
    handleSubmit: aoEnviar
  } = useForm({ localizacao: '', descricao: '' }, regrasValidacaoResgate, async (valoresFormulario) => {
    setEnviando(true);
    await reportarResgate(valoresFormulario);
    setEnviando(false);
    exibirNotificacao('Equipe de resgate notificada!');
    setTela('painel');
  });

  const estiloInput = { background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '0 24px' };

  return (
    <div className="fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <CabecalhoPagina titulo="Central de Resgate" subtitulo="Reporte animais em situação de risco" />
      <div className="premium-card" style={{ background: '#1f3024', color: 'white' }}>
        <p style={{ marginBottom: '32px', opacity: 0.8 }}>Sua ação pode salvar uma vida. Preencha os detalhes para notificar nossa equipe de campo.</p>
        <form onSubmit={aoEnviar}>
          <div className="campo-wrapper">
            <label className="campo-rotulo" style={{ color: 'white' }}>Localização Exata</label>
            <input 
              name="localizacao"
              className={`campo-entrada ${erros.localizacao ? 'campo-entrada-erro' : ''}`} 
              style={{ ...estiloInput, border: erros.localizacao ? '1.5px solid #ef4444' : '1px solid rgba(255,255,255,0.2)' }} 
              placeholder="Rua, Bairro, Ponto de Referência"
              value={dados.localizacao} 
              onChange={handleChange} 
              onBlur={handleBlur}
              required 
            />
            {erros.localizacao && <span className="campo-erro-mensagem" style={{ color: '#fca5a5' }}>{erros.localizacao}</span>}
          </div>
          <div className="campo-wrapper">
            <label className="campo-rotulo" style={{ color: 'white' }}>Descrição da Situação</label>
            <textarea 
              name="descricao"
              className={`campo-entrada ${erros.descricao ? 'campo-entrada-erro' : ''}`} 
              style={{ ...estiloInput, border: erros.descricao ? '1.5px solid #ef4444' : '1px solid rgba(255,255,255,0.2)', height: '120px', padding: '20px' }}
              placeholder="O que está acontecendo?"
              value={dados.descricao} 
              onChange={handleChange} 
              onBlur={handleBlur}
              required 
            />
            {erros.descricao && <span className="campo-erro-mensagem" style={{ color: '#fca5a5' }}>{erros.descricao}</span>}
          </div>
          <button type="submit" className="btn-submit-premium" style={{ background: 'white', color: '#1f3024' }} disabled={enviando}>
            <AlertCircle size={18} /> {enviando ? 'Enviando...' : 'Enviar Alerta de Resgate'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Resgate;
