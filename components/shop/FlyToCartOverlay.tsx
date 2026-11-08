'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export interface FlyingItem {
  id: string;
  image: string;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
}

interface FlyToCartOverlayProps {
  flyingItem: FlyingItem | null;
  onComplete: () => void;
}

export function FlyToCartOverlay({ flyingItem, onComplete }: FlyToCartOverlayProps) {
  if (!flyingItem) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      <AnimatePresence>
        <motion.div
          key={flyingItem.id}
          initial={{
            position: 'fixed',
            left: flyingItem.startX - 32,
            top: flyingItem.startY - 32,
            width: 64,
            height: 64,
            opacity: 1,
            scale: 1,
            rotate: 0,
          }}
          animate={{
            left: flyingItem.targetX - 16,
            top: flyingItem.targetY - 16,
            width: 32,
            height: 32,
            scale: 0.4,
            opacity: [1, 1, 0.9, 0],
            rotate: [0, -20, 25, 0],
          }}
          transition={{
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
          }}
          onAnimationComplete={onComplete}
          className="rounded-xl overflow-hidden border-2 border-wizard-purple-glow shadow-2xl shadow-purple-500/60 bg-[#0d0c14] flex items-center justify-center"
        >
          <div className="relative w-full h-full">
            <Image
              src={flyingItem.image}
              alt="Flying product"
              fill
              className="object-cover"
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

