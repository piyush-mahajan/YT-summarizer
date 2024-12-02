import React, { useState } from 'react';

function YouTubeInput({ onSubmit, isLoading = false }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      <div className="flex gap-4">
        <input
          type="url"
          placeholder="Enter the YouTube link to summarize"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? 'Processing...' : 'Summary'}
        </button>
      </div>
    </form>
  );
}

export default YouTubeInput; 


