import { useState, useCallback } from 'react';

// Hook para gerenciar e validar formulários usando regras e regex
export const useForm = (valoresIniciais = {}, regrasValidacao = {}, aoEnviar) => {
  const [valores, setValores] = useState(valoresIniciais);
  const [erros, setErros] = useState({});
  const [tocado, setTocado] = useState({});

  // Função auxiliar para atualizar a mensagem de erro de um campo
  const definirErro = useCallback((nome, erro) => {
    setErros((errosAnteriores) => ({
      ...errosAnteriores,
      [nome]: erro
    }));
  }, []);

  // Valida um campo baseado nas regras
  const validarCampo = useCallback((nome, valor, todosValores) => {
    const regras = regrasValidacao[nome];
    if (!regras) return '';

    const ehObrigatorio = typeof regras.required === 'function' 
      ? regras.required(todosValores) 
      : regras.required;

    const estaVazio = valor === undefined || valor === null || String(valor).trim() === '';

    // Se estiver vazio, decide se retorna erro (se for obrigatório) ou string vazia
    if (estaVazio) {
      return ehObrigatorio ? (regras.mensagemErroObrigatorio || 'Este campo é obrigatório.') : '';
    }

    if (regras.minLength && String(valor).length < regras.minLength) {
      return regras.mensagemErroMinLength || `Deve conter no mínimo ${regras.minLength} caracteres.`;
    }

    if (regras.maxLength && String(valor).length > regras.maxLength) {
      return regras.mensagemErroMaxLength || `Deve conter no máximo ${regras.maxLength} caracteres.`;
    }

    if (regras.regex && !regras.regex.test(String(valor))) {
      return regras.mensagemErroRegex || 'Formato inválido.';
    }

    if (regras.custom && typeof regras.custom === 'function') {
      const erroCustomizado = regras.custom(valor, todosValores);
      if (erroCustomizado) return erroCustomizado;
    }

    return '';
  }, [regrasValidacao]);

  // Valida todos os campos do formulário
  const validarFormulario = useCallback((valoresAtuais) => {
    const novosErros = {};
    Object.keys(regrasValidacao).forEach((nome) => {
      const erro = validarCampo(nome, valoresAtuais[nome], valoresAtuais);
      if (erro) {
        novosErros[nome] = erro;
      }
    });
    return novosErros;
  }, [regrasValidacao, validarCampo]);

  // Atualiza os valores do formulário
  const handleChange = useCallback((evento) => {
    const { name, value, type, checked } = evento.target;
    const valorFinal = type === 'checkbox' ? checked : value;

    setValores((valoresAnteriores) => {
      const novosValores = { ...valoresAnteriores, [name]: valorFinal };
      
      if (tocado[name]) {
        const erro = validarCampo(name, valorFinal, novosValores);
        definirErro(name, erro);
      }
      
      return novosValores;
    });
  }, [tocado, validarCampo, definirErro]);

  // Marca o campo como tocado e executa validação
  const handleBlur = useCallback((evento) => {
    const { name, value } = evento.target;
    
    setTocado((tocadosAnteriores) => ({
      ...tocadosAnteriores,
      [name]: true
    }));

    const erro = validarCampo(name, value, valores);
    definirErro(name, erro);
  }, [valores, validarCampo, definirErro]);

  // Envia o formulário se estiver válido
  const handleSubmit = useCallback(async (evento) => {
    if (evento && typeof evento.preventDefault === 'function') {
      evento.preventDefault();
    }

    const todosTocados = {};
    Object.keys(valores).forEach((nome) => {
      todosTocados[nome] = true;
    });
    setTocado(todosTocados);

    const novosErros = validarFormulario(valores);
    setErros(novosErros);

    const formularioValido = Object.keys(novosErros).every((chave) => !novosErros[chave]);

    if (formularioValido && aoEnviar) {
      await aoEnviar(valores);
    }
  }, [valores, validarFormulario, aoEnviar]);

  // Redefine o formulário
  const resetForm = useCallback(() => {
    setValores(valoresIniciais);
    setErros({});
    setTocado({});
  }, [valoresIniciais]);

  return {
    valores,
    erros,
    tocado,
    handleChange,
    handleBlur,
    handleSubmit,
    setValores,
    setErros,
    resetForm,
    validarFormulario
  };
};

// Expressões regulares para as validações comuns
export const VALIDADORES_REGEX = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  cnpj: /^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/,
  cep: /^\d{5}-?\d{3}$/,
  telefone: /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/,
  url: /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9-._~:?#\[\]@!$&'()*+,;=]*)*$/,
  letrasEAcentos: /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/,
  apenasNumeros: /^\d+$/,
  precoOuQuantidade: /^\d+(\.\d{1,2})?$/
};
