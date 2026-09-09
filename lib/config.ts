export const APP_CONFIG = {
  businessName: 'QP HVAC',
  tagline: "Family Values, Professional Comfort: Father and Son keeping your home's heating and cooling running at its best",
  contactPerson: 'Jayson',
  phone: '12269263032',
  phoneDisplay: '(226) 926-3032',
  email: 'qphvac00@gmail.com',
  emergencyAvailable: true,
  uploadFolders: ['logos', 'services', 'team', 'gallery', 'general'] as const,
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'] as const,
  maxUploadSize: 8 * 1024 * 1024, // 8MB
  defaultAdminPassword: process.env.ADMIN_PASSWORD || 'admin',
  colors: {
    navyDark: '#0B1120',
    slateDark: '#1E293B',
    coolingBlue: '#0284C7',
    coolingBlueDark: '#0369A1',
    heatingRed: '#DC2626',
    heatingRedDark: '#B91C1C',
    pureWhite: '#FFFFFF',
    creamWhite: '#F8FAFC',
    accentBorder: '#334155',
  },
};

export type UploadFolder = typeof APP_CONFIG.uploadFolders[number];
