import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const themePalettes = {
  light: {
    theme: 'light',
    background: '#F5F5F7',
    cardBackground: '#FFFFFF',
    textPrimary: '#111111',
    textSecondary: '#6E6E73',
    accent: '#FF2E2E', // Yango Brand Red
    primary: '#FF2E2E',
    ethioGreen: '#00D154',
    ethioGold: '#FFCC00',
    border: '#E5E5EA',
    shadow: 'rgba(0, 0, 0, 0.08)',
    ethioFlag: {
      green: '#00D154',
      yellow: '#FFCC00',
      red: '#FF2E2E',
    },
  },
  dark: {
    theme: 'dark',
    background: '#0F172A',
    cardBackground: '#1C1C1E',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    accent: '#FF2E2E', // Yango Brand Red
    primary: '#FF2E2E',
    ethioGreen: '#00D154',
    ethioGold: '#FFCC00',
    border: '#2C2C2E',
    shadow: 'rgba(0, 0, 0, 0.5)',
    ethioFlag: {
      green: '#00D154',
      yellow: '#FFCC00',
      red: '#FF2E2E',
    },
  },
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = themePalettes[mode];

  return (
    <ThemeContext.Provider value={{ mode, theme, toggleTheme, setMode, isDark: mode === 'dark' }}>
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
      isDark: false,
      toggleTheme: () => {},
      setMode: () => {},
    };
  }
  return context;
};

