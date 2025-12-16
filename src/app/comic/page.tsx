'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './page.module.css';

const TOTAL_PAGES = 24;

// Helper to format page number with the actual file naming convention
const getPagePath = (pageNum: number) => {
  return `/Comic/Comic Final Version_page-${String(pageNum).padStart(4, '0')}.jpg`;
};

export default function ComicReader() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  
  // Mouse drag state for desktop swipe
  const [mouseStart, setMouseStart] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Nudge hint state
  const [showNudge, setShowNudge] = useState(true);

  // Preload images
  useEffect(() => {
    const preloadImages = async () => {
      const promises = [];
      for (let i = 1; i <= TOTAL_PAGES; i++) {
        const img = new Image();
        img.src = getPagePath(i);
        promises.push(new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        }));
      }
      await Promise.all(promises);
      setIsLoaded(true);
    };
    preloadImages();
  }, []);

  // Mouse move for 3D tilt effect on desktop
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
      setTiltX(y * 5); // Tilt based on mouse Y position
      setTiltY(x * -5); // Tilt based on mouse X position
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const goToPage = useCallback((direction: 'next' | 'prev') => {
    if (isFlipping) return;
    
    if (direction === 'next' && currentPage >= TOTAL_PAGES - 1) return;
    if (direction === 'prev' && currentPage <= 0) return;

    setIsFlipping(true);
    setFlipDirection(direction);

    setTimeout(() => {
      setCurrentPage(prev => direction === 'next' ? prev + 1 : prev - 1);
      setIsFlipping(false);
      setFlipDirection(null);
    }, 600);
  }, [currentPage, isFlipping]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goToPage('next');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPage('prev');
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      } else if (e.key === 'f' || e.key === 'F') {
        setIsFullscreen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPage, isFullscreen]);

  // Touch handlers for swipe (mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
    dismissNudge();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToPage('next');
      } else {
        goToPage('prev');
      }
    }
    setTouchStart(null);
  };

  // Mouse handlers for click-and-drag swipe (desktop)
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only left click
    if (e.button !== 0) return;
    setMouseStart(e.clientX);
    setIsDragging(true);
    dismissNudge();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || mouseStart === null) return;
    // Could add visual feedback here during drag
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging || mouseStart === null) {
      setIsDragging(false);
      return;
    }
    
    const mouseEnd = e.clientX;
    const diff = mouseStart - mouseEnd;

    if (Math.abs(diff) > 80) { // Slightly larger threshold for mouse
      if (diff > 0) {
        goToPage('next');
      } else {
        goToPage('prev');
      }
    }
    
    setMouseStart(null);
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setMouseStart(null);
    setIsDragging(false);
  };

  // Dismiss nudge hint
  const dismissNudge = () => {
    if (showNudge) setShowNudge(false);
  };

  // Auto-dismiss nudge after 5 seconds
  useEffect(() => {
    if (showNudge && isLoaded) {
      const timer = setTimeout(() => setShowNudge(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showNudge, isLoaded]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className={`${styles.comicContainer} ${isFullscreen ? styles.fullscreen : ''}`}>
      {/* Header */}
      <header className={styles.header}>
        <a href="/" className={styles.backBtn}>
          ← Back
        </a>
        <h1 className={styles.title}>My Comic</h1>
        <button onClick={toggleFullscreen} className={styles.fullscreenBtn}>
          {isFullscreen ? '⊠' : '⛶'}
        </button>
      </header>

      {/* Loading Screen */}
      {!isLoaded && (
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading comic...</p>
        </div>
      )}

      {/* Comic Book */}
      <div 
        className={`${styles.bookWrapper} ${isDragging ? styles.dragging : ''}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ opacity: isLoaded ? 1 : 0 }}
      >
        <div 
          className={`${styles.book} ${styles.levitating}`}
          style={{
            transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          }}
        >
          {/* Book spine shadow */}
          <div className={styles.spine}></div>

          {/* Left page (previous) */}
          <div className={styles.pageLeft}>
            {currentPage > 0 && (
              <img 
                src={getPagePath(currentPage)} 
                alt={`Page ${currentPage}`}
                className={styles.pageImage}
              />
            )}
            {currentPage === 0 && (
              <div className={styles.coverBack}>
                <span>📖</span>
              </div>
            )}
          </div>

          {/* Right page (current) */}
          <div className={styles.pageRight}>
            <img 
              src={getPagePath(currentPage + 1)} 
              alt={`Page ${currentPage + 1}`}
              className={styles.pageImage}
            />
          </div>

          {/* Flipping page overlay */}
          {isFlipping && flipDirection === 'next' && (
            <div className={`${styles.flippingPage} ${styles.flipNext}`}>
              <div className={styles.flipFront}>
                <img 
                  src={getPagePath(currentPage + 1)} 
                  alt={`Page ${currentPage + 1}`}
                  className={styles.pageImage}
                />
              </div>
              <div className={styles.flipBack}>
                <img 
                  src={getPagePath(currentPage + 2)} 
                  alt={`Page ${currentPage + 2}`}
                  className={styles.pageImage}
                />
              </div>
            </div>
          )}

          {isFlipping && flipDirection === 'prev' && (
            <div className={`${styles.flippingPage} ${styles.flipPrev}`}>
              <div className={styles.flipFront}>
                <img 
                  src={getPagePath(currentPage)} 
                  alt={`Page ${currentPage}`}
                  className={styles.pageImage}
                />
              </div>
              <div className={styles.flipBack}>
                <img 
                  src={getPagePath(currentPage + 1)} 
                  alt={`Page ${currentPage + 1}`}
                  className={styles.pageImage}
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation arrows */}
        <button 
          className={`${styles.navBtn} ${styles.navPrev}`}
          onClick={() => { goToPage('prev'); dismissNudge(); }}
          disabled={currentPage <= 0 || isFlipping}
          aria-label="Previous page"
        >
          ‹
        </button>
        <button 
          className={`${styles.navBtn} ${styles.navNext}`}
          onClick={() => { goToPage('next'); dismissNudge(); }}
          disabled={currentPage >= TOTAL_PAGES - 1 || isFlipping}
          aria-label="Next page"
        >
          ›
        </button>

        {/* Nudge hint */}
        {showNudge && isLoaded && (
          <div className={styles.nudge} onClick={dismissNudge}>
            <div className={styles.nudgeContent}>
              <div className={styles.nudgeIcon}>
                <span className={styles.nudgeHand}>👆</span>
                <span className={styles.nudgeArrows}>← →</span>
              </div>
              <p className={styles.nudgeText}>
                <span className={styles.nudgeDesktop}>Click & drag or use arrow keys</span>
                <span className={styles.nudgeMobile}>Swipe to turn pages</span>
              </p>
              <span className={styles.nudgeDismiss}>Tap to dismiss</span>
            </div>
          </div>
        )}
      </div>

      {/* Page indicator */}
      <div className={styles.pageIndicator}>
        <span>Page {currentPage + 1} of {TOTAL_PAGES}</span>
        <div className={styles.progressBar}>
          <div 
            className={styles.progress} 
            style={{ width: `${((currentPage + 1) / TOTAL_PAGES) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Controls hint */}
      <div className={styles.controls}>
        <span>← → Arrow keys</span>
        <span>Swipe on mobile</span>
        <span>F for fullscreen</span>
      </div>
    </div>
  );
}

