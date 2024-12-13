import React, { useState } from 'react';
import LanguageSelect from './LanguageSelect';
import ChatView from './ChatView';
import VideoPlayer from './VideoPlayer';
import TranscriptView from './TranscriptView';
import SplitView from './SplitView';
import { translateText } from '../utils/translate';

function ResultsView({ data, onLanguageChange }) {
  const [activeTab, setActiveTab] = useState('summary');
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [translations, setTranslations] = useState({
    en: data.summary // Store original English text
  });

  const handleLanguageChange = async (newLanguage) => {
    try {
      if (translations[newLanguage]) {
        // If we already have this translation, use it
        setCurrentLanguage(newLanguage);
        return;
      }

      // Get the text to translate (either from English or current translation)
      const textToTranslate = translations.en || data.summary;
      
      // Translate the text
      const translatedText = await translateText(
        textToTranslate,
        newLanguage,
        currentLanguage
      );

      // Store the translation
      setTranslations(prev => ({
        ...prev,
        [newLanguage]: translatedText
      }));

      setCurrentLanguage(newLanguage);
    } catch (error) {
      console.error('Translation error:', error);
      // Handle error (maybe show a toast notification)
    }
  };

  const getVideoId = (url) => {
    const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    return match ? match[1] : null;
  };

  const LeftPanel = (
    <div className="p-4 space-y-4 min-w-[280px]">
      <VideoPlayer
        videoId={getVideoId(data.url)}
        thumbnail={data.thumbnail}
        title={data.title}
      />
      <h2 className="text-lg font-semibold text-gray-800 break-words">
        {data.title}
      </h2>
    </div>
  );

  const RightPanel = (
    <div className="p-4 min-w-[320px] w-full">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 sm:gap-4 mb-6">
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-4 sm:px-6 py-2 rounded-lg font-medium whitespace-nowrap
            ${activeTab === 'summary'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          Summary
        </button>
        <button
          onClick={() => setActiveTab('transcript')}
          className={`px-4 sm:px-6 py-2 rounded-lg font-medium whitespace-nowrap
            ${activeTab === 'transcript'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          Transcript
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-4 sm:px-6 py-2 rounded-lg font-medium whitespace-nowrap
            ${activeTab === 'chat'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          AI Chat
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-gray-50 rounded-lg p-3 sm:p-6 min-h-[400px] overflow-auto">
        {activeTab === 'summary' && (
          <div>
            <div className="mb-4 flex justify-end">
              <LanguageSelect 
                value={currentLanguage} 
                onChange={handleLanguageChange}
                currentLanguage={currentLanguage}
              />
            </div>
            <p className="whitespace-pre-wrap text-gray-700 break-words">
              {translations[currentLanguage] || data.summary}
            </p>
          </div>
        )}

        {activeTab === 'transcript' && (
          <TranscriptView 
            transcript={data.transcript?.text || data.transcript} 
            videoId={getVideoId(data.url)}
          />
        )}

        {activeTab === 'chat' && (
          <ChatView transcript={data.transcript?.text || data.transcript} />
        )}
      </div>
    </div>
  );

  return (
    <SplitView 
      left={LeftPanel}
      right={RightPanel}
    />
  );
}

export default ResultsView; 


