import React, { useState } from 'react';
import LanguageSelect from './LanguageSelect';
import ChatView from './ChatView';
import VideoPlayer from './VideoPlayer';
import TranscriptView from './TranscriptView';
import SplitView from './SplitView';
import { translateText } from '../utils/translate';
import Toast from './Toast';
import FormattedSummary from './FormattedSummary';

function ResultsView({ data, onLanguageChange }) {
  const [activeTab, setActiveTab] = useState('summary');
  const [currentLanguage, setCurrentLanguage] = useState('en');
  
  const [translations, setTranslations] = useState({
    en: data.summary // Store original English text
  });
  const [toast, setToast] = useState(null);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  
  console.log('Initial state:', { 
    activeTab, 
    currentLanguage, 
    translations, 
    toast, 
    currentVideoTime 
  });

  const handleLanguageChange = async (newLanguage) => {
    console.log('Language change initiated:', { newLanguage, currentLanguage });
    try {
      if (translations[newLanguage]) {
        console.log('Translation already exists. Switching language.');
        setCurrentLanguage(newLanguage);
        return;
      }

      const textToTranslate = translations.en || data.summary;
      console.log('Text to translate:', textToTranslate);

      const translatedText = await translateText(
        textToTranslate,
        newLanguage,
        currentLanguage
      );
      console.log('Translated text:', translatedText);

      setTranslations(prev => ({
        ...prev,
        [newLanguage]: translatedText
      }));
      setCurrentLanguage(newLanguage);
    } catch (error) {
      console.error('Translation error:', error);
    }
  };

  const getVideoId = (url) => {
    const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    const videoId = match ? match[1] : null;
    console.log('Extracted video ID:', videoId);
    return videoId;
  };

  const showToast = (message, type = 'success') => {
    console.log('Showing toast:', { message, type });
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCopy = async () => {
    console.log('Copy button clicked');
    try {
      await navigator.clipboard.writeText(translations[currentLanguage] || data.summary);
      showToast('Copied to clipboard!');
    } catch (err) {
      console.error('Copy error:', err);
      showToast('Failed to copy text', 'error');
    }
  };

  const handleDownload = () => {
    console.log('Download button clicked');
    try {
      const text = translations[currentLanguage] || data.summary;
      console.log('Text to download:', text);
      const blob = new Blob([text], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `summary_${currentLanguage}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      showToast('Summary downloaded!');
    } catch (err) {
      console.error('Download error:', err);
      showToast('Failed to download summary', 'error');
    }
  };

  const handleTimeClick = (seconds) => {
    console.log('Time clicked in transcript:', seconds);
    setCurrentVideoTime(seconds);
  };

  const LeftPanel = (
    <div className="p-4 space-y-4 min-w-[280px]">
      <VideoPlayer
        videoId={getVideoId(data.url)}
        thumbnail={data.thumbnail}
        title={data.title}
        startTime={currentVideoTime}
      />
      <h2 className="text-lg font-semibold text-gray-800 break-words">
        {data.title}
      </h2>
    </div>
  );

  const RightPanel = (
    <div className="p-4 min-w-[320px] w-full">
      <div className="flex flex-wrap gap-2 sm:gap-4 mb-6">
        <button
          onClick={() => {
            console.log('Switched to Summary tab');
            setActiveTab('summary');
          }}
          className={`px-4 sm:px-6 py-2 rounded-lg font-medium whitespace-nowrap
            ${activeTab === 'summary'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          Summary
        </button>
        <button
          onClick={() => {
            console.log('Switched to Transcript tab');
            setActiveTab('transcript');
          }}
          className={`px-4 sm:px-6 py-2 rounded-lg font-medium whitespace-nowrap
            ${activeTab === 'transcript'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          Transcript
        </button>
        <button
          onClick={() => {
            console.log('Switched to AI Chat tab');
            setActiveTab('chat');
          }}
          className={`px-4 sm:px-6 py-2 rounded-lg font-medium whitespace-nowrap
            ${activeTab === 'chat'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          AI Chat
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 sm:p-6 min-h-[400px] overflow-auto">
        {activeTab === 'summary' && (
          <div>
            <div className="mb-4 flex justify-end items-center gap-3">
              <LanguageSelect 
                value={currentLanguage} 
                onChange={handleLanguageChange}
                currentLanguage={currentLanguage}
              />
            </div>
            <FormattedSummary 
              text={translations[currentLanguage] || data.summary}
            />
          </div>
        )}

        {activeTab === 'transcript' && (
          <TranscriptView 
            transcript={data.transcript?.text || data.transcript} 
            videoId={getVideoId(data.url)}
            onTimeClick={handleTimeClick}
          />
        )}

        {activeTab === 'chat' && (
          <ChatView 
            transcript={
              typeof data.transcript === 'string' 
                ? data.transcript 
                : data.transcript?.text || data.transcript?.full_text || ''
            } 
          />
        )}
      </div>
    </div>
  );

  return (
    <>
      <SplitView 
        left={LeftPanel}
        right={RightPanel}
      />
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </>
  );
}

export default ResultsView;