import { Platform, type ViewStyle } from "react-native";

/**
 * Paleta de EPMAPS: azul institucional, agua y estados de campo.
 * Los tonos `glass*` son superficies de vidrio con opacidad alta para que el
 * texto y los campos siempre se lean bien sobre el fondo.
 */
export const Brand = {
  primary: "#0D5E8C",
  primaryDark: "#082F4D",
  primaryDeep: "#041E32",
  primaryLight: "#EAF5FC",
  primarySoft: "#F4FAFF",
  accent: "#1097B2",
  accentDeep: "#0A7280",
  accentBright: "#6ED7E9",
  aqua: "#9AE3F3",
  mint: "#74D9C9",

  background: "#EEF5FA",
  surface: "#FFFFFF",
  surfaceAlt: "#F5FAFD",
  text: "#102738",
  textMuted: "#5A7688",
  border: "rgba(12, 66, 96, 0.12)",

  success: "#127A55",
  successSoft: "#E9F9F1",
  warning: "#A06110",
  warningSoft: "#FFF4E8",
  danger: "#B83B34",
  dangerSoft: "#FDEDEA",
  offline: "#715703",
  offlineSoft: "#FFF7E0",

  glass: "rgba(255,255,255,0.92)",
  glassStrong: "rgba(255,255,255,0.98)",
  glassSoft: "rgba(247,251,255,0.94)",
  glassBorder: "rgba(13,94,140,0.12)",
  glassBorderSoft: "rgba(13,94,140,0.08)",
  glassField: "#F7FBFF",

  sky: "#7FCFEA",
  turquoise: "#1AB7C8",
  gradientTop: "#F5FAFD",
  gradientMid: "#E7F4FB",
  gradientBottom: "#DDF6F4",
  deepStart: "#062B45",
  deepMid: "#0C5E8D",
  deepEnd: "#14A7B8",
  deepGlow: "#4CD6E2",
  overlay: "rgba(5, 25, 38, 0.58)",
} as const;

export const Radius = {
  xs: 10,
  sm: 12,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
} as const;

export const Shadows: Record<"card" | "tile" | "floating" | "hero", ViewStyle> =
  {
    card: {
      ...Platform.select({
        ios: {
          shadowColor: "#052B47",
          shadowOpacity: 0.07,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
        },
        android: { elevation: 2 },
        default: {},
      }),
    },
    tile: {
      ...Platform.select({
        ios: {
          shadowColor: "#052B47",
          shadowOpacity: 0.1,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 6 },
        },
        android: { elevation: 4 },
        default: {},
      }),
    },
    floating: {
      ...Platform.select({
        ios: {
          shadowColor: "#04263C",
          shadowOpacity: 0.16,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 8 },
        },
        android: { elevation: 8 },
        default: {},
      }),
    },
    hero: {
      ...Platform.select({
        ios: {
          shadowColor: "#04263C",
          shadowOpacity: 0.22,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 12 },
        },
        android: { elevation: 6 },
        default: {},
      }),
    },
  };
