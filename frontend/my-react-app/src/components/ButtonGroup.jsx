import React, { useState, useEffect } from 'react';

function ButtonGroup({ onAddImage, onSummarize, onAnalyzeVideo, onAnalyzeData }) {
  const [showInputForm, setShowInputForm] = useState(false);
  const [newButtonData, setNewButtonData] = useState({
    title: '',
    prompt: ''
  });
  const [customButtons, setCustomButtons] = useState(() => {
    const savedButtons = localStorage.getItem('customButtons');
    return savedButtons ? JSON.parse(savedButtons) : [];
  });

  useEffect(() => {
    localStorage.setItem('customButtons', JSON.stringify(customButtons));
  }, [customButtons]);

  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (newButtonData.title.trim() && newButtonData.prompt.trim()) {
      const updatedButtons = [...customButtons, {
        title: newButtonData.title.trim(),
        prompt: newButtonData.prompt.trim()
      }];
      setCustomButtons(updatedButtons);
      setNewButtonData({ title: '', prompt: '' });
      setShowInputForm(false);
    }
  };

  const handleRemoveButton = (index) => {
    const updatedButtons = customButtons.filter((_, i) => i !== index);
    setCustomButtons(updatedButtons);
  };

  return (
    <div className="flex flex-wrap gap-4 mt-4 justify-center items-center">
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

      {/* Custom Buttons */}
      {customButtons.map((button, index) => (
        <div key={index} className="relative group">
          <button
            className="flex items-center gap-2 px-6 py-2 bg-[#D3D3D3] border border-[#B0B0B0] rounded-full 
            hover:bg-[#A9A9A9] text-black font-medium transition-all duration-200"
            title={button.prompt}
          >
            {button.title}
          </button>
          <button
            onClick={() => handleRemoveButton(index)}
            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full 
            opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-xs"
          >
            ×
          </button>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 
            bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 
            transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            {button.prompt}
          </div>
        </div>
      ))}

      {/* Input Form Modal */}
      {showInputForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Add New Button</h3>
            <form onSubmit={handleInputSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Button Title
                  </label>
                  <input
                    type="text"
                    value={newButtonData.title}
                    onChange={(e) => setNewButtonData(prev => ({
                      ...prev,
                      title: e.target.value
                    }))}
                    placeholder="Enter button title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Button Prompt
                  </label>
                  <textarea
                    value={newButtonData.prompt}
                    onChange={(e) => setNewButtonData(prev => ({
                      ...prev,
                      prompt: e.target.value
                    }))}
                    placeholder="Enter prompt text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowInputForm(false);
                      setNewButtonData({ title: '', prompt: '' });
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 font-medium"
                  >
                    Add Button
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* More Button */}
      <button
        onClick={() => setShowInputForm(true)}
        className="flex items-center gap-2 px-6 py-2 bg-[#D3D3D3] border border-[#B0B0B0] rounded-full 
        hover:bg-[#A9A9A9] text-black font-medium transition-all duration-200"
      >
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
          />
        </svg>
        More
      </button>
    </div>
  );
}

export default ButtonGroup;