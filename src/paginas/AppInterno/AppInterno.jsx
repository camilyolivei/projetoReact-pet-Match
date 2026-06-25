import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiPets } from '../../servicos/api.js';

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

  const [usuario, setUsuarioLocal] = useState(() => {
    try {
      const salvo = localStorage.getItem('petmatch_current_user');
      return salvo ? JSON.parse(salvo) : null;
    } catch {
      return null;
    }
  });

  const [pets, setPetsLocal] = useState([]);

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

  const [menuAberto, setMenuAberto] = useState(false);

  const [petEditando, setPetEditando] = useState(null);

  const [notificacao, setNotificacao] = useState({ visivel: false, mensagem: '', tipo: 'sucesso' });

  const [adocoes, setAdocoesLocal] = useState([]);

  const [doacoes, setDoacoes] = useState([]);
  const [resgates, setResgates] = useState([]);
  const [donationTotal, setDonationTotal] = useState(0);

  function setUsuario(novoValor) {
    setUsuarioLocal(novoValor);
    if (novoValor) {
      localStorage.setItem('petmatch_current_user', JSON.stringify(novoValor));
    } else {
      localStorage.removeItem('petmatch_current_user');
    }
    canalAbas?.postMessage({ chave: 'petmatch_current_user', valor: novoValor });
  }

  function setPets(novoValor) {
    setPetsLocal(novoValor);
    canalAbas?.postMessage({ chave: 'petmatch_pets', valor: novoValor });
  }

  function setAdocoes(novoValor) {
    setAdocoesLocal(novoValor);
    canalAbas?.postMessage({ chave: 'petmatch_adocoes', valor: novoValor });
  }


  useEffect(() => {
    if (!usuario) {
      navegar('/login', { replace: true });
    }
  }, [usuario]);

  useEffect(() => {
    setMenuAberto(false);
  }, [tela]);

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

        if (usuario.isOng && usuario.instituicao_id) {
          apiAdocoes.porInstituicao(usuario.instituicao_id).then((respostaInst) => {
            if (respostaInst.ok && Array.isArray(respostaInst.dados)) {
              todasAdocoes = [...todasAdocoes, ...respostaInst.dados];
            }
            const unicas = Array.from(new Map(todasAdocoes.map(item => [item.id, item])).values());
            setAdocoes(unicas);
          });

          apiDoacoes.porInstituicao(usuario.instituicao_id).then((respostaDoacao) => {
            if (respostaDoacao.ok && Array.isArray(respostaDoacao.dados)) {
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
          apiDoacoes.porUsuario(usuario.id).then((respostaDoacao) => {
            if (respostaDoacao.ok && Array.isArray(respostaDoacao.dados)) {
              setDoacoes(prev => {
                const map = new Map();
                [...prev, ...respostaDoacao.dados].forEach(d => map.set(d.id, d));
                return Array.from(map.values());
              });
            }
          });
        }
      });

      apiResgates.listar().then((respostaResgates) => {
        if (respostaResgates.ok && Array.isArray(respostaResgates.dados)) {
          setResgates(respostaResgates.dados.filter(r => r.status !== 'excluido'));
        }
      });
    };

    buscarDados();
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

    // alternativa para navegadores antigos: escuta mudanças no localStorage
    function quandoStorageMudar(evento) {
      if (!evento.key || !evento.newValue) return;
      try {
        receberDadosDeOutraAba(evento.key, JSON.parse(evento.newValue));
      } catch { }
    }
    window.addEventListener('storage', quandoStorageMudar);

    return () => {
      canalAbas?.close();
      canalAbas = null;
      window.removeEventListener('storage', quandoStorageMudar);
    };
  }, []);


  function exibirNotificacao(mensagem, tipo = 'sucesso') {
    setNotificacao({ visivel: true, mensagem, tipo });
    setTimeout(() => {
      setNotificacao((anterior) => ({ ...anterior, visivel: false }));
    }, 3000);
  }

  function sair() {
    localStorage.removeItem('petmatch_token');
    setUsuario(null);
  }

  async function adicionarPet(dadosPet) {
    const resposta = await apiPets.criar(dadosPet);
    const novoPet = {
      id: (resposta.ok && resposta.dados.id) ? resposta.dados.id : Date.now(),
      ativo: true,
      ...dadosPet,
    };
    setPets([novoPet, ...pets]);
  }

  async function atualizarPet(id, dadosPet) {
    await apiPets.atualizar(id, dadosPet);
    setPets(pets.map((pet) => (pet.id === id ? { ...pet, ...dadosPet } : pet)));
  }

  async function removerPet(id) {
    await apiPets.remover(id);
    setPets(pets.filter((pet) => pet.id !== id));
  }

  async function atualizarPerfil(dadosNovos) {
    // Tenta atualizar no backend
    try {
      const payload = {
        name: dadosNovos.name,
        telefone: dadosNovos.telefone,
        endereco: {
          rua: dadosNovos.rua || "",
          numero: dadosNovos.numero || "",
          complemento: dadosNovos.complemento || "",
          bairro: dadosNovos.bairro || "",
          cidade: dadosNovos.cidade || "",
          estado: dadosNovos.estado || "",
          cep: dadosNovos.cep || ""
        }
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
    // Converte nomenclatura de camelCase para o padrão snake_case esperado pela API
    if (dadosNovos.linkSite !== undefined) dadosMerge.link_site = dadosNovos.linkSite;
    setUsuario({ ...usuario, ...dadosMerge });
  }

  async function excluirPerfil() {
    try {
      if (usuario.isOng && usuario.instituicao_id) {
        await fetch(`https://pets-api-gt48.onrender.com/instituicoes/${usuario.instituicao_id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('petmatch_token')}` } });
      }
      await fetch(`https://pets-api-gt48.onrender.com/usuarios/${usuario.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('petmatch_token')}` } });
    } catch (e) {
      console.error("Erro ao excluir perfil na API", e);
    }
    sair();
    setUsuario(null);
    navegar('/');
  }

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

  async function fazerDoacao(dados) {
    const resposta = await apiDoacoes.criar(dados);
    if (resposta.ok) {
      setDoacoes(prev => [...prev, resposta.dados]);
      setDonationTotal(prev => prev + parseFloat(dados.quantidade));
    } else {
      exibirNotificacao('Erro na API: O banco de dados recusou a transação (Verifique TIPOS_DOACAO).', 'erro');
    }
  }

  async function reportarResgate(dados) {
    const payloadCombinado = `${dados.descricao} | Local: ${dados.localizacao}`;
    const resposta = await apiResgates.reportar({ descricao: payloadCombinado, localizacao: payloadCombinado, status: 'pendente' });
    if (resposta.ok) {
      // Tentar buscar imediatamente para pegar o ID real
      apiResgates.listar().then(resBusca => {
        if (resBusca.ok && Array.isArray(resBusca.dados)) {
          const resgatesAtivos = resBusca.dados.filter(r => r.status !== 'excluido');
          setResgates(resgatesAtivos);
          // O resgate mais recente com esse texto será o nosso
          const meuCriado = resgatesAtivos.find(r => r.descricao === payloadCombinado);
          if (meuCriado) {
            const meus = JSON.parse(localStorage.getItem('petmatch_meus_resgates') || '[]');
            if (!meus.includes(meuCriado.id)) meus.push(meuCriado.id);
            localStorage.setItem('petmatch_meus_resgates', JSON.stringify(meus));
          }
        }
      });
    } else {
      exibirNotificacao('Erro ao reportar resgate.', 'erro');
    }
  }

  async function excluirResgate(id) {
    try {
      await fetch(`https://pets-api-gt48.onrender.com/resgates/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'excluido' })
      });
      setResgates(prev => prev.filter(r => r.id !== id));
      exibirNotificacao('Resgate excluído com sucesso!');
    } catch {
      exibirNotificacao('Erro ao excluir resgate.', 'erro');
    }
  }

  // Editar Resgate (Simula edição excluindo o antigo e criando um novo)
  async function editarResgate(idAntigo, novaDesc, novaLoc) {
    try {
      await fetch(`https://pets-api-gt48.onrender.com/resgates/${idAntigo}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'excluido' })
      });
      await reportarResgate({ descricao: novaDesc, localizacao: novaLoc });
      exibirNotificacao('Resgate atualizado com sucesso!');
    } catch {
      exibirNotificacao('Erro ao editar resgate.', 'erro');
    }
  }

  // atualiza o status de uma adoção
  async function atualizarStatusAdocao(adocaoId, novoStatus, petId) {
    await apiAdocoes.atualizar(adocaoId, { status: novoStatus });

    let novasAdocoes = adocoes.map((a) => (a.id === adocaoId ? { ...a, status: novoStatus } : a));

    // Se a adoção foi aprovada, marca o pet como indisponível e recusa as outras solicitações para este pet
    if (novoStatus === 'aprovada') {
      await atualizarPet(petId, { ativo: false });

      // Recusar as outras adoções para o mesmo pet
      const outrasAdocoes = novasAdocoes.filter(a => a.petId === petId && a.id !== adocaoId && a.status === 'pendente');
      for (const adocao of outrasAdocoes) {
        await apiAdocoes.atualizar(adocao.id, { status: 'recusada' });
      }

      novasAdocoes = novasAdocoes.map(a => {
        if (a.petId === petId && a.id !== adocaoId && a.status === 'pendente') {
          return { ...a, status: 'recusada' };
        }
        return a;
      });
    }

    setAdocoes(novasAdocoes);
  }

  const renderizarTela = () => {
    switch (tela) {
      case 'painel':
        return <Dashboard setView={setTela} excluirResgate={excluirResgate} editarResgate={editarResgate} />;
      case 'pets':
        return <ListaPets pets={pets} setPetEditando={setPetEditando} setTela={setTela} usuarioAtual={usuario} removerPet={removerPet} />;
      case 'formulario_pet':
        return <FormularioPet petEditando={petEditando} setPetEditando={setPetEditando} usuarioAtual={usuario} setTela={setTela} adicionarPet={adicionarPet} atualizarPet={atualizarPet} exibirNotificacao={exibirNotificacao} />;
      case 'perfil':
        return <Perfil usuarioAtual={usuario} atualizarPerfil={atualizarPerfil} excluirPerfil={excluirPerfil} exibirNotificacao={exibirNotificacao} />;
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
    pets,
    adocoes,
    resgates,
    doacoes,
    donationTotal,
    usuarioAtual: usuario
  };

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
