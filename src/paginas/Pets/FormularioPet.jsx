import React, { useState } from 'react';
import { Camera, ChevronRight } from 'lucide-react';
import CabecalhoPagina from '../../componentes/CabecalhoPagina/CabecalhoPagina.jsx';
import CampoFormulario from '../../componentes/CampoFormulario/CampoFormulario.jsx';
import { useForm, VALIDADORES_REGEX } from '../../hooks/useForm.js';

const regrasValidacaoPet = {
  name: {
    required: true,
    mensagemErroObrigatorio: 'O nome do pet é obrigatório.',
    regex: VALIDADORES_REGEX.letrasEAcentos,
    mensagemErroRegex: 'O nome deve conter apenas letras.'
  },
  type: {
    required: true,
    mensagemErroObrigatorio: 'A espécie / raça é obrigatória.',
    regex: VALIDADORES_REGEX.letrasEAcentos,
    mensagemErroRegex: 'A espécie / raça deve conter apenas letras.'
  },
  age: {
    required: true,
    mensagemErroObrigatorio: 'A idade aproximada é obrigatória.'
  },
  cor: {
    required: true,
    mensagemErroObrigatorio: 'A cor é obrigatória.',
    regex: VALIDADORES_REGEX.letrasEAcentos,
    mensagemErroRegex: 'A cor deve conter apenas letras.'
  },
  desc: {
    required: false
  }
};

const FormularioPet = ({ petEditando, setPetEditando, usuarioAtual, setTela, adicionarPet, atualizarPet, exibirNotificacao }) => {
  const [salvando, setSalvando] = useState(false);

  const {
    valores: dados,
    erros,
    handleChange,
    handleBlur,
    handleSubmit: aoEnviar,
    setValores: setDados
  } = useForm(
    petEditando || { name: '', type: '', age: '', desc: '', cor: '', vacinado: true, castrado: true, img: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800' },
    regrasValidacaoPet,
    async (valoresFormulario) => {
      setSalvando(true);
      if (petEditando) {
        await atualizarPet(petEditando.id, valoresFormulario);
        exibirNotificacao(`${valoresFormulario.name} atualizado com sucesso!`);
      } else {
        await adicionarPet({ ...valoresFormulario, owner_id: usuarioAtual.instituicao_id || usuarioAtual.id });
        exibirNotificacao(`${valoresFormulario.name} cadastrado com sucesso!`);
      }
      setSalvando(false);
      setPetEditando(null);
      setTela('pets');
    }
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
            <CampoFormulario name="name" rotulo="Nome do Pet" placeholder="Ex: Rex" valor={dados.name} aoMudar={handleChange} aoBlur={handleBlur} erro={erros.name} obrigatorio />
            <CampoFormulario name="type" rotulo="Espécie / Raça" placeholder="Ex: Golden Retriever" valor={dados.type} aoMudar={handleChange} aoBlur={handleBlur} erro={erros.type} obrigatorio />
          </div>
          <div className="form-grid-premium">
            <CampoFormulario name="age" rotulo="Idade" placeholder="Ex: 2 anos" valor={dados.age} aoMudar={handleChange} aoBlur={handleBlur} erro={erros.age} obrigatorio />
            <CampoFormulario name="cor" rotulo="Cor" placeholder="Ex: Caramelo" valor={dados.cor} aoMudar={handleChange} aoBlur={handleBlur} erro={erros.cor} obrigatorio />
          </div>
          <div className="campo-wrapper" style={{ marginTop: '16px' }}>
            <label className="campo-rotulo">Sobre ele</label>
            <textarea 
              name="desc"
              className={`campo-entrada ${erros.desc ? 'campo-entrada-erro' : ''}`} 
              style={{ padding: '20px 24px', height: '120px', resize: 'none' }}
              placeholder="Conte um pouco sobre a personalidade..."
              value={dados.desc} 
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {erros.desc && <span className="campo-erro-mensagem">{erros.desc}</span>}
          </div>
          <div style={{ display: 'flex', gap: '24px', marginTop: '16px', marginBottom: '24px', background: 'rgba(209,107,71,0.05)', padding: '16px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="checkbox" 
                id="vacinado" 
                name="vacinado"
                checked={dados.vacinado} 
                onChange={handleChange}
                style={{ width: '18px', height: '18px', accentColor: '#d16b47', cursor: 'pointer' }}
              />
              <label htmlFor="vacinado" style={{ cursor: 'pointer', fontWeight: 600, color: '#1f3024' }}>Pet Vacinado</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="checkbox" 
                id="castrado" 
                name="castrado"
                checked={dados.castrado} 
                onChange={handleChange}
                style={{ width: '18px', height: '18px', accentColor: '#d16b47', cursor: 'pointer' }}
              />
              <label htmlFor="castrado" style={{ cursor: 'pointer', fontWeight: 600, color: '#1f3024' }}>Pet Castrado</label>
            </div>
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
