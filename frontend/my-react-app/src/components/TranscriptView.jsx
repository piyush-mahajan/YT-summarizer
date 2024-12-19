import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TranscriptView({ transcript, videoId, onTimeClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [segments, setSegments] = useState([]);
  const [filteredSegments, setFilteredSegments] = useState(null);
  const [selectedInterval, setSelectedInterval] = useState(15);

  const intervals = [
    { value: 5, label: '5 sec' },
    { value: 15, label: '15 sec' },
    { value: 30, label: '30 sec' },
    { value: 60, label: '1 min' },
    { value: 300, label: '5 min' },
  ];

  useEffect(() => {
    if (videoId && selectedInterval) {
      fetchTranscriptWithInterval();
    }
  }, [videoId, selectedInterval]);

  const fetchTranscriptWithInterval = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/transcript/${videoId}`, {
        params: { interval: selectedInterval }
      });
      if (response.data && response.data.segments) {
        setSegments(response.data.segments);
      }
    } catch (error) {
      console.error('Error fetching transcript:', error);
    }
  };

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
    if (!timestamp || !onTimeClick) return;
    
    let seconds;
    if (typeof timestamp === 'string') {
      const [minutes, secs] = timestamp.split(':').map(Number);
      seconds = minutes * 60 + secs;
    } else if (typeof timestamp === 'number') {
      seconds = timestamp;
    } else {
      return;
    }

    console.log('Clicking timestamp:', seconds);
    onTimeClick(seconds);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        {/* Search Bar */}
        <div className="flex gap-2 flex-1 mr-4">
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

        {/* Interval Selector */}
        <select
          value={selectedInterval}
          onChange={(e) => setSelectedInterval(Number(e.target.value))}
          className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {intervals.map(interval => (
            <option key={interval.value} value={interval.value}>
              {interval.label}
            </option>
          ))}
        </select>
      </div>

      {/* Transcript Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2">
          {(filteredSegments || segments).map((segment, index) => (
            <div 
              key={index}
              className="flex items-start gap-4 p-2 hover:bg-gray-50 rounded-lg group cursor-pointer"
              onClick={() => handleTimeClick(segment.timestamp)}
            >
              <span className="bg-blue-400 text-white hover:text-gray-300 font-mono whitespace-nowrap px-2 py-1 rounded">
                {segment.timestamp}
              </span>
              <p className="text-gray-700 flex-1">{segment.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TranscriptView; 