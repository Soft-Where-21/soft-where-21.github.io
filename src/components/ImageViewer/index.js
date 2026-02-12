import React, { useState, useEffect, useCallback } from 'react';

const ImageViewer = ({ src, alt }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const openModal = () => {
    setIsOpen(true);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    // Use a try-catch block to handle potential issues with document access in SSR or unexpected environments
    try {
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } catch (e) {
        console.warn('Could not set body overflow style:', e);
    }
  };

  const closeModal = useCallback(() => {
    setIsOpen(false);
    try {
        document.body.style.overflow = 'unset';
    } catch (e) {
         console.warn('Could not reset body overflow style:', e);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeModal]);

  const handleWheel = (e) => {
    // In React, onWheel is a synthetic event. To prevent default behavior (scrolling the page behind the modal),
    // we might need to attach a non-passive listener to the DOM element directly if we want to be 100% sure,
    // but often handling it here and stopping propagation is enough if the modal covers the screen.
    // However, the 'wheel' event on window/document is often passive by default.
    // Since we are rendering a full-screen div, scrolling *inside* it is what we are catching.
    
    // Check if scale would go out of bounds
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.min(Math.max(0.1, scale + delta), 5);
    
    // Only update state if it changes
    if (newScale !== scale) {
        setScale(newScale);
    }
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <>
      <div 
        onClick={openModal} 
        style={{ cursor: 'pointer', textAlign: 'center', margin: '20px 0' }}
      >
        <img 
          src={src} 
          alt={alt} 
          style={{ 
            maxWidth: '100%', 
            borderRadius: '8px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        />
        <p style={{ color: '#666', fontSize: '0.9em', marginTop: '8px' }}>
          点击图片放大查看
        </p>
      </div>

      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.9)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden'
          }}
          onClick={closeModal}
          onWheel={handleWheel}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div 
            style={{ 
              position: 'absolute', 
              top: '20px', 
              right: '30px', 
              color: 'white', 
              fontSize: '40px', 
              cursor: 'pointer',
              zIndex: 10000
            }}
            onClick={closeModal}
          >
            &times;
          </div>
          
          <img 
            src={src} 
            alt={alt} 
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              objectFit: 'contain',
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
            onClick={(e) => e.stopPropagation()} 
            onMouseDown={handleMouseDown}
            onDragStart={(e) => e.preventDefault()}
          />
          
          <div style={{
            position: 'absolute',
            bottom: '20px',
            color: 'white',
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: '8px 16px',
            borderRadius: '4px',
            pointerEvents: 'none'
          }}>
            滚轮缩放 | ESC 关闭
          </div>
        </div>
      )}
    </>
  );
};

export default ImageViewer;
