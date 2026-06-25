import { createContext } from 'react';

export const AppContext = createContext({
  pets: [],
  adocoes: [],
  resgates: [],
  donationTotal: 0,
  usuarioAtual: null
});
