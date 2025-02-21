'use client';

import { createContext, useContext, ReactNode, useState } from 'react';

export type Theme = 'classic' | 'dark' | 'synthwave' | 'forest' | 'coffee';

export const themes = {
  classic: {
    window: 'bg-[#C0C0C0]',
    header: 'bg-[#000080]',
    text: 'text-black',
    border: 'border-[#DFDFDF] border-r-[#808080] border-b-[#808080]',
    button: 'bg-[#C0C0C0] text-black',
    buttonHover: 'hover:bg-[#DFDFDF]',
    editor: 'bg-white',
    sidebar: 'bg-[#C0C0C0]',
  },
  synthwave: {
    window: 'bg-[#1a1a2e]',
    header: 'bg-gradient-to-r from-[#ff2a6d] to-[#7a04eb]',
    text: 'text-[#ff2a6d]',
    border: 'border-[#ff2a6d] border-r-[#7a04eb] border-b-[#7a04eb]',
    button: 'bg-[#16213e] text-[#ff2a6d]',
    buttonHover: 'hover:bg-[#1a1a2e]',
    editor: 'bg-[#0f0f1b] text-[#f706cf]',
    sidebar: 'bg-[#1a1a2e]',
  },
  forest: {
    window: 'bg-[#2c4a3c]',
    header: 'bg-[#1a332b]',
    text: 'text-[#c8e6c9]',
    border: 'border-[#4a7862] border-r-[#1a332b] border-b-[#1a332b]',
    button: 'bg-[#3e6553] text-[#c8e6c9]',
    buttonHover: 'hover:bg-[#4a7862]',
    editor: 'bg-[#243c32] text-[#e8f5e9]',
    sidebar: 'bg-[#2c4a3c]',
  },
  coffee: {
    window: 'bg-[#483434]',
    header: 'bg-[#3c2a21]',
    text: 'text-[#e5c3a6]',
    border: 'border-[#6b4f4f] border-r-[#3c2a21] border-b-[#3c2a21]',
    button: 'bg-[#6b4f4f] text-[#e5c3a6]',
    buttonHover: 'hover:bg-[#7d5e5e]',
    editor: 'bg-[#3c2a21] text-[#e5c3a6]',
    sidebar: 'bg-[#483434]',
  },
  dark: {
    window: 'bg-[#333333]',
    header: 'bg-[#1A1A1A]',
    text: 'text-white',
    border: 'border-[#4A4A4A] border-r-[#1A1A1A] border-b-[#1A1A1A]',
    button: 'bg-[#4A4A4A] text-gray-200',
    buttonHover: 'hover:bg-[#5A5A5A]',
    editor: 'bg-[#2A2A2A] text-white',
    sidebar: 'bg-[#333333]',
  },
};
type ThemeContextType = {
  theme: Theme;
  themes: typeof themes;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('classic');

  return (
    <ThemeContext.Provider value={{ theme, themes, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
