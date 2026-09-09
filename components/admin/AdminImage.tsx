'use client';

/**
 * The admin surface uses the same fallback-aware image as the public site;
 * this alias keeps the admin imports local to components/admin.
 */
export { SafeImage as AdminImage, IMAGE_PLACEHOLDER, resolveImageSrc } from '@/components/ui/SafeImage';
