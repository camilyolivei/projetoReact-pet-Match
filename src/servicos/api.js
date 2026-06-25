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

export const apiUsuarios = {
  criar: async (body) => {
    try {
      const response = await api.post('/usuarios', body);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
  login: async (body) => {
    try {
      const response = await api.post('/usuarios/login', body);
      if (response.data?.token) {
        localStorage.setItem('petmatch_token', response.data.token);
      }
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
  obter: async (id) => {
    try {
      const response = await api.get(`/usuarios/${id}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
  atualizar: async (id, body) => {
    try {
      const response = await api.patch(`/usuarios/${id}`, body);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
  remover: async (id) => {
    try {
      const response = await api.delete(`/usuarios/${id}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
};

export const apiEnderecos = {
  criar: async (body) => {
    try {
      const response = await api.post('/enderecos', body);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  }
};

export const apiInstituicoes = {
  listar: async () => {
    try {
      const response = await api.get('/instituicoes');
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
  criar: async (body) => {
    try {
      const response = await api.post('/instituicoes', body);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  }
};

export const apiPets = {
  listar: async () => {
    try {
      const response = await api.get('/pets');
      const petsFormatados = response.data.map(pet => ({
        ...pet,
        name: pet.name || pet.nome || 'Desconhecido',
        type: pet.type || pet.especie || 'Desconhecido',
        age: pet.age || pet.idade_aproximada || 'Idade desconhecida',
        desc: pet.desc || pet.historia || pet.descricao_saude || 'Sem descrição',
        img: pet.imagem || pet.img || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800'
      }));
      return { ok: true, status: response.status, dados: petsFormatados };
    } catch (error) {
      return handleError(error);
    }
  },
  criar: async (body) => {
    try {
      const response = await api.post('/pets', body);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
  obter: async (id) => {
    try {
      const response = await api.get(`/pets/${id}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
  atualizar: async (id, body) => {
    try {
      const response = await api.patch(`/pets/${id}`, body);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
  remover: async (id) => {
    try {
      const response = await api.delete(`/pets/${id}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
};

export const apiAdocoes = {
  listar: async () => {
    try {
      const response = await api.get('/adocoes');
      const adocoesFormatadas = response.data.map(adocao => ({
        ...adocao,
        petName: adocao.petName || adocao.pet_nome || adocao.pet?.nome || adocao.pet?.name || 'Desconhecido',
        img: adocao.img || adocao.pet_imagem || adocao.pet?.imagem || adocao.pet?.img || '',
        applicant: adocao.applicant || adocao.usuario_nome || adocao.usuario?.nome || adocao.usuario?.name || 'Desconhecido',
        time: adocao.time || (adocao.data_criacao ? new Date(adocao.data_criacao).toLocaleDateString('pt-BR') : 'Data não informada'),
      }));
      return { ok: true, status: response.status, dados: adocoesFormatadas };
    } catch (error) {
      return handleError(error);
    }
  },
  criar: async (body) => {
    try {
      const response = await api.post('/adocoes', body);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
  obter: async (id) => {
    try {
      const response = await api.get(`/adocoes/${id}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
  atualizar: async (id, body) => {
    try {
      const response = await api.patch(`/adocoes/${id}/status`, body);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
  remover: async (id) => {
    try {
      const response = await api.delete(`/adocoes/${id}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
  porUsuario: async (usuarioId) => {
    try {
      const response = await api.get(`/adocoes/usuario/${usuarioId}`);
      const adocoesFormatadas = response.data.map(adocao => ({
        ...adocao,
        usuario_id: usuarioId,
        petName: adocao.petName || 'Pet',
        img: adocao.img || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800',
        time: adocao.requestDate ? new Date(adocao.requestDate).toLocaleDateString('pt-BR') : 'Recente'
      }));
      return { ok: true, status: response.status, dados: adocoesFormatadas };
    } catch (error) {
      return handleError(error);
    }
  },
  porInstituicao: async (instituicaoId) => {
    try {
      const response = await api.get(`/adocoes/instituicao/${instituicaoId}`);
      const adocoesFormatadas = response.data.map(adocao => ({
        ...adocao,
        petName: adocao.petName || 'Pet',
        img: adocao.img || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800',
        time: adocao.requestDate ? new Date(adocao.requestDate).toLocaleDateString('pt-BR') : 'Recente'
      }));
      return { ok: true, status: response.status, dados: adocoesFormatadas };
    } catch (error) {
      return handleError(error);
    }
  },
};

export const apiMatches = {
  discover: async (usuarioId) => {
    try {
      const response = await api.get(`/matches/discover/pets?usuario_id=${usuarioId}`);
      const petsFormatados = response.data.map(pet => ({
        ...pet,
        name: pet.nome || pet.name || 'Desconhecido',
        type: pet.especie || pet.type || 'Desconhecido',
        age: pet.age || pet.idade_aproximada || 'Idade desconhecida',
        desc: pet.desc || pet.historia || pet.descricao_saude || 'Sem descrição',
        img: pet.imagem || pet.img || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800'
      }));
      return { ok: true, status: response.status, dados: petsFormatados };
    } catch (error) {
      return handleError(error);
    }
  },
  swipeUsuario: async (body) => {
    // dados: { usuario_id, pet_id, tipo: 'like' ou 'pass' }
    try {
      const response = await api.post('/matches/swipe/usuario', body);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  }
};

export const apiResgates = {
  listar: async () => {
    try {
      const response = await api.get('/resgates');
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
  reportar: async (body) => {
    try {
      const response = await api.post('/resgates/reportar', body);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  }
};

export const apiDoacoes = {
  criar: async (body) => {
    try {
      const response = await api.post('/doacoes', body);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
  porInstituicao: async (instituicaoId) => {
    try {
      const response = await api.get(`/doacoes/instituicao/${instituicaoId}`);
      return { ok: true, status: response.status, dados: response.data || [] };
    } catch (error) {
      return handleError(error);
    }
  },
  porUsuario: async (usuarioId) => {
    try {
      const response = await api.get(`/doacoes/usuario/${usuarioId}`);
      return { ok: true, status: response.status, dados: response.data || [] };
    } catch (error) {
      return handleError(error);
    }
  }
};
