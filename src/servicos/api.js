const API_URL = 'https://pets-api-gt48.onrender.com';

const obterToken = () => {
  try {
    const v = localStorage.getItem('petmatch_token');
    return v ? JSON.parse(v) : null;
  } catch {
    return null;
  }
};

const cabecalhosAutenticados = () => {
  const token = obterToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const requisitar = async (rota, opcoes = {}) => {
  const resposta = await fetch(`${API_URL}${rota}`, {
    headers: cabecalhosAutenticados(),
    ...opcoes,
  });
  let dados = {};
  try { dados = await resposta.json(); } catch { }
  return { ok: resposta.ok, status: resposta.status, dados };
};

// ─── Usuários ───
export const apiUsuarios = {
  criar: (body) => requisitar('/usuarios', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => requisitar('/usuarios/login', { method: 'POST', body: JSON.stringify(body) }),
  obter: (id) => requisitar(`/usuarios/${id}`),
  atualizar: (id, body) => requisitar(`/usuarios/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  remover: (id) => requisitar(`/usuarios/${id}`, { method: 'DELETE' }),
};

// ─── Pets ───
export const apiPets = {
  listar: () => requisitar('/pets'),
  criar: (body) => requisitar('/pets', { method: 'POST', body: JSON.stringify(body) }),
  obter: (id) => requisitar(`/pets/${id}`),
  atualizar: (id, body) => requisitar(`/pets/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  remover: (id) => requisitar(`/pets/${id}`, { method: 'DELETE' }),
};
