import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { THEME_COLORS } from '../context/ThemeContext';

function ColorPicker() {
  const [isOpen, setIsOpen] = useState(false);
  const { themeColor, updateThemeColor } = useTheme();

  const colors = [
    { id: 'blue', value: THEME_COLORS.blue },
    { id: 'red', value: THEME_COLORS.red },
    { id: 'green', value: THEME_COLORS.green },
    { id: 'yellow', value: THEME_COLORS.yellow },
    { id: 'purple', value: THEME_COLORS.purple },
  ];

  const handleColorChange = (color) => {
    updateThemeColor(color);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
  onClick={() => setIsOpen(!isOpen)}
  className="p-2 bg-gray-200 hover:bg-gray-300 transition-colors rounded"
  title="Change theme color"
>
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="black"
    className="w-5 h-5"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" 
    />
  </svg>
</button>


      {isOpen && (
        <div className="absolute right-0 mt-2 p-2 bg-white rounded-lg shadow-xl z-50
                        border border-gray-200 flex gap-2">
          {colors.map((color) => (
            <button
              key={color.id}
              onClick={() => handleColorChange(color.value)}
              className={`w-8 h-8 rounded-full border-2 transition-transform
                ${themeColor === color.value ? 'border-gray-900 scale-110' : 'border-white hover:scale-110'}
                shadow-sm`}
              style={{ backgroundColor: color.value }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ColorPicker; 