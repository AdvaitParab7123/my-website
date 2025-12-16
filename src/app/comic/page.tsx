'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './page.module.css';

const TOTAL_PAGES = 24;

// Helper to format page number with the actual file naming convention
const getPagePath = (pageNum: number) => {
  return `/Comic/Comic Final Version_page-${String(pageNum).padStart(4, '0')}.jpg`;
};

export default function ComicReader() {
  // Current spread index (0 = cover, 1 = pages 2-3, 2 = pages 4-5, etc.)
  const [currentSpread, setCurrentSpread] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showNudge, setShowNudge] = useState(true);
  
  // Touch/Mouse drag
  const [dragStart, setDragStart] = useState<number | null>(null);

  // Total spreads: cover (1) + middle spreads (11) + back cover (1) = 13 spreads
  // Spread 0: Page 1 (front cover) - right side only
  // Spread 1: Pages 2-3
  // Spread 2: Pages 4-5
  // ... 
  // Spread 11: Pages 22-23
  // Spread 12: Page 24 (back cover) - left side only
  const TOTAL_SPREADS = 13;

  // Get pages for current spread
  const getSpreadPages = (spread: number): { left: number | null; right: number | null } => {
    if (spread === 0) {
      // Front cover - only right side
      return { left: null, right: 1 };
    } else if (spread === TOTAL_SPREADS - 1) {
      // Back cover - only left side
      return { left: 24, right: null };
    } else {
      // Regular spread
      const leftPage = spread * 2;
      const rightPage = spread * 2 + 1;
      return { left: leftPage, right: rightPage };
    }
  };

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

  // Auto-hide nudge after 5 seconds
  useEffect(() => {
    if (showNudge && isLoaded) {
      const timer = setTimeout(() => setShowNudge(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showNudge, isLoaded]);

  const goToSpread = useCallback((direction: 'next' | 'prev') => {
    if (isFlipping) return;
    
    if (direction === 'next' && currentSpread >= TOTAL_SPREADS - 1) return;
    if (direction === 'prev' && currentSpread <= 0) return;

    setShowNudge(false);
    setIsFlipping(true);
    setFlipDirection(direction);

    // Fast animation - 400ms
    setTimeout(() => {
      setCurrentSpread(prev => direction === 'next' ? prev + 1 : prev - 1);
      setIsFlipping(false);
      setFlipDirection(null);
    }, 400);
  }, [currentSpread, isFlipping]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goToSpread('next');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToSpread('prev');
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      } else if (e.key === 'f' || e.key === 'F') {
        setIsFullscreen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToSpread, isFullscreen]);

  // Unified drag handler for both touch and mouse
  const handleDragStart = (x: number) => {
    setDragStart(x);
  };

  const handleDragEnd = (x: number) => {
    if (dragStart === null) return;
    
    const diff = dragStart - x;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        goToSpread('next');
      } else {
        goToSpread('prev');
      }
    }
    setDragStart(null);
  };

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => handleDragEnd(e.changedTouches[0].clientX);

  // Mouse handlers
  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) handleDragStart(e.clientX);
  };
  const onMouseUp = (e: React.MouseEvent) => handleDragEnd(e.clientX);
  const onMouseLeave = () => setDragStart(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const currentPages = getSpreadPages(currentSpread);
  const nextPages = getSpreadPages(currentSpread + 1);
  const prevPages = getSpreadPages(currentSpread - 1);

  return (
    <div className={`${styles.container} ${isFullscreen ? styles.fullscreen : ''}`}>
      {/* Header */}
      <header className={styles.header}>
        <a href="/" className={styles.backBtn}>← Back</a>
        <h1 className={styles.title}>My Comic</h1>
        <button onClick={toggleFullscreen} className={styles.fullscreenBtn}>
          {isFullscreen ? '✕' : '⛶'}
        </button>
      </header>

      {/* Loading */}
      {!isLoaded && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading comic...</p>
        </div>
      )}

      {/* Nudge hint - floating above book */}
      {showNudge && isLoaded && (
        <div className={styles.nudge}>
          <span className={styles.nudgeArrow}>←</span>
          <span className={styles.nudgeText}>Swipe or drag to turn pages</span>
          <span className={styles.nudgeArrow}>→</span>
        </div>
      )}

      {/* Book */}
      <div 
        className={styles.bookArea}
        style={{ opacity: isLoaded ? 1 : 0 }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        <div className={styles.book}>
          {/* Left Page */}
          <div className={styles.pageLeft}>
            {currentPages.left ? (
              <img src={getPagePath(currentPages.left)} alt={`Page ${currentPages.left}`} />
            ) : (
              <div className={styles.emptyPage}></div>
            )}
          </div>

          {/* Spine */}
          <div className={styles.spine}></div>

          {/* Right Page */}
          <div className={styles.pageRight}>
            {currentPages.right ? (
              <img src={getPagePath(currentPages.right)} alt={`Page ${currentPages.right}`} />
            ) : (
              <div className={styles.emptyPage}></div>
            )}
          </div>

          {/* Flip animation overlay */}
          {isFlipping && flipDirection === 'next' && (
            <div className={styles.flipOverlayNext}>
              <div className={styles.flipPageFront}>
                {currentPages.right && (
                  <img src={getPagePath(currentPages.right)} alt="Flipping" />
                )}
              </div>
              <div className={styles.flipPageBack}>
                {nextPages.left && (
                  <img src={getPagePath(nextPages.left)} alt="Next" />
                )}
              </div>
            </div>
          )}

          {isFlipping && flipDirection === 'prev' && (
            <div className={styles.flipOverlayPrev}>
              <div className={styles.flipPageFront}>
                {currentPages.left && (
                  <img src={getPagePath(currentPages.left)} alt="Flipping" />
                )}
              </div>
              <div className={styles.flipPageBack}>
                {prevPages.right && (
                  <img src={getPagePath(prevPages.right)} alt="Prev" />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Ground shadow */}
        <div className={styles.shadow}></div>
      </div>

      {/* Navigation */}
      <div className={styles.nav}>
        <button 
          onClick={() => goToSpread('prev')}
          disabled={currentSpread <= 0 || isFlipping}
          className={styles.navBtn}
        >
          ‹ Prev
        </button>
        
        <div className={styles.pageInfo}>
          <span>{currentSpread + 1} / {TOTAL_SPREADS}</span>
          <div className={styles.progress}>
            <div 
              className={styles.progressFill}
              style={{ width: `${((currentSpread + 1) / TOTAL_SPREADS) * 100}%` }}
            ></div>
          </div>
        </div>

        <button 
          onClick={() => goToSpread('next')}
          disabled={currentSpread >= TOTAL_SPREADS - 1 || isFlipping}
          className={styles.navBtn}
        >
          Next ›
        </button>
      </div>
    </div>
  );
}
