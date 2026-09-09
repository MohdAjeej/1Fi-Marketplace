/**
 * 1Fi Design System — Premium Marketplace Theme
 * Inspired by modern marketplace/fintech app aesthetics
 */

export const Colors = {
  // Brand Core
  primary: '#2D3436',
  primaryDark: '#1A1A2E',
  accent: '#6C5CE7',
  accentLight: '#A29BFE',
  accentSoft: '#EEEDFF',

  // Warm palette
  green: '#00B894',
  greenDark: '#00A381',
  greenLight: '#E8FFF5',
  orange: '#FDCB6E',
  orangeDark: '#F0932B',
  orangeLight: '#FFF9E6',
  coral: '#FF6B6B',
  coralLight: '#FFEAEA',
  blue: '#0984E3',
  blueLight: '#E8F4FD',
  
  // Surfaces
  bg: '#FAFBFD',
  card: '#FFFFFF',
  cardAlt: '#F8F9FA',
  
  // Text
  text: '#2D3436',
  textMuted: '#636E72',
  textLight: '#B2BEC3',
  textWhite: '#FFFFFF',
  
  // Borders & Dividers
  border: '#F0F0F3',
  borderDark: '#E0E0E6',
  divider: '#F5F5F8',
  
  // Overlay
  overlay: 'rgba(0,0,0,0.5)',
  
  // Gradient pairs
  gradientPrimary: ['#6C5CE7', '#A29BFE'] as const,
  gradientDark: ['#2D3436', '#636E72'] as const,
  gradientGreen: ['#00B894', '#55EFC4'] as const,
  gradientOrange: ['#FDCB6E', '#F0932B'] as const,
  gradientCoral: ['#FF6B6B', '#EE5A24'] as const,
  gradientPurple: ['#6C5CE7', '#8B5CF6'] as const,
} as const;

export const Fonts = {
  // Display
  displayBold: { fontSize: 28, fontWeight: '800' as const, letterSpacing: -0.8, lineHeight: 34 },
  
  // Headings
  h1: { fontSize: 24, fontWeight: '700' as const, letterSpacing: -0.5, lineHeight: 30 },
  h2: { fontSize: 20, fontWeight: '700' as const, letterSpacing: -0.3, lineHeight: 26 },
  h3: { fontSize: 17, fontWeight: '600' as const, letterSpacing: -0.2, lineHeight: 22 },
  
  // Body
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  bodyMedium: { fontSize: 15, fontWeight: '500' as const, lineHeight: 22 },
  bodySemibold: { fontSize: 15, fontWeight: '600' as const, lineHeight: 22 },
  bodyBold: { fontSize: 15, fontWeight: '700' as const, lineHeight: 22 },
  
  // Caption
  caption: { fontSize: 13, fontWeight: '500' as const, lineHeight: 18 },
  captionBold: { fontSize: 13, fontWeight: '700' as const, lineHeight: 18 },
  
  // Small
  tiny: { fontSize: 11, fontWeight: '600' as const, lineHeight: 15 },
  tinyBold: { fontSize: 11, fontWeight: '700' as const, lineHeight: 15 },
  
  // Special
  price: { fontSize: 22, fontWeight: '800' as const, letterSpacing: -0.5 },
  priceSmall: { fontSize: 17, fontWeight: '700' as const, letterSpacing: -0.3 },
  label: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 1, textTransform: 'uppercase' as const },
} as const;

export const Space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
} as const;

export const Radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 999,
} as const;

export const Shadow = {
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 10,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  }),
} as const;

export const formatPrice = (price: number): string => {
  return `₹${Math.round(price).toLocaleString('en-IN')}`;
};
