import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

function ChatView({ transcript }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPromptForm, setShowPromptForm] = useState(false);
  const [customPrompts, setCustomPrompts] = useState(() => {
    const saved = localStorage.getItem('customPrompts');
    return saved ? JSON.parse(saved) : [];
  });
  const [newPrompt, setNewPrompt] = useState({
    title: '',
    prompt: ''
  });

  useEffect(() => {
    localStorage.setItem('customPrompts', JSON.stringify(customPrompts));
  }, [customPrompts]);

  const handleAddPrompt = (e) => {
    e.preventDefault();
    if (newPrompt.title.trim() && newPrompt.prompt.trim()) {
      if (newPrompt.id) {
        // Edit existing prompt
        setCustomPrompts(prev => prev.map(p => 
          p.id === newPrompt.id ? { ...newPrompt } : p
        ));
      } else {
        // Add new prompt
        setCustomPrompts(prev => [...prev, { ...newPrompt, id: Date.now() }]);
      }
      setNewPrompt({ title: '', prompt: '' });
      setShowPromptForm(false);
    }
  };

  const handleDeletePrompt = (id) => {
    setCustomPrompts(prev => prev.filter(prompt => prompt.id !== id));
  };

  const handleEditPrompt = (id) => {
    const promptToEdit = customPrompts.find(p => p.id === id);
    if (promptToEdit) {
      setNewPrompt(promptToEdit);
      setShowPromptForm(true);
    }
  };

  const handlePromptClick = async (prompt) => {
    if (!prompt) return;
    
    setIsLoading(true);
    try {
      const userMessage = { role: 'user', content: prompt };
      setMessages(prev => [...prev, userMessage]);

      const response = await axios.post('http://localhost:8000/api/chat', {
        messages: [userMessage],
        transcript: transcript
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.response
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:8000/api/chat', {
        messages: [userMessage],
        transcript: transcript
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.response
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Custom Prompts Section */}
      <div className="flex flex-wrap gap-2 mb-4">
        {customPrompts.map((prompt) => (
          <div key={prompt.id} className="group relative">
            <button
              onClick={() => handlePromptClick(prompt.prompt)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 
                       rounded-full text-sm font-medium text-gray-700 transition-colors"
            >
              <span>✨</span>
              {prompt.title}
            </button>
            <div className="absolute right-0 top-0 -mt-2 -mr-2 opacity-0 group-hover:opacity-100 
                          transition-opacity flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditPrompt(prompt.id);
                }}
                className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                title="Edit"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeletePrompt(prompt.id);
                }}
                className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                title="Delete"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={() => setShowPromptForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 
                   rounded-full text-sm font-medium text-blue-700 transition-colors"
        >
          <span>+</span>
          Add New Prompt
        </button>
      </div>

      {/* Add/Edit Prompt Modal */}
      {showPromptForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {newPrompt.id ? 'Edit Prompt' : 'Add New Prompt'}
            </h3>
            <form onSubmit={handleAddPrompt}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Button Title
                  </label>
                  <input
                    type="text"
                    value={newPrompt.title}
                    onChange={(e) => setNewPrompt(prev => ({
                      ...prev,
                      title: e.target.value
                    }))}
                    placeholder="Enter button title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md 
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prompt Text
                  </label>
                  <textarea
                    value={newPrompt.prompt}
                    onChange={(e) => setNewPrompt(prev => ({
                      ...prev,
                      prompt: e.target.value
                    }))}
                    placeholder="Enter prompt text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md 
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPromptForm(false);
                      setNewPrompt({ title: '', prompt: '' });
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md 
                             hover:bg-blue-600 font-medium"
                  >
                    {newPrompt.id ? 'Save Changes' : 'Add Button'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              message.role === 'user'
                ? 'bg-blue-100 ml-auto max-w-[80%]'
                : 'bg-gray-100 mr-auto max-w-[80%]'
            }`}
          >
            {message.role === 'user' ? (
              <p className="text-gray-800">{message.content}</p>
            ) : (
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="bg-gray-100 p-3 rounded-lg mr-auto">
            <p className="text-gray-500">Thinking...</p>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about the video..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg font-medium ${
            isLoading
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatView; 