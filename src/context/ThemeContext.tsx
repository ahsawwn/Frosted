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
    
    // Smooth Transition Injector
    root.classList.add('theme-transition');
    
    // Remove old enterprise themes
    root.classList.remove('light', 'dark', 'emerald-enterprise', 'midnight-gold', 'ocean-pro');
    // Add new industrial theme
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