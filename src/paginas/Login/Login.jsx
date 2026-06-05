import { useState, useEffect } from 'react';
import { Mail, Lock, EyeOff, Eye, PawPrint, ArrowRight, User, Shield, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import bgDog from '../../assets/dog.png';
import { entrar } from '../../servicos/autenticacao.js';
import CampoFormulario from '../../componentes/CampoFormulario/CampoFormulario.jsx';
import Botao from '../../componentes/Botao/Botao.jsx';
import Notificacao from '../../componentes/Notificacao/Notificacao.jsx';
import './login.css';

const Login = () => {
  const navegar = useNavigate();

  const [dadosLogin, setDadosLogin] = useState({ email: '', senha: '' });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarModalEsqueci, setMostrarModalEsqueci] = useState(false);
  const [emailEsqueci, setEmailEsqueci] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (!toast.show) return;
    const timer = setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
    return () => clearTimeout(timer);
  }, [toast.show]);

  const exibirNotificacao = (mensagem, tipo = 'success') => {
    setToast({ show: true, message: mensagem, type: tipo });
  };

  const aoEnviarLogin = async (e) => {
    e.preventDefault();
    setCarregando(true);

    const resultado = await entrar(dadosLogin.email, dadosLogin.senha);

    setCarregando(false);

    if (resultado.sucesso) {
      // Salva o usuário no formato esperado pelo AppContext
      const usuario = resultado.usuario?.usuario || resultado.usuario || {};
      localStorage.setItem('petmatch_current_user', JSON.stringify(usuario));
      exibirNotificacao('Que bom ter você de volta!');
      setDadosLogin({ email: '', senha: '' });
      navegar('/app');
    } else {
      exibirNotificacao(resultado.erro || 'E-mail ou senha incorretos!', 'error');
    }
  };

  const aoEnviarEsqueci = async (e) => {
    e.preventDefault();
    if (novaSenha !== confirmarNovaSenha) {
      return exibirNotificacao('As senhas não coincidem!', 'error');
    }
    setCarregando(true);
    await new Promise(resolve => setTimeout(resolve, 400));
    setCarregando(false);
    exibirNotificacao('Recuperação de senha não suportada pela API atual.', 'error');
    setMostrarModalEsqueci(false);
    setEmailEsqueci('');
    setNovaSenha('');
    setConfirmarNovaSenha('');
  };

  const irParaCadastro = () => {
    setDadosLogin({ email: '', senha: '' });
    navegar('/cadastro');
  };

  return (
    <div className="container-autenticacao fade-in">
      <Notificacao visivel={toast.show} mensagem={toast.message} tipo={toast.type} />

      {/* Modal Esqueci Minha Senha */}
      {mostrarModalEsqueci && (
        <div className="sobreposicao-modal" onClick={() => setMostrarModalEsqueci(false)}>
          <div className="conteudo-modal fade-in" onClick={e => e.stopPropagation()}>
            <button className="botao-fechar-modal" onClick={() => setMostrarModalEsqueci(false)}><X size={24} /></button>
            <h2 className="login-titulo-secao" style={{ fontSize: '2rem' }}>Redefinir Senha</h2>
            <p className="login-subtitulo-secao" style={{ marginBottom: '32px' }}>Insira seu e-mail e a nova senha desejada.</p>
            <form onSubmit={aoEnviarEsqueci}>
              <CampoFormulario
                rotulo="E-mail cadastrado"
                tipo="email"
                placeholder="Seu e-mail"
                valor={emailEsqueci}
                aoMudar={e => setEmailEsqueci(e.target.value)}
                icone={Mail}
                obrigatorio
              />
              <CampoFormulario
                rotulo="Nova senha"
                tipo="password"
                placeholder="Mínimo 6 caracteres"
                valor={novaSenha}
                aoMudar={e => setNovaSenha(e.target.value)}
                icone={Lock}
                obrigatorio
                tamanhoMinimo={6}
              />
              <CampoFormulario
                rotulo="Confirmar nova senha"
                tipo="password"
                placeholder="Confirme a senha"
                valor={confirmarNovaSenha}
                aoMudar={e => setConfirmarNovaSenha(e.target.value)}
                icone={Lock}
                obrigatorio
                tamanhoMinimo={6}
              />
              <Botao tipo="submit" estilo={{ marginTop: '16px' }} desabilitado={carregando}>
                {carregando ? 'Processando...' : 'Salvar nova senha'}
              </Botao>
            </form>
          </div>
        </div>
      )}

      {/* Painel Esquerdo — marca editorial */}
      <div className="painel-esquerdo" style={{ background: '#1f3024', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(209,107,71,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '80px', left: '-100px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(42,65,50,0.7)', pointerEvents: 'none' }} />

        <div className="logo-marca" style={{ zIndex: 10, position: 'relative' }}>
          <PawPrint size={28} fill="white" strokeWidth={0} />
          <span style={{ fontSize: '1.5rem' }}>PetMatch</span>
        </div>

        <div style={{ zIndex: 10, position: 'relative', marginTop: 'auto', paddingBottom: '200px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(209,107,71,0.15)', border: '1px solid rgba(209,107,71,0.28)', borderRadius: '100px', padding: '6px 14px', marginBottom: '28px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#d16b47', display: 'block' }} />
            <span style={{ color: '#d16b47', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Adoção consciente</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 3vw, 2.9rem)', lineHeight: 1.08, color: '#f3eae1', fontFamily: "'Poppins', sans-serif", fontWeight: 700, marginBottom: '20px' }}>
            Conexões que<br />mudam <em style={{ color: '#d16b47', fontStyle: 'normal' }}>vidas.</em> ♡
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'rgba(243,234,225,0.6)', lineHeight: 1.7, maxWidth: '340px', marginBottom: '40px' }}>
            Encontre o seu melhor amigo e transforme histórias através da adoção consciente.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '14px 18px', maxWidth: '360px' }}>
            <div style={{ display: 'flex', marginRight: '4px' }}>
              {['#d16b47', '#e8956b', '#c4563a'].map((c, i) => (
                <div key={i} style={{ width: '30px', height: '30px', borderRadius: '50%', background: c, border: '2px solid rgba(255,255,255,0.15)', marginLeft: i > 0 ? '-8px' : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>🐾</div>
              ))}
            </div>
            <div>
              <p style={{ color: 'white', fontSize: '0.82rem', fontWeight: 600, lineHeight: 1 }}>+12.000 adoções realizadas</p>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', marginTop: '3px' }}>Junte-se à nossa comunidade</p>
            </div>
          </div>
        </div>

        <div className="container-mascote">
          <img src={bgDog} alt="Mascote PetMatch" className="imagem-mascote" />
        </div>

        <PawPrint size={280} color="rgba(255,255,255,0.025)" strokeWidth={0} fill="currentColor"
          style={{ position: 'absolute', top: '60px', right: '-40px', transform: 'rotate(15deg)', zIndex: 1, pointerEvents: 'none' }} />
      </div>

      {/* Painel Direito — formulário limpo */}
      <div className="painel-direito" style={{ background: '#fdfcf9' }}>
        <div style={{ width: '100%', maxWidth: '400px', margin: 'auto' }} className="fade-in">

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '48px' }}>
            <p style={{ fontSize: '0.85rem', color: '#9ca3af', margin: 0 }}>
              Novo por aqui?{' '}
              <button type="button" onClick={irParaCadastro}
                style={{ background: 'none', border: 'none', color: '#1f3024', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                Criar conta
              </button>
            </p>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#1f3024', fontFamily: "'Poppins', sans-serif", lineHeight: 1.1, marginBottom: '6px' }}>Bem-vindo de volta</h2>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Entre com seus dados para continuar</p>
          </div>

          <form onSubmit={aoEnviarLogin}>
            <CampoFormulario
              rotulo="E-mail"
              tipo="email"
              placeholder="seu@email.com"
              valor={dadosLogin.email}
              aoMudar={e => setDadosLogin({ ...dadosLogin, email: e.target.value })}
              icone={Mail}
              obrigatorio
            />
            <div className="campo-wrapper">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label className="campo-rotulo" style={{ margin: 0 }}>Senha</label>
                <a href="#" onClick={e => { e.preventDefault(); setMostrarModalEsqueci(true); }}
                  style={{ fontSize: '0.78rem', color: '#d16b47', fontWeight: 600, textDecoration: 'none' }}>Esqueci a senha</a>
              </div>
              <div className="campo-grupo">
                <Lock className="campo-icone" size={17} />
                <input type={mostrarSenha ? 'text' : 'password'} placeholder="Sua senha" className="campo-entrada"
                  value={dadosLogin.senha} onChange={e => setDadosLogin({ ...dadosLogin, senha: e.target.value })} required />
                <button type="button" className="campo-acao" onClick={() => setMostrarSenha(!mostrarSenha)}>
                  {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <Botao tipo="submit" estilo={{ marginTop: '20px', height: '48px', borderRadius: '12px', fontSize: '0.95rem' }} desabilitado={carregando}>
              {carregando ? (
                <span>Conectando...</span>
              ) : (
                <>
                  <PawPrint size={18} fill="white" />
                  Entrar na minha conta
                  <ArrowRight size={18} style={{ marginLeft: 'auto' }} />
                </>
              )}
            </Botao>
          </form>

          <div className="login-divisor">
            <div className="login-divisor-linha" />
            <span className="login-divisor-texto">ou</span>
            <div className="login-divisor-linha" />
          </div>

          <button type="button" onClick={irParaCadastro}
            style={{ width: '100%', height: '48px', background: 'white', border: '1.5px solid #e5e7eb', borderRadius: '12px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem', fontWeight: 600, color: '#1f3024', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <User size={17} /> Criar uma conta gratuita
          </button>

          <div className="login-caixa-privacidade">
            <Shield size={16} color="#1f3024" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: '0.77rem', color: '#6b7280', lineHeight: 1.4, margin: 0 }}>
              <strong style={{ color: '#374151' }}>Privacidade garantida.</strong> Seus dados são protegidos e jamais compartilhados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
