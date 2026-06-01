import { createContext } from 'react';

export const AppContext = createContext({
  activeUsers: 0,
  pets: [],
  adocoes: [],
  resgates: [],
  donationTotal: 0
});
