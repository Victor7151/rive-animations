import React, { useState, useEffect, useRef } from 'react';
import { Rive, Layout, Fit, Alignment } from '@rive-app/canvas';

export default function HeroSection() {
  const canvasRef = useRef(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let riveInstance = null;

    try {
      riveInstance = new Rive({
        src: '/wardrobe.riv',
        canvas: canvas,
        artboard: 'main',
        stateMachine: 'main',
        autoplay: true,
        layout: new Layout({
          fit: Fit.Contain,
          alignment: Alignment.Center,
        }),
        onLoad: () => {
          if (riveInstance) {
            riveInstance.resizeDrawingSurfaceToCanvas();
          }
          setIsLoaded(true);
        },
        onLoadError: () => {
          setIsLoaded(false);
        },
      });

      const handleResize = () => {
        if (riveInstance) {
          riveInstance.resizeDrawingSurfaceToCanvas();
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (riveInstance) {
          riveInstance.cleanup();
        }
      };
    } catch {
      setIsLoaded(false);
    }
  }, []);

  const handlePointerDown = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  return (
    <section className="hero-section" id="hero" aria-label="Interactive Wardrobe Hero">
      <div className="section-container hero-container">
        
        {/* Concept label badge */}
        <div className="concept-badge-wrapper">
          <div className="concept-badge">
            <span className="concept-badge-dot" aria-hidden="true" />
            <span className="concept-badge-text">A concept piece</span>
          </div>
        </div>

        {/* Main headline */}
        <h1 className="hero-headline">
          Open your wardrobe.
        </h1>

        {/* Subtext */}
        <p className="hero-subtext">
          What if browsing a wardrobe online felt less like viewing a static photograph, and more like opening the real thing in your own bedroom?
        </p>

        {/* Interactive Wardrobe Canvas Container */}
        <div className="wardrobe-stage">
          <div
            className="wardrobe-canvas-container"
            onPointerDown={handlePointerDown}
            tabIndex={0}
            role="region"
            aria-label="Interactive wardrobe animation. Tap doors to open or close, flip light switch to toggle illumination."
          >
            {/* Graceful placeholder while loading or if .riv file is missing */}
            <div
              className={`wardrobe-placeholder ${isLoaded ? 'is-hidden' : ''}`}
              aria-hidden={isLoaded}
            >
              <div className="placeholder-shimmer" />
              <div className="placeholder-status">
                <span className="placeholder-pulse" aria-hidden="true" />
                <span className="placeholder-text">Wardrobe loading…</span>
              </div>
            </div>

            {/* Rive canvas rendering container */}
            <div className={`wardrobe-canvas-box ${isLoaded ? 'is-ready' : 'is-loading'}`}>
              <canvas
                ref={canvasRef}
                width={2752}
                height={1536}
                className="wardrobe-canvas"
                style={{ touchAction: 'pan-y' }}
              />
            </div>
          </div>

          {/* Interactive hint */}
          <div
            className={`wardrobe-hint ${hasInteracted ? 'is-faded' : ''}`}
            aria-live="polite"
          >
            <span className="hint-icon" aria-hidden="true">✦</span>
            <span className="hint-text">Tap the doors. Flip the light.</span>
          </div>
        </div>

      </div>
    </section>
  );
}
