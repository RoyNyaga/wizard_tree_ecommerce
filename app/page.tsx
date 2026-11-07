import React from 'react';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { DiscoverFlower } from '@/components/home/DiscoverFlower';
import { SeedsSection } from '@/components/home/SeedsSection';
import { OtherSection } from '@/components/home/OtherSection';
import { WeAreWizardTrees } from '@/components/home/WeAreWizardTrees';
import { CultivationVideo } from '@/components/home/CultivationVideo';
import { FooterSection } from '@/components/home/FooterSection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black pt-[86px] sm:pt-[92px]">
      {/* 01 // Hero Carousel */}
      <HeroCarousel />

      {/* 02 // Discover Our Flower Banner */}
      <DiscoverFlower />

      {/* 03 // Seeds Banner */}
      <SeedsSection />

      {/* 04 // Other Banner */}
      <OtherSection />

      {/* 05 // We Are Wizard Trees Banner */}
      <WeAreWizardTrees />

      {/* 06 // Cultivation Video Banner */}
      <CultivationVideo />

      {/* 07 // Final Section: Telegram Announcement & Email Subscription */}
      <FooterSection />
    </div>
  );
}
