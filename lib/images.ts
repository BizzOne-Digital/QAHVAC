/**
 * Art direction map.
 *
 * The project ships no local photography — `/public` contains no image assets —
 * so these are the six remote photographs already referenced by the service
 * catalogue and the marketing pages. Each page is matched to the frame whose
 * subject and negative space suit its message, and `position` keeps the headline
 * off the focal point. Replace the URLs with local files under /public when the
 * client supplies branded photography; nothing else has to change.
 */

const RAW = {
  /** Technician at a furnace, gauge in hand. Subject right of centre. */
  technicianFurnace: 'photo-1621905251189-08b45d6a269e',
  /** Single craftsman at an air handler. Subject centre-left. */
  craftsmanAtWork: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg0FJKr_akCWpTXFeEXCoCEunHTkarALqX967icct7Qw&s=10',
  /** Mechanical plant and pipework. No human subject, even weight. */
  mechanicalPlant: 'photo-1581092160607-ee22621dd758',
  /** Two technicians working together — the father-and-son frame. */
  twoTechnicians: 'photo-1504328345606-18bbc8c9d7d1',
  /** Hands on service tooling. Tight, detail-led. */
  serviceDetail: 'photo-1581092580497-e0d23cbdf1dc',
  /** Commercial rooftop equipment against sky. Wide, lots of headroom. */
  commercialRooftop: 'photo-1541888946425-d0fbb186c5f7',
} as const;

export type ImageKey = keyof typeof RAW;

/** Unsplash delivery URL at a width appropriate to the slot. */
export function photo(key: ImageKey, width: 1200 | 1600 | 2200 = 1600): string {
  const value = RAW[key];
  if (value.startsWith('https://')) return value;
  return `https://images.unsplash.com/${value}?q=80&w=${width}&auto=format&fit=crop`;
}

interface HeroArt {
  src: string;
  alt: string;
  /** CSS object-position, chosen so the text column never covers the subject. */
  position: string;
  /** Text column side, opposite the focal point. */
  align: 'left' | 'right';
}

export const HERO_ART: Record<
  'home' | 'services' | 'about' | 'booking' | 'contact',
  HeroArt
> = {
  home: {
    src: photo('technicianFurnace', 2200),
    alt: 'QP HVAC technician taking readings on a residential furnace',
    position: '68% 45%',
    align: 'left',
  },
  services: {
    src: photo('mechanicalPlant', 2200),
    alt: 'Heating and cooling plant with copper line sets and mechanical pipework',
    position: '50% 50%',
    align: 'left',
  },
  about: {
    src: photo('twoTechnicians', 2200),
    alt: 'Two QP HVAC technicians working side by side on climate equipment',
    position: '62% 35%',
    align: 'left',
  },
  booking: {
    src: photo('serviceDetail', 2200),
    alt: 'Close detail of HVAC service tooling during a scheduled maintenance visit',
    position: '58% 50%',
    align: 'left',
  },
  contact: {
    src: photo('craftsmanAtWork', 2200),
    alt: 'QP HVAC craftsman servicing an indoor air handler',
    position: '35% 40%',
    align: 'right',
  },
};
