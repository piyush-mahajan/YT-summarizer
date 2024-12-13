import React, { useState, useEffect } from 'react';

function TranscriptView({ transcript, videoId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [segments, setSegments] = useState([]);
  const [filteredSegments, setFilteredSegments] = useState(null);

  useEffect(() => {
    // Parse transcript data
    if (transcript) {
      try {
        // Check if transcript is an object with segments
        if (transcript.segments) {
          setSegments(transcript.segments);
        } 
        // Check if transcript is a string
        else if (typeof transcript === 'string') {
          const lines = transcript.split('\n');
          const parsedSegments = lines.map(line => {
            const timestampMatch = line.match(/\[([\d:]+)\]/);
            const timestamp = timestampMatch ? timestampMatch[1] : '';
            const text = line.replace(/\[[\d:]+\]/, '').trim();
            return { timestamp, text };
          });
          setSegments(parsedSegments);
        }
        // If transcript is in a different format
        else if (Array.isArray(transcript)) {
          const formattedSegments = transcript.map(segment => ({
            timestamp: segment.timestamp || '',
            text: segment.text || ''
          }));
          setSegments(formattedSegments);
        }
      } catch (error) {
        console.error('Error parsing transcript:', error);
        setSegments([]);
      }
    }
  }, [transcript]);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredSegments(null);
      return;
    }

    const matches = segments.filter(segment => 
      segment.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSegments(matches);
  };

  const handleTimeClick = (timestamp) => {
    if (!timestamp || !videoId) return;
    
    // Convert MM:SS to seconds
    const [minutes, seconds] = timestamp.split(':').map(Number);
    const totalSeconds = minutes * 60 + seconds;
    
    window.open(
      `https://www.youtube.com/watch?v=${videoId}&t=${totalSeconds}`,
      '_blank'
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search in transcript..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {/* Transcript Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2">
          {(filteredSegments || segments).map((segment, index) => (
            <div 
              key={index}
              className="flex items-start gap-4 p-2 hover:bg-gray-50 rounded-lg group"
            >
              <button
                onClick={() => handleTimeClick(segment.timestamp)}
                className="text-blue-500 hover:text-blue-700 font-mono whitespace-nowrap"
              >
                {segment.timestamp}
              </button>
              <p className="text-gray-700 flex-1">{segment.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TranscriptView; 