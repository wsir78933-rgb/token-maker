'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';

export type ArmyBackgroundPreview = {
  id: string;
  previewSrc: string;
};

function shufflePreviews(previews: readonly ArmyBackgroundPreview[]): ArmyBackgroundPreview[] {
  const shuffledPreviews = [...previews];

  for (let index = shuffledPreviews.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledPreviews[index], shuffledPreviews[randomIndex]] = [
      shuffledPreviews[randomIndex],
      shuffledPreviews[index],
    ];
  }

  return shuffledPreviews;
}

function validateArmyBackgroundPreviews(previews: readonly ArmyBackgroundPreview[]): void {
  if (previews.length !== 16) {
    throw new Error(`Army background shuffle grid requires 16 previews, received: ${previews.length}.`);
  }

  const previewIds = new Set<string>();

  for (const preview of previews) {
    if (previewIds.has(preview.id)) {
      throw new Error(`Army background shuffle grid received duplicate preview id: ${JSON.stringify(preview.id)}.`);
    }

    previewIds.add(preview.id);
  }
}

export function ArmyBackgroundShuffleGrid({
  previews,
  label,
}: {
  previews: readonly ArmyBackgroundPreview[];
  label: string;
}) {
  const [orderedPreviews, setOrderedPreviews] = useState(() => [...previews]);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const shuffleInterval = window.setInterval(() => {
      if (!document.hidden) {
        setOrderedPreviews((currentPreviews) => shufflePreviews(currentPreviews));
      }
    }, 3000);

    return () => window.clearInterval(shuffleInterval);
  }, [prefersReducedMotion]);

  validateArmyBackgroundPreviews(previews);

  return (
    <div
      role="img"
      aria-label={label}
      className="grid aspect-square w-full grid-cols-4 grid-rows-4 gap-1 md:aspect-auto md:h-[450px]"
    >
      {orderedPreviews.map((preview) => (
        <motion.div
          key={preview.id}
          layout={!prefersReducedMotion}
          initial={false}
          transition={{ duration: 1.5, type: 'spring' }}
          className="relative h-full w-full bg-[#111210]"
        >
          <Image
            src={preview.previewSrc}
            alt=""
            fill
            unoptimized
            loading="lazy"
            sizes="(max-width: 768px) 25vw, 120px"
            className="object-contain"
          />
        </motion.div>
      ))}
    </div>
  );
}
