import React, { useState } from 'react';
import { Camera, ChevronRight } from 'lucide-react';
import CabecalhoPagina from '../../componentes/CabecalhoPagina/CabecalhoPagina.jsx';

const FormularioPet = ({ petEditando, setPetEditando, usuarioAtual, setTela, adicionarPet, atualizarPet, exibirNotificacao }) => {
  const [dados, setDados] = useState(
    petEditando || { name: '', type: '', age: '', desc: '', cor: '', vacinado: true, castrado: true, img: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800' }
  );
  const [salvando, setSalvando] = useState(false);

  const aoEnviar = async (e) => {
    e.preventDefault();
    if (!dados.name || !dados.age) return exibirNotificacao('Preencha os campos obrigatórios!', 'erro');
    setSalvando(true);
    if (petEditando) {
      await atualizarPet(petEditando.id, dados);
      exibirNotificacao(`${dados.name} atualizado com sucesso!`);
    } else {
      await adicionarPet({ ...dados, owner_id: usuarioAtual.id });
      exibirNotificacao(`${dados.name} cadastrado com sucesso!`);
    }
    setSalvando(false);
    setPetEditando(null);
    setTela('pets');
  };

  const campo = (rotulo, chave, placeholder) => (
    <div className="campo-wrapper">
      <label className="campo-rotulo">{rotulo}</label>
      <input className="campo-entrada" style={{ padding: '0 24px' }} placeholder={placeholder}
        value={dados[chave]} onChange={e => setDados({ ...dados, [chave]: e.target.value })} />
    </div>
  );

  return (
    <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <button className="btn-texto" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}
        onClick={() => { setPetEditando(null); setTela('pets'); }}>
        <ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} /> Voltar para lista
      </button>

      <CabecalhoPagina
        titulo={petEditando ? 'Editar Pet' : 'Cadastrar Pet'}
        subtitulo={petEditando ? 'Atualize as informações do seu animal.' : 'Preencha os dados do animal para encontrar um match.'}
      />

      <div className="premium-card">
        <div style={{ background: '#f9fafb', border: '2px dashed #e5e7eb', borderRadius: '24px', padding: '48px', textAlign: 'center', marginBottom: '32px' }}>
          <Camera size={48} color="#9ca3af" style={{ marginBottom: '16px' }} />
          <p style={{ fontWeight: 600 }}>Upload de Imagem</p>
          <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>Arraste ou clique para selecionar</p>
        </div>

        <form onSubmit={aoEnviar}>
          <div className="form-grid-premium">
            {campo('Nome do Pet', 'name', 'Ex: Rex')}
            {campo('Espécie / Raça', 'type', 'Ex: Golden Retriever')}
          </div>
          <div className="form-grid-premium">
            {campo('Idade', 'age', 'Ex: 2 anos')}
            {campo('Cor', 'cor', 'Ex: Caramelo')}
          </div>
          <div className="campo-wrapper">
            <label className="campo-rotulo">Sobre ele</label>
            <textarea className="campo-entrada" style={{ padding: '20px 24px', height: '120px', resize: 'none' }}
              placeholder="Conte um pouco sobre a personalidade..."
              value={dados.desc} onChange={e => setDados({ ...dados, desc: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
            <button type="submit" className="btn-submit-premium" style={{ marginTop: 0 }} disabled={salvando}>
              {salvando ? 'Salvando...' : petEditando ? 'Salvar Alterações' : 'Salvar Cadastro'}
            </button>
            <button type="button" className="btn-outline-premium" style={{ marginTop: 0 }}
              onClick={() => { setPetEditando(null); setTela('pets'); }}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioPet;
