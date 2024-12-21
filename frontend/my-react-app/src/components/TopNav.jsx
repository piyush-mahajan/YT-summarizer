import React from 'react';
import ColorPicker from './ColorPicker';

function TopNav({ onColorChange }) {
  return (
    <div className="fixed top-0 right-0 p-4 z-50">
      <div className="flex items-center gap-2">
        {/* <button className="p-2 text-blue-500 hover:text-blue-600 transition-colors">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
            />
          </svg>
        </button> */}
        <ColorPicker onChange={onColorChange} />
      </div>
    </div>
  );
}

export default TopNav; 