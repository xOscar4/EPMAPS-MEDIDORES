import { Platform, type ViewStyle } from 'react-native';

/** Paleta de EPMAPS: azul institucional, agua y estados de campo. */
export const Brand = {
  primary: '#0B5C8E',
  primaryDark: '#073F63',
  primaryDeep: '#052E4A',
  primaryLight: '#E6F2F8',
  accent: '#12A6B4',
  accentSoft: '#DDF6F5',
  background: '#F4F8FA',
  surface: '#FFFFFF',
  surfaceAlt: '#EDF4F8',
  text: '#0E2635',
  textMuted: '#5A7283',
  border: '#D7E5EC',
  success: '#177A4A',
  successSoft: '#E2F5EA',
  warning: '#A86400',
  warningSoft: '#FFF1D6',
  danger: '#B3261E',
  dangerSoft: '#FCE8E6',
  offline: '#7A4E00',
  offlineSoft: '#FFEFC7',
} as const;

export const Radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
} as const;

export const Shadows: Record<'card' | 'floating', ViewStyle> = {
  card: {
    ...Platform.select({
      ios: { shadowColor: '#083A52', shadowOpacity: 0.08, shadowRadius: 14, shadowOffset: { width: 0, height: 6 } },
      android: { elevation: 3 },
      default: {},
    }),
  },
  floating: {
    ...Platform.select({
      ios: { shadowColor: '#052E4A', shadowOpacity: 0.18, shadowRadius: 18, shadowOffset: { width: 0, height: 8 } },
      android: { elevation: 8 },
      default: {},
    }),
  },
};
