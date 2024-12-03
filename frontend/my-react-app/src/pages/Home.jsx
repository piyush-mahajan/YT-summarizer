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
        ...response,
        originalSummary: response.summary
      });
    } catch (error) {
      setError(error.message);
      setVideoData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = async (targetLang) => {
    if (!videoData?.originalSummary) return;
    
    setIsLoading(true);
    try {
      // Use Google Translate API
      const encodedText = encodeURIComponent(videoData.originalSummary);
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodedText}`
      );
      
      const data = await response.json();
      const translatedText = data[0].map(x => x[0]).join('');

      setVideoData({
        ...videoData,
        summary: translatedText
      });
    } catch (error) {
      console.error('Translation error:', error);
      setError('Failed to translate summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        PPAS Summarizer
        </h1>
        
        <div className="mb-8">
          <YouTubeInput onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
        
        {error && (
          <div className="text-red-500 text-center max-w-xl mx-auto p-4 bg-red-50 rounded-lg">
            {error}
          </div>
        )}
        
        {isLoading && (
          <div className="flex items-center justify-center gap-3 py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="text-gray-600">Processing...</span>
          </div>
        )}
        
        {videoData && !isLoading && (
          <div className="mt-8">
            <ResultsView 
              data={videoData} 
              onLanguageChange={handleLanguageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;






