import { Platform, type ViewStyle } from 'react-native';

/**
 * Paleta de EPMAPS: azul institucional, agua y estados de campo.
 * Los tonos `glass*` son superficies de vidrio con opacidad alta para que el
 * texto y los campos siempre se lean bien sobre el fondo.
 */
export const Brand = {
  primary: '#0B5C8E',
  primaryDark: '#073F63',
  primaryDeep: '#052E4A',
  primaryLight: '#E6F3FA',
  accent: '#12A6B4',
  accentSoft: '#DDF6F5',
  background: '#EAF5FB',
  surface: '#FFFFFF',
  surfaceAlt: '#F1F8FC',
  text: '#0B2333',
  textMuted: '#4D6B7C',
  border: 'rgba(11,92,142,0.16)',
  success: '#11704A',
  successSoft: '#E3F6EC',
  warning: '#9A5B00',
  warningSoft: '#FFF4DF',
  danger: '#B3261E',
  dangerSoft: '#FDECEA',
  offline: '#6E4500',
  offlineSoft: '#FFF1D6',

  /** Capas de vidrio esmerilado (casi opacas para no interferir con el texto). */
  glass: 'rgba(255,255,255,0.94)',
  glassStrong: 'rgba(255,255,255,0.98)',
  glassSoft: 'rgba(249,253,255,0.94)',
  glassBorder: 'rgba(11,92,142,0.12)',
  glassBorderSoft: 'rgba(11,92,142,0.08)',
  glassField: '#FFFFFF',

  /** Degradados de agua. */
  sky: '#7FD2E8',
  turquoise: '#1BB8C6',
  gradientTop: '#E4F3FC',
  gradientMid: '#F4FAFE',
  gradientBottom: '#E8F6F8',
  deepStart: '#0A4A75',
  deepMid: '#0A6C93',
  deepEnd: '#0F8FA3',
  overlay: 'rgba(4,41,63,0.62)',
} as const;

export const Radius = {
  sm: 12,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
} as const;

export const Shadows: Record<'card' | 'floating', ViewStyle> = {
  card: {
    ...Platform.select({
      ios: { shadowColor: '#0A4A75', shadowOpacity: 0.07, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 2 },
      default: {},
    }),
  },
  floating: {
    ...Platform.select({
      ios: { shadowColor: '#052E4A', shadowOpacity: 0.16, shadowRadius: 20, shadowOffset: { width: 0, height: 8 } },
      android: { elevation: 6 },
      default: {},
    }),
  },
};
