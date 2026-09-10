/**
 * Art direction map.
 *
 * These are the client's own job photographs, served from `/public`. They
 * replaced the stock Unsplash frames the site shipped with: photographs of
 * other companies' technicians undercut a business whose whole pitch is that
 * you get this family rather than a franchise.
 *
 * Every source is portrait (3:4) straight off a phone. In a wide hero the
 * `object-cover` crop fills the width and overflows vertically, so the Y half
 * of each `position` is what chooses the visible band — the X half is there
 * only for the few frames that are narrower than their slot.
 */

const LOCAL = {
  /** Technician in a branded shirt at a rooftop package unit. The only frame with a person in it. */
  technicianRooftop: '/assets/Img/jyson6.jpeg',
  /** Furnace gas valve and wiring loom. Tight, craft-led. */
  furnaceGasValve: '/assets/Img/jyson7.jpeg',
  /** Outdoor condensing unit, fan grille and coil. Bright, holds up under a scrim. */
  condenserUnit: '/assets/Img/jyson1.jpeg',
  /** Fouled condenser coil in dappled light. Reads as texture more than subject. */
  condenserCoil: '/assets/Img/jyson9.jpeg',
} as const;

export type ImageKey = keyof typeof LOCAL;

/**
 * Path to a photograph. These are local assets, so Next optimises and sizes
 * them from the `sizes` attribute at each call site — there is no width to
 * request here the way there was with the Unsplash delivery URLs.
 */
export function photo(key: ImageKey): string {
  return LOCAL[key];
}

interface HeroArt {
  src: string;
  alt: string;
  /** CSS object-position, chosen so the text column never covers the subject. */
  position: string;
  /** Text column side, opposite the focal point. */
  align: 'left' | 'right';
  /** `soft` lifts the wash for a frame whose visible half is on the dim side. */
  scrim?: 'default' | 'soft';
}

/**
 * Hero art direction.
 *
 * Every source is a portrait phone photograph, and a hero crops one to roughly
 * 2.6:1 — a slice about 29% of the image height. Only two of the four survive
 * that: the condenser (its fan grille and coil still read as HVAC equipment at
 * any zoom) and the rooftop technician (he fills enough of the frame to stay
 * recognisable). The furnace interior and the fouled coil reduce to barcode
 * stickers and abstract texture, so they are kept out of the heroes and belong
 * in a tall frame instead — a service gallery, where they are shown whole.
 *
 * `align` puts the text column, and with it the heavy end of the scrim, over
 * the DIMMER half of the crop so the brighter half reads as photography.
 * Comments give the measured luminance (0-255) of the half that shows.
 */
export const HERO_ART: Record<
  'home' | 'services' | 'about' | 'booking' | 'contact',
  HeroArt
> = {
  home: {
    src: photo('condenserUnit'),
    alt: 'Outdoor condensing unit serviced by QP HVAC',
    position: '50% 20%',
    align: 'left', // shows right: 174
  },
  services: {
    // Bright half is the opened package unit on the left, so the copy sits
    // right. That covers the technician, but a legible photograph of the work
    // beats a recognisable subject buried under the wash.
    src: photo('technicianRooftop'),
    alt: 'A QP HVAC technician servicing an opened rooftop package unit',
    position: '50% 20%',
    align: 'right', // shows left: 156
    scrim: 'soft',
  },
  about: {
    src: photo('condenserUnit'),
    alt: 'Coil and casing of a condensing unit during a QP HVAC service call',
    position: '50% 45%',
    align: 'right', // shows left: 193
    scrim: 'soft',
  },
  booking: {
    src: photo('technicianRooftop'),
    alt: 'A QP HVAC technician on a rooftop, opening a package unit for service',
    position: '50% 5%',
    align: 'right', // shows left: 147
    scrim: 'soft',
  },
  contact: {
    src: photo('condenserUnit'),
    alt: 'QP HVAC servicing an outdoor condensing unit',
    position: '50% 8%',
    align: 'left', // shows right: 143
    scrim: 'soft',
  },
};
