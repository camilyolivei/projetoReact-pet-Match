import axios from 'axios';

const api = axios.create({
  baseURL: 'https://pets-api-gt48.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('petmatch_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const handleResponse = (response) => {
  return { ok: true, status: response.status, dados: response.data };
};

const handleError = (error) => {
  return { 
    ok: false, 
    status: error.response?.status || 500, 
    dados: error.response?.data || { message: error.message } 
  };
};

// Função utilitária genérica para requisições de API
const requisitar = async (metodo, url, dados = null, formatador = null) => {
  try {
    const response = await api[metodo](url, dados);
    const dadosFormatados = formatador ? formatador(response.data) : response.data;
    return { ok: true, status: response.status, dados: dadosFormatados };
  } catch (error) {
    return handleError(error);
  }
};

export const apiUsuarios = {
  criar: (dados) => requisitar('post', '/usuarios', dados),
  login: async (dados) => {
    try {
      const response = await api.post('/usuarios/login', dados);
      if (response.data?.token) {
        localStorage.setItem('petmatch_token', response.data.token);
      }
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
  obter: (id) => requisitar('get', `/usuarios/${id}`),
  atualizar: (id, dados) => requisitar('patch', `/usuarios/${id}`, dados),
  remover: (id) => requisitar('delete', `/usuarios/${id}`),
};

export const apiEnderecos = {
  criar: (dados) => requisitar('post', '/enderecos', dados),
  obter: (id) => requisitar('get', `/enderecos/${id}`),
  atualizar: (id, dados) => requisitar('patch', `/enderecos/${id}`, dados)
};

export const apiInstituicoes = {
  listar: () => requisitar('get', '/instituicoes'),
  criar: (dados) => requisitar('post', '/instituicoes', dados),
  atualizar: (id, dados) => requisitar('patch', `/instituicoes/${id}`, dados),
  remover: (id) => requisitar('delete', `/instituicoes/${id}`)
};

export const apiPets = {
  listar: () => requisitar('get', '/pets', null, (dados) => 
    dados.map(pet => ({
      ...pet,
      name: pet.name || pet.nome || 'Desconhecido',
      type: pet.type || pet.especie || 'Desconhecido',
      age: pet.age || pet.idade_aproximada || 'Idade desconhecida',
      desc: pet.desc || pet.historia || pet.descricao_saude || 'Sem descrição',
      img: pet.imagem || pet.img || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800'
    }))
  ),
  criar: (dados) => requisitar('post', '/pets', dados),
  obter: (id) => requisitar('get', `/pets/${id}`),
  atualizar: (id, dados) => requisitar('patch', `/pets/${id}`, dados),
  remover: (id) => requisitar('delete', `/pets/${id}`),
};

export const apiAdocoes = {
  listar: () => requisitar('get', '/adocoes', null, (dados) => 
    dados.map(adocao => ({
      ...adocao,
      petName: adocao.petName || adocao.pet_nome || adocao.pet?.nome || adocao.pet?.name || 'Desconhecido',
      img: adocao.img || adocao.pet_imagem || adocao.pet?.imagem || adocao.pet?.img || '',
      applicant: adocao.applicant || adocao.usuario_nome || adocao.usuario?.nome || adocao.usuario?.name || 'Desconhecido',
      time: adocao.time || (adocao.data_criacao ? new Date(adocao.data_criacao).toLocaleDateString('pt-BR') : 'Data não informada'),
    }))
  ),
  criar: (dados) => requisitar('post', '/adocoes', dados),
  obter: (id) => requisitar('get', `/adocoes/${id}`),
  atualizar: (id, dados) => requisitar('patch', `/adocoes/${id}/status`, dados),
  remover: (id) => requisitar('delete', `/adocoes/${id}`),
  porUsuario: (usuarioId) => requisitar('get', `/adocoes/usuario/${usuarioId}`, null, (dados) => 
    dados.map(adocao => ({
      ...adocao,
      usuario_id: usuarioId,
      petName: adocao.petName || 'Pet',
      img: adocao.img || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800',
      time: adocao.requestDate ? new Date(adocao.requestDate).toLocaleDateString('pt-BR') : 'Recente'
    }))
  ),
  porInstituicao: (instituicaoId) => requisitar('get', `/adocoes/instituicao/${instituicaoId}`, null, (dados) => 
    dados.map(adocao => ({
      ...adocao,
      petName: adocao.petName || 'Pet',
      img: adocao.img || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800',
      time: adocao.requestDate ? new Date(adocao.requestDate).toLocaleDateString('pt-BR') : 'Recente'
    }))
  ),
};

export const apiMatches = {
  discover: (usuarioId) => requisitar('get', `/matches/discover/pets?usuario_id=${usuarioId}`, null, (dados) => 
    dados.map(pet => ({
      ...pet,
      name: pet.nome || pet.name || 'Desconhecido',
      type: pet.especie || pet.type || 'Desconhecido',
      age: pet.age || pet.idade_aproximada || 'Idade desconhecida',
      desc: pet.desc || pet.historia || pet.descricao_saude || 'Sem descrição',
      img: pet.imagem || pet.img || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800'
    }))
  ),
  swipeUsuario: (dados) => requisitar('post', '/matches/swipe/usuario', dados)
};

export const apiResgates = {
  listar: () => requisitar('get', '/resgates'),
  reportar: (dados) => requisitar('post', '/resgates/reportar', dados),
  atualizarStatus: (id, status) => requisitar('patch', `/resgates/${id}/status`, { status })
};

export const apiDoacoes = {
  criar: (dados) => requisitar('post', '/doacoes', dados),
  porInstituicao: (instituicaoId) => requisitar('get', `/doacoes/instituicao/${instituicaoId}`, null, (dados) => dados || []),
  porUsuario: (usuarioId) => requisitar('get', `/doacoes/usuario/${usuarioId}`, null, (dados) => dados || [])
};
