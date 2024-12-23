import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

function SplitView({ left, right }) {
  const { themeColor } = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const [splitPosition, setSplitPosition] = useState(40);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const containerRef = useRef(null);
  const dragRef = useRef(null);

  // Debounced resize handler
  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const mobile = window.innerWidth <= 768;
        setIsMobile(mobile);
        if (mobile && splitPosition > 50) {
          setSplitPosition(50);
        }
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [splitPosition]);

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const mouseX = e.clientX - containerRect.left;
    
    // Calculate new position with smooth interpolation
    const targetPosition = (mouseX / containerWidth) * 100;
    const minPosition = isMobile ? 30 : 20;
    const maxPosition = isMobile ? 70 : 80;
    
    // Apply easing to the movement
    const currentPosition = splitPosition;
    const easingFactor = 0.1; // Adjust this value to control smoothness (0.1 = smooth, 1 = instant)
    const newPosition = currentPosition + (targetPosition - currentPosition) * easingFactor;
    
    // Clamp the position within bounds
    const clampedPosition = Math.min(Math.max(newPosition, minPosition), maxPosition);
    
    requestAnimationFrame(() => {
      setSplitPosition(clampedPosition);
    });
  }, [isDragging, isMobile, splitPosition]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mouseleave', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div 
      ref={containerRef}
      className={`flex h-[calc(100vh-12rem)] relative bg-white/90 backdrop-blur-sm 
        rounded-lg shadow-lg overflow-hidden ${isMobile ? 'flex-col sm:flex-row' : ''}`}
    >
      {/* Left Panel */}
      <div 
        className={`overflow-auto will-change-[width] motion-reduce:transition-none
          ${isMobile ? 'w-full sm:w-auto' : ''}
          transition-[width] duration-[50ms] ease-out`}
        style={{ width: `${splitPosition}%` }}
      >
        {left}
      </div>

      {/* Draggable Divider */}
      <div
        ref={dragRef}
        className={`bg-gray-200 transition-colors relative
          ${isDragging ? '' : 'hover:bg-opacity-75'}
          ${isMobile ? 'h-1 w-full sm:h-full sm:w-1' : 'w-1 h-full'}
          cursor-col-resize touch-none select-none`}
        style={{ 
          backgroundColor: isDragging ? themeColor : 'rgb(229 231 235)',
          '&:hover': { backgroundColor: themeColor }
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className={`bg-current rounded-full ${isMobile ? 'w-8 h-1 sm:w-1 sm:h-8' : 'w-1 h-8'}`}></div>
        </div>
      </div>

      {/* Right Panel */}
      <div 
        className={`overflow-auto will-change-[width] motion-reduce:transition-none
          ${isMobile ? 'w-full sm:w-auto' : ''}
          transition-[width] duration-[50ms] ease-out`}
        style={{ width: `${100 - splitPosition}%` }}
      >
        {right}
      </div>
    </div>
  );
}

export default SplitView; 