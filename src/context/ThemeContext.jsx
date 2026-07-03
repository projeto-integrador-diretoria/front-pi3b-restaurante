import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

const STORAGE_KEY = 'pi3b-theme';
// const DARK = 'dark';
const DARK = 'light'; // Forçando o tema claro para evitar problemas de contraste com o fundo do app
const LIGHT = 'light';

/**
 * Determina o tema inicial:
 * 1. Preferência salva no localStorage
 * 2. Preferência do sistema operacional
 * 3. Fallback: dark
 */
function getInitialTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === DARK || stored === LIGHT) return stored;
  } catch {}

  return window.matchMedia('(prefers-color-scheme: light)').matches ? LIGHT : DARK;
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  // Aplica o atributo no <html> e persiste no localStorage sempre que o tema mudar
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === DARK ? LIGHT : DARK));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === DARK }}>
      {children}
    </ThemeContext.Provider>
  );
}

/** Hook para consumir o contexto de tema em qualquer componente */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme deve ser usado dentro de <ThemeProvider>');
  return ctx;
}
