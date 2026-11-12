import React, { createContext, useContext, useState, useEffect } from 'react';

export const THEMES = [
  {
    id: 'dark',
    name: 'Dark Slate',
    category: 'Dark',
    desc: 'Deep midnight charcoal canvas with slate tones',
    bg: '#090d16',
    surface: '#111827',
    border: '#1e293b',
    text: '#f8fafc'
  },
  {
    id: 'light',
    name: 'Clean Light',
    category: 'Light',
    desc: 'Crisp minimal daylight for high readability',
    bg: '#f8fafc',
    surface: '#ffffff',
    border: '#e2e8f0',
    text: '#0f172a'
  },
  {
    id: 'oled',
    name: 'OLED Pitch',
    category: 'Dark',
    desc: 'Pure true-black canvas with ultra contrast',
    bg: '#000000',
    surface: '#0a0a0c',
    border: '#1e1e28',
    text: '#ffffff'
  },
  {
    id: 'forest',
    name: 'Evergreen Nocturne',
    category: 'Dark',
    desc: 'Botanical deep pine night with emerald undertones',
    bg: '#05130e',
    surface: '#0b1e17',
    border: '#15392d',
    text: '#f0fdf4'
  },
  {
    id: 'synthwave',
    name: 'Cyberpunk Twilight',
    category: 'Dark',
    desc: 'Neon midnight atmosphere with violet glow',
    bg: '#0c0a1a',
    surface: '#15122b',
    border: '#2a2355',
    text: '#fdf4ff'
  },
  {
    id: 'nordic',
    name: 'Nordic Frost',
    category: 'Dark',
    desc: 'Subdued cold arctic navy and steel gray',
    bg: '#0f172a',
    surface: '#1e293b',
    border: '#334155',
    text: '#f1f5f9'
  }
];

export const ACCENTS = [
  {
    id: 'indigo',
    name: 'Electric Indigo',
    hex: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    subtle: 'rgba(99, 102, 241, 0.15)'
  },
  {
    id: 'sapphire',
    name: 'Ocean Sapphire',
    hex: '#0ea5e9',
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
    subtle: 'rgba(14, 165, 233, 0.15)'
  },
  {
    id: 'emerald',
    name: 'Emerald Mint',
    hex: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
    subtle: 'rgba(16, 185, 129, 0.15)'
  },
  {
    id: 'rose',
    name: 'Neon Rose',
    hex: '#f43f5e',
    gradient: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)',
    subtle: 'rgba(244, 63, 94, 0.15)'
  },
  {
    id: 'amber',
    name: 'Sunset Amber',
    hex: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
    subtle: 'rgba(245, 158, 11, 0.15)'
  },
  {
    id: 'amethyst',
    name: 'Amethyst Purple',
    hex: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #c026d3 100%)',
    subtle: 'rgba(139, 92, 246, 0.15)'
  },
  {
    id: 'teal',
    name: 'Teal Horizon',
    hex: '#14b8a6',
    gradient: 'linear-gradient(135deg, #14b8a6 0%, #0284c7 100%)',
    subtle: 'rgba(20, 184, 166, 0.15)'
  },
  {
    id: 'crimson',
    name: 'Crimson Ruby',
    hex: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444 0%, #e11d48 100%)',
    subtle: 'rgba(239, 68, 68, 0.15)'
  }
];

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('taskflow_theme') || 'dark';
  });

  const [accent, setAccentState] = useState(() => {
    return localStorage.getItem('taskflow_accent') || 'indigo';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('taskflow_theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accent);
    localStorage.setItem('taskflow_accent', accent);
  }, [accent]);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
  };

  const setAccent = (newAccent) => {
    setAccentState(newAccent);
  };

  const toggleQuickTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const resetToDefaults = () => {
    setThemeState('dark');
    setAccentState('indigo');
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        accent,
        setTheme,
        setAccent,
        toggleQuickTheme,
        resetToDefaults,
        isLight: theme === 'light',
        themes: THEMES,
        accents: ACCENTS
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

