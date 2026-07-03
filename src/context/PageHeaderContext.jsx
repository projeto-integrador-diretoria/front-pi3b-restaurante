import { createContext, useContext, useState, useCallback } from 'react';

const PageHeaderContext = createContext(null);

const DEFAULT_STATE = {
  title: '',
  subtitle: '',
  showBack: false,
  onBack: null, // null = usa navigate(-1) por padrão
};

export function PageHeaderProvider({ children }) {
  const [header, setHeaderState] = useState(DEFAULT_STATE);

  /**
   * Define as informações do header a partir de qualquer página.
   *
   * @param {object} config
   * @param {string}   config.title    - Título da página (obrigatório)
   * @param {string}   [config.subtitle] - Subtexto/descrição (opcional)
   * @param {boolean}  [config.showBack] - Exibir botão de voltar (default: false)
   * @param {function} [config.onBack]   - Callback ao clicar em voltar.
   *                                       Se omitido, usa navigate(-1).
   */
  const setHeader = useCallback((config) => {
    setHeaderState({ ...DEFAULT_STATE, ...config });
  }, []);

  return (
    <PageHeaderContext.Provider value={{ ...header, setHeader }}>
      {children}
    </PageHeaderContext.Provider>
  );
}

/** Hook para consumir e controlar o header a partir de qualquer página */
export function usePageHeader() {
  const ctx = useContext(PageHeaderContext);
  if (!ctx) throw new Error('usePageHeader deve ser usado dentro de <PageHeaderProvider>');
  return ctx;
}
