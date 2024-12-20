import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

function ChatView({ transcript }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const customRenderers = {
    strong: ({ children }) => (
      <span className="font-bold text-gray-900">{children}</span>
    ),
    link: ({ href, children }) => (
      <a 
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline"
      >
        {children}
      </a>
    ),
    paragraph: ({ children }) => (
      <p className="mb-2 text-gray-800">{children}</p>
    ),
    list: ({ ordered, children }) => (
      ordered ? (
        <ol className="list-decimal ml-6 mb-3 space-y-1">{children}</ol>
      ) : (
        <ul className="list-disc ml-6 mb-3 space-y-1">{children}</ul>
      )
    ),
    code: ({ inline, className, children }) => (
      inline ? (
        <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-sm">
          {children}
        </code>
      ) : (
        <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto">
          <code className={`language-${className} font-mono text-sm`}>
            {children}
          </code>
        </pre>
      )
    ),
  };

  const getTranscriptText = (transcript) => {
    if (!transcript) return '';
    if (typeof transcript === 'string') return transcript;
    if (transcript.full_text) return transcript.full_text;
    if (transcript.segments) {
      return transcript.segments.map(segment => segment.text).join(' ');
    }
    return '';
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    try {
      setIsLoading(true);
      const userMessage = { role: 'user', content: input };
      setMessages(prev => [...prev, userMessage]);
      setInput('');

      const transcriptText = getTranscriptText(transcript);
      console.log('Using transcript:', transcriptText.substring(0, 100) + '...');

      const chatMessages = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await axios.post('http://localhost:8000/api/chat', {
        messages: chatMessages,
        transcript: transcriptText
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.response
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error.response?.data || error);
      const errorMessage = error.response?.data?.detail?.[0]?.msg || 
                          error.response?.data?.detail ||
                          'Sorry, I encountered an error. Please try again.';
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errorMessage
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
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
                  components={customRenderers}
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