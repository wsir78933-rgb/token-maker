'use client';

/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';
import { Play } from 'lucide-react';

interface LiteYouTubeEmbedProps {
  videoId: string;
  title: string;
  description?: string;
  thumbnailAlt: string;
  playLabel: string;
}

export function LiteYouTubeEmbed({
  videoId,
  title,
  description,
  thumbnailAlt,
  playLabel,
}: LiteYouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const thumbnailSrc = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  if (isLoaded) {
    return (
      <iframe
        className="aspect-video w-full rounded-[28px] border border-white/10 bg-black"
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsLoaded(true)}
      className="group relative block aspect-video w-full overflow-hidden rounded-[28px] border border-white/10 bg-black text-left"
      aria-label={`${playLabel}: ${title}`}
    >
      <img
        src={thumbnailSrc}
        alt={thumbnailAlt}
        loading="lazy"
        className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-95"
      />
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.08),rgba(0,0,0,0.72))]" />
      <span className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#d7b46a]/35 bg-black/65 px-4 py-2 text-sm font-medium text-[#f1d492] backdrop-blur">
          <Play className="h-4 w-4 fill-current" />
          {playLabel}
        </span>
        <span className="mt-4 block font-display text-2xl leading-tight text-stone-50 sm:text-3xl">
          {title}
        </span>
        {description ? (
          <span className="mt-3 block max-w-2xl text-sm leading-6 text-stone-300">
            {description}
          </span>
        ) : null}
      </span>
    </button>
  );
}
