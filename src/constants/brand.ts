import { Platform, type ViewStyle } from 'react-native';

/**
 * Paleta de EPMAPS: azul institucional, agua y estados de campo.
 * Los tonos `glass*` son superficies de vidrio con opacidad alta para que el
 * texto y los campos siempre se lean bien sobre el fondo.
 */
export const Brand = {
  primary: '#0A5A8C',
  primaryDark: '#063B5C',
  primaryDeep: '#04263C',
  primaryLight: '#E3F1F9',
  primarySoft: '#F2FAFE',
  accent: '#0FA6B4',
  accentDeep: '#077C8C',
  accentBright: '#35D2DD',
  aqua: '#8FE6EF',
  mint: '#6FE0BE',

  background: '#E9F4FB',
  surface: '#FFFFFF',
  surfaceAlt: '#F2F8FC',
  text: '#0B2333',
  textMuted: '#4A6879',
  border: 'rgba(10,90,140,0.14)',

  success: '#0E6B45',
  successSoft: '#E0F5EA',
  warning: '#8F5300',
  warningSoft: '#FFF3DD',
  danger: '#A8231C',
  dangerSoft: '#FCEBE9',
  offline: '#6E4500',
  offlineSoft: '#FFF1D6',

  /** Capas de vidrio esmerilado (casi opacas para no interferir con el texto). */
  glass: 'rgba(255,255,255,0.94)',
  glassStrong: 'rgba(255,255,255,0.98)',
  glassSoft: 'rgba(249,253,255,0.94)',
  glassBorder: 'rgba(10,90,140,0.12)',
  glassBorderSoft: 'rgba(10,90,140,0.08)',
  glassField: '#FFFFFF',

  /** Degradados de agua. `deep*` es la corriente principal de los encabezados. */
  sky: '#7FD2E8',
  turquoise: '#1BB8C6',
  gradientTop: '#E7F4FC',
  gradientMid: '#F5FBFE',
  gradientBottom: '#E3F4F6',
  deepStart: '#052B47',
  deepMid: '#085F86',
  deepEnd: '#0C9AAA',
  deepGlow: '#18BCC8',
  overlay: 'rgba(3,32,48,0.66)',
} as const;

export const Radius = {
  xs: 10,
  sm: 12,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
} as const;

export const Shadows: Record<'card' | 'tile' | 'floating' | 'hero', ViewStyle> = {
  card: {
    ...Platform.select({
      ios: { shadowColor: '#052B47', shadowOpacity: 0.07, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 2 },
      default: {},
    }),
  },
  tile: {
    ...Platform.select({
      ios: { shadowColor: '#052B47', shadowOpacity: 0.10, shadowRadius: 14, shadowOffset: { width: 0, height: 6 } },
      android: { elevation: 4 },
      default: {},
    }),
  },
  floating: {
    ...Platform.select({
      ios: { shadowColor: '#04263C', shadowOpacity: 0.16, shadowRadius: 20, shadowOffset: { width: 0, height: 8 } },
      android: { elevation: 8 },
      default: {},
    }),
  },
  hero: {
    ...Platform.select({
      ios: { shadowColor: '#04263C', shadowOpacity: 0.22, shadowRadius: 24, shadowOffset: { width: 0, height: 12 } },
      android: { elevation: 6 },
      default: {},
    }),
  },
};
