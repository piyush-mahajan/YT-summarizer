import React, { useEffect } from 'react';
import InputForm from '../components/InputForm';
import SummaryView from '../components/SummaryView';
import { checkHealth } from '../services/api';

function Home() {
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [apiStatus, setApiStatus] = React.useState('checking');

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

  if (apiStatus === 'checking') {
    return <div className="text-center py-8">Checking API status...</div>;
  }

  if (apiStatus === 'error') {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        YouTube Transcript Summarizer
      </h1>
      <InputForm 
        setResult={setResult} 
        setLoading={setLoading} 
        setError={setError} 
      />
      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2">Processing...</p>
        </div>
      )}
      {error && (
        <div className="text-red-500 text-center py-4 max-w-xl mx-auto">
          {error}
        </div>
      )}
      {result && <SummaryView result={result} />}
    </div>
  );
}

export default Home;