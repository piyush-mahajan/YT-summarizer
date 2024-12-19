import React from 'react';

function Toast({ message, onClose, type = 'success' }) {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`rounded-lg px-4 py-3 shadow-lg flex items-center gap-2 
        ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
        {type === 'success' ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        <span>{message}</span>
        <button 
          onClick={onClose}
          className="ml-2 hover:text-gray-200"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default Toast; 