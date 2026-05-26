const API_URL = 'https://pets-api-gt48.onrender.com';
const CHAVE_USUARIO_ATUAL = 'petmatch_current_user';
const CHAVE_TOKEN = 'petmatch_token';

// Utilitários de armazenamento
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
    const resposta = await fetch(`${API_URL}/usuarios/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    let dados = {};
    try {
      dados = await resposta.json();
    } catch {
      // Se não for JSON (ex: erro 404 em HTML do Express)
    }

    if (!resposta.ok) {
      if (resposta.status === 404 || dados.message?.toLowerCase().includes('não encontrado')) {
        return { sucesso: false, erro: 'Essa conta não existe.' };
      }
      
      return { sucesso: false, erro: dados.error || dados.message || 'E-mail ou senha incorretos.' };
    }

    salvar(CHAVE_USUARIO_ATUAL, dados.usuario || dados);
    if (dados.token) salvar(CHAVE_TOKEN, dados.token);

    return { sucesso: true, usuario: dados };
  } catch (erro) {
    return { sucesso: false, erro: 'Erro de conexão com o servidor' };
  }
};

export const cadastrar = async (dadosUsuario) => {
  try {
    const { name, email, password } = dadosUsuario;
    
    const resposta = await fetch(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    let dados = {};
    try {
      dados = await resposta.json();
    } catch {
      // Evita quebrar a aplicação caso a API retorne HTML em erros
    }

    if (!resposta.ok) {
      return { sucesso: false, erro: dados.error || dados.message || 'Erro ao criar conta. Verifique os dados.' };
    }

    return { sucesso: true, usuario: dados };
  } catch (erro) {
    return { sucesso: false, erro: 'Erro de conexão com o servidor' };
  }
};

export const sair = () => {
  remover(CHAVE_USUARIO_ATUAL);
  remover(CHAVE_TOKEN);
};

export const redefinirSenha = async (email, novaSenha) => {
  // A API documentada não possui um endpoint claro para redefinição de senha ainda.
  // Você pode implementar PATCH /usuarios/:id se souber o ID do usuário,
  // mas como o fluxo normal de esqueci a senha exige token no email, retornaremos um erro amigável por enquanto.
  return { sucesso: false, erro: 'Serviço de redefinição de senha não implementado na API ainda.' };
};
