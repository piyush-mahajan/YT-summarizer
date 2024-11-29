import React from 'react';

function SummaryView({ result }) {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{result.title}</h2>
      
      {result.thumbnail && (
        <img 
          src={result.thumbnail} 
          alt="Video thumbnail" 
          className="w-full max-w-xl mx-auto mb-6"
        />
      )}

      {result.summary && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Summary</h3>
          <p className="whitespace-pre-wrap">{result.summary}</p>
        </div>
      )}

      {result.transcript && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Transcript</h3>
          <p className="whitespace-pre-wrap">{result.transcript}</p>
        </div>
      )}
    </div>
  );
}

export default SummaryView; 