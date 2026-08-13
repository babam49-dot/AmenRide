import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const themePalettes = {
  light: {
    theme: 'light',
    background: '#F8FAFC',
    cardBackground: '#FFFFFF',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    accent: '#0284C7',
    primary: '#0D9488',
    border: '#E2E8F0',
    shadow: 'rgba(15, 23, 42, 0.08)',
  },
  dark: {
    theme: 'dark',
    background: '#0F172A',
    cardBackground: '#1E293B',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    accent: '#38BDF8',
    primary: '#14B8A6',
    border: '#334155',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = themePalettes[mode];

  return (
    <ThemeContext.Provider value={{ mode, theme, toggleTheme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      mode: 'light',
      theme: themePalettes.light,
      toggleTheme: () => {},
      setMode: () => {},
    };
  }
  return context;
};
