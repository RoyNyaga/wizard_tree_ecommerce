import React from 'react';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { DiscoverFlower } from '@/components/home/DiscoverFlower';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#07070a] pt-[86px] sm:pt-[92px]">
      {/* 01 // Hero Carousel */}
      <HeroCarousel />

      {/* 02 // Discover Our Flower Banner */}
      <DiscoverFlower />
    </div>
  );
}
