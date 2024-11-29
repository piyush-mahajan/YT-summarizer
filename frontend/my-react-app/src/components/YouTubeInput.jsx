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
    <>
    <form onSubmit={handleSubmit} className="flex w-full max-w-3xl gap-4 mx-auto">
      <input
        type="url"
        placeholder="Enter the YouTube link to summarize"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <button
        type="submit"
        disabled={isLoading}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processing...' : 'Summarize'}
      </button>
    </form>
    </>

  );
}

export default YouTubeInput; 