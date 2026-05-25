
import { Check, AlertCircle } from 'lucide-react';

const Notificacao = ({ visivel, mensagem, tipo }) => (
  <div className={`notificacao-toast ${visivel ? 'visivel' : ''} ${tipo === 'success' ? 'sucesso' : 'erro'}`}>
    {tipo === 'success' ? <Check size={18} color="#10b981" /> : <AlertCircle size={18} color="#ef4444" />}
    <span>{mensagem}</span>
  </div>
);

export default Notificacao;
