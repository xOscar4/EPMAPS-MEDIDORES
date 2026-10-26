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
  neutral: { fondo: Brand.surfaceAlt, texto: Brand.textMuted },
  success: { fondo: Brand.successSoft, texto: Brand.success },
  warning: { fondo: Brand.warningSoft, texto: Brand.warning },
  danger: { fondo: Brand.dangerSoft, texto: Brand.danger },
  info: { fondo: Brand.primaryLight, texto: Brand.primary },
} as const;

export function Chip({ label, tone = 'neutral', icon }: Props) {
  const colores = TONOS[tone];
  return (
    <View style={[styles.chip, { backgroundColor: colores.fondo }]}>
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
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 0.2 },
});
