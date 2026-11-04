import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Microscope, Award, ShieldCheck, Sparkles, Dna, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const pillars = [
    {
      title: 'IN-HOUSE BREEDING ONLY',
      desc: 'We do not buy white-label biomass. Every cultivar carrying the Wizard Trees emblem was either hunted from thousands of seed seedlings in our Los Angeles facility or bred directly with our elite partners.',
      icon: Dna,
    },
    {
      title: 'TIER 1 INDOOR CLEANROOMS',
      desc: 'Our cultivation canopy operates under medical-grade positive pressure environments with continuous HEPA filtration and strict sterile room procedures to eliminate pests and pathogens without toxic chemicals.',
      icon: ShieldCheck,
    },
    {
      title: '28-DAY COLD CURING',
      desc: 'Drying and curing is an art form. We slow-dry whole plants at 60°F / 60% relative humidity, followed by minimum 28 days in dark glass jars to allow terpene profiles to mature and soften.',
      icon: Microscope,
    },
    {
      title: 'COLLABORATIVE EXCELLENCE',
      desc: 'From breeding ZOAP with Deep East to developing ZANGRIA alongside Fiya Farmer, we embrace collaborative alchemy to break botanical boundaries.',
      icon: Award,
    },
  ];

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#07070a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="border-b border-white/10 pb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/20 px-3.5 py-1 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-wizard-purple-glow" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-purple-200">
              06 // PHILOSOPHY & CULTIVATION
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-black uppercase text-white">
            THE WIZARD ROOTS
          </h1>

          <p className="mt-2 text-sm sm:text-base text-wizard-muted max-w-2xl font-normal leading-relaxed">
            Founded on botanical obsession and uncompromising attention to detail in Los Angeles, California.
          </p>
        </div>

        {/* Narrative Section with Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6 text-sm sm:text-base text-wizard-muted leading-relaxed">
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold uppercase text-white">
              WHERE STREETWEAR CULTURE MEETS CANNABIS HORTICULTURE.
            </h2>
            <p>
              Wizard Trees was born from a refusal to accept the commercialization of modern flower. As mega-facilities prioritized yield over aroma and THC numbers over terpenes, our team committed to the craft tradition: obsessive phenotype selection, patient curing, and distinct artistic packaging.
            </p>
            <p>
              When we released <strong className="text-white">ZOAP</strong> in collaboration with Deep East, it captured Leafly’s Strain of the Year and sparked an international movement. It proved that true connoisseurs crave complex, layered terpene bouquets over generic candy strains.
            </p>
            <p>
              Today, our Los Angeles facility remains our laboratory. We cultivate in small batches, curate limited seed releases for genetic preservation, and produce heavyweight streetwear crafted in Downtown LA.
            </p>
          </div>

          <div className="lg:col-span-6 relative aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-black">
            <Image
              src="https://images.unsplash.com/photo-1568644396922-5c3bfae12521?auto=format&fit=crop&w=1200&q=80"
              alt="Wizard Trees Cultivation"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 font-mono text-xs flex justify-between text-white/80">
              <span>LOS ANGELES, CA</span>
              <span className="text-wizard-purple-glow">TIER 1 CLEANROOM</span>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="space-y-6 pt-6">
          <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-white text-center">
            THE FOUR CORE STANDARDS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-[#0c0b13] p-6 space-y-4 transition hover:border-wizard-purple-glow/40 hover:shadow-xl hover:shadow-purple-950/40"
                >
                  <div className="h-10 w-10 rounded-xl bg-wizard-purple/20 border border-wizard-purple-glow/30 flex items-center justify-center text-wizard-purple-glow">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-display text-base font-bold uppercase text-white">
                    {p.title}
                  </h4>
                  <p className="text-xs text-wizard-muted leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to action */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-purple-950/30 to-[#0c0b13] p-8 sm:p-12 text-center space-y-6">
          <h3 className="font-display text-3xl sm:text-4xl font-extrabold uppercase text-white">
            EXPERIENCE THE CULTIVARS
          </h3>
          <p className="text-sm text-wizard-muted max-w-lg mx-auto">
            Discover our full genetics library or locate an authorized retail dispensary partner near you.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/strains"
              className="rounded-xl bg-white px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-widest text-black hover:bg-wizard-purple-glow hover:text-white transition"
            >
              Explore Genetics
            </Link>
            <Link
              href="/locations"
              className="rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-widest text-white hover:bg-white hover:text-black transition"
            >
              Find Near You
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

