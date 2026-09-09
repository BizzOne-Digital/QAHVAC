'use client';

import React, { useEffect, useRef, useState } from 'react';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Milliseconds. Keep stagger steps to 80–120ms; anything more reads as a loading screen. */
  delay?: number;
  as?: 'div' | 'li' | 'article' | 'span' | 'p' | 'h1' | 'h2';
  /**
   * Fade back out when the element leaves the viewport, so the copy fades in
   * again on the way back up. Off by default: cards and list items settle once.
   */
  repeat?: boolean;
}

/**
 * A single, slow entrance. One observer per element, and skipped entirely when
 * the visitor has asked for reduced motion.
 */
export function Reveal({
  children,
  className = '',
  delay = 0,
  as = 'div',
  repeat = false,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (
      typeof window === 'undefined' ||
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting) {
          setShown(true);
          if (!repeat) observer.disconnect();
        } else if (repeat) {
          setShown(false);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [repeat]);

  const Tag = as as React.ElementType;

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      data-shown={shown ? 'true' : 'false'}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
