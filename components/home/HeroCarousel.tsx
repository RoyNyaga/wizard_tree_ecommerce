'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

interface Slide {
  id: number;
  image: string;
  alt: string;
  link?: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    image: '/images/home_page_slide_one.png',
    alt: 'Wizard Trees - New York Drop',
    link: '/shop',
  },
  {
    id: 2,
    image: '/images/home_page_slide_two.png',
    alt: 'Unlock The Magic - Explore Our Strains',
    link: '/strains',
  },
  {
    id: 3,
    image: '/images/home_page_slide_three.png',
    alt: 'Wizard Trees Handheld Drop',
    link: '/shop',
  },
];

export function HeroCarousel() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const totalSlides = SLIDES.length;

  const nextSlide = useCallback(() => {
    setCurrentIdx((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIdx((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (idx: number) => {
    setCurrentIdx(idx);
  };

  // Auto-play timer (5 seconds) when playing and not hovered
  useEffect(() => {
    if (!isPlaying || isHovered) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, nextSlide]);

  // Touch handlers for mobile swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      aria-label="Home Page Carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full overflow-hidden bg-black select-none"
    >
      {/* Sliding Track */}
      <div
        className="flex w-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIdx * 100}%)` }}
      >
        {SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className="relative w-full flex-shrink-0"
          >
            {/* Aspect Ratio Container matching the widescreen banner proportions */}
            <div className="relative w-full aspect-[16/7] sm:aspect-[2.3/1] md:aspect-[2.8/1] lg:aspect-[3.15/1] min-h-[220px]">
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={idx === 0}
                sizes="100vw"
                className="object-cover object-center"
              />

              {slide.link && (
                <Link
                  href={slide.link}
                  className="absolute inset-0 z-10"
                  aria-label={slide.alt}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ======================================================== */}
      {/* LEFT ARROW (Minimalist sleek white chevron)              */}
      {/* ======================================================== */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 p-2 text-white/70 hover:text-white transition-all hover:scale-125 active:scale-95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]"
      >
        <ChevronLeft className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 stroke-[1.25]" />
      </button>

      {/* ======================================================== */}
      {/* RIGHT ARROW (Minimalist sleek white chevron)             */}
      {/* ======================================================== */}
      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 p-2 text-white/70 hover:text-white transition-all hover:scale-125 active:scale-95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]"
      >
        <ChevronRight className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 stroke-[1.25]" />
      </button>

      {/* ======================================================== */}
      {/* BOTTOM CONTROLS: Pause/Play + Pagination Dots            */}
      {/* ======================================================== */}
      <div className="absolute bottom-3 sm:bottom-4 md:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 sm:gap-3 py-1 px-2.5 rounded-full drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
        {/* Pause / Play Toggle Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          className="text-white/80 hover:text-white transition-colors p-0.5"
        >
          {isPlaying ? (
            <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
          ) : (
            <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
          )}
        </button>

        {/* 3 Pagination Dots */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`rounded-full transition-all duration-300 ${currentIdx === idx
                  ? 'w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white scale-110 shadow-sm shadow-white'
                  : 'w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/40 hover:bg-white/75'
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
