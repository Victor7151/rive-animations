import React, { useEffect } from 'react';
import HeroSection from '../components/HeroSection.jsx';
import WhatYoureLookingAt from '../components/WhatYoureLookingAt.jsx';
import BuiltForWood from '../components/BuiltForWood.jsx';
import WhyItWorks from '../components/WhyItWorks.jsx';
import ContactSection from '../components/ContactSection.jsx';
import Footer from '../components/Footer.jsx';

export default function WardrobePage() {
  // Scroll-linked background transition echoing the night-to-morning light
  useEffect(() => {
    let ticking = false;

    const updateScrollProgress = () => {
      const scrollY = window.scrollY;
      const transitionStart = window.innerHeight * 0.25;
      const transitionDistance = window.innerHeight * 1.1;
      const progress = Math.min(
        Math.max((scrollY - transitionStart) / transitionDistance, 0),
        1
      );

      document.documentElement.style.setProperty('--scroll-progress', progress.toFixed(4));
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', onScroll);
      document.documentElement.style.removeProperty('--scroll-progress');
    };
  }, []);

  // Soft fade-and-rise observer on sections
  useEffect(() => {
    const revealTargets = document.querySelectorAll('.reveal-on-scroll');
    if (!revealTargets.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealTargets.forEach((target) => target.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    revealTargets.forEach((target) => observer.observe(target));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="site-wrapper">
      {/* Background layer: starts at night navy (#1B2236) and eases into morning cream (#F6E3C4) */}
      <div className="ambient-background-layer" aria-hidden="true">
        <div className="night-navy-base" />
        <div className="morning-cream-overlay" />
        <div className="ambient-light-glow" />
      </div>

      {/* Main single-page content */}
      <main id="main-content" className="site-main">
        {/* Section 1: Hero */}
        <HeroSection />

        {/* Section 2: What you're looking at */}
        <div className="reveal-on-scroll">
          <WhatYoureLookingAt />
        </div>

        {/* Section 3: Built for wood */}
        <div className="reveal-on-scroll">
          <BuiltForWood />
        </div>

        {/* Section 4: Why it works on a product page */}
        <div className="reveal-on-scroll">
          <WhyItWorks />
        </div>

        {/* Section 5: Contact */}
        <div className="reveal-on-scroll">
          <ContactSection />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
