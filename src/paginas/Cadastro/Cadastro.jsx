import  { useState, useEffect } from 'react';
import { User, Mail, Lock, EyeOff, Eye, Phone, MapPin, ArrowLeft, PawPrint, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cadastrar } from '../../servicos/autenticacao.js';
import CampoFormulario from '../../componentes/CampoFormulario/CampoFormulario.jsx';
import Botao from '../../componentes/Botao/Botao.jsx';
import Notificacao from '../../componentes/Notificacao/Notificacao.jsx';
import './cadastro.css';

const Cadastro = () => {
  const navegar = useNavigate();

  const [dados, setDados] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    isOng: false,
    cnpj: '', telefone: '', linkSite: '', descricao: '',
    rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', cep: ''
  });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
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

  const aoEnviarCadastro = async (e) => {
    e.preventDefault();
    if (dados.password !== dados.confirmPassword) {
      return exibirNotificacao("As senhas não coincidem!", "error");
    }
    if (dados.password.length < 6) {
      return exibirNotificacao("A senha deve ter pelo menos 6 caracteres", "error");
    }

    setCarregando(true);
    const resultado = await cadastrar({
      name: dados.name, email: dados.email, password: dados.password, isOng: dados.isOng,
      cnpj: dados.cnpj, telefone: dados.telefone, linkSite: dados.linkSite, descricao: dados.descricao,
      rua: dados.rua, numero: dados.numero, complemento: dados.complemento, bairro: dados.bairro,
      cidade: dados.cidade, estado: dados.estado, cep: dados.cep
    });
    setCarregando(false);

    if (resultado.sucesso) {
      exibirNotificacao("Conta criada com sucesso! Faça seu login.");
      setDados({
        name: '', email: '', password: '', confirmPassword: '', isOng: false,
        cnpj: '', telefone: '', linkSite: '', descricao: '',
        rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', cep: ''
      });
      navegar('/login');
    } else {
      exibirNotificacao(resultado.erro || "Este e-mail já está em uso.", "error");
    }
  };

  const irParaLogin = () => {
    setDados({ name: '', email: '', password: '', confirmPassword: '', telefone: '', endereco: '' });
    navegar('/login');
  };

  return (
    <div className="container-autenticacao fade-in">
      <Notificacao visivel={toast.show} mensagem={toast.message} tipo={toast.type} />

      {/* Painel Esquerdo */}
      <div className="painel-esquerdo" style={{ background: '#1f3024', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', left: '-60px', width: '380px', height: '380px', borderRadius: '50%', background: 'rgba(209,107,71,0.07)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '340px', height: '340px', borderRadius: '50%', background: 'rgba(42,65,50,0.9)', pointerEvents: 'none' }} />

        <div className="logo-marca" style={{ zIndex: 10, position: 'relative' }}>
          <PawPrint size={28} fill="white" strokeWidth={0} />
          <span style={{ fontSize: '1.5rem' }}>PetMatch</span>
        </div>

        <div style={{ zIndex: 10, position: 'relative', marginTop: 'auto', marginBottom: 'auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(209,107,71,0.15)', border: '1px solid rgba(209,107,71,0.28)', borderRadius: '100px', padding: '6px 14px', marginBottom: '28px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#d16b47', display: 'block' }} />
            <span style={{ color: '#d16b47', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Nova conta</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 3vw, 2.8rem)', lineHeight: 1.1, color: '#f3eae1', fontFamily: "'Poppins', sans-serif", fontWeight: 700, marginBottom: '20px' }}>
            Cada animal<br />merece um<br /><em style={{ color: '#d16b47', fontStyle: 'normal' }}>lar com amor.</em>
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'rgba(243,234,225,0.6)', lineHeight: 1.7, maxWidth: '340px', marginBottom: '52px' }}>
            Cadastre-se gratuitamente e faça parte de uma comunidade que transforma vidas através da adoção responsável.
          </p>
          <div style={{ display: 'flex', gap: '36px' }}>
            {[{ v: '12k+', l: 'Adoções' }, { v: '4.8 ★', l: 'Avaliação' }, { v: '100%', l: 'Gratuito' }].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'white', fontFamily: "'Poppins', sans-serif" }}>{s.v}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '3px', letterSpacing: '0.3px' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <PawPrint size={320} color="rgba(255,255,255,0.025)" strokeWidth={0} fill="currentColor"
          style={{ position: 'absolute', bottom: '-50px', right: '-70px', transform: 'rotate(-18deg)', zIndex: 1, pointerEvents: 'none' }} />
      </div>

      {/* Painel Direito — formulário */}
      <div className="painel-direito" style={{ background: '#fdfcf9' }}>
        <div style={{ width: '100%', maxWidth: '440px' }} className="fade-in">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '36px' }}>
            <button type="button" onClick={irParaLogin}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#9ca3af', fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>
              <ArrowLeft size={17} /> Voltar
            </button>
            <p style={{ fontSize: '0.85rem', color: '#9ca3af', margin: 0 }}>
              Já tem conta?{' '}
              <button type="button" onClick={irParaLogin}
                style={{ background: 'none', border: 'none', color: '#1f3024', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                Entrar
              </button>
            </p>
          </div>

          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#1f3024', fontFamily: "'Poppins', sans-serif", lineHeight: 1.1, marginBottom: '6px' }}>Criar conta</h2>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Preencha os campos abaixo para começar</p>
          </div>

          <form onSubmit={aoEnviarCadastro}>
            <CampoFormulario rotulo="Nome completo" tipo="text" placeholder="Como podemos te chamar?" valor={dados.name} aoMudar={e => setDados({ ...dados, name: e.target.value })} icone={User} obrigatorio />
            <CampoFormulario rotulo="E-mail" tipo="email" placeholder="seu@email.com" valor={dados.email} aoMudar={e => setDados({ ...dados, email: e.target.value })} icone={Mail} obrigatorio />

            <div className="cadastro-grade-dupla">
              <div className="campo-wrapper">
                <label className="campo-rotulo">Senha</label>
                <div className="campo-grupo">
                  <Lock className="campo-icone" size={17} />
                  <input type={mostrarSenha ? 'text' : 'password'} placeholder="Mín. 6 chars" className="campo-entrada" value={dados.password} onChange={e => setDados({ ...dados, password: e.target.value })} required />
                  <button type="button" className="campo-acao" onClick={() => setMostrarSenha(!mostrarSenha)}>{mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                </div>
              </div>
              <div className="campo-wrapper">
                <label className="campo-rotulo">Confirmar</label>
                <div className="campo-grupo">
                  <Lock className="campo-icone" size={17} />
                  <input type={mostrarConfirmar ? 'text' : 'password'} placeholder="Repita" className="campo-entrada" value={dados.confirmPassword} onChange={e => setDados({ ...dados, confirmPassword: e.target.value })} required />
                  <button type="button" className="campo-acao" onClick={() => setMostrarConfirmar(!mostrarConfirmar)}>{mostrarConfirmar ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                </div>
              </div>
            </div>

            {dados.isOng && (
              <div className="fade-in" style={{ marginTop: '16px', background: 'rgba(209,107,71,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(209,107,71,0.1)' }}>
                <h3 style={{ fontSize: '1.05rem', color: '#1f3024', marginBottom: '16px' }}>Dados da Instituição</h3>
                <div className="cadastro-grade-dupla">
                  <CampoFormulario rotulo="CNPJ" tipo="text" placeholder="00.000.000/0000-00" valor={dados.cnpj} aoMudar={e => setDados({ ...dados, cnpj: e.target.value })} icone={User} obrigatorio={dados.isOng} />
                  <CampoFormulario rotulo="Telefone" tipo="tel" placeholder="(00) 00000-0000" valor={dados.telefone} aoMudar={e => setDados({ ...dados, telefone: e.target.value })} icone={Phone} obrigatorio={dados.isOng} />
                </div>
                <CampoFormulario rotulo="Site ou Rede Social" tipo="url" placeholder="https://" valor={dados.linkSite} aoMudar={e => setDados({ ...dados, linkSite: e.target.value })} icone={PawPrint} obrigatorio={dados.isOng} />
                <CampoFormulario rotulo="Descrição da ONG" tipo="text" placeholder="Conte sobre o trabalho de vocês..." valor={dados.descricao} aoMudar={e => setDados({ ...dados, descricao: e.target.value })} icone={PawPrint} obrigatorio={dados.isOng} />
                
                <h3 style={{ fontSize: '1.05rem', color: '#1f3024', marginTop: '24px', marginBottom: '16px' }}>Endereço</h3>
                <div className="cadastro-grade-dupla">
                  <CampoFormulario rotulo="CEP" tipo="text" placeholder="00000-000" valor={dados.cep} aoMudar={e => setDados({ ...dados, cep: e.target.value })} icone={MapPin} obrigatorio={dados.isOng} />
                  <CampoFormulario rotulo="Estado (UF)" tipo="text" placeholder="SP" valor={dados.estado} aoMudar={e => setDados({ ...dados, estado: e.target.value })} icone={MapPin} obrigatorio={dados.isOng} />
                </div>
                <div className="cadastro-grade-dupla">
                  <CampoFormulario rotulo="Cidade" tipo="text" placeholder="São Paulo" valor={dados.cidade} aoMudar={e => setDados({ ...dados, cidade: e.target.value })} icone={MapPin} obrigatorio={dados.isOng} />
                  <CampoFormulario rotulo="Bairro" tipo="text" placeholder="Centro" valor={dados.bairro} aoMudar={e => setDados({ ...dados, bairro: e.target.value })} icone={MapPin} obrigatorio={dados.isOng} />
                </div>
                <div className="cadastro-grade-dupla">
                  <CampoFormulario rotulo="Rua/Avenida" tipo="text" placeholder="Av. Principal" valor={dados.rua} aoMudar={e => setDados({ ...dados, rua: e.target.value })} icone={MapPin} obrigatorio={dados.isOng} />
                  <CampoFormulario rotulo="Número" tipo="text" placeholder="1000" valor={dados.numero} aoMudar={e => setDados({ ...dados, numero: e.target.value })} icone={MapPin} obrigatorio={dados.isOng} />
                </div>
                <CampoFormulario rotulo="Complemento" tipo="text" placeholder="Apto, Sala (opcional)" valor={dados.complemento} aoMudar={e => setDados({ ...dados, complemento: e.target.value })} icone={MapPin} />
              </div>
            )}

            <div style={{ marginTop: '16px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(209,107,71,0.05)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(209,107,71,0.2)' }}>
              <input 
                type="checkbox" 
                id="isOng" 
                checked={dados.isOng} 
                onChange={e => setDados({ ...dados, isOng: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: '#d16b47', cursor: 'pointer' }}
              />
              <label htmlFor="isOng" style={{ fontSize: '0.9rem', color: '#1f3024', fontWeight: 600, cursor: 'pointer' }}>
                Sou uma Instituição / ONG
              </label>
            </div>

            <p style={{ fontSize: '0.77rem', color: '#b0b7c3', lineHeight: 1.6, marginTop: '4px', marginBottom: 0 }}>
              Ao criar sua conta, você concorda com os{' '}
              <a href="#" onClick={e => e.preventDefault()} style={{ color: '#1f3024', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '2px' }}>Termos</a>
              {' '}e a{' '}
              <a href="#" onClick={e => e.preventDefault()} style={{ color: '#1f3024', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '2px' }}>Privacidade</a>.
            </p>
            <Botao tipo="submit" estilo={{ marginTop: '16px', height: '48px', borderRadius: '12px', fontSize: '0.95rem' }} desabilitado={carregando}>
              {carregando ? (
                <span>Criando conta...</span>
              ) : (
                <>
                  <PawPrint size={18} fill="white" />
                  Criar minha conta
                  <ArrowRight size={18} style={{ marginLeft: 'auto' }} />
                </>
              )}
            </Botao>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
