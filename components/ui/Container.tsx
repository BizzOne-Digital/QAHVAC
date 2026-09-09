import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  /** `wide` for full editorial spreads, `narrow` for reading columns and forms. */
  width?: 'default' | 'wide' | 'narrow';
  as?: 'div' | 'header' | 'footer' | 'section' | 'nav';
}

const WIDTHS = {
  default: 'max-w-[1240px]',
  wide: 'max-w-[1440px]',
  narrow: 'max-w-[760px]',
} as const;

export function Container({ children, className = '', width = 'default', as = 'div' }: ContainerProps) {
  const Tag = as;
  return (
    <Tag className={`${WIDTHS[width]} mx-auto px-6 sm:px-8 lg:px-12 ${className}`}>
      {children}
    </Tag>
  );
}
