import React from 'react';

function ButtonGroup({ onAddImage, onSummarize, onAnalyzeVideo, onAnalyzeData }) {
    return (
      <div className="flex gap-4 mt-4 justify-center">
        <button
          onClick={onAddImage}
          className="flex items-center gap-2 px-6 py-2 bg-[#D3D3D3] border border-[#B0B0B0] rounded-full 
          hover:bg-[#A9A9A9] text-black font-medium transition-all duration-200 group"
        >
          <svg 
            className="w-5 h-5 text-green-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          Create image
        </button>
        
        <button
          onClick={onSummarize}
          className="flex items-center gap-2 px-6 py-2 bg-[#D3D3D3] border border-[#B0B0B0] rounded-full 
          hover:bg-[#A9A9A9] text-black font-medium transition-all duration-200 group"
        >
          <svg 
            className="w-5 h-5 text-orange-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
          Summarize text
        </button>
        
        <button
          onClick={onAnalyzeVideo}
          className="flex items-center gap-2 px-6 py-2 bg-[#D3D3D3] border border-[#B0B0B0] rounded-full 
          hover:bg-[#A9A9A9] text-black font-medium transition-all duration-200 group"
        >
          <svg 
            className="w-5 h-5 text-blue-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 10l4.5 4.5L15 19V10zM3 5h12a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2z" 
            />
          </svg>
          Analyze Video
        </button>
        
        <button
          onClick={onAnalyzeData}
          className="flex items-center gap-2 px-6 py-2 bg-[#D3D3D3] border border-[#B0B0B0] rounded-full 
          hover:bg-[#A9A9A9] text-black font-medium transition-all duration-200 group"
        >
          <svg 
            className="w-5 h-5 text-purple-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 3h18v18H3V3zm6 6h6v6H9V9z" 
            />
          </svg>
          Analyze Data
        </button>
      </div>
    );
  }
export default ButtonGroup;