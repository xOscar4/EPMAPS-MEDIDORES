import { Platform, type ViewStyle } from 'react-native';

/**
 * Paleta de EPMAPS: azul institucional, agua y estados de campo.
 * Los tonos `glass*` son superficies translúcidas para el efecto de vidrio.
 */
export const Brand = {
  primary: '#0A5C8E',
  primaryDark: '#06456B',
  primaryDeep: '#04293F',
  primaryLight: '#E4F2FA',
  accent: '#12A6B4',
  accentSoft: '#DCF5F4',
  background: '#EAF5FB',
  surface: 'rgba(255,255,255,0.78)',
  surfaceAlt: 'rgba(255,255,255,0.52)',
  text: '#0B2333',
  textMuted: '#4D6B7C',
  border: 'rgba(10,92,142,0.14)',
  success: '#11704A',
  successSoft: 'rgba(23,164,106,0.12)',
  warning: '#9A5B00',
  warningSoft: 'rgba(214,138,0,0.13)',
  danger: '#B3261E',
  dangerSoft: 'rgba(179,38,30,0.10)',
  offline: '#6E4500',
  offlineSoft: 'rgba(255,214,140,0.22)',

  /** Capas de vidrio esmerilado. */
  glass: 'rgba(255,255,255,0.74)',
  glassStrong: 'rgba(255,255,255,0.92)',
  glassSoft: 'rgba(255,255,255,0.42)',
  glassBorder: 'rgba(255,255,255,0.92)',
  glassBorderSoft: 'rgba(255,255,255,0.58)',
  glassField: 'rgba(255,255,255,0.62)',

  /** Degradados de agua. */
  sky: '#7FD2E8',
  turquoise: '#1BB8C6',
  gradientTop: '#E4F3FC',
  gradientMid: '#F2FAFE',
  gradientBottom: '#E6F6F7',
  deepStart: '#0A4A75',
  deepMid: '#0A6C93',
  deepEnd: '#0F8FA3',
  overlay: 'rgba(4,41,63,0.62)',
} as const;

export const Radius = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 30,
  pill: 999,
} as const;

export const Shadows: Record<'card' | 'floating', ViewStyle> = {
  card: {
    ...Platform.select({
      ios: { shadowColor: '#0A4A75', shadowOpacity: 0.10, shadowRadius: 18, shadowOffset: { width: 0, height: 8 } },
      android: { elevation: 4 },
      default: {},
    }),
  },
  floating: {
    ...Platform.select({
      ios: { shadowColor: '#04293F', shadowOpacity: 0.22, shadowRadius: 26, shadowOffset: { width: 0, height: 12 } },
      android: { elevation: 10 },
      default: {},
    }),
  },
};
