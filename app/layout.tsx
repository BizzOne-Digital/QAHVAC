import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'QP HVAC - Heating & Cooling Solutions',
  description: "Family Values, Professional Comfort: Father and Son keeping your home's heating and cooling running at its best. Residential & commercial HVAC services in your community.",
  openGraph: {
    title: 'QP HVAC - Heating & Cooling Solutions',
    description: "Family Values, Professional Comfort: Father and Son keeping your home's heating and cooling running at its best. Residential & commercial HVAC services in your community.",
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QP HVAC - Heating & Cooling Solutions',
    description: "Family Values, Professional Comfort: Father and Son keeping your home's heating and cooling running at its best. Residential & commercial HVAC services in your community.",
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
