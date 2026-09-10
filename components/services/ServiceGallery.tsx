import React from 'react';
import { SafeImage } from '@/components/ui/SafeImage';
import { Reveal } from '@/components/ui/Reveal';

interface ServiceGalleryProps {
  images: string[];
  /** Service title, used to build meaningful alt text for each frame. */
  title: string;
  heading?: string;
}

/**
 * Gallery of additional service photographs.
 *
 * Renders nothing when a service has no extra images, so every existing service
 * page is byte-identical until someone uploads to it. A single image gets the
 * full width rather than sitting alone in a two-column grid looking like a
 * layout bug.
 */
export function ServiceGallery({ images, title, heading = 'Recent work' }: ServiceGalleryProps) {
  if (!images || images.length === 0) return null;

  const isSingle = images.length === 1;

  return (
    <div className="mt-14">
      <h2 className="type-label text-ink-3">{heading}</h2>

      <div
        className={`grid gap-px bg-line border border-line mt-6 ${
          isSingle ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'
        }`}
      >
        {images.map((src, index) => (
          <Reveal key={src} delay={index * 70} repeat>
            <div className={`relative bg-canvas-sunk ${isSingle ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
              <SafeImage
                src={src}
                alt={`${title} — photograph ${index + 1} of ${images.length}`}
                fill
                sizes={isSingle ? '(max-width: 1024px) 100vw, 60vw' : '(max-width: 640px) 100vw, 30vw'}
                className="object-cover"
              />
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
