import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'emerald-enterprise' | 'midnight-gold' | 'ocean-pro';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Check local storage or system preference
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('oftsy-theme') as Theme;
    return saved || 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove old themes
    root.classList.remove('light', 'dark', 'softsy');
    // Add new theme
    root.classList.add(theme);
    
    localStorage.setItem('oftsy-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};