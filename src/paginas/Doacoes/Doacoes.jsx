import React, { useState, useEffect } from 'react';
import { Gift, ChevronDown } from 'lucide-react';
import { apiInstituicoes } from '../../servicos/api.js';
import CabecalhoPagina from '../../componentes/CabecalhoPagina/CabecalhoPagina.jsx';

const Doacoes = ({ setTela, usuarioAtual, fazerDoacao, exibirNotificacao }) => {
  const [quantidade, setQuantidade] = useState('');
  const [tipo, setTipo] = useState('dinheiro');
  const [instituicoes, setInstituicoes] = useState([]);
  const [instituicaoSelecionada, setInstituicaoSelecionada] = useState('');
  const [processando, setProcessando] = useState(false);

  useEffect(() => {
    async function carregarInstituicoes() {
      const resposta = await apiInstituicoes.listar();
      if (resposta.ok && Array.isArray(resposta.dados)) {
        setInstituicoes(resposta.dados);
        if (resposta.dados.length > 0) {
          setInstituicaoSelecionada(resposta.dados[0].id.toString());
        }
      }
    }
    carregarInstituicoes();
  }, []);

  const aoEnviar = async (e) => {
    e.preventDefault();
    const valor = parseFloat(quantidade);
    if (!valor || valor <= 0) return exibirNotificacao('Insira uma quantidade válida.', 'erro');
    if (!instituicaoSelecionada) return exibirNotificacao('Selecione uma ONG.', 'erro');
    
    setProcessando(true);
    
    // Mapeamos os tipos para IDs fictícios apenas para enviar à API
    const mapTipos = { dinheiro: 1, racao: 2, remedio: 3, brinquedo: 4 };
    
    await fazerDoacao({ 
      usuario_id: usuarioAtual.id, 
      instituicao_id: Number(instituicaoSelecionada), 
      tipo_doacao_id: mapTipos[tipo], 
      quantidade: valor, 
      status_entrega: 'pendente' 
    });
    
    setProcessando(false);
    exibirNotificacao(`Sua doação de ${tipo} foi computada com sucesso! ♥`);
    setQuantidade('');
    setTela('painel');
  };

  return (
    <div className="fade-in">
      <CabecalhoPagina titulo="Central de Doações" subtitulo="Faça a diferença na vida de centenas de animais" />
      
      <div className="premium-card" style={{ maxWidth: '600px', margin: '40px auto', padding: '40px', background: '#ffffff', borderRadius: '24px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #fdf4f0 0%, #fefcfb 100%)', color: '#d16b47', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 16px -4px rgba(209, 107, 71, 0.2)' }}>
            <Gift size={36} strokeWidth={2.5} />
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '8px', fontFamily: "'Poppins', sans-serif", color: '#111827' }}>Apoie uma Causa</h3>
          <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Sua contribuição vai direto para a instituição escolhida e ajuda a fornecer comida, abrigo e tratamentos médicos.
          </p>
        </div>

        <form onSubmit={aoEnviar}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left' }}>
              ONG Destino
            </label>
            <div className="campo-wrapper" style={{ position: 'relative' }}>
              <select 
                className="campo-entrada" 
                value={instituicaoSelecionada} 
                onChange={e => setInstituicaoSelecionada(e.target.value)}
                style={{ appearance: 'none', cursor: 'pointer', paddingRight: '40px', paddingLeft: '16px' }}
                required
              >
                <option value="" disabled>Selecione a ONG...</option>
                {instituicoes.map(inst => (
                  <option key={inst.id} value={inst.id}>{inst.nome}</option>
                ))}
              </select>
              <ChevronDown size={18} color="#6b7280" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left' }}>
              Tipo de Contribuição
            </label>
            <div className="campo-wrapper" style={{ position: 'relative' }}>
              <select 
                className="campo-entrada" 
                value={tipo} 
                onChange={e => setTipo(e.target.value)}
                style={{ appearance: 'none', cursor: 'pointer', paddingRight: '40px', paddingLeft: '16px' }}
              >
                <option value="dinheiro">Dinheiro (R$)</option>
                <option value="racao">Sacos de Ração (kg)</option>
                <option value="remedio">Remédios (unid.)</option>
                <option value="brinquedo">Brinquedos (unid.)</option>
              </select>
              <ChevronDown size={18} color="#6b7280" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left' }}>
              Quantidade / Valor
            </label>
            <div className="campo-wrapper">
              <input 
                className="campo-entrada" 
                style={{ paddingLeft: '16px' }}
                placeholder={tipo === 'dinheiro' ? "Ex: 50.00" : "Digite a quantidade"} 
                value={quantidade} 
                onChange={e => setQuantidade(e.target.value)}
                type="number" step="0.01" min="0.01" required 
              />
            </div>
          </div>

          <button type="submit" className="btn-submit-premium" style={{ width: '100%', padding: '16px', fontSize: '1.1rem', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} disabled={processando}>
            <Gift size={20} /> {processando ? 'Processando doação...' : 'Confirmar Doação'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Doacoes;
