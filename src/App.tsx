/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Rive, Layout, Fit, Alignment } from '@rive-app/canvas';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let riveInstance: Rive | null = null;

    try {
      riveInstance = new Rive({
        src: 'desk-lamp.riv',
        canvas: canvas,
        autoplay: true,
        stateMachines: 'main',
        layout: new Layout({
          fit: Fit.Contain,
          alignment: Alignment.Center,
        }),
        onLoad: () => {
          if (riveInstance) {
            riveInstance.resizeDrawingSurfaceToCanvas();
          }
          setIsLoaded(true);
          setHasError(false);
        },
        onLoadError: () => {
          setHasError(true);
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
      setHasError(true);
    }
  }, []);

  // Show friendly placeholder until the file is found and loaded
  const showFallback = !isLoaded || hasError;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0F14] to-[#111820] text-[#F3E6D6] flex flex-col font-['Inter',sans-serif] selection:bg-[#F2A33A]/20 selection:text-[#F2A33A]">
      {/* 1. Slim Top Bar */}
      <header className="w-full max-w-5xl mx-auto px-5 py-6 sm:px-8 sm:py-7 flex items-center justify-between">
        <a
          href="#"
          className="font-['Outfit',sans-serif] text-lg font-semibold tracking-tight text-[#F3E6D6] hover:opacity-85 transition-opacity"
          aria-label="JMark Home"
        >
          JMark
        </a>
        <a
          href="#about"
          className="text-sm font-medium text-[#9AA5B1] hover:text-[#F2A33A] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F2A33A] rounded px-1"
        >
          Portfolio
        </a>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-5 pb-16 sm:px-8 sm:pb-20 flex flex-col items-center">
        {/* 2. Hero Section */}
        <section className="w-full text-center mt-3 sm:mt-6 mb-12 sm:mb-16" aria-labelledby="hero-title">
          <h1
            id="hero-title"
            className="font-['Outfit',sans-serif] text-[2.25rem] sm:text-5xl lg:text-[3.5rem] font-semibold tracking-tight text-[#F3E6D6] leading-[1.12] mb-3 [text-wrap:balance]"
          >
            Turn the lamp on.
          </h1>
          <p className="text-[0.95rem] sm:text-base lg:text-[1.0625rem] text-[#9AA5B1] leading-relaxed max-w-xl mx-auto mb-8 [text-wrap:balance]">
            An interactive Rive scene. Tap the switches to light the lamp and open the book.
          </p>

          {/* 16:9 Canvas Container with Soft Warm Glow and 24px Rounded Corners */}
          <div
            className="relative w-full max-w-[960px] mx-auto aspect-video rounded-[24px] overflow-hidden bg-[#080C10] border border-[#F2A33A]/20 shadow-[0_0_0_1px_rgba(242,163,58,0.1),0_20px_48px_-12px_rgba(0,0,0,0.85),0_0_65px_-10px_rgba(242,163,58,0.16)] transition-all duration-300 hover:border-[#F2A33A]/30 hover:shadow-[0_0_0_1px_rgba(242,163,58,0.15),0_24px_60px_-12px_rgba(0,0,0,0.9),0_0_85px_-10px_rgba(242,163,58,0.22)]"
          >
            <canvas
              ref={canvasRef}
              id="rive-canvas"
              width={1920}
              height={1080}
              className="w-full h-full block object-contain"
              aria-label="Interactive Rive scene canvas"
            />

            {/* Friendly message inside the 16:9 container when desk-lamp.riv is not yet present */}
            {showFallback && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#080C10] z-10"
                role="status"
                aria-live="polite"
              >
                <div className="flex flex-col items-center gap-3.5 max-w-md">
                  <svg
                    className="w-8 h-8 text-[#F2A33A] opacity-90"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 2v4" />
                    <path d="m4.93 10.93 2.83-2.83" />
                    <path d="M2 18h20" />
                    <path d="M20 18l-3-8H7l-3 8" />
                    <circle cx="12" cy="18" r="1" />
                  </svg>
                  <p className="text-[0.9375rem] text-[#F3E6D6] leading-relaxed">
                    Add{' '}
                    <code className="font-mono text-[#F2A33A] bg-[#F2A33A]/10 border border-[#F2A33A]/25 px-1.5 py-0.5 rounded text-sm">
                      desk-lamp.riv
                    </code>{' '}
                    next to this page to see the animation
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 3. Hint Line Under Canvas */}
          <p className="text-sm text-[#9AA5B1] mt-4 tracking-normal">
            Tap the Lamp and Book switches inside the scene.
          </p>
        </section>

        {/* 4. About this project Section */}
        <section className="w-full max-w-[960px] mx-auto mb-16" id="about" aria-labelledby="about-title">
          <h2
            id="about-title"
            className="font-['Outfit',sans-serif] text-xl sm:text-2xl font-semibold text-[#F3E6D6] tracking-tight mb-6 text-left"
          >
            About this project
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 w-full">
            {/* Card 1: Built with Rive */}
            <article className="bg-[#111820]/75 backdrop-blur-sm border border-[rgba(243,230,214,0.08)] rounded-2xl p-6 transition-all duration-200 hover:border-[#F2A33A]/30 hover:-translate-y-0.5">
              <h3 className="font-['Outfit',sans-serif] text-lg font-semibold text-[#F3E6D6] tracking-tight mb-2">
                Built with Rive
              </h3>
              <p className="text-sm text-[#9AA5B1] leading-relaxed">
                State machines and listeners
              </p>
            </article>

            {/* Card 2: AI-generated visuals */}
            <article className="bg-[#111820]/75 backdrop-blur-sm border border-[rgba(243,230,214,0.08)] rounded-2xl p-6 transition-all duration-200 hover:border-[#F2A33A]/30 hover:-translate-y-0.5">
              <h3 className="font-['Outfit',sans-serif] text-lg font-semibold text-[#F3E6D6] tracking-tight mb-2">
                AI-generated visuals
              </h3>
              <p className="text-sm text-[#9AA5B1] leading-relaxed">
                Images created with Gemini
              </p>
            </article>

            {/* Card 3: Made to be interactive */}
            <article className="bg-[#111820]/75 backdrop-blur-sm border border-[rgba(243,230,214,0.08)] rounded-2xl p-6 transition-all duration-200 hover:border-[#F2A33A]/30 hover:-translate-y-0.5">
              <h3 className="font-['Outfit',sans-serif] text-lg font-semibold text-[#F3E6D6] tracking-tight mb-2">
                Made to be interactive
              </h3>
              <p className="text-sm text-[#9AA5B1] leading-relaxed">
                Two switches, four scene states
              </p>
            </article>
          </div>
        </section>
      </main>

      {/* 5. Footer */}
      <footer className="w-full max-w-[960px] mx-auto px-5 py-8 sm:px-8 border-t border-[rgba(243,230,214,0.08)] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <p className="text-sm text-[#9AA5B1]">Made by Victor Johnmark</p>
        <div className="flex items-center gap-4 text-sm">
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#9AA5B1] hover:text-[#F2A33A] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F2A33A] rounded px-1"
            aria-label="Victor Johnmark on LinkedIn"
          >
            LinkedIn
          </a>
          <span className="text-[#9AA5B1]/40" aria-hidden="true">
            ·
          </span>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#9AA5B1] hover:text-[#F2A33A] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F2A33A] rounded px-1"
            aria-label="Victor Johnmark on X"
          >
            X
          </a>
        </div>
      </footer>
    </div>
  );
}
