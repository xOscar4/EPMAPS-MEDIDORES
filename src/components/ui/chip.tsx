import { StyleSheet, Text, View } from 'react-native';

import { Brand, Radius } from '@/constants/brand';
import type { IconName } from '@/constants/icons';
import { AppIcon } from './app-icon';

type Tono = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

interface Props {
  label: string;
  tone?: Tono;
  icon?: IconName;
}

const TONOS = {
  neutral: { fondo: 'rgba(255,255,255,0.58)', texto: Brand.textMuted, borde: 'rgba(10,92,142,0.12)' },
  success: { fondo: 'rgba(23,164,106,0.12)', texto: Brand.success, borde: 'rgba(23,164,106,0.24)' },
  warning: { fondo: 'rgba(214,138,0,0.14)', texto: Brand.warning, borde: 'rgba(214,138,0,0.26)' },
  danger: { fondo: 'rgba(179,38,30,0.10)', texto: Brand.danger, borde: 'rgba(179,38,30,0.22)' },
  info: { fondo: 'rgba(10,92,142,0.10)', texto: Brand.primary, borde: 'rgba(10,92,142,0.18)' },
} as const;

export function Chip({ label, tone = 'neutral', icon }: Props) {
  const colores = TONOS[tone];
  return (
    <View style={[styles.chip, { backgroundColor: colores.fondo, borderColor: colores.borde }]}>
      {icon ? <AppIcon name={icon} size={13} color={colores.texto} /> : null}
      <Text style={[styles.label, { color: colores.texto }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: Radius.pill,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  label: { fontSize: 10, fontWeight: '800', letterSpacing: 0.3 },
});
