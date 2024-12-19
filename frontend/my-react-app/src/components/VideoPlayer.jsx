import React, { useState, useEffect, useRef } from 'react';

function VideoPlayer({ videoId, thumbnail, title, startTime = 0 }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null);
  const [isAPIReady, setIsAPIReady] = useState(false);

  // Load YouTube API once
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        console.log('YouTube API Ready');
        setIsAPIReady(true);
      };
    } else {
      setIsAPIReady(true);
    }
  }, []);

  // Initialize or update player
  useEffect(() => {
    if (!isAPIReady || !videoId || !isPlaying) return;

    console.log('Initializing player with ID:', videoId);
    
    const player = new window.YT.Player('youtube-player', {
      videoId,
      playerVars: {
        autoplay: 1,
        controls: 1,
        rel: 0,
        modestbranding: 1,
        origin: window.location.origin
      },
      events: {
        onReady: (event) => {
          console.log('Player ready');
          playerRef.current = event.target;
          if (startTime > 0) {
            console.log('Initial seek to:', startTime);
            event.target.seekTo(startTime);
            event.target.playVideo();
          }
        },
        onStateChange: (event) => {
          if (event.data === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true);
          }
        },
        onError: (event) => {
          console.error('YouTube Player Error:', event.data);
        }
      }
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId, isPlaying, isAPIReady]);

  // Handle timestamp changes
  useEffect(() => {
    if (playerRef.current && startTime > 0) {
      console.log('Seeking to time:', startTime);
      try {
        playerRef.current.seekTo(startTime);
        if (!isPlaying) {
          playerRef.current.playVideo();
          setIsPlaying(true);
        }
      } catch (error) {
        console.error('Seek error:', error);
      }
    }
  }, [startTime]);

  const handleThumbnailClick = () => {
    console.log('Thumbnail clicked');
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
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      ) : (
        <div id="youtube-player" className="w-full h-full" />
      )}
    </div>
  );
}

export default VideoPlayer;