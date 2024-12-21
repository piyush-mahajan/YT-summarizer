import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

function FormattedSummary({ text }) {
  const [feedback, setFeedback] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isReading, setIsReading] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleFeedback = async (type) => {
    if (feedback === type) {
      setFeedback(null);
    } else {
      setFeedback(type);
    }
    // Here you can add API call to save feedback
  };

  const handleRead = () => {
    setIsReading(!isReading);
    if (!isReading) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      window.speechSynthesis.cancel();
    }
  };

  // Function to format text with markdown syntax
  const formatText = (text) => {
    if (!text) return '';

    // Define patterns to make bold
    const patterns = [
      'Key Points:',
      'Main Topics:',
      'Summary:',
      'Conclusion:',
      'Background:',
      'Discussion Points:',
      'Analysis:',
      'Introduction:',
      'Overview:',
      'Highlights:',
      'Recommendations:',
      'Timestamps:',
      'Chapter \\d+:',
      '\\d+:\\d+\\s*-',
      '[A-Za-z\\s]+ said:',
      'Q:',
      'A:'
    ];

    let formattedText = text;

    // Make patterns bold
    patterns.forEach(pattern => {
      formattedText = formattedText.replace(
        new RegExp(`(${pattern})`, 'g'),
        '**$1**'
      );
    });

    // Convert lists
    formattedText = formattedText.replace(/^(\d+\.\s)/gm, '1. ');
    formattedText = formattedText.replace(/^[-•]\s/gm, '* ');

    // Convert URLs to markdown links
    formattedText = formattedText.replace(
      /(https?:\/\/[^\s]+)/g,
      '[$1]($1)'
    );

    // Add line breaks for readability
    formattedText = formattedText.replace(/\n/g, '\n\n');

    return formattedText;
  };

  const customRenderers = {
    // Custom rendering for specific elements if needed
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
      <p className="mb-4 text-gray-700">{children}</p>
    ),
    list: ({ ordered, children }) => (
      ordered ? (
        <ol className="list-decimal ml-6 mb-4 space-y-2">{children}</ol>
      ) : (
        <ul className="list-disc ml-6 mb-4 space-y-2">{children}</ul>
      )
    ),
  };

  return (
    <div className="space-y-4">
      <div className="prose prose-lg max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={customRenderers}
        >
          {formatText(text)}
        </ReactMarkdown>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 pt-4 border-t">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Copy to clipboard"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isCopied ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            )}
          </svg>
          {isCopied ? 'Copied!' : 'Copy'}
        </button>

        <button
          onClick={() => handleFeedback('up')}
          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
            feedback === 'up' 
              ? 'text-green-600 bg-green-50' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          title="Thumbs up"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          Helpful
        </button>

        <button
          onClick={() => handleFeedback('down')}
          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
            feedback === 'down' 
              ? 'text-red-600 bg-red-50' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          title="Thumbs down"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
          </svg>
          Not Helpful
        </button>

        <button
          onClick={handleRead}
          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
            isReading 
              ? 'text-blue-600 bg-blue-50' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          title={isReading ? 'Stop reading' : 'Read aloud'}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isReading ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M10 9v6m4-6v6" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.728-2.728" />
            )}
          </svg>
          {isReading ? 'Stop' : 'Read'}
        </button>
      </div>
    </div>
  );
}

export default FormattedSummary;