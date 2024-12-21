import React, { useState } from 'react';

function ActionPills({ onAction }) {
  const [showMore, setShowMore] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showPromptInput, setShowPromptInput] = useState(false);

  const mainActions = [
    { id: 'create-image', label: 'Create Image', icon: '🖼️', prompt: 'Create an image based on the transcript' },
    { id: 'summarize', label: 'Summarize text', icon: '📝', prompt: 'Summarize the key points' },
    { id: 'analyze-video', label: 'Analyze Video', icon: '🎥', prompt: 'Analyze the video content' },
    { id: 'analyze-data', label: 'Analyze Data', icon: '📊', prompt: 'Extract and analyze data points' },
  ];

  const handleActionClick = (action) => {
    if (action.customizable) {
      setShowPromptInput(true);
      setCustomPrompt(action.prompt || '');
    } else {
      onAction(action.id, action.prompt);
    }
  };

  const handlePromptSubmit = (e) => {
    e.preventDefault();
    onAction('custom', customPrompt);
    setShowPromptInput(false);
    setCustomPrompt('');
  };

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        {mainActions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleActionClick(action)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 
                     rounded-full text-sm font-medium text-gray-700 transition-colors"
          >
            <span>{action.icon}</span>
            {action.label}
          </button>
        ))}
        
        <button
          onClick={() => setShowPromptInput(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 
                   rounded-full text-sm font-medium text-blue-700 transition-colors"
        >
          <span>✨</span>
          Custom Prompt
        </button>
      </div>

      {/* Custom Prompt Input */}
      {showPromptInput && (
        <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
          <form onSubmit={handlePromptSubmit} className="space-y-3">
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Enter your custom prompt..."
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 
                       focus:ring-blue-500 min-h-[100px]"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPromptInput(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg 
                         hover:bg-blue-600 transition-colors"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ActionPills; 