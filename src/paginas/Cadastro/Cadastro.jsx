import { useState, useEffect } from 'react';
import { User, Mail, Lock, EyeOff, Eye, Phone, MapPin, ArrowLeft, PawPrint, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cadastrar } from '../../servicos/autenticacao.js';
import CampoFormulario from '../../componentes/CampoFormulario/CampoFormulario.jsx';
import Botao from '../../componentes/Botao/Botao.jsx';
import Notificacao from '../../componentes/Notificacao/Notificacao.jsx';
import { useForm, VALIDADORES_REGEX } from '../../hooks/useForm.js';
import './cadastro.css';

const regrasValidacao = {
  name: {
    required: true,
    mensagemErroObrigatorio: 'O nome completo é obrigatório.',
    regex: VALIDADORES_REGEX.letrasEAcentos,
    mensagemErroRegex: 'O nome deve conter apenas letras e espaços.'
  },
  email: {
    required: true,
    mensagemErroObrigatorio: 'O e-mail é obrigatório.',
    regex: VALIDADORES_REGEX.email,
    mensagemErroRegex: 'Por favor, insira um e-mail válido.'
  },
  password: {
    required: true,
    mensagemErroObrigatorio: 'A senha é obrigatória.',
    minLength: 6,
    mensagemErroMinLength: 'A senha deve conter no mínimo 6 caracteres.'
  },
  confirmPassword: {
    required: true,
    mensagemErroObrigatorio: 'A confirmação de senha é obrigatória.',
    custom: (valor, valores) => valor !== valores.password ? 'As senhas não coincidem.' : ''
  },
  cnpj: {
    required: (valores) => valores.isOng,
    mensagemErroObrigatorio: 'O CNPJ é obrigatório para ONGs.',
    regex: VALIDADORES_REGEX.cnpj,
    mensagemErroRegex: 'Por favor, insira um CNPJ válido (ex: 00.000.000/0000-00).'
  },
  linkSite: {
    required: (valores) => valores.isOng,
    mensagemErroObrigatorio: 'O site/rede social é obrigatório para ONGs.',
    regex: VALIDADORES_REGEX.url,
    mensagemErroRegex: 'Por favor, insira um link válido (ex: https://site.com).'
  },
  descricao: {
    required: (valores) => valores.isOng,
    mensagemErroObrigatorio: 'A descrição da ONG é obrigatória.',
    minLength: 10,
    mensagemErroMinLength: 'Fale um pouco mais sobre a ONG (mín. 10 caracteres).'
  },
  telefone: {
    required: false,
    regex: VALIDADORES_REGEX.telefone,
    mensagemErroRegex: 'Por favor, insira um telefone válido com DDD (ex: (11) 99999-9999).'
  },
  cep: {
    required: (valores) => valores.isOng,
    mensagemErroObrigatorio: 'O CEP é obrigatório.',
    regex: VALIDADORES_REGEX.cep,
    mensagemErroRegex: 'Por favor, insira um CEP válido (ex: 00000-000).'
  },
  estado: {
    required: (valores) => valores.isOng,
    mensagemErroObrigatorio: 'O estado é obrigatório.',
    regex: /^[A-Z]{2}$/,
    mensagemErroRegex: 'Estado deve ser com 2 letras maiúsculas (ex: SP).'
  },
  cidade: {
    required: (valores) => valores.isOng,
    mensagemErroObrigatorio: 'A cidade é obrigatória.'
  },
  bairro: {
    required: (valores) => valores.isOng,
    mensagemErroObrigatorio: 'O bairro é obrigatório.'
  },
  rua: {
    required: (valores) => valores.isOng,
    mensagemErroObrigatorio: 'A rua é obrigatória.'
  },
  numero: {
    required: (valores) => valores.isOng,
    mensagemErroObrigatorio: 'O número é obrigatório.'
  }
};

const Cadastro = () => {
  const navegar = useNavigate();

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (!toast.show) return;
    const timer = setTimeout(() => setToast(toastAnterior => ({ ...toastAnterior, show: false })), 3000);
    return () => clearTimeout(timer);
  }, [toast.show]);

  const exibirNotificacao = (mensagem, tipo = 'success') => {
    setToast({ show: true, message: mensagem, type: tipo });
  };

  const {
    valores: dados,
    erros,
    handleChange,
    handleBlur,
    handleSubmit: aoEnviarCadastro,
    setValores: setDados
  } = useForm({
    name: '', email: '', password: '', confirmPassword: '',
    isOng: false,
    cnpj: '', telefone: '', linkSite: '', descricao: '',
    rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', cep: ''
  }, regrasValidacao, async (valoresFormulario) => {
    setCarregando(true);
    const resultado = await cadastrar(valoresFormulario);
    setCarregando(false);

    if (resultado.sucesso) {
      exibirNotificacao("Conta criada com sucesso! Faça seu login.");
      navegar('/login');
    } else {
      exibirNotificacao(resultado.erro || "Este e-mail já está em uso.", "error");
    }
  });

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
            {[{ valor: '12k+', rotulo: 'Adoções' }, { valor: '4.8 ★', rotulo: 'Avaliação' }, { valor: '100%', rotulo: 'Gratuito' }].map((estatistica, indice) => (
              <div key={indice}>
                <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'white', fontFamily: "'Poppins', sans-serif" }}>{estatistica.valor}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '3px', letterSpacing: '0.3px' }}>{estatistica.rotulo}</div>
              </div>
            ))}
          </div>
        </div>

        <PawPrint size={320} color="rgba(255,255,255,0.025)" strokeWidth={0} fill="currentColor"
          style={{ position: 'absolute', bottom: '-50px', right: '-70px', transform: 'rotate(-18deg)', zIndex: 1, pointerEvents: 'none' }} />
      </div>

      {/* Painel Direito — formulário */}
      <div className="painel-direito" style={{ background: '#fdfcf9' }}>
        <div style={{ width: '100%', maxWidth: '440px', margin: 'auto' }} className="fade-in">
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
            <CampoFormulario name="name" rotulo="Nome completo" tipo="text" placeholder="Como podemos te chamar?" valor={dados.name} aoMudar={handleChange} aoBlur={handleBlur} erro={erros.name} icone={User} obrigatorio />
            <CampoFormulario name="email" rotulo="E-mail" tipo="email" placeholder="seu@email.com" valor={dados.email} aoMudar={handleChange} aoBlur={handleBlur} erro={erros.email} icone={Mail} obrigatorio />

            <div className="cadastro-grade-dupla">
              <div className="campo-wrapper">
                <label className="campo-rotulo">Senha</label>
                <div className="campo-grupo">
                  <Lock className="campo-icone" size={17} />
                  <input 
                    name="password"
                    type={mostrarSenha ? 'text' : 'password'} 
                    placeholder="Mín. 6 chars" 
                    className={`campo-entrada ${erros.password ? 'campo-entrada-erro' : ''}`}
                    value={dados.password} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required 
                  />
                  <button type="button" className="campo-acao" onClick={() => setMostrarSenha(!mostrarSenha)}>{mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                </div>
                {erros.password && <span className="campo-erro-mensagem">{erros.password}</span>}
              </div>
              <div className="campo-wrapper">
                <label className="campo-rotulo">Confirmar</label>
                <div className="campo-grupo">
                  <Lock className="campo-icone" size={17} />
                  <input 
                    name="confirmPassword"
                    type={mostrarConfirmar ? 'text' : 'password'} 
                    placeholder="Repita" 
                    className={`campo-entrada ${erros.confirmPassword ? 'campo-entrada-erro' : ''}`}
                    value={dados.confirmPassword} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required 
                  />
                  <button type="button" className="campo-acao" onClick={() => setMostrarConfirmar(!mostrarConfirmar)}>{mostrarConfirmar ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                </div>
                {erros.confirmPassword && <span className="campo-erro-mensagem">{erros.confirmPassword}</span>}
              </div>
            </div>

            {dados.isOng && (
              <div className="fade-in" style={{ marginTop: '16px', background: 'rgba(209,107,71,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(209,107,71,0.1)' }}>
                <h3 style={{ fontSize: '1.05rem', color: '#1f3024', marginBottom: '16px' }}>Dados da Instituição</h3>
                <CampoFormulario name="cnpj" rotulo="CNPJ" tipo="text" placeholder="00.000.000/0000-00" valor={dados.cnpj} aoMudar={handleChange} aoBlur={handleBlur} erro={erros.cnpj} icone={User} obrigatorio={dados.isOng} />
                <CampoFormulario name="linkSite" rotulo="Site ou Rede Social" tipo="url" placeholder="https://" valor={dados.linkSite} aoMudar={handleChange} aoBlur={handleBlur} erro={erros.linkSite} icone={PawPrint} obrigatorio={dados.isOng} />
                <CampoFormulario name="descricao" rotulo="Descrição da ONG" tipo="text" placeholder="Conte sobre o trabalho de vocês..." valor={dados.descricao} aoMudar={handleChange} aoBlur={handleBlur} erro={erros.descricao} icone={PawPrint} obrigatorio={dados.isOng} />
              </div>
            )}

            <div className="fade-in" style={{ marginTop: '16px', padding: '8px 0' }}>
              <h3 style={{ fontSize: '1.05rem', color: '#1f3024', marginBottom: '16px' }}>Informações de Contato e Endereço</h3>
              <CampoFormulario name="telefone" rotulo="Telefone" tipo="tel" placeholder="(00) 00000-0000" valor={dados.telefone} aoMudar={handleChange} aoBlur={handleBlur} erro={erros.telefone} icone={Phone} />
              
              <h3 style={{ fontSize: '1.05rem', color: '#1f3024', marginTop: '24px', marginBottom: '16px' }}>Endereço</h3>
                <div className="cadastro-grade-dupla">
                  <CampoFormulario name="cep" rotulo="CEP" tipo="text" placeholder="00000-000" valor={dados.cep} aoMudar={handleChange} aoBlur={handleBlur} erro={erros.cep} icone={MapPin} obrigatorio={dados.isOng} />
                  <CampoFormulario name="estado" rotulo="Estado (UF)" tipo="text" placeholder="SP" valor={dados.estado} aoMudar={handleChange} aoBlur={handleBlur} erro={erros.estado} icone={MapPin} obrigatorio={dados.isOng} />
                </div>
                <div className="cadastro-grade-dupla">
                  <CampoFormulario name="cidade" rotulo="Cidade" tipo="text" placeholder="São Paulo" valor={dados.cidade} aoMudar={handleChange} aoBlur={handleBlur} erro={erros.cidade} icone={MapPin} obrigatorio={dados.isOng} />
                  <CampoFormulario name="bairro" rotulo="Bairro" tipo="text" placeholder="Centro" valor={dados.bairro} aoMudar={handleChange} aoBlur={handleBlur} erro={erros.bairro} icone={MapPin} obrigatorio={dados.isOng} />
                </div>
                <div className="cadastro-grade-dupla">
                  <CampoFormulario name="rua" rotulo="Rua/Avenida" tipo="text" placeholder="Av. Principal" valor={dados.rua} aoMudar={handleChange} aoBlur={handleBlur} erro={erros.rua} icone={MapPin} obrigatorio={dados.isOng} />
                  <CampoFormulario name="numero" rotulo="Número" tipo="text" placeholder="1000" valor={dados.numero} aoMudar={handleChange} aoBlur={handleBlur} erro={erros.numero} icone={MapPin} obrigatorio={dados.isOng} />
                </div>
                <CampoFormulario name="complemento" rotulo="Complemento" tipo="text" placeholder="Apto, Sala (opcional)" valor={dados.complemento} aoMudar={handleChange} aoBlur={handleBlur} erro={erros.complemento} icone={MapPin} />
            </div>

            <div style={{ marginTop: '16px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(209,107,71,0.05)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(209,107,71,0.2)' }}>
              <input 
                type="checkbox" 
                id="isOng" 
                name="isOng"
                checked={dados.isOng} 
                onChange={handleChange}
                style={{ width: '18px', height: '18px', accentColor: '#d16b47', cursor: 'pointer' }}
              />
              <label htmlFor="isOng" style={{ fontSize: '0.9rem', color: '#1f3024', fontWeight: 600, cursor: 'pointer' }}>
                Sou uma Instituição / ONG
              </label>
            </div>

            <p style={{ fontSize: '0.77rem', color: '#b0b7c3', lineHeight: 1.6, marginTop: '4px', marginBottom: 0 }}>
              Ao criar sua conta, você concorda com os{' '}
              <a href="#" onClick={evento => evento.preventDefault()} style={{ color: '#1f3024', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '2px' }}>Termos</a>
              {' '}e a{' '}
              <a href="#" onClick={evento => evento.preventDefault()} style={{ color: '#1f3024', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '2px' }}>Privacidade</a>.
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
