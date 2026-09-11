import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X, RotateCcw } from 'lucide-react';

/**
 * Product360Viewer - Interactive 360° product view component
 * 
 * Features:
 * - Click and drag to rotate smoothly
 * - Thumbnail navigation
 * - Auto-rotation toggle
 * - Fullscreen modal
 * - Touch support for mobile devices
 * - Preloading to eliminate flickering
 * - Keyboard navigation (Left / Right / Escape)
 */
export const ANGLE_LABELS = [
  'Vue de face (0°)',
  'Vue arrière (180°)',
  'Vue gauche (90°)',
  'Vue droite (270°)',
  'Vue dessus (90°)',
  'Vue dessous (270°)',
  'Vue avant gauche (45°)',
  'Vue avant droite (315°)',
  'Vue arrière gauche (135°)',
  'Vue arrière droite (225°)',
  'Vue haut gauche (135°)',
  'Vue haut droite (225°)',
];

export function Product360Viewer({ images = [], productName = '' }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(false);

  const autoRotateRef = useRef(null);

  // Preload all angle images for instantaneous smooth rotation
  useEffect(() => {
    if (!images || images.length === 0) return;
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);

  // Auto-rotation effect
  useEffect(() => {
    if (isAutoRotating && images.length > 0) {
      autoRotateRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 120);
    } else {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current);
      }
    }
    return () => {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current);
      }
    };
  }, [isAutoRotating, images.length]);

  const goToPrevious = useCallback(() => {
    if (!images || images.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images]);

  const goToNext = useCallback(() => {
    if (!images || images.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevious, goToNext, isFullscreen]);

  // Mouse drag handlers with global listener for smooth dragging
  const handleMouseDown = (e) => {
    if (isAutoRotating) return;
    setIsDragging(true);
    setStartX(e.clientX);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const diff = e.clientX - startX;
      const sensitivity = 16; // pixels per step
      if (Math.abs(diff) >= sensitivity) {
        const steps = Math.floor(Math.abs(diff) / sensitivity);
        if (diff > 0) {
          setCurrentIndex((prev) => (prev + steps) % images.length);
        } else {
          setCurrentIndex((prev) => (prev - (steps % images.length) + images.length) % images.length);
        }
        setStartX(e.clientX);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startX, images.length]);

  // Touch handlers
  const handleTouchStart = (e) => {
    if (isAutoRotating) return;
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || isAutoRotating) return;
    const diff = e.touches[0].clientX - startX;
    const sensitivity = 16;
    if (Math.abs(diff) >= sensitivity) {
      const steps = Math.floor(Math.abs(diff) / sensitivity);
      if (diff > 0) {
        setCurrentIndex((prev) => (prev + steps) % images.length);
      } else {
        setCurrentIndex((prev) => (prev - (steps % images.length) + images.length) % images.length);
      }
      setStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  if (!images || images.length === 0) {
    return null;
  }

  const currentImage = images[currentIndex] || images[0];

  const renderViewerContent = (inModal = false) => (
    <div className={`product-360-viewer ${inModal ? 'fullscreen' : ''}`}>
      <div 
        className="viewer-main-image"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <span className="viewer-badge-360">
          <RotateCcw size={14} /> Vue 360°
        </span>

        <img 
          src={currentImage} 
          alt={`${productName} - angle ${currentIndex + 1}`}
          draggable={false}
        />
        
        {/* Navigation arrows */}
        <button 
          type="button"
          className="viewer-nav-btn viewer-nav-prev"
          onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
          aria-label="Angle précédent"
        >
          <ChevronLeft size={22} />
        </button>
        <button 
          type="button"
          className="viewer-nav-btn viewer-nav-next"
          onClick={(e) => { e.stopPropagation(); goToNext(); }}
          aria-label="Angle suivant"
        >
          <ChevronRight size={22} />
        </button>

        {/* Controls overlay */}
        <div className="viewer-controls" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className={`viewer-control-btn ${isAutoRotating ? 'active' : ''}`}
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            title={isAutoRotating ? 'Arrêter la rotation' : 'Rotation automatique'}
          >
            {isAutoRotating ? '⏸ Arrêter' : '▶ Auto'}
          </button>
          {!inModal && (
            <button
              type="button"
              className="viewer-control-btn"
              onClick={() => setIsFullscreen(true)}
              title="Plein écran"
            >
              <Maximize2 size={14} /> Agrandir
            </button>
          )}
          <span className="viewer-counter">
            {currentIndex + 1} / {images.length} {ANGLE_LABELS[currentIndex] ? `• ${ANGLE_LABELS[currentIndex]}` : ''}
          </span>
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="viewer-thumbnails">
        {images.map((img, idx) => (
          <button
            type="button"
            key={idx}
            className={`viewer-thumbnail ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(idx)}
            title={ANGLE_LABELS[idx] || `Angle ${idx + 1}`}
            aria-label={ANGLE_LABELS[idx] || `Angle ${idx + 1}`}
          >
            <img src={img} alt={ANGLE_LABELS[idx] || `Angle ${idx + 1}`} loading="lazy" />
          </button>
        ))}
      </div>

      <p className="viewer-hint">
        💡 Glissez l'image horizontalement pour faire pivoter à 360°
      </p>
    </div>
  );

  return (
    <>
      {renderViewerContent(false)}

      {/* Fullscreen modal */}
      {isFullscreen && (
        <div className="viewer-modal-overlay" onClick={() => setIsFullscreen(false)}>
          <div className="viewer-modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button"
              className="viewer-modal-close"
              onClick={() => setIsFullscreen(false)}
              aria-label="Fermer"
            >
              <X size={22} />
            </button>
            {renderViewerContent(true)}
          </div>
        </div>
      )}
    </>
  );
}

