import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Edit, Camera, Save } from 'lucide-react';
import CabecalhoPagina from '../../componentes/CabecalhoPagina/CabecalhoPagina.jsx';
import { AvatarUsuario } from '../../componentes/SobreposicaoMatch/SobreposicaoMatch.jsx';

const Perfil = ({ usuarioAtual, atualizarPerfil, exibirNotificacao }) => {
  const [editando, setEditando] = useState(false);
  const [dadosEdicao, setDadosEdicao] = useState({
    name: usuarioAtual?.name || '',
    email: usuarioAtual?.email || '',
    telefone: usuarioAtual?.telefone || '',
    endereco: usuarioAtual?.endereco || '',
    avatar: usuarioAtual?.avatar || null,
  });

  // Atualiza dados de edição quando usuário muda
  useEffect(() => {
    if (usuarioAtual) {
      setDadosEdicao({
        name: usuarioAtual.name || '',
        email: usuarioAtual.email || '',
        telefone: usuarioAtual.telefone || '',
        endereco: usuarioAtual.endereco || '',
        avatar: usuarioAtual.avatar || null,
      });
    }
  }, [usuarioAtual]);

  // Troca de foto usando label + input (sem useRef)
  const aoTrocarFoto = (e) => {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    if (arquivo.size > 5 * 1024 * 1024) return exibirNotificacao('Imagem muito grande. Máximo 5MB.', 'erro');
    const leitor = new FileReader();
    leitor.onload = (ev) => setDadosEdicao(d => ({ ...d, avatar: ev.target.result }));
    leitor.readAsDataURL(arquivo);
  };

  const aoSalvar = () => {
    atualizarPerfil(dadosEdicao);
    setEditando(false);
    exibirNotificacao('Perfil atualizado com sucesso!');
  };

  return (
    <div className="fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <CabecalhoPagina titulo="Meu Perfil" subtitulo="Gerencie suas informações pessoais" />

      <div className="premium-card" style={{ textAlign: 'center' }}>
        {/* Avatar — usa label ao invés de useRef */}
        <div style={{ position: 'relative', width: '150px', height: '150px', margin: '0 auto 32px' }}>
          {editando ? (
            <>
              <input
                id="input-foto-perfil"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={aoTrocarFoto}
              />
              <label
                htmlFor="input-foto-perfil"
                style={{ display: 'block', width: 150, height: 150, borderRadius: '50%', cursor: 'pointer', overflow: 'hidden', position: 'relative', border: '4px solid #1f3024' }}
              >
                <AvatarUsuario usuario={{ avatar: dadosEdicao.avatar }} tamanho={150} estilo={{ border: 'none' }} />
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(0,0,0,0.45)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'white', fontSize: '0.8rem', fontWeight: 600 }}>
                  <Camera size={24} />
                  <span>Alterar foto</span>
                </div>
              </label>
            </>
          ) : (
            <>
              <AvatarUsuario usuario={usuarioAtual} tamanho={150} />
              <button onClick={() => setEditando(true)}
                style={{ position: 'absolute', bottom: 4, right: 4, background: '#1f3024', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                <Edit size={18} />
              </button>
            </>
          )}
        </div>

        {/* Visualização */}
        {!editando ? (
          <>
            <h3 style={{ fontSize: '2rem', marginBottom: '8px', fontFamily: "'Poppins', sans-serif" }}>{usuarioAtual?.name}</h3>
            <p style={{ color: '#6b7280', marginBottom: '32px' }}>{usuarioAtual?.email}</p>
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              <div style={{ padding: '20px', borderRadius: '20px', background: '#f9fafb', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <MapPin size={20} color="#6b7280" />
                <span>{usuarioAtual?.endereco || 'Endereço não cadastrado'}</span>
              </div>
              <div style={{ padding: '20px', borderRadius: '20px', background: '#f9fafb', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Phone size={20} color="#6b7280" />
                <span>{usuarioAtual?.telefone || 'Telefone não cadastrado'}</span>
              </div>
            </div>
            <button className="btn-outline-premium" style={{ marginTop: 0 }} onClick={() => setEditando(true)}>
              <Edit size={16} /> Editar Perfil Completo
            </button>
          </>
        ) : (
          /* Formulário de edição */
          <div style={{ textAlign: 'left' }}>
            {[{ rotulo: 'Nome', chave: 'name' }, { rotulo: 'Telefone', chave: 'telefone' }, { rotulo: 'Endereço', chave: 'endereco' }].map(({ rotulo, chave }) => (
              <div className="campo-wrapper" key={chave}>
                <label className="campo-rotulo">{rotulo}</label>
                <input className="campo-entrada" style={{ padding: '0 24px' }} value={dadosEdicao[chave]}
                  onChange={e => setDadosEdicao({ ...dadosEdicao, [chave]: e.target.value })} />
              </div>
            ))}
            <div className="campo-wrapper">
              <label className="campo-rotulo">E-mail</label>
              <input className="campo-entrada" style={{ padding: '0 24px' }} value={dadosEdicao.email} disabled />
            </div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
              <button className="btn-submit-premium" style={{ marginTop: 0 }} onClick={aoSalvar}><Save size={16} /> Salvar</button>
              <button className="btn-outline-premium" style={{ marginTop: 0 }} onClick={() => setEditando(false)}>Cancelar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Perfil;
