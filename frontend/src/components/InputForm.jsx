import React, { useState } from 'react';
import axios from 'axios';

function InputForm({ setResult, setLoading, setError }) {
  const [url, setUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios({
        method: 'post',
        url: 'http://localhost:8000/api/process',
        headers: {
          'Content-Type': 'application/json',
        },
        data: { url },
        withCredentials: false // Important for CORS
      });

      if (response.data) {
        setResult(response.data);
      } else {
        throw new Error('No data received from server');
      }
    } catch (error) {
      console.error('API Error:', error);
      setError(
        error.response?.data?.detail || 
        error.response?.data?.error || 
        error.message || 
        'An error occurred while processing the video'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-8">
      <div className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter YouTube URL"
          className="flex-1 p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={!url || url.trim() === ''}
        >
          Process
        </button>
      </div>
    </form>
  );
}

export default InputForm; 