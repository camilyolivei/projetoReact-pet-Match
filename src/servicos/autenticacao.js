import { apiUsuarios, apiInstituicoes, apiEnderecos } from './api.js';

const CHAVE_USUARIO_ATUAL = 'petmatch_current_user';
const CHAVE_TOKEN = 'petmatch_token';

const salvar = (chave, valor) => localStorage.setItem(chave, JSON.stringify(valor));
const remover = (chave) => localStorage.removeItem(chave);

export const obterUsuarioAtual = () => {
  try {
    const valor = localStorage.getItem(CHAVE_USUARIO_ATUAL);
    return valor ? JSON.parse(valor) : null;
  } catch {
    return null;
  }
};

export const obterToken = () => {
  try {
    const valor = localStorage.getItem(CHAVE_TOKEN);
    return valor ? JSON.parse(valor) : null;
  } catch {
    return null;
  }
};

export const entrar = async (email, password) => {
  try {
    const resLogin = await apiUsuarios.login({ email, password });
    
    if (!resLogin.ok) {
      return { sucesso: false, erro: 'E-mail ou senha incorretos.' };
    }

    const { user, token } = resLogin.dados;
    const usuario = user;
    
    // Check if this user is an institution by email
    const resInst = await apiInstituicoes.listar();
    let instituicao_id = null;
    let isOng = false;
    
    let dadosInstituicao = {};
    if (resInst.ok && Array.isArray(resInst.dados)) {
      const inst = resInst.dados.find(i => i.email.toLowerCase() === email.toLowerCase());
      if (inst) {
        instituicao_id = inst.id;
        isOng = true;
        dadosInstituicao = {
          cnpj: inst.cnpj || '',
          telefone: inst.telefone || '',
          link_site: inst.link_site || '',
          descricao: inst.descricao || '',
          endereco_id: inst.endereco_id || null
        };
      }
    }

    const usuarioEnriquecido = {
      ...usuario,
      isOng,
      instituicao_id,
      ...dadosInstituicao
    };

    salvar(CHAVE_USUARIO_ATUAL, usuarioEnriquecido);
    // Token is saved in localStorage by api.js already, but we can ensure it here too
    if (token) {
        localStorage.setItem(CHAVE_TOKEN, token);
    }

    return { sucesso: true, usuario: usuarioEnriquecido };
  } catch (erro) {
    return { sucesso: false, erro: 'Erro de conexão com o servidor.' };
  }
};

export const cadastrar = async (dadosUsuario) => {
  try {
    const { 
      name, email, password, isOng,
      cnpj, telefone, linkSite, descricao,
      rua, numero, complemento, bairro, cidade, estado, cep 
    } = dadosUsuario;
    
    // 1. Criar o usuário normal
    const resCriar = await apiUsuarios.criar({ name, email, password });
    if (!resCriar.ok) {
      return { sucesso: false, erro: resCriar.dados?.message || 'Este e-mail já está em uso ou erro no servidor.' };
    }

    let instituicao_id = null;

    // 2. Se for ONG, precisa criar endereço e instituição na API
    if (isOng) {
      const resEnd = await apiEnderecos.criar({
        rua: rua || "Não informado",
        numero: numero || "S/N",
        complemento: complemento || "",
        bairro: bairro || "Não informado",
        cidade: cidade || "Não informado",
        estado: estado || "XX",
        cep: cep || "00000000",
        latitude: -23.561684, // mock coordinate
        longitude: -46.655981
      });

      let endId = 1;
      if (resEnd.ok) {
        endId = resEnd.dados.id || resEnd.dados[0] || 1;
      }

      // Cria a Instituição
      const resInst = await apiInstituicoes.criar({
        nome: name,
        email: email,
        cnpj: cnpj || "00000000000000",
        telefone: telefone || "0000000000",
        link_site: linkSite || "",
        descricao: descricao || "Criado pelo app Frontend",
        endereco_id: endId
      });

      if (resInst.ok) {
        instituicao_id = resInst.dados.id || resInst.dados[0];
      }
    }

    const novoUsuario = {
      ...resCriar.dados,
      isOng,
      instituicao_id
    };

    return { sucesso: true, usuario: novoUsuario };
  } catch (erro) {
    return { sucesso: false, erro: 'Erro ao criar conta no servidor.' };
  }
};

export const sair = () => {
  remover(CHAVE_USUARIO_ATUAL);
  remover(CHAVE_TOKEN);
};
