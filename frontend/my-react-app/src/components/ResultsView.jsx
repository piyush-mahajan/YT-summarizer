import React, { useState } from 'react';

function ResultsView({ data }) {
  const [activeTab, setActiveTab] = useState('summary');

  return (
    <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg">
      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div className="space-y-4">
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <img
              src={data.thumbnail}
              alt={data.title}
              className="object-cover w-full h-full"
            />
          </div>
          <h2 className="text-lg font-semibold">{data.title}</h2>
        </div>
        <div>
          <div className="mb-4 border-b">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('summary')}
                className={`px-4 py-2 ${
                  activeTab === 'summary'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600'
                }`}
              >
                Summary
              </button>
              <button
                onClick={() => setActiveTab('transcript')}
                className={`px-4 py-2 ${
                  activeTab === 'transcript'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600'
                }`}
              >
                Transcript
              </button>
            </div>
          </div>
          <div className="min-h-[300px] p-4">
            {activeTab === 'summary' ? (
              <p className="whitespace-pre-wrap">{data.summary}</p>
            ) : (
              <p className="whitespace-pre-wrap">{data.transcript}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultsView; 