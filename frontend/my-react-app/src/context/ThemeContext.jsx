import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

const THEME_COLORS = {
  blue: '#608BC1',
  red: '#B03052',
  green: '#7ED4AD',
  yellow: '#D7B26D',
  purple: '#9694FF',
};

export function ThemeProvider({ children }) {
  const [themeColor, setThemeColor] = useState(THEME_COLORS.blue); // Default blue

  const updateThemeColor = (color) => {
    setThemeColor(color);
    // Optional: Save to localStorage for persistence
    localStorage.setItem('themeColor', color);
  };

  return (
    <ThemeContext.Provider value={{ themeColor, updateThemeColor }}>
      <div 
        className="min-h-screen w-full transition-colors duration-300"
        style={{ 
          backgroundColor: themeColor,
          backgroundImage: `linear-gradient(to bottom right, ${themeColor}, ${themeColor}dd)`,
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export { THEME_COLORS }; 