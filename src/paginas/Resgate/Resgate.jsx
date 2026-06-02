import React, { useState, useContext } from 'react';
import { AlertCircle, MapPin, Clock } from 'lucide-react';
import CabecalhoPagina from '../../componentes/CabecalhoPagina/CabecalhoPagina.jsx';
import { AppContext } from '../../context/AppContext.jsx';

const Resgate = ({ setTela, reportarResgate, exibirNotificacao }) => {
  const { resgates } = useContext(AppContext);
  const [dados, setDados] = useState({ localizacao: '', descricao: '' });
  const [enviando, setEnviando] = useState(false);

  const aoEnviar = async (e) => {
    e.preventDefault();
    if (!dados.localizacao || !dados.descricao) return exibirNotificacao('Preencha todos os campos!', 'erro');
    setEnviando(true);
    await reportarResgate(dados);
    setEnviando(false);
    exibirNotificacao('Equipe de resgate notificada!');
    setTela('painel');
  };

  const estiloInput = { background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '0 24px' };

  return (
    <div className="fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <CabecalhoPagina titulo="Central de Resgate" subtitulo="Reporte animais em situação de risco" />
      <div className="premium-card" style={{ background: '#1f3024', color: 'white' }}>
        <p style={{ marginBottom: '32px', opacity: 0.8 }}>Sua ação pode salvar uma vida. Preencha os detalhes para notificar nossa equipe de campo.</p>
        <form onSubmit={aoEnviar}>
          <div className="campo-wrapper">
            <label className="campo-rotulo" style={{ color: 'white' }}>Localização Exata</label>
            <input className="campo-entrada" style={estiloInput} placeholder="Rua, Bairro, Ponto de Referência"
              value={dados.localizacao} onChange={e => setDados({ ...dados, localizacao: e.target.value })} required />
          </div>
          <div className="campo-wrapper">
            <label className="campo-rotulo" style={{ color: 'white' }}>Descrição da Situação</label>
            <textarea className="campo-entrada" style={{ ...estiloInput, height: '120px', padding: '20px' }}
              placeholder="O que está acontecendo?"
              value={dados.descricao} onChange={e => setDados({ ...dados, descricao: e.target.value })} required />
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
