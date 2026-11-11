"use client";

import React from 'react';
import Image from 'next/image';
import { LOGO_EMBLEM_PATH } from './LogoPathData';

interface LogoRevealProps {
  className?: string;
  size?: number;
  priority?: boolean;
}

/**
 * Cinematic SVG Stroke Logo Reveal
 * Draws the logo outlines with golden strokes first, followed by soft fill and subtle warm glow.
 */
export function LogoReveal({
  className = "w-8 h-8 sm:w-9 sm:h-9",
  size = 36,
  priority = true,
}: LogoRevealProps) {
  return (
    <div
      className={`relative ${className} shrink-0 flex items-center justify-center select-none`}
    >
      {/* 1. Underlying High-Res Logo Image with gentle fill fade-in */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center animate-fill-fade">
        <Image
          src="/logo_web_new1.svg"
          alt="میدیای ئیسلامی"
          width={size}
          height={size}
          priority={priority}
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
        className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-xs overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="logoStrokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="35%" stopColor="#f59e0b" />
            <stop offset="70%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <linearGradient id="logoFillGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        <path
          d={LOGO_EMBLEM_PATH}
          fill="url(#logoFillGradient)"
          stroke="url(#logoStrokeGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          fillRule="evenodd"
          pathLength={1000}
          className="animate-stroke-reveal"
        />
      </svg>
    </div>
  );
}
