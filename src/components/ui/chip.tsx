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
  neutral: { fondo: '#F1F8FC', texto: '#3D5B6C', borde: 'rgba(10,90,140,0.14)', punto: '#6E93A6' },
  success: { fondo: '#E1F6EC', texto: Brand.success, borde: 'rgba(14,107,69,0.20)', punto: '#1B9A67' },
  warning: { fondo: '#FFF3DD', texto: Brand.warning, borde: 'rgba(143,83,0,0.22)', punto: '#D08A16' },
  danger: { fondo: '#FCEBE9', texto: Brand.danger, borde: 'rgba(168,35,28,0.20)', punto: '#D0503F' },
  info: { fondo: '#E4F3FA', texto: Brand.primary, borde: 'rgba(10,90,140,0.18)', punto: Brand.accent },
} as const;

export function Chip({ label, tone = 'neutral', icon }: Props) {
  const colores = TONOS[tone];
  return (
    <View style={[styles.chip, { backgroundColor: colores.fondo, borderColor: colores.borde }]}>
      {icon ? (
        <AppIcon name={icon} size={12} color={colores.texto} />
      ) : (
        <View style={[styles.dot, { backgroundColor: colores.punto }]} />
      )}
      <Text style={[styles.label, { color: colores.texto }]} numberOfLines={1}>
        {label}
      </Text>
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
    paddingHorizontal: 9,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    flexShrink: 1,
  },
  dot: { width: 5, height: 5, borderRadius: 3 },
  label: { fontSize: 10, fontWeight: '800', letterSpacing: 0.3, flexShrink: 1 },
});
