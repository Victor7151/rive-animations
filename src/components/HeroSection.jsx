import React, { useState, useEffect } from 'react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';

export default function HeroSection() {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize Rive with both standard state machine names as fallback
  const { rive, RiveComponent } = useRive({
    src: '/wardrobe.riv',
    stateMachines: ['State Machine 1', 'main'],
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    isTouchScrollEnabled: true,
    onLoad: () => {
      setIsLoaded(true);
    },
    onLoadError: () => {
      // Graceful fallback: stay on loading placeholder, never show error screen
      setIsLoaded(false);
    },
  });

  // Verify if rive instance is ready and ensure the state machine is running
  useEffect(() => {
    if (rive) {
      setIsLoaded(true);
      const smNames = rive.stateMachineNames;
      if (smNames && smNames.length > 0 && (!rive.playingStateMachineNames || rive.playingStateMachineNames.length === 0)) {
        rive.play(smNames[0]);
      }
    }
  }, [rive]);

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
              <RiveComponent
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
