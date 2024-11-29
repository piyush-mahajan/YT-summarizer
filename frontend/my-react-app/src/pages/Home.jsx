import React, { useState, useEffect } from 'react';
import YouTubeInput from '../components/YouTubeInput';
import ResultsView from '../components/ResultsView';
import { checkHealth, processYouTubeUrl } from '../services/api';

function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');
  const [videoData, setVideoData] = useState(null);

  useEffect(() => {
    const verifyApiHealth = async () => {
      try {
        await checkHealth();
        setApiStatus('healthy');
      } catch (error) {
        setApiStatus('error');
        setError('API server is not responding. Please try again later.');
      }
    };

    verifyApiHealth();
  }, []);

  const handleSubmit = async (url) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await processYouTubeUrl(url);
      setVideoData({
        title: response.title || 'Untitled Video',
        thumbnail: response.thumbnail || '/placeholder.jpg',
        summary: response.summary || 'No summary available',
        transcript: response.transcript || 'No transcript available'
      });
    } catch (error) {
      setError(error.message);
      setVideoData(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (apiStatus === 'checking') {
    return <div className="text-center py-8">Checking API status...</div>;
  }

  if (apiStatus === 'error') {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-8 p-4 md:p-8">
      <h1 className="text-3xl font-bold text-center">
        YouTube Transcript Summarizer
      </h1>
      <YouTubeInput onSubmit={handleSubmit} isLoading={isLoading} />
      {error && (
        <div className="text-red-500 text-center max-w-xl">{error}</div>
      )}
      {videoData && <ResultsView data={videoData} />}
    </main>
  );
}

export default Home;