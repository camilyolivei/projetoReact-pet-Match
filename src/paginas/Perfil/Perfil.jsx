import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Edit, Camera, Save, Trash2 } from 'lucide-react';
import CabecalhoPagina from '../../componentes/CabecalhoPagina/CabecalhoPagina.jsx';
import { AvatarUsuario } from '../../componentes/SobreposicaoMatch/SobreposicaoMatch.jsx';
import { apiEnderecos } from '../../servicos/api.js';

const Perfil = ({ usuarioAtual, atualizarPerfil, excluirPerfil, exibirNotificacao }) => {
  const [editando, setEditando] = useState(false);
  const [dadosEdicao, setDadosEdicao] = useState({
    name: usuarioAtual?.name || '',
    email: usuarioAtual?.email || '',
    telefone: usuarioAtual?.telefone || '',
    avatar: usuarioAtual?.avatar || null,
    cnpj: usuarioAtual?.cnpj || '',
    linkSite: usuarioAtual?.link_site || '',
    descricao: usuarioAtual?.descricao || '',
    rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', cep: ''
  });
  const [enderecoFormatado, setEnderecoFormatado] = useState(usuarioAtual?.endereco || '');

  useEffect(() => {
    if (usuarioAtual) {
      setDadosEdicao(dadosPerfil => ({
        ...dadosPerfil,
        name: usuarioAtual.name || '',
        email: usuarioAtual.email || '',
        telefone: usuarioAtual.telefone || '',
        avatar: usuarioAtual.avatar || null,
        cnpj: usuarioAtual.cnpj || '',
        linkSite: usuarioAtual.link_site || '',
        descricao: usuarioAtual.descricao || ''
      }));

      // Se for ONG e tiver endereco_id, busca na API
      if (usuarioAtual.isOng && usuarioAtual.endereco_id) {
        const buscarEndereco = async () => {
          const res = await apiEnderecos.obter(usuarioAtual.endereco_id);
          if (res.ok) {
            const end = res.dados;
            setDadosEdicao(dadosAnteriores => ({
              ...dadosAnteriores,
              rua: end.rua || '', numero: end.numero || '', complemento: end.complemento || '',
              bairro: end.bairro || '', cidade: end.cidade || '', estado: end.estado || '', cep: end.cep || ''
            }));
            setEnderecoFormatado(`${end.rua || ''}, ${end.numero || ''} - ${end.bairro || ''}, ${end.cidade || ''}/${end.estado || ''}`);
          }
        };
        buscarEndereco();
      } else if (usuarioAtual.endereco && typeof usuarioAtual.endereco === 'object') {
        const end = usuarioAtual.endereco;
        setDadosEdicao(dadosAnteriores => ({
          ...dadosAnteriores,
          rua: end.rua || '', numero: end.numero || '', complemento: end.complemento || '',
          bairro: end.bairro || '', cidade: end.cidade || '', estado: end.estado || '', cep: end.cep || ''
        }));
        setEnderecoFormatado(`${end.rua || ''}, ${end.numero || ''} - ${end.bairro || ''}, ${end.cidade || ''}/${end.estado || ''}`);
      }
    }
  }, [usuarioAtual]);

  // Troca de foto usando label + input (sem useRef)
  const aoTrocarFoto = (evento) => {
    const arquivo = evento.target.files?.[0];
    if (!arquivo) return;
    if (arquivo.size > 5 * 1024 * 1024) return exibirNotificacao('Imagem muito grande. Máximo 5MB.', 'erro');
    const leitor = new FileReader();
    leitor.onload = (eventoLeitor) => setDadosEdicao(dadosAnteriores => ({ ...dadosAnteriores, avatar: eventoLeitor.target.result }));
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

        {!editando ? (
          <>
            <h3 style={{ fontSize: '2rem', marginBottom: '8px', fontFamily: "'Poppins', sans-serif" }}>{usuarioAtual?.name}</h3>
            <p style={{ color: '#6b7280', marginBottom: '32px' }}>{usuarioAtual?.email}</p>
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              <div style={{ padding: '20px', borderRadius: '20px', background: '#f9fafb', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Phone size={20} color="#6b7280" />
                <span style={{ flex: 1, minWidth: 0, wordBreak: 'break-word' }}>{usuarioAtual?.telefone || 'Telefone não cadastrado'}</span>
              </div>
              <div style={{ padding: '20px', borderRadius: '20px', background: '#f9fafb', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <MapPin size={20} color="#6b7280" />
                <span style={{ flex: 1, minWidth: 0, wordBreak: 'break-word' }}>{enderecoFormatado || 'Endereço não cadastrado'}</span>
              </div>
              
              {usuarioAtual?.isOng && (
                <>
                  {usuarioAtual.cnpj && (
                    <div style={{ padding: '20px', borderRadius: '20px', background: '#f9fafb', display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontWeight: 700, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>CNPJ</span>
                      <span style={{ flex: 1, minWidth: 0, wordBreak: 'break-word' }}>{usuarioAtual.cnpj}</span>
                    </div>
                  )}
                  {usuarioAtual.link_site && (
                    <div style={{ padding: '20px', borderRadius: '20px', background: '#f9fafb', display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontWeight: 700, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Site/Rede</span>
                      <a href={usuarioAtual.link_site.startsWith('http') ? usuarioAtual.link_site : `https://${usuarioAtual.link_site}`} target="_blank" rel="noreferrer" style={{ flex: 1, minWidth: 0, wordBreak: 'break-all', color: '#d16b47', textDecoration: 'underline' }}>{usuarioAtual.link_site}</a>
                    </div>
                  )}
                  {usuarioAtual.descricao && (
                    <div style={{ padding: '20px', borderRadius: '20px', background: '#f9fafb', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{ fontWeight: 700, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Descrição da ONG</span>
                      <span style={{ lineHeight: 1.6, fontSize: '0.95rem', wordBreak: 'break-word' }}>{usuarioAtual.descricao}</span>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="botoes-grupo-responsive">
              <button className="btn-outline-premium" style={{ marginTop: 0, flex: 1 }} onClick={() => setEditando(true)}>
                <Edit size={16} /> Editar Perfil Completo
              </button>
              <button 
                className="btn-outline-premium"
                style={{ marginTop: 0, flex: 1, background: 'rgba(239,68,68,0.05)', border: '1.5px solid #fca5a5', color: '#ef4444' }}
                onClick={() => {
                  if(window.confirm('Tem certeza que deseja excluir sua conta permanentemente? Esta ação não pode ser desfeita.')) {
                    excluirPerfil();
                  }
                }}
                onMouseOver={evento => { evento.currentTarget.style.background = '#fee2e2'; evento.currentTarget.style.borderColor = '#ef4444'; }}
                onMouseOut={evento => { evento.currentTarget.style.background = 'rgba(239,68,68,0.05)'; evento.currentTarget.style.borderColor = '#fca5a5'; }}
              >
                <Trash2 size={16} /> Excluir Conta
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'left' }}>
            <h4 style={{ marginBottom: '16px', fontSize: '1.1rem', fontWeight: 600, color: '#1f3024' }}>Informações Básicas</h4>
            <div className="campo-wrapper">
              <label className="campo-rotulo">E-mail (Não editável)</label>
              <input className="campo-entrada" style={{ padding: '0 24px', opacity: 0.7 }} value={dadosEdicao.email} disabled />
            </div>
            {[{ rotulo: usuarioAtual?.isOng ? 'Nome da ONG' : 'Nome Completo', chave: 'name' }, { rotulo: 'Telefone', chave: 'telefone' }].map(({ rotulo, chave }) => (
              <div className="campo-wrapper" key={chave}>
                <label className="campo-rotulo">{rotulo}</label>
                <input className="campo-entrada" style={{ padding: '0 24px' }} value={dadosEdicao[chave]}
                  onChange={evento => setDadosEdicao({ ...dadosEdicao, [chave]: evento.target.value })} />
              </div>
            ))}

            {usuarioAtual?.isOng && (
              <>
                <h4 style={{ marginTop: '32px', marginBottom: '16px', fontSize: '1.1rem', fontWeight: 600, color: '#1f3024' }}>Dados da Instituição</h4>
                {[{ rotulo: 'CNPJ', chave: 'cnpj' }, { rotulo: 'Site ou Rede Social', chave: 'linkSite' }].map(({ rotulo, chave }) => (
                  <div className="campo-wrapper" key={chave}>
                    <label className="campo-rotulo">{rotulo}</label>
                    <input className="campo-entrada" style={{ padding: '0 24px' }} value={dadosEdicao[chave]}
                      onChange={evento => setDadosEdicao({ ...dadosEdicao, [chave]: evento.target.value })} />
                  </div>
                ))}
                <div className="campo-wrapper">
                  <label className="campo-rotulo">Descrição da ONG</label>
                  <textarea className="campo-entrada" style={{ padding: '16px 24px', height: '100px', resize: 'none' }} value={dadosEdicao.descricao}
                    onChange={evento => setDadosEdicao({ ...dadosEdicao, descricao: evento.target.value })} />
                </div>
              </>
            )}

            <h4 style={{ marginTop: '32px', marginBottom: '16px', fontSize: '1.1rem', fontWeight: 600, color: '#1f3024' }}>Endereço Completo</h4>
                <div className="grid-responsivo-perfil">
                  <div className="campo-wrapper"><label className="campo-rotulo">CEP</label><input className="campo-entrada" style={{ padding: '0 20px' }} value={dadosEdicao.cep} onChange={evento => setDadosEdicao({ ...dadosEdicao, cep: evento.target.value })} /></div>
                  <div className="campo-wrapper"><label className="campo-rotulo">Estado (UF)</label><input className="campo-entrada" style={{ padding: '0 20px' }} value={dadosEdicao.estado} onChange={evento => setDadosEdicao({ ...dadosEdicao, estado: evento.target.value })} /></div>
                </div>
                <div className="grid-responsivo-perfil">
                  <div className="campo-wrapper"><label className="campo-rotulo">Cidade</label><input className="campo-entrada" style={{ padding: '0 20px' }} value={dadosEdicao.cidade} onChange={evento => setDadosEdicao({ ...dadosEdicao, cidade: evento.target.value })} /></div>
                  <div className="campo-wrapper"><label className="campo-rotulo">Bairro</label><input className="campo-entrada" style={{ padding: '0 20px' }} value={dadosEdicao.bairro} onChange={evento => setDadosEdicao({ ...dadosEdicao, bairro: evento.target.value })} /></div>
                </div>
                <div className="grid-responsivo-perfil-rua">
                  <div className="campo-wrapper"><label className="campo-rotulo">Rua/Avenida</label><input className="campo-entrada" style={{ padding: '0 20px' }} value={dadosEdicao.rua} onChange={evento => setDadosEdicao({ ...dadosEdicao, rua: evento.target.value })} /></div>
                  <div className="campo-wrapper"><label className="campo-rotulo">Número</label><input className="campo-entrada" style={{ padding: '0 20px' }} value={dadosEdicao.numero} onChange={evento => setDadosEdicao({ ...dadosEdicao, numero: evento.target.value })} /></div>
                </div>
                <div className="campo-wrapper"><label className="campo-rotulo">Complemento</label><input className="campo-entrada" style={{ padding: '0 24px' }} value={dadosEdicao.complemento} onChange={evento => setDadosEdicao({ ...dadosEdicao, complemento: evento.target.value })} /></div>
            <div className="botoes-grupo-responsive" style={{ marginTop: '24px' }}>
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
