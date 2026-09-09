'use client';

import React, { useEffect, useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { isLegacyUploadUrl } from '@/lib/uploads/validation';

/**
 * Image with a placeholder fallback.
 *
 * Legacy `/uploads/...` paths were written to the filesystem by the previous
 * upload mechanism and no longer resolve once the app is redeployed, so they
 * are swapped for the placeholder up front instead of rendering broken. Any
 * other load failure — a deleted stored upload, a dead external URL — falls
 * back the same way, so one missing image never breaks a page.
 */

export const IMAGE_PLACEHOLDER = '/assets/image-placeholder.svg';

export function resolveImageSrc(src: string | null | undefined): string {
  if (!src) return IMAGE_PLACEHOLDER;
  if (isLegacyUploadUrl(src)) return IMAGE_PLACEHOLDER;
  return src;
}

export type SafeImageProps = Omit<ImageProps, 'src'> & { src: string | null | undefined };

export function SafeImage({ src, alt, ...rest }: SafeImageProps) {
  const [resolved, setResolved] = useState(() => resolveImageSrc(src));

  useEffect(() => {
    setResolved(resolveImageSrc(src));
  }, [src]);

  return (
    <Image
      {...rest}
      src={resolved}
      alt={alt}
      onError={() => setResolved(IMAGE_PLACEHOLDER)}
      // Stored uploads come from our own route, which already sets immutable
      // cache headers; the optimizer would add nothing but latency.
      unoptimized={rest.unoptimized ?? resolved.startsWith('/api/uploads/')}
    />
  );
}
