import React from 'react';
import Link from 'next/link';

type Variant = 'primary' | 'secondary' | 'quiet' | 'urgent' | 'inverse' | 'outline-inverse';
type Size = 'sm' | 'md' | 'lg';

const BASE =
  'inline-flex items-center justify-center gap-2 font-sans font-semibold text-center whitespace-nowrap rounded-sm ' +
  'transition-colors duration-200 disabled:opacity-45 disabled:pointer-events-none';

const VARIANTS: Record<Variant, string> = {
  /* One filled button per view. Ink, not colour. */
  primary: 'bg-ink text-canvas hover:bg-ink-soft border border-ink hover:border-ink-soft',
  /* Outlined, for the second choice. */
  secondary: 'bg-transparent text-ink border border-line-strong hover:border-ink hover:bg-canvas-sunk',
  /* Text-only, for tertiary navigation. */
  quiet: 'bg-transparent text-ink-2 hover:text-ink border border-transparent',
  /* Reserved for emergency dispatch only. */
  urgent: 'bg-urgent text-white hover:bg-urgent-hover border border-urgent hover:border-urgent-hover',
  /* For use on obsidian surfaces and over photography. */
  inverse: 'bg-white text-ink hover:bg-canvas border border-white',
  'outline-inverse': 'bg-transparent text-white border border-white/35 hover:border-white hover:bg-white/8',
};

const SIZES: Record<Size, string> = {
  sm: 'text-[0.8125rem] px-3.5 py-2',
  md: 'text-sm px-5 py-2.5',
  lg: 'text-[0.9375rem] px-7 py-3.5',
};

interface CommonProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  id?: string;
  fullWidth?: boolean;
}

type ButtonProps = CommonProps & {
  href?: undefined;
  type?: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
};

type AnchorProps = CommonProps & {
  href: string;
  /** External or protocol links (tel:, mailto:) render as a plain anchor. */
  external?: boolean;
  ariaLabel?: string;
};

function classes(
  variant: Variant = 'primary',
  size: Size = 'md',
  fullWidth?: boolean,
  className = ''
) {
  return `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${fullWidth ? 'w-full' : ''} ${className}`;
}

export function Button(props: ButtonProps | AnchorProps) {
  const { children, variant, size, className, id, fullWidth } = props;
  const cn = classes(variant, size, fullWidth, className);

  if ('href' in props && props.href !== undefined) {
    const isProtocol = /^(tel:|mailto:|https?:)/.test(props.href);
    if (props.external || isProtocol) {
      return (
        <a href={props.href} id={id} className={cn} aria-label={props.ariaLabel}>
          {children}
        </a>
      );
    }
    return (
      <Link href={props.href} id={id} className={cn} aria-label={props.ariaLabel}>
        {children}
      </Link>
    );
  }

  const { type = 'button', onClick, disabled } = props as ButtonProps;
  return (
    <button type={type} id={id} onClick={onClick} disabled={disabled} className={cn}>
      {children}
    </button>
  );
}
