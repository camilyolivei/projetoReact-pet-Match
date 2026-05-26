import React, { createContext, useState, useEffect, useRef } from 'react';
import { apiPets } from '../servicos/api.js';

export const AppContext = createContext();

// ─── Helpers localStorage ───
const carregar = (chave, fallback) => {
  try {
    const v = localStorage.getItem(chave);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};
const salvarLocal = (chave, valor) => localStorage.setItem(chave, JSON.stringify(valor));

// ─── Dados padrão (fallback offline) ───
const PETS_PADRAO = [
  { id: 1, name: 'Max', type: 'Cachorro', age: '2 anos', distance: '2 km', desc: 'Muito brincalhão e ama passeios no parque.', img: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80', owner_id: 1, vacinado: true, castrado: true, cor: 'Caramelo', ativo: true },
  { id: 2, name: 'Luna', type: 'Cachorro', age: '1 ano', distance: '5 km', desc: 'Adora dormir o dia todo e dar muito carinho.', img: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80', owner_id: 1, vacinado: true, castrado: false, cor: 'Preto', ativo: true },
  { id: 3, name: 'Thor', type: 'Cachorro', age: '3 meses', distance: '1 km', desc: 'Um filhote cheio de energia procurando uma família.', img: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80', owner_id: 2, vacinado: false, castrado: false, cor: 'Dourado', ativo: true },
  { id: 4, name: 'Bella', type: 'Cachorro', age: '4 anos', distance: '8 km', desc: 'Super dócil, já está castrada e vacinada.', img: 'https://images.unsplash.com/photo-1537151608804-ea6f272a720e?auto=format&fit=crop&w=800&q=80', owner_id: 3, vacinado: true, castrado: true, cor: 'Branco', ativo: true },
];

export const AppProvider = ({ children }) => {
  const channelRef = useRef(null);

  // ─── Estado global ───
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const [currentUser, _setCurrentUser] = useState(() => carregar('petmatch_current_user', null));
  const [pets, _setPets] = useState(() => carregar('petmatch_pets', PETS_PADRAO));
  const [carregandoPets, setCarregandoPets] = useState(false);

  // ─── Sync helpers ───
  const sync = (chave, valor) => {
    salvarLocal(chave, valor);
    channelRef.current?.postMessage({ chave, valor });
  };

  const setCurrentUser = (v) => { _setCurrentUser(v); sync('petmatch_current_user', v); };
  const setPets = (v) => { _setPets(v); sync('petmatch_pets', v); };

  // ─── BroadcastChannel (multi-tab sync) ───
  useEffect(() => {
    try {
      channelRef.current = new BroadcastChannel('petmatch_realtime');
      channelRef.current.onmessage = ({ data: { chave, valor } }) => {
        if (chave === 'petmatch_current_user') _setCurrentUser(valor);
        else if (chave === 'petmatch_pets') _setPets(valor);
      };
    } catch {}

    const onStorage = ({ key, newValue }) => {
      if (!key || !newValue) return;
      try {
        const valor = JSON.parse(newValue);
        if (key === 'petmatch_current_user') _setCurrentUser(valor);
        else if (key === 'petmatch_pets') _setPets(valor);
      } catch {}
    };
    window.addEventListener('storage', onStorage);

    return () => {
      channelRef.current?.close();
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  // ─── Carregar pets da API ao logar ───
  useEffect(() => {
    if (!currentUser) return;

    const carregarPets = async () => {
      setCarregandoPets(true);
      const { ok, dados } = await apiPets.listar();
      if (ok && Array.isArray(dados)) {
        setPets(dados);
      }
      setCarregandoPets(false);
    };

    carregarPets();
  }, [currentUser?.id]);

  // ─── Toast ───
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  };

  // ─── Perfil ───
  const updateProfile = async (dadosAtualizados) => {
    const usuarioAtualizado = { ...currentUser, ...dadosAtualizados };
    setCurrentUser(usuarioAtualizado);
    // Tenta sincronizar com a API
    try {
      await apiPets.listar(); // mantém sessão ativa
    } catch {}
  };

  // ─── Logout ───
  const logout = () => {
    localStorage.removeItem('petmatch_token');
    setCurrentUser(null);
  };

  // ─── Pets ───
  const addPet = async (dadosPet) => {
    const { ok, dados } = await apiPets.criar(dadosPet);
    if (ok) {
      setPets([{ ...dadosPet, id: dados.id || Date.now(), ativo: true }, ...pets]);
      return { sucesso: true };
    }
    // fallback local
    setPets([{ id: Date.now(), ativo: true, ...dadosPet }, ...pets]);
    return { sucesso: false };
  };

  const updatePet = async (id, dadosPet) => {
    await apiPets.atualizar(id, dadosPet);
    setPets(pets.map(p => p.id === id ? { ...p, ...dadosPet } : p));
  };

  const removePet = async (id) => {
    await apiPets.remover(id);
    setPets(pets.filter(p => p.id !== id));
  };

  const value = {
    toast, showToast,
    currentUser, setCurrentUser, logout, updateProfile,
    pets, addPet, updatePet, removePet, carregandoPets,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
