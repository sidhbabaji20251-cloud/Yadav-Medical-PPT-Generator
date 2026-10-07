import { ThemeColors, PresentationTheme } from '../types/ppt';

export const THEMES: Record<PresentationTheme, ThemeColors> = {
  navy: {
    id: 'navy',
    name: 'Deep Clinical Navy',
    primary: '#0F2042',        // Deep Oxford Navy
    secondary: '#0284C7',      // Clinical Cyan/Sky
    accent: '#0D9488',         // Teal
    bgLight: '#F8FAFC',        // Slate 50
    bgCard: '#FFFFFF',
    textDark: '#0B1528',
    textMuted: '#475569',
    border: '#E2E8F0',
    badgeBg: '#E0F2FE',
    badgeText: '#0369A1'
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Bio-Metabolism',
    primary: '#064E3B',        // Deep Pine/Emerald
    secondary: '#059669',      // Bright Emerald
    accent: '#10B981',         // Mint
    bgLight: '#F0FDF4',        // Green 50
    bgCard: '#FFFFFF',
    textDark: '#062B21',
    textMuted: '#374151',
    border: '#D1FAE5',
    badgeBg: '#DCFCE7',
    badgeText: '#15803D'
  },
  crimson: {
    id: 'crimson',
    name: 'Crimson Cardiology & Heme',
    primary: '#881337',        // Deep Maroon/Crimson
    secondary: '#E11D48',      // Rose Red
    accent: '#BE123C',         // Ruby
    bgLight: '#FFF1F2',        // Rose 50
    bgCard: '#FFFFFF',
    textDark: '#4C0519',
    textMuted: '#4B5563',
    border: '#FFE4E6',
    badgeBg: '#FCE7F3',
    badgeText: '#BE185D'
  },
  violet: {
    id: 'violet',
    name: 'Royal Violet Genetics',
    primary: '#3B0764',        // Deep Purple
    secondary: '#7C3AED',      // Violet
    accent: '#A855F7',         // Lavender
    bgLight: '#FAF5FF',        // Purple 50
    bgCard: '#FFFFFF',
    textDark: '#2E1065',
    textMuted: '#4B5563',
    border: '#EDE9FE',
    badgeBg: '#F3E8FF',
    badgeText: '#6D28D9'
  },
  amber: {
    id: 'amber',
    name: 'Amber Endocrinology & Liver',
    primary: '#78350F',        // Deep Amber/Brown
    secondary: '#D97706',      // Golden Amber
    accent: '#B45309',         // Ochre
    bgLight: '#FFFBEB',        // Amber 50
    bgCard: '#FFFFFF',
    textDark: '#451A03',
    textMuted: '#525252',
    border: '#FEF3C7',
    badgeBg: '#FEF3C7',
    badgeText: '#B45309'
  }
};
