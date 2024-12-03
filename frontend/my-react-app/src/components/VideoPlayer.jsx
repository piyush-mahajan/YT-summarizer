import React, { useState } from 'react';

function VideoPlayer({ videoId, thumbnail, title }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const getVideoUrl = () => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  };

  const handleThumbnailClick = () => {
    setIsPlaying(true);
  };

  return (
    <div className="w-full aspect-video rounded-lg overflow-hidden bg-black">
      {!isPlaying ? (
        <div 
          className="relative w-full h-full cursor-pointer group"
          onClick={handleThumbnailClick}
        >
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <svg 
                className="w-8 h-8 text-white ml-1" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>
      ) : (
        <iframe
          src={getVideoUrl()}
          title={title}
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      )}
    </div>
  );
}

export default VideoPlayer;