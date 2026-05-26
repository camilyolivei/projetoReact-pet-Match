import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { apiPets } from '../../servicos/api.js';

import Notificacao from '../../componentes/Notificacao/Notificacao.jsx';
import BarraLateral from '../../componentes/BarraLateral/BarraLateral.jsx';
import MenuMobile from '../../componentes/MenuMobile/MenuMobile.jsx';
import Layout from '../../componentes/Layout/Layout.jsx';

import ListaPets from '../Pets/ListaPets.jsx';
import FormularioPet from '../Pets/FormularioPet.jsx';
import Perfil from '../Perfil/Perfil.jsx';

// ─── Canal de broadcast (fora do componente — sem useRef) ───
let canal = null;

// ─── Helpers localStorage ───
const carregar = (chave, padrao) => {
  try { const v = localStorage.getItem(chave); return v ? JSON.parse(v) : padrao; }
  catch { return padrao; }
};
const salvarLocal = (chave, valor) => localStorage.setItem(chave, JSON.stringify(valor));

// ─── Dados padrão ───
const PETS_PADRAO = [
  { id: 1, name: 'Max', type: 'Cachorro', age: '2 anos', desc: 'Muito brincalhão e ama passeios no parque.', img: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80', owner_id: 1, vacinado: true, castrado: true, cor: 'Caramelo', ativo: true },
  { id: 2, name: 'Luna', type: 'Cachorro', age: '1 ano', desc: 'Adora dormir o dia todo e dar muito carinho.', img: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80', owner_id: 1, vacinado: true, castrado: false, cor: 'Preto', ativo: true },
  { id: 3, name: 'Thor', type: 'Cachorro', age: '3 meses', desc: 'Um filhote cheio de energia procurando uma família.', img: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80', owner_id: 2, vacinado: false, castrado: false, cor: 'Dourado', ativo: true },
  { id: 4, name: 'Bella', type: 'Cachorro', age: '4 anos', desc: 'Super dócil, já está castrada e vacinada.', img: 'https://images.unsplash.com/photo-1537151608804-ea6f272a720e?auto=format&fit=crop&w=800&q=80', owner_id: 3, vacinado: true, castrado: true, cor: 'Branco', ativo: true },
];

const AppInterno = () => {
  const navegar = useNavigate();

  // ─── Estado global ───
  const [usuarioAtual, setUsuarioAtual_] = useState(() => carregar('petmatch_current_user', null));
  const [tela, setTela] = useState('pets');
  const [menuAberto, setMenuAberto] = useState(false);
  const [petEditando, setPetEditando] = useState(null);

  const [pets, setPets_] = useState(() => carregar('petmatch_pets', PETS_PADRAO));

  const [notificacao, setNotificacao] = useState({ visivel: false, mensagem: '', tipo: 'sucesso' });

  // ─── Redirecionar se não logado ───
  useEffect(() => {
    if (!usuarioAtual) navegar('/login', { replace: true });
  }, [usuarioAtual]);

  // ─── Setters sincronizados ───
  const sinc = (chave, valor) => {
    salvarLocal(chave, valor);
    canal?.postMessage({ chave, valor });
  };
  const setUsuarioAtual = (v) => { setUsuarioAtual_(v); sinc('petmatch_current_user', v); };
  const setPets = (v) => { setPets_(v); sinc('petmatch_pets', v); };

  // ─── BroadcastChannel (sem useRef) ───
  useEffect(() => {
    try {
      canal = new BroadcastChannel('petmatch_realtime');
      canal.onmessage = ({ data: { chave, valor } }) => {
        if (chave === 'petmatch_current_user') setUsuarioAtual_(valor);
        else if (chave === 'petmatch_pets') setPets_(valor);
      };
    } catch {}

    const aoStorage = ({ key, newValue }) => {
      if (!key || !newValue) return;
      try {
        const valor = JSON.parse(newValue);
        if (key === 'petmatch_current_user') setUsuarioAtual_(valor);
        else if (key === 'petmatch_pets') setPets_(valor);
      } catch {}
    };
    window.addEventListener('storage', aoStorage);

    return () => {
      canal?.close(); canal = null;
      window.removeEventListener('storage', aoStorage);
    };
  }, []);

  // ─── Fechar menu ao trocar tela ───
  useEffect(() => { setMenuAberto(false); }, [tela]);

  // ─── Carregar dados da API ao logar ───
  useEffect(() => {
    if (!usuarioAtual) return;
    apiPets.listar().then(({ ok, dados }) => { if (ok && Array.isArray(dados)) setPets(dados); });
  }, [usuarioAtual?.id]);

  // ─── Toast ───
  const exibirNotificacao = (mensagem, tipo = 'sucesso') => {
    setNotificacao({ visivel: true, mensagem, tipo });
    setTimeout(() => setNotificacao(n => ({ ...n, visivel: false })), 3000);
  };

  // ─── Logout ───
  const sair = () => {
    localStorage.removeItem('petmatch_token');
    setUsuarioAtual(null);
  };

  // ─── Pets ───
  const adicionarPet = async (dadosPet) => {
    const { ok, dados } = await apiPets.criar(dadosPet);
    const novoPet = { id: (ok && dados.id) ? dados.id : Date.now(), ativo: true, ...dadosPet };
    setPets([novoPet, ...pets]);
  };
  const atualizarPet = async (id, dadosPet) => {
    await apiPets.atualizar(id, dadosPet);
    setPets(pets.map(p => p.id === id ? { ...p, ...dadosPet } : p));
  };
  const removerPet = async (id) => {
    await apiPets.remover(id);
    setPets(pets.filter(p => p.id !== id));
  };

  // ─── Perfil ───
  const atualizarPerfil = (dadosAtualizados) => {
    setUsuarioAtual({ ...usuarioAtual, ...dadosAtualizados });
  };

  // ─── Renderizar tela ───
  const renderizarTela = () => {
    switch (tela) {
      case 'pets':           return <ListaPets pets={pets} usuarioAtual={usuarioAtual} setTela={setTela} setPetEditando={setPetEditando} removerPet={removerPet} exibirNotificacao={exibirNotificacao} />;
      case 'formulario_pet': return <FormularioPet petEditando={petEditando} setPetEditando={setPetEditando} usuarioAtual={usuarioAtual} setTela={setTela} adicionarPet={adicionarPet} atualizarPet={atualizarPet} exibirNotificacao={exibirNotificacao} />;
      case 'perfil':         return <Perfil usuarioAtual={usuarioAtual} atualizarPerfil={atualizarPerfil} exibirNotificacao={exibirNotificacao} />;
      default:               return <ListaPets pets={pets} usuarioAtual={usuarioAtual} setTela={setTela} setPetEditando={setPetEditando} removerPet={removerPet} exibirNotificacao={exibirNotificacao} />;
    }
  };

  if (!usuarioAtual) return null;

  return (
    <div className="app-root-premium">
      <Notificacao visivel={notificacao.visivel} mensagem={notificacao.mensagem} tipo={notificacao.tipo === 'sucesso' ? 'success' : 'error'} />

      <BarraLateral tela={tela} setTela={setTela} aoSair={sair} />

      <MenuMobile aberto={menuAberto} tela={tela} setTela={setTela} aoSair={sair} aoFechar={() => setMenuAberto(false)} />

      <Layout tela={tela} setTela={setTela} aoAbrirMenu={() => setMenuAberto(true)}>
        {renderizarTela()}
      </Layout>
    </div>
  );
};

export default AppInterno;
