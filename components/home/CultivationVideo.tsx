'use client';

import React, { useRef, useEffect } from 'react';

const VIDEO_URL =
  'https://wizardtrees.us/cdn/shop/videos/c/vp/4fc7ce9bb32f40208729e90843f4e3c4/4fc7ce9bb32f40208729e90843f4e3c4.HD-720p-1.6Mbps-87884090.mp4?v=0';

export function CultivationVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure autoplay triggers reliably across all mobile and desktop browsers
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {
        // Handle any browser-specific policy restrictions gracefully
      });
    }
  }, []);

  return (
    <section className="relative w-full bg-black overflow-hidden border-t border-white/[0.04]">
      {/* Aspect Ratio Box matching the widescreen video display */}
      <div className="relative w-full aspect-video md:aspect-[2.2/1] max-h-[85vh] overflow-hidden bg-black flex items-center justify-center">
        <video
          ref={videoRef}
          src={VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-center pointer-events-none"
        />

        {/* Subtle top & bottom edge blend into deep black */}
        <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[#07040d] to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#07040d] to-transparent pointer-events-none" />
      </div>
    </section>
  );
}

