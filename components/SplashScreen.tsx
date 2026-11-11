"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { LOGO_EMBLEM_PATH } from './LogoPathData';

const SPLASH_SESSION_KEY = 'mediay_splash_screen_seen';

/**
 * Luxury Cinematic Splash Screen
 * Displays a full-screen dark canvas with golden SVG Stroke Logo Reveal,
 * typography fade-in, and smooth exit before the site reveals.
 * Shows once per session on desktop and mobile.
 */
export function SplashScreen() {
  const [isRendered, setIsRendered] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const dismissSplash = useCallback(() => {
    setIsFadingOut(true);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    const timer = setTimeout(() => {
      setIsRendered(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const alreadySeen = sessionStorage.getItem(SPLASH_SESSION_KEY);
      if (alreadySeen) {
        return; // Skip splash on subsequent navigations in the same session
      }
      sessionStorage.setItem(SPLASH_SESSION_KEY, 'true');
    } catch {
      // ignore storage errors
    }

    setIsRendered(true);
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    // Cinematic pacing: 1.8s drawing + glow settles -> smooth exit at 2.4s
    const exitTimer = setTimeout(() => {
      dismissSplash();
    }, 2400);

    return () => {
      clearTimeout(exitTimer);
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [dismissSplash]);

  if (!isRendered) return null;

  return (
    <div
      onClick={dismissSplash}
      aria-hidden="true"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#09090b] text-white select-none cursor-pointer transition-opacity duration-700 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
    >
      {/* Ambient Warm Golden Glow behind the emblem */}
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Main Luxury Emblem Container */}
      <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center mb-6">
        {/* 1. Underlying High-Res Emblem with smooth fill fade */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center animate-fill-fade">
          <Image
            src="/logo_web_new1.svg"
            alt="میدیای ئیسلامی"
            width={144}
            height={144}
            priority={true}
            loading="eager"
            unoptimized
            className="w-full h-full object-contain"
          />
        </div>

        {/* 2. Cinematic SVG Stroke Reveal Overlay */}
        <svg
          viewBox="0 0 908 1094"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-md overflow-visible"
        >
          <defs>
            <linearGradient id="splashStrokeGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="35%" stopColor="#f59e0b" />
              <stop offset="70%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id="splashFillGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.85" />
            </linearGradient>
          </defs>

          <path
            d={LOGO_EMBLEM_PATH}
            fill="url(#splashFillGold)"
            stroke="url(#splashStrokeGold)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            fillRule="evenodd"
            pathLength={1000}
            className="animate-stroke-reveal"
          />
        </svg>
      </div>

      {/* Brand Title (Fades in smoothly) */}
      <h1
        className="text-2xl sm:text-3xl font-bold font-peshang tracking-normal text-white text-center animate-splash-text"
        style={{ animationDelay: '0.8s', opacity: 0 }}
      >
        میدیای ئیسلامی
      </h1>

      {/* Brand Subtitle / Tagline */}
      <p
        className="text-xs sm:text-sm font-sirwan text-zinc-400 mt-2 tracking-normal text-center max-w-xs animate-splash-text"
        style={{ animationDelay: '1.1s', opacity: 0 }}
      >
        سەکۆی فیلم، کارتۆن و نووسینی کوردی
      </p>

      {/* Subtle Luxury Golden Accent Line */}
      <div
        className="w-16 h-0.5 rounded-full bg-gradient-to-r from-transparent via-amber-500/80 to-transparent mt-6 animate-pulse"
        style={{ animationDelay: '1.4s' }}
      />
    </div>
  );
}

