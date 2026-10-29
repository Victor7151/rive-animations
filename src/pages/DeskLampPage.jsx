/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useId } from 'react';
import { Rive, Layout, Fit, Alignment } from '@rive-app/canvas';
import {
  Lamp,
  BookOpen,
  Clock,
  Play,
  Pause,
  RotateCcw,
  ChevronDown,
  Mail,
  CheckCircle2,
  Sparkles,
  Bookmark,
  Volume2,
  VolumeX,
} from 'lucide-react';

/* BookItem shape: id, title, author, year, description, mood, coverBg, spineBg, accentColor, textColor */

const CLASSIC_BOOKS = [
  {
    id: 'pride-and-prejudice',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    year: '1813',
    description: 'A witty, sparkling dance of manners, misunderstandings, and quiet first impressions.',
    mood: 'Cozy',
    coverBg: 'from-[#143428] via-[#0E251D] to-[#091812]',
    spineBg: '#091A13',
    accentColor: '#D8B168',
    textColor: '#F5EADB',
  },
  {
    id: 'frankenstein',
    title: 'Frankenstein',
    author: 'Mary Shelley',
    year: '1818',
    description: 'An eerie, philosophical exploration of ambition, loneliness, and the spark of creation.',
    mood: 'Gothic',
    coverBg: 'from-[#122A36] via-[#0D1D26] to-[#081218]',
    spineBg: '#07131A',
    accentColor: '#81B4B2',
    textColor: '#E4F0EE',
  },
  {
    id: 'dracula',
    title: 'Dracula',
    author: 'Bram Stoker',
    year: '1897',
    description: 'Epistolary dread unfolding through diaries, ship logs, and shadows across Victorian London.',
    mood: 'Gothic',
    coverBg: 'from-[#3A121A] via-[#260B11] to-[#170509]',
    spineBg: '#18060A',
    accentColor: '#D88A96',
    textColor: '#FBE9EB',
  },
  {
    id: 'alice-in-wonderland',
    title: "Alice's Adventures in Wonderland",
    author: 'Lewis Carroll',
    year: '1865',
    description: 'A surreal, dreamlike descent down the rabbit hole where whimsical logic rules the night.',
    mood: 'Whimsical',
    coverBg: 'from-[#1B2245] via-[#121630] to-[#0A0D1E]',
    spineBg: '#0C0E20',
    accentColor: '#F2A33A',
    textColor: '#F6E9D7',
  },
  {
    id: 'dorian-gray',
    title: 'The Picture of Dorian Gray',
    author: 'Oscar Wilde',
    year: '1890',
    description: 'A decadent, haunting reflection on art, vanity, and the secret toll of eternal youth.',
    mood: 'Philosophical',
    coverBg: 'from-[#29162D] via-[#1B0E1E] to-[#100712]',
    spineBg: '#120714',
    accentColor: '#C498D8',
    textColor: '#F3E4F7',
  },
  {
    id: 'meditations',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    year: 'c. 180 AD',
    description: 'Private nighttime notes from a Roman emperor on calm, mortality, and inner stillness.',
    mood: 'Reflective',
    coverBg: 'from-[#2D1C14] via-[#1E120D] to-[#120A07]',
    spineBg: '#130B07',
    accentColor: '#E2A96C',
    textColor: '#F7EBDC',
  },
];

/* FAQItem shape: question, answer */

const FAQ_ITEMS = [
  {
    question: 'What is the best time to read?',
    answer:
      'Ideally 30 to 45 minutes before you intend to sleep, after you have turned off brighter overhead lights and stowed away blue-lit screens. Even 15 quiet minutes can signal to your mind that the work of the day is complete.',
  },
  {
    question: 'How long should I read each night?',
    answer:
      'Twenty minutes is a comfortable sweet spot. It is long enough to immerse yourself in a chapter without turning reading into a chore. If you find momentum, keep going; if your eyelids feel heavy, close the book guilt-free.',
  },
  {
    question: 'Paper vs. screen: does it matter?',
    answer:
      'Physical paper is wonderful because it emits zero artificial light and prevents notifications from interrupting you. If you prefer an e-reader, choose one with warm front-lighting at the lowest legible brightness and keep Wi-Fi switched off.',
  },
  {
    question: 'What if I fall asleep while reading?',
    answer:
      'Consider it a victory, not a failure. A nightly reading habit is meant to encourage peaceful rest, not test your stamina. Simply fold down a corner or slip a bookmark in place and let sleep arrive.',
  },
];

