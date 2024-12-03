import React, { useState } from 'react';
import LanguageSelect from './LanguageSelect';
import ChatView from './ChatView';
import VideoPlayer from './VideoPlayer';

function ResultsView({ data, onLanguageChange }) {
  const [activeTab, setActiveTab] = useState('summary');
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const handleLanguageChange = (newLanguage) => {
    setCurrentLanguage(newLanguage);
    onLanguageChange(newLanguage);
  };

  // Extract video ID from URL
  const getVideoId = (url) => {
    const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    return match ? match[1] : null;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="grid grid-cols-[300px_1fr] gap-6">
        {/* Left Column - Video/Thumbnail and Title */}
        <div className="space-y-4">
          <VideoPlayer
            videoId={getVideoId(data.url)}
            thumbnail={data.thumbnail}
            title={data.title}
          />
          <h2 className="text-lg font-semibold text-gray-800">
            {data.title}
          </h2>
        </div>

        {/* Right Column - Tabs and Content */}
        <div>
          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-6 py-2 rounded-lg font-medium ${
                activeTab === 'summary'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setActiveTab('transcript')}
              className={`px-6 py-2 rounded-lg font-medium ${
                activeTab === 'transcript'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Transcript
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-6 py-2 rounded-lg font-medium ${
                activeTab === 'chat'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              AI Chat
            </button>
          </div>

          {/* Content Area */}
          <div className="bg-gray-50 rounded-lg p-6 min-h-[400px]">
            {activeTab === 'summary' && (
              <div>
                <div className="mb-4">
                  <LanguageSelect 
                    value={currentLanguage} 
                    onChange={handleLanguageChange}
                  />
                </div>
                <p className="whitespace-pre-wrap text-gray-700">
                  {data.summary}
                </p>
              </div>
            )}

            {activeTab === 'transcript' && (
              <p className="whitespace-pre-wrap text-gray-700">
                {data.transcript}
              </p>
            )}

            {activeTab === 'chat' && (
              <ChatView transcript={data.transcript} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultsView; 


