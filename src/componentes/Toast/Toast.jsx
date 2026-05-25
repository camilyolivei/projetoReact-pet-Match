import React from 'react';
import { Check, AlertCircle } from 'lucide-react';

/**
 * Toast global de notificações.
 * Usa as mesmas classes CSS do sistema de autenticação (global.css)
 * mas também funciona nas telas internas do app (app.css).
 */
const Toast = ({ visivel, mensagem, tipo }) => (
  <div
    className={[
      'notificacao-toast',
      'toast-notificacao',
      visivel ? 'visivel' : '',
      tipo === 'success' ? 'sucesso' : 'erro',
    ].join(' ')}
  >
    {tipo === 'success'
      ? <Check size={18} color="#10b981" />
      : <AlertCircle size={18} color="#ef4444" />
    }
    <span>{mensagem}</span>
  </div>
);

export default Toast;