export default function DeskLampPage() {
  // ==========================================
  // RIVE ANIMATION CODE (KEPT EXACTLY AS IT IS)
  // ==========================================
  const canvasRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let riveInstance = null;

    try {
      riveInstance = new Rive({
        src: '/desk-lamp.riv',
        canvas: canvas,
        autoplay: true,
        stateMachine: 'main',
        layout: new Layout({
          fit: Fit.Contain,
          alignment: Alignment.Center,
        }),
        onLoad: () => {
          console.log('DESK LAMP LOADED!');
          console.log('DESK LAMP AB:', riveInstance?.artboard?.name);
          console.log('DESK LAMP SM:', riveInstance?.stateMachineNames);
          console.log('DESK LAMP ANIM:', riveInstance?.animationNames);
          if (riveInstance) {
            riveInstance.resizeDrawingSurfaceToCanvas();
          }
          setIsLoaded(true);
          setHasError(false);
        },
        onLoadError: (err) => {
          console.error('DESK LAMP LOAD ERROR:', err);
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

  // ==========================================
  // READING TIMER STATE (20 MINUTES = 1200 SEC)
  // ==========================================
  const INITIAL_SECONDS = 20 * 60;
  const [timerSeconds, setTimerSeconds] = useState(INITIAL_SECONDS);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerCompleted, setTimerCompleted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Play gentle completion chime via Web Audio API
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Note 1: 523.25 Hz (C5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now);
      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.exponentialRampToValueAtTime(0.14, now + 0.05);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 1.2);

      // Note 2: 659.25 Hz (E5)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, now + 0.22);
      gain2.gain.setValueAtTime(0.001, now + 0.22);
      gain2.gain.exponentialRampToValueAtTime(0.12, now + 0.28);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.22);
      osc2.stop(now + 1.8);
    } catch {
      // Audio autoplay restrictions or unsupported
    }
  };

  useEffect(() => {
    let interval = null;

    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setTimerCompleted(true);
            playChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds, soundEnabled]);

  const handleStartTimer = () => {
    if (timerSeconds === 0) {
      setTimerSeconds(INITIAL_SECONDS);
      setTimerCompleted(false);
    }
    setIsTimerRunning(true);
    setTimerCompleted(false);
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(false);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(INITIAL_SECONDS);
    setTimerCompleted(false);
  };

  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressPercent = ((INITIAL_SECONDS - timerSeconds) / INITIAL_SECONDS) * 100;

  // ==========================================
  // FAQ ACCORDION STATE
  // ==========================================
  const [openFAQIndex, setOpenFAQIndex] = useState(0);
  const toggleFAQ = (index) => {
    setOpenFAQIndex((current) => (current === index ? null : index));
  };

  // ==========================================
  // NEWSLETTER STATE (FRONT-END ONLY)
  // ==========================================
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const newsletterInputId = useId();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setIsSubscribed(true);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0B0F14] via-[#0E141C] to-[#111820] text-[#F3E6D6] flex flex-col items-center overflow-x-hidden selection:bg-[#F2A33A]/25 selection:text-[#F2A33A]">
      {/* ========================================================= */}
      {/* 1. STICKY SLIM NAV                                        */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#0B0F14]/85 border-b border-[rgba(243,230,214,0.06)] transition-colors">
        <div className="w-full max-w-[1120px] mx-auto px-6 h-16 sm:h-20 flex items-center justify-between">
          {/* Wordmark */}
          <a
            href="#"
            className="flex items-center gap-2.5 font-['Outfit',sans-serif] text-xl font-semibold tracking-tight text-[#F3E6D6] hover:text-[#F2A33A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2A33A] rounded-lg px-1.5 py-1"
            aria-label="Lamplight Home"
          >
            <span
              className="w-2.5 h-2.5 rounded-full bg-[#F2A33A] shadow-[0_0_10px_#F2A33A]"
              aria-hidden="true"
            />
            <span>Lamplight</span>
          </a>

          {/* Nav Links */}
          <nav aria-label="Page navigation">
            <ul className="flex items-center gap-4 sm:gap-8 text-xs sm:text-sm font-medium text-[#9AA5B1]">
              <li>
                <a
                  href="#ritual"
                  className="hover:text-[#F2A33A] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F2A33A] rounded px-1.5 py-1"
                >
                  Ritual
                </a>
              </li>
              <li>
                <a
                  href="#timer"
                  className="hover:text-[#F2A33A] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F2A33A] rounded px-1.5 py-1"
                >
                  Timer
                </a>
              </li>
              <li>
                <a
                  href="#reading-list"
                  className="hover:text-[#F2A33A] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F2A33A] rounded px-1.5 py-1"
                >
                  Reading list
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="hover:text-[#F2A33A] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F2A33A] rounded px-1.5 py-1"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* ========================================================= */}
      {/* MAIN CONTAINER                                            */}
      {/* ========================================================= */}
      <main className="w-full flex flex-col items-center">
        {/* ======================================================= */}
        {/* 2. HERO SECTION                                         */}
        {/* ======================================================= */}
        <section
          className="w-full flex justify-center px-6 pt-12 sm:pt-20 pb-16 sm:pb-24"
          aria-labelledby="hero-title"
        >
          <div className="w-full max-w-[1120px] mx-auto text-center flex flex-col items-center">
            {/* Subtle Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F2A33A]/10 border border-[#F2A33A]/20 text-[#F2A33A] text-xs font-medium tracking-wide uppercase mb-6 sm:mb-8">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>A nightly reading sanctuary</span>
            </div>

            {/* Big Headline */}
            <h1
              id="hero-title"
              className="font-['Outfit',sans-serif] text-3xl sm:text-5xl lg:text-[3.75rem] font-semibold tracking-tight text-[#F3E6D6] leading-[1.12] mb-4 sm:mb-5 max-w-3xl [text-wrap:balance]"
            >
              Turn the lamp on. Open the book.
            </h1>

            {/* Subtitle */}
            <p className="text-[1rem] sm:text-lg text-[#9AA5B1] font-normal leading-relaxed max-w-xl mx-auto mb-10 sm:mb-12 [text-wrap:balance]">
              A small nightly ritual for readers. Try the scene below: switch on the lamp, open the book.
            </p>

            {/* 16:9 Aspect Ratio Canvas Container (EXACTLY AS SPECIFIED) */}
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

            {/* Small Hint Under Scene */}
            <p className="text-sm text-[#9AA5B1] mt-5 tracking-normal text-center flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F2A33A] shadow-[0_0_6px_#F2A33A]" aria-hidden="true" />
              <span>Tap the Lamp and Book switches inside the scene.</span>
            </p>
          </div>
        </section>

        {/* ======================================================= */}
        {/* 3. "THE 3-STEP RITUAL" SECTION                           */}
        {/* ======================================================= */}
        <section
          id="ritual"
          className="w-full flex justify-center px-6 py-16 sm:py-24 border-t border-[rgba(243,230,214,0.06)]"
          aria-labelledby="ritual-title"
        >
          <div className="w-full max-w-[1120px] mx-auto">
            {/* Section Header */}
            <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
              <p className="text-xs uppercase tracking-widest text-[#F2A33A] font-semibold mb-2 font-['Inter',sans-serif]">
                The Nightly Cadence
              </p>
              <h2
                id="ritual-title"
                className="font-['Outfit',sans-serif] text-2xl sm:text-4xl font-semibold text-[#F3E6D6] tracking-tight mb-3"
              >
                The 3-step ritual
              </h2>
              <p className="text-[#9AA5B1] text-sm sm:text-base leading-relaxed">
                Quiet simplicity. No elaborate setups, no complicated tracking. Just three quiet motions to close the day.
              </p>
            </div>

            {/* Three Numbered Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              {/* Card 1 */}
              <article className="group relative bg-[#111820]/75 backdrop-blur-sm border border-[rgba(243,230,214,0.08)] rounded-[24px] p-8 flex flex-col justify-between transition-all duration-300 hover:border-[#F2A33A]/30 hover:-translate-y-1 hover:shadow-[0_16px_36px_-10px_rgba(0,0,0,0.7)]">
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-['Outfit',sans-serif] text-sm font-semibold tracking-wider text-[#F2A33A] bg-[#F2A33A]/10 border border-[#F2A33A]/20 px-3 py-1 rounded-full">
                      Step 01
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-[#0B0F14] border border-[rgba(243,230,214,0.08)] flex items-center justify-center text-[#F2A33A] group-hover:scale-105 transition-transform">
                      <Lamp className="w-5 h-5" aria-hidden="true" />
                    </div>
                  </div>
                  <h3 className="font-['Outfit',sans-serif] text-xl font-semibold text-[#F3E6D6] tracking-tight mb-2.5">
                    Set the light
                  </h3>
                  <p className="text-sm text-[#9AA5B1] leading-relaxed">
                    Lower the room lights, switch on one warm lamp. Let shadows fill the corners and draw your focus inward.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-[rgba(243,230,214,0.06)] flex items-center gap-2 text-xs text-[#9AA5B1]/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F2A33A]/50" aria-hidden="true" />
                  <span>Warm amber illumination</span>
                </div>
              </article>

              {/* Card 2 */}
              <article className="group relative bg-[#111820]/75 backdrop-blur-sm border border-[rgba(243,230,214,0.08)] rounded-[24px] p-8 flex flex-col justify-between transition-all duration-300 hover:border-[#F2A33A]/30 hover:-translate-y-1 hover:shadow-[0_16px_36px_-10px_rgba(0,0,0,0.7)]">
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-['Outfit',sans-serif] text-sm font-semibold tracking-wider text-[#F2A33A] bg-[#F2A33A]/10 border border-[#F2A33A]/20 px-3 py-1 rounded-full">
                      Step 02
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-[#0B0F14] border border-[rgba(243,230,214,0.08)] flex items-center justify-center text-[#F2A33A] group-hover:scale-105 transition-transform">
                      <BookOpen className="w-5 h-5" aria-hidden="true" />
                    </div>
                  </div>
                  <h3 className="font-['Outfit',sans-serif] text-xl font-semibold text-[#F3E6D6] tracking-tight mb-2.5">
                    Open the book
                  </h3>
                  <p className="text-sm text-[#9AA5B1] leading-relaxed">
                    Keep it within arm's reach, no phone on the table. Give your eyes a tactile world of ink, paper, and silence.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-[rgba(243,230,214,0.06)] flex items-center gap-2 text-xs text-[#9AA5B1]/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F2A33A]/50" aria-hidden="true" />
                  <span>Screen-free sanctuary</span>
                </div>
              </article>

              {/* Card 3 */}
              <article className="group relative bg-[#111820]/75 backdrop-blur-sm border border-[rgba(243,230,214,0.08)] rounded-[24px] p-8 flex flex-col justify-between transition-all duration-300 hover:border-[#F2A33A]/30 hover:-translate-y-1 hover:shadow-[0_16px_36px_-10px_rgba(0,0,0,0.7)]">
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-['Outfit',sans-serif] text-sm font-semibold tracking-wider text-[#F2A33A] bg-[#F2A33A]/10 border border-[#F2A33A]/20 px-3 py-1 rounded-full">
                      Step 03
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-[#0B0F14] border border-[rgba(243,230,214,0.08)] flex items-center justify-center text-[#F2A33A] group-hover:scale-105 transition-transform">
                      <Clock className="w-5 h-5" aria-hidden="true" />
                    </div>
                  </div>
                  <h3 className="font-['Outfit',sans-serif] text-xl font-semibold text-[#F3E6D6] tracking-tight mb-2.5">
                    Read for 20 minutes
                  </h3>
                  <p className="text-sm text-[#9AA5B1] leading-relaxed">
                    Stop at a natural pause and note one line. You do not need to finish the chapter; merely let your thoughts quiet down.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-[rgba(243,230,214,0.06)] flex items-center gap-2 text-xs text-[#9AA5B1]/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F2A33A]/50" aria-hidden="true" />
                  <span>Gentle, unhurried ending</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ======================================================= */}
        {/* 4. "WHY READ BY LAMPLIGHT" SECTION                      */}
        {/* ======================================================= */}
        <section
          className="w-full flex justify-center px-6 py-16 sm:py-24 border-t border-[rgba(243,230,214,0.06)]"
          aria-labelledby="why-title"
        >
          <div className="w-full max-w-[1120px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column: Calm Paragraph */}
              <div className="lg:col-span-7 flex flex-col">
                <p className="text-xs uppercase tracking-widest text-[#F2A33A] font-semibold mb-2 font-['Inter',sans-serif]">
                  Quiet Evening Philosophy
                </p>
                <h2
                  id="why-title"
                  className="font-['Outfit',sans-serif] text-2xl sm:text-4xl font-semibold text-[#F3E6D6] tracking-tight mb-6"
                >
                  Why read by lamplight
                </h2>
                <div className="space-y-4 text-base sm:text-lg text-[#9AA5B1] font-light leading-relaxed">
                  <p>
                    Evening reading is not an exercise in speed, competition, or checking titles off a list. It is an intentional boundary placed gently between the clamor of the day and the silence of sleep.
                  </p>
                  <p>
                    When you narrow your visual world to the warm pool cast by a single lamp, the urge to refresh endless streams dissolves. Turning physical pages requires only your quiet presence. The breath slows, the shoulders drop, and rest is invited on its own unhurried terms.
                  </p>
                </div>
              </div>

              {/* Right Column: Pull Quote in Fraunces Italic */}
              <div className="lg:col-span-5">
                <div className="relative bg-gradient-to-br from-[#111820]/90 to-[#0B0F14]/90 border border-[#F2A33A]/20 rounded-[24px] p-8 sm:p-10 shadow-[0_0_40px_-10px_rgba(242,163,58,0.08)] overflow-hidden">
                  {/* Decorative Quotation Symbol */}
                  <span
                    className="absolute -top-4 -left-1 text-8xl font-serif text-[#F2A33A]/15 select-none pointer-events-none"
                    aria-hidden="true"
                  >
                    “
                  </span>

                  <blockquote className="relative z-10 font-['Fraunces',Georgia,serif] italic text-xl sm:text-2xl text-[#F3E6D6] leading-relaxed pt-2">
                    "In the circle of a single lamp, the entire world shrinks to the page before you."
                  </blockquote>

                  <div className="relative z-10 mt-6 pt-5 border-t border-[rgba(243,230,214,0.08)] flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-widest text-[#F2A33A]">
                      Lamplight Reflections
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-[#F2A33A]/70" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================= */}
        {/* 5. "READING TIMER" SECTION                              */}
        {/* ======================================================= */}
        <section
          id="timer"
          className="w-full flex justify-center px-6 py-16 sm:py-24 border-t border-[rgba(243,230,214,0.06)]"
          aria-labelledby="timer-title"
        >
          <div className="w-full max-w-[1120px] mx-auto">
            {/* Centered Timer Card */}
            <div className="max-w-[700px] mx-auto bg-[#111820]/80 backdrop-blur-md border border-[rgba(243,230,214,0.08)] rounded-[24px] p-8 sm:p-12 text-center shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)] relative overflow-hidden">
              {/* Header */}
              <div className="mb-6">
                <p className="text-xs uppercase tracking-widest text-[#F2A33A] font-semibold mb-2 font-['Inter',sans-serif]">
                  Quiet Focus Companion
                </p>
                <h2
                  id="timer-title"
                  className="font-['Outfit',sans-serif] text-2xl sm:text-4xl font-semibold text-[#F3E6D6] tracking-tight mb-2"
                >
                  Reading timer
                </h2>
                <p className="text-sm text-[#9AA5B1]">
                  Twenty quiet minutes. Place your device face down and immerse yourself.
                </p>
              </div>

              {/* Progress Indicator Bar */}
              <div
                className="w-full max-w-md mx-auto h-1.5 bg-[#080C10] rounded-full overflow-hidden mb-6 border border-[rgba(243,230,214,0.05)]"
                role="progressbar"
                aria-valuenow={Math.round(progressPercent)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Reading timer progress"
              >
                <div
                  className="h-full bg-gradient-to-r from-[#F2A33A]/60 to-[#F2A33A] transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Large Time Display */}
              <div
                className="font-['Outfit',sans-serif] font-light text-6xl sm:text-8xl text-[#F2A33A] tracking-wider my-4 sm:my-6 select-none drop-shadow-[0_0_24px_rgba(242,163,58,0.2)]"
                aria-live="polite"
              >
                {formattedTime}
              </div>

              {/* Completion Message */}
              {timerCompleted && (
                <div
                  className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#F2A33A]/15 border border-[#F2A33A]/40 text-[#F2A33A] text-sm sm:text-base font-medium mb-6 animate-pulse"
                  role="status"
                >
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  <span>Time. Mark your page.</span>
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center justify-center gap-3 sm:gap-4 mt-2">
                {!isTimerRunning ? (
                  <button
                    onClick={handleStartTimer}
                    className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-full bg-[#F2A33A] text-[#0B0F14] font-semibold text-sm sm:text-base hover:bg-[#F2A33A]/90 transition-all hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(242,163,58,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2A33A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111820]"
                    aria-label={timerSeconds === INITIAL_SECONDS ? 'Start 20 minute timer' : 'Resume timer'}
                  >
                    <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                    <span>{timerSeconds === INITIAL_SECONDS ? 'Start' : 'Resume'}</span>
                  </button>
                ) : (
                  <button
                    onClick={handlePauseTimer}
                    className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-full bg-[#F3E6D6]/10 text-[#F3E6D6] font-semibold text-sm sm:text-base hover:bg-[#F3E6D6]/20 transition-all hover:scale-105 active:scale-95 border border-[rgba(243,230,214,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2A33A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111820]"
                    aria-label="Pause timer"
                  >
                    <Pause className="w-4 h-4 fill-current" aria-hidden="true" />
                    <span>Pause</span>
                  </button>
                )}

                <button
                  onClick={handleResetTimer}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-transparent text-[#9AA5B1] hover:text-[#F3E6D6] hover:bg-[#0B0F14]/50 border border-[rgba(243,230,214,0.08)] transition-all text-sm sm:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2A33A]"
                  aria-label="Reset timer to 20 minutes"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  <span>Reset</span>
                </button>

                {/* Sound Toggle */}
                <button
                  onClick={() => setSoundEnabled((prev) => !prev)}
                  className={`p-3 rounded-full border transition-all text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2A33A] ${
                    soundEnabled
                      ? 'border-[#F2A33A]/30 text-[#F2A33A] bg-[#F2A33A]/10'
                      : 'border-[rgba(243,230,214,0.08)] text-[#9AA5B1] hover:text-[#F3E6D6]'
                  }`}
                  aria-label={soundEnabled ? 'Disable completion chime' : 'Enable completion chime'}
                  title={soundEnabled ? 'Chime sound is enabled' : 'Chime sound is muted'}
                >
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <VolumeX className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================= */}
        {/* 6. "TONIGHT'S READING LIST" SECTION                      */}
        {/* ======================================================= */}
        <section
          id="reading-list"
          className="w-full flex justify-center px-6 py-16 sm:py-24 border-t border-[rgba(243,230,214,0.06)]"
          aria-labelledby="reading-list-title"
        >
          <div className="w-full max-w-[1120px] mx-auto">
            {/* Section Header */}
            <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
              <p className="text-xs uppercase tracking-widest text-[#F2A33A] font-semibold mb-2 font-['Inter',sans-serif]">
                Public Domain Classics
              </p>
              <h2
                id="reading-list-title"
                className="font-['Outfit',sans-serif] text-2xl sm:text-4xl font-semibold text-[#F3E6D6] tracking-tight mb-3"
              >
                Tonight's reading list
              </h2>
              <p className="text-[#9AA5B1] text-sm sm:text-base leading-relaxed">
                Six timeless works ready for quiet evenings. Free of copyright, rich with atmosphere, impossible to rush.
              </p>
            </div>

            {/* Grid of 6 Book Cards (CSS Typographic Covers, No Images) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 w-full">
              {CLASSIC_BOOKS.map((book) => (
                <article
                  key={book.id}
                  className="group bg-[#111820]/75 backdrop-blur-sm border border-[rgba(243,230,214,0.08)] rounded-[24px] p-6 flex flex-col justify-between transition-all duration-300 hover:border-[#F2A33A]/30 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)]"
                >
                  {/* CSS-Engineered Typographic Book Cover */}
                  <div
                    className={`relative w-full h-44 rounded-2xl bg-gradient-to-r ${book.coverBg} border border-[rgba(243,230,214,0.1)] p-4 flex flex-col justify-between shadow-inner overflow-hidden mb-6 transition-transform group-hover:scale-[1.01]`}
                  >
                    {/* Simulated Book Spine on the Left */}
                    <div
                      className="absolute top-0 left-0 bottom-0 w-3.5 border-r border-[rgba(243,230,214,0.15)] shadow-md"
                      style={{ backgroundColor: book.spineBg }}
                      aria-hidden="true"
                    />

                    {/* Bookmark Ribbon Hanging from Top */}
                    <div
                      className="absolute top-0 right-6 w-3 h-9 shadow-md flex flex-col items-center"
                      style={{ backgroundColor: book.accentColor }}
                      aria-hidden="true"
                    >
                      <div className="mt-auto w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[5px] border-b-[#0B0F14]" />
                    </div>

                    {/* Cover Header */}
                    <div className="pl-4 flex items-center justify-between text-[11px] uppercase tracking-wider font-semibold opacity-70">
                      <span style={{ color: book.accentColor }}>Classic Edition</span>
                      <span className="text-[#9AA5B1]">{book.year}</span>
                    </div>

                    {/* Centered Embossed Title & Author */}
                    <div className="pl-4 pr-3 text-center my-auto">
                      <h4
                        className="font-['Fraunces',Georgia,serif] text-lg sm:text-xl font-medium tracking-tight leading-tight line-clamp-2"
                        style={{ color: book.textColor }}
                      >
                        {book.title}
                      </h4>
                      <div
                        className="w-8 h-0.5 mx-auto my-1.5 opacity-40 rounded-full"
                        style={{ backgroundColor: book.accentColor }}
                        aria-hidden="true"
                      />
                      <p className="text-xs tracking-wider uppercase font-medium opacity-75" style={{ color: book.accentColor }}>
                        {book.author}
                      </p>
                    </div>

                    {/* Subtle Spine Stitch Line Effect */}
                    <div className="pl-4 flex justify-between items-center text-[10px] text-[#9AA5B1]/50 uppercase tracking-widest">
                      <span>Public Domain</span>
                      <Bookmark className="w-3 h-3 text-[#9AA5B1]/40" aria-hidden="true" />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="font-['Outfit',sans-serif] text-lg font-semibold text-[#F3E6D6] tracking-tight">
                        {book.title}
                      </h3>
                      {/* Mood Tag */}
                      <span className="shrink-0 text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#F2A33A]/10 text-[#F2A33A] border border-[#F2A33A]/20">
                        {book.mood}
                      </span>
                    </div>

                    <p className="text-xs text-[#9AA5B1] mb-2 font-medium">By {book.author}</p>
                    <p className="text-sm text-[#9AA5B1] leading-relaxed line-clamp-2">{book.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ======================================================= */}
        {/* 7. "QUESTIONS" (FAQ ACCORDION) SECTION                  */}
        {/* ======================================================= */}
        <section
          id="faq"
          className="w-full flex justify-center px-6 py-16 sm:py-24 border-t border-[rgba(243,230,214,0.06)]"
          aria-labelledby="faq-title"
        >
          <div className="w-full max-w-[1120px] mx-auto">
            {/* Section Header */}
            <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
              <p className="text-xs uppercase tracking-widest text-[#F2A33A] font-semibold mb-2 font-['Inter',sans-serif]">
                Common Thoughts
              </p>
              <h2
                id="faq-title"
                className="font-['Outfit',sans-serif] text-2xl sm:text-4xl font-semibold text-[#F3E6D6] tracking-tight mb-3"
              >
                Questions
              </h2>
              <p className="text-[#9AA5B1] text-sm sm:text-base leading-relaxed">
                Gentle guidance for easing into a steady bedtime reading practice.
              </p>
            </div>

            {/* Accordion List */}
            <div className="max-w-[800px] mx-auto space-y-4">
              {FAQ_ITEMS.map((item, index) => {
                const isOpen = openFAQIndex === index;
                const questionId = `faq-question-${index}`;
                const panelId = `faq-panel-${index}`;

                return (
                  <div
                    key={index}
                    className="bg-[#111820]/75 backdrop-blur-sm border border-[rgba(243,230,214,0.08)] rounded-[24px] overflow-hidden transition-colors hover:border-[#F2A33A]/30"
                  >
                    <h3>
                      <button
                        id={questionId}
                        onClick={() => toggleFAQ(index)}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        className="w-full px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between gap-4 text-left font-['Outfit',sans-serif] text-base sm:text-lg font-medium text-[#F3E6D6] hover:text-[#F2A33A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2A33A] rounded-[24px]"
                      >
                        <span>{item.question}</span>
                        <ChevronDown
                          className={`w-5 h-5 shrink-0 text-[#F2A33A] transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                    </h3>

                    {isOpen && (
                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={questionId}
                        className="px-6 sm:px-8 pb-6 pt-1 text-sm sm:text-base text-[#9AA5B1] leading-relaxed border-t border-[rgba(243,230,214,0.04)]"
                      >
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ======================================================= */}
        {/* 8. NEWSLETTER SIGNUP CARD                               */}
        {/* ======================================================= */}
        <section
          className="w-full flex justify-center px-6 py-16 sm:py-24 border-t border-[rgba(243,230,214,0.06)]"
          aria-labelledby="newsletter-title"
        >
          <div className="w-full max-w-[1120px] mx-auto">
            <div className="max-w-[760px] mx-auto bg-gradient-to-b from-[#151D27] to-[#111820] border border-[#F2A33A]/20 rounded-[24px] p-8 sm:p-14 text-center shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden">
              {/* Warm Ambient Glow in Corner */}
              <div
                className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[#F2A33A]/10 blur-3xl pointer-events-none"
                aria-hidden="true"
              />

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-[#0B0F14] border border-[#F2A33A]/30 text-[#F2A33A] flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-6 h-6" aria-hidden="true" />
                </div>

                <h2
                  id="newsletter-title"
                  className="font-['Outfit',sans-serif] text-2xl sm:text-4xl font-semibold text-[#F3E6D6] tracking-tight mb-3"
                >
                  One line a week for readers
                </h2>

                <p className="text-sm sm:text-base text-[#9AA5B1] max-w-md mx-auto mb-8 leading-relaxed">
                  A single contemplative sentence from classic literature delivered to your inbox every Sunday evening.
                </p>

                {isSubscribed ? (
                  <div
                    className="p-6 rounded-2xl bg-[#0B0F14]/80 border border-[#F2A33A]/30 text-center animate-fadeIn"
                    role="status"
                  >
                    <CheckCircle2 className="w-8 h-8 text-[#F2A33A] mx-auto mb-3" aria-hidden="true" />
                    <h3 className="font-['Outfit',sans-serif] text-lg font-semibold text-[#F3E6D6] mb-1">
                      You're on the list
                    </h3>
                    <p className="text-sm text-[#9AA5B1] mb-4">
                      Thank you for joining. Keep your lamp lit and your evenings quiet.
                    </p>
                    <button
                      onClick={() => {
                        setIsSubscribed(false);
                        setEmailInput('');
                      }}
                      className="text-xs text-[#F2A33A] underline hover:opacity-80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F2A33A] rounded px-1"
                    >
                      Subscribe another address
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleNewsletterSubmit}
                    className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
                  >
                    <label htmlFor={newsletterInputId} className="sr-only">
                      Email address
                    </label>
                    <input
                      id={newsletterInputId}
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="your.email@quietnight.com"
                      className="w-full px-5 py-3 rounded-full bg-[#080C10] border border-[rgba(243,230,214,0.12)] text-[#F3E6D6] placeholder-[#9AA5B1]/50 text-sm focus:outline-none focus:border-[#F2A33A] focus:ring-1 focus:ring-[#F2A33A] transition-all"
                    />
                    <button
                      type="submit"
                      className="w-full sm:w-auto shrink-0 px-7 py-3 rounded-full bg-[#F2A33A] text-[#0B0F14] font-semibold text-sm hover:bg-[#F2A33A]/90 transition-all hover:scale-105 active:scale-95 shadow-[0_4px_16px_rgba(242,163,58,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2A33A]"
                    >
                      Subscribe
                    </button>
                  </form>
                )}

                <p className="text-[11px] text-[#9AA5B1]/60 mt-4">
                  No promotional spam. Unsubscribe quietly with one click anytime.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================= */}
      {/* 9. FOOTER                                                 */}
      {/* ========================================================= */}
      <footer className="w-full border-t border-[rgba(243,230,214,0.08)] bg-[#080C10] py-12 px-6">
        <div className="w-full max-w-[1120px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          {/* Creator & Project Note */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-[#F3E6D6]">Made by Victor Johnmark</p>
            <p className="text-xs text-[#9AA5B1]/70">Interactive scene built with Rive</p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-5 text-sm">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9AA5B1] hover:text-[#F2A33A] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F2A33A] rounded px-1"
              aria-label="Victor Johnmark on LinkedIn"
            >
              LinkedIn
            </a>
            <span className="text-[#9AA5B1]/30" aria-hidden="true">
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
        </div>
      </footer>
    </div>
  );
}
