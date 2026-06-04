import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiPets } from '../../servicos/api.js';

//AppInterno = a tela que aparece depois do login.
import Notificacao from '../../componentes/Notificacao/Notificacao.jsx';
import BarraLateral from '../../componentes/BarraLateral/BarraLateral.jsx';
import MenuMobile from '../../componentes/MenuMobile/MenuMobile.jsx';
import Layout from '../../componentes/Layout/Layout.jsx';

import ListaPets from '../Pets/ListaPets.jsx';
import FormularioPet from '../Pets/FormularioPet.jsx';
import Perfil from '../Perfil/Perfil.jsx';
import Descobrir from '../Descobrir/Descobrir.jsx';
import Adocao from '../Adocao/Adocao.jsx';
import Dashboard from '../Dashboard/Dashboard.jsx';
import Doacoes from '../Doacoes/Doacoes.jsx';
import Resgate from '../Resgate/Resgate.jsx';
import { apiAdocoes, apiDoacoes, apiResgates } from '../../servicos/api.js';
import { AppContext } from '../../context/AppContext.jsx';

// Variável do canal de comunicação entre abas
let canalAbas = null;


const AppInterno = () => {
  const navegar = useNavigate();
  const { pagina } = useParams();

  // estado do usuário logado
  const [usuario, setUsuarioLocal] = useState(() => {
    try {
      const salvo = localStorage.getItem('petmatch_current_user');
      return salvo ? JSON.parse(salvo) : null;
    } catch {
      return null;
    }
  });

  // lista de pets
  const [pets, setPetsLocal] = useState([]);

  // qual tela está aparecendo
  const [tela, setTelaState] = useState(pagina || 'painel');

  const setTela = (novaTela) => {
    if (tela !== novaTela) {
      setTelaState(novaTela);
      navegar(`/app/${novaTela}`);
    }
  };

  useEffect(() => {
    const paginasValidas = ['painel', 'pets', 'formulario_pet', 'perfil', 'descobrir', 'adocao', 'doacoes', 'resgate'];
    if (pagina && paginasValidas.includes(pagina)) {
      if (pagina !== tela) {
        setTelaState(pagina);
      }
    } else {
      navegar('/app/painel', { replace: true });
    }
  }, [pagina]);

  // controle do menu mobile
  const [menuAberto, setMenuAberto] = useState(false);

  // pet que está sendo editado no formulário
  const [petEditando, setPetEditando] = useState(null);

  // dados da notificação (toast)
  const [notificacao, setNotificacao] = useState({ visivel: false, mensagem: '', tipo: 'sucesso' });

  // lista de adoções
  const [adocoes, setAdocoesLocal] = useState([]);

  // novos estados
  const [doacoes, setDoacoes] = useState([]);
  const [resgates, setResgates] = useState([]);
  const [donationTotal, setDonationTotal] = useState(0);

  // salva o usuário no estado + localStorage + avisa outras abas
  function setUsuario(novoValor) {
    setUsuarioLocal(novoValor);
    if (novoValor) {
      localStorage.setItem('petmatch_current_user', JSON.stringify(novoValor));
    } else {
      localStorage.removeItem('petmatch_current_user');
    }
    canalAbas?.postMessage({ chave: 'petmatch_current_user', valor: novoValor });
  }

  // salva os pets no estado
  function setPets(novoValor) {
    setPetsLocal(novoValor);
    canalAbas?.postMessage({ chave: 'petmatch_pets', valor: novoValor });
  }

  // salva as adoções no estado
  function setAdocoes(novoValor) {
    setAdocoesLocal(novoValor);
    canalAbas?.postMessage({ chave: 'petmatch_adocoes', valor: novoValor });
  }


  // se não tem usuário logado, manda pro login
  useEffect(() => {
    if (!usuario) {
      navegar('/login', { replace: true });
    }
  }, [usuario]);

  // fecha o menu mobile quando troca de tela
  useEffect(() => {
    setMenuAberto(false);
  }, [tela]);

  // busca os pets e adoções da API quando o usuário loga
  useEffect(() => {
    if (!usuario) return;

    const buscarDados = () => {
      apiPets.listar().then((resposta) => {
        if (resposta.ok && Array.isArray(resposta.dados)) {
          setPets(resposta.dados);
        }
      });

      apiAdocoes.porUsuario(usuario.id).then((respostaUsuario) => {
        let todasAdocoes = [];
        if (respostaUsuario.ok && Array.isArray(respostaUsuario.dados)) {
          todasAdocoes = [...respostaUsuario.dados];
        }
        
        // Se for ONG, busca também as adoções recebidas e doações
        if (usuario.isOng && usuario.instituicao_id) {
          apiAdocoes.porInstituicao(usuario.instituicao_id).then((respostaInst) => {
            if (respostaInst.ok && Array.isArray(respostaInst.dados)) {
              todasAdocoes = [...todasAdocoes, ...respostaInst.dados];
            }
            // Remove duplicatas por ID
            const unicas = Array.from(new Map(todasAdocoes.map(item => [item.id, item])).values());
            setAdocoes(unicas);
          });
          
          apiDoacoes.porInstituicao(usuario.instituicao_id).then((respostaDoacao) => {
            if (respostaDoacao.ok && Array.isArray(respostaDoacao.dados)) {
              // Mantemos doações locais combinadas com as da API
              setDoacoes(prev => {
                const map = new Map();
                [...prev, ...respostaDoacao.dados].forEach(d => map.set(d.id, d));
                return Array.from(map.values());
              });
              
              setDonationTotal(prevTotal => {
                const apiTotal = respostaDoacao.dados.reduce((acc, curr) => acc + (parseFloat(curr.quantidade) || 0), 0);
                return apiTotal;
              });
            }
          });
        } else {
          setAdocoes(todasAdocoes);
        }
      });

      apiResgates.listar().then((respostaResgates) => {
        if (respostaResgates.ok && Array.isArray(respostaResgates.dados)) {
          setResgates(respostaResgates.dados);
        }
      });
    };

    // Busca imediatamente
    buscarDados();

    // Configura um intervalo para buscar automaticamente a cada 5 segundos
    const intervalo = setInterval(buscarDados, 5000);

    return () => clearInterval(intervalo);
  }, [usuario?.id]);

  // sincroniza dados entre abas do navegador
  useEffect(() => {
    // recebe dados de outra aba e atualiza o estado local
    function receberDadosDeOutraAba(chave, valor) {
      if (chave === 'petmatch_current_user') setUsuarioLocal(valor);
      if (chave === 'petmatch_pets') setPetsLocal(valor);
      if (chave === 'petmatch_adocoes') setAdocoesLocal(valor);
    }

    // cria o canal de comunicação entre abas
    try {
      canalAbas = new BroadcastChannel('petmatch_realtime');
      canalAbas.onmessage = (evento) => {
        receberDadosDeOutraAba(evento.data.chave, evento.data.valor);
      };
    } catch { }

    // fallback: escuta mudanças no localStorage (navegadores antigos)
    function quandoStorageMudar(evento) {
      if (!evento.key || !evento.newValue) return;
      try {
        receberDadosDeOutraAba(evento.key, JSON.parse(evento.newValue));
      } catch { }
    }
    window.addEventListener('storage', quandoStorageMudar);

    // limpa tudo quando o componente desmonta
    return () => {
      canalAbas?.close();
      canalAbas = null;
      window.removeEventListener('storage', quandoStorageMudar);
    };
  }, []);


  // mostra uma notificação por 3 segundos
  function exibirNotificacao(mensagem, tipo = 'sucesso') {
    setNotificacao({ visivel: true, mensagem, tipo });
    setTimeout(() => {
      setNotificacao((anterior) => ({ ...anterior, visivel: false }));
    }, 3000);
  }

  // faz logout
  function sair() {
    localStorage.removeItem('petmatch_token');
    setUsuario(null);
  }

  // adiciona um pet novo
  async function adicionarPet(dadosPet) {
    const resposta = await apiPets.criar(dadosPet);
    const novoPet = {
      id: (resposta.ok && resposta.dados.id) ? resposta.dados.id : Date.now(),
      ativo: true,
      ...dadosPet,
    };
    setPets([novoPet, ...pets]);
  }

  // atualiza um pet existente
  async function atualizarPet(id, dadosPet) {
    await apiPets.atualizar(id, dadosPet);
    setPets(pets.map((pet) => (pet.id === id ? { ...pet, ...dadosPet } : pet)));
  }

  // remove um pet
  async function removerPet(id) {
    await apiPets.remover(id);
    setPets(pets.filter((pet) => pet.id !== id));
  }

  // atualiza o perfil do usuário
  async function atualizarPerfil(dadosNovos) {
    // Tenta atualizar no backend
    try {
      const payload = {
        nome: dadosNovos.name,
        telefone: dadosNovos.telefone
      };
      
      if (usuario.isOng && usuario.instituicao_id) {
        // Se for ONG, adicionamos os novos campos ao payload principal
        if (dadosNovos.cnpj !== undefined) payload.cnpj = dadosNovos.cnpj;
        if (dadosNovos.linkSite !== undefined) payload.link_site = dadosNovos.linkSite;
        if (dadosNovos.descricao !== undefined) payload.descricao = dadosNovos.descricao;

        await fetch(`https://pets-api-gt48.onrender.com/instituicoes/${usuario.instituicao_id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('petmatch_token')}` },
          body: JSON.stringify(payload)
        });

        // Se houver endereco_id, também atualizamos o endereço na API de endereços
        if (usuario.endereco_id && dadosNovos.rua !== undefined) {
          const payloadEndereco = {
            rua: dadosNovos.rua,
            numero: dadosNovos.numero,
            complemento: dadosNovos.complemento,
            bairro: dadosNovos.bairro,
            cidade: dadosNovos.cidade,
            estado: dadosNovos.estado,
            cep: dadosNovos.cep
          };
          await fetch(`https://pets-api-gt48.onrender.com/enderecos/${usuario.endereco_id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('petmatch_token')}` },
            body: JSON.stringify(payloadEndereco)
          });
        }
      } else {
        await fetch(`https://pets-api-gt48.onrender.com/usuarios/${usuario.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('petmatch_token')}` },
          body: JSON.stringify(payload)
        });
      }
    } catch (e) {
      console.error("Erro ao atualizar perfil na API", e);
    }
    
    // Atualiza estado local mapeando corretamente os campos
    const dadosMerge = { ...dadosNovos };
    // Converte camelCase para snake_case que o usuário espera
    if (dadosNovos.linkSite !== undefined) dadosMerge.link_site = dadosNovos.linkSite;
    setUsuario({ ...usuario, ...dadosMerge });
  }

  // criar uma solicitação de adoção
  async function solicitarAdocao(petId) {
    const resposta = await apiAdocoes.criar({
      usuario_id: usuario.id,
      pet_id: petId,
      status: 'pendente'
    });
    
    if (resposta.ok) {
      exibirNotificacao('Adoção solicitada com sucesso! A ONG avaliará o pedido.');
    } else {
      exibirNotificacao('Erro ao solicitar adoção.', 'erro');
    }
  }

  // Fazer doação
  async function fazerDoacao(dados) {
    const resposta = await apiDoacoes.criar(dados);
    if (resposta.ok) {
      setDoacoes(prev => [...prev, resposta.dados]);
      setDonationTotal(prev => prev + parseFloat(dados.quantidade));
    } else {
      exibirNotificacao('Erro na API: O banco de dados recusou a transação (Verifique TIPOS_DOACAO).', 'erro');
    }
  }

  // Reportar Resgate
  async function reportarResgate(dados) {
    const resposta = await apiResgates.reportar({ ...dados, status: 'pendente' });
    if (resposta.ok) {
      const novoResgate = { id: Date.now(), ...dados, status: 'pendente' };
      setResgates(prev => [novoResgate, ...prev]);
    } else {
      exibirNotificacao('Erro ao reportar resgate.', 'erro');
    }
  }

  // atualiza o status de uma adoção
  async function atualizarStatusAdocao(adocaoId, novoStatus, petId) {
    await apiAdocoes.atualizar(adocaoId, { status: novoStatus });
    setAdocoes(
      adocoes.map((a) => (a.id === adocaoId ? { ...a, status: novoStatus } : a))
    );

    // Se a adoção foi aprovada, marca o pet como indisponível
    if (novoStatus === 'aprovada') {
      await atualizarPet(petId, { ativo: false });
    }
  }

  // Renderiza a tela baseada na navegação
  const renderizarTela = () => {
    switch (tela) {
      case 'painel':
        return <Dashboard setView={setTela} />;
      case 'pets':
        return <ListaPets pets={pets} setPetEditando={setPetEditando} setTela={setTela} usuarioAtual={usuario} removerPet={removerPet} />;
      case 'formulario_pet':
        return <FormularioPet petEditando={petEditando} setPetEditando={setPetEditando} usuarioAtual={usuario} setTela={setTela} adicionarPet={adicionarPet} atualizarPet={atualizarPet} exibirNotificacao={exibirNotificacao} />;
      case 'perfil':
        return <Perfil usuarioAtual={usuario} atualizarPerfil={atualizarPerfil} exibirNotificacao={exibirNotificacao} />;
      case 'descobrir':
        return <Descobrir pets={pets} adocoes={adocoes} usuarioAtual={usuario} exibirNotificacao={exibirNotificacao} setTela={setTela} criarAdocao={solicitarAdocao} />;
      case 'adocao':
        return <Adocao adocoes={adocoes} pets={pets} usuarioAtual={usuario} atualizarStatusAdocao={atualizarStatusAdocao} exibirNotificacao={exibirNotificacao} />;
      case 'doacoes':
        return <Doacoes setTela={setTela} usuarioAtual={usuario} fazerDoacao={fazerDoacao} exibirNotificacao={exibirNotificacao} />;
      case 'resgate':
        return <Resgate setTela={setTela} reportarResgate={reportarResgate} exibirNotificacao={exibirNotificacao} />;
      default:
        return <ListaPets pets={pets} setPetEditando={setPetEditando} setTela={setTela} usuarioAtual={usuario} removerPet={removerPet} />;
    }
  };

  const contextValue = {
    activeUsers: 42, // mock since we don't have a route for total active users
    pets,
    adocoes,
    resgates,
    doacoes,
    donationTotal
  };

  // se não tem usuário, não renderiza nada
  if (!usuario) return null;

  return (
    <AppContext.Provider value={contextValue}>
      <div className="app-root-premium">
        <Notificacao
          visivel={notificacao.visivel}
          mensagem={notificacao.mensagem}
          tipo={notificacao.tipo === 'sucesso' ? 'success' : 'error'}
        />

        <BarraLateral tela={tela} setTela={setTela} aoSair={sair} usuarioAtual={usuario} />

        <MenuMobile
          aberto={menuAberto}
          tela={tela}
          setTela={setTela}
          aoSair={sair}
          aoFechar={() => setMenuAberto(false)}
          usuarioAtual={usuario}
        />

        <Layout tela={tela} setTela={setTela} aoAbrirMenu={() => setMenuAberto(true)}>
          {renderizarTela()}
        </Layout>
      </div>
    </AppContext.Provider>
  );
};

export default AppInterno;
