import { StyleSheet, Text, View } from 'react-native';

import { Brand } from '@/constants/brand';
import type { IconName } from '@/constants/icons';
import { AppIcon } from './app-icon';

interface Props {
  label: string;
  value: string;
  icon?: IconName;
}

export function FieldRow({ label, value, icon }: Props) {
  return (
    <View style={styles.row}>
      {icon ? (
        <View style={styles.icon}>
          <AppIcon name={icon} size={17} color={Brand.primary} />
        </View>
      ) : null}
      <View style={styles.texts}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 9 },
  icon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: Brand.primaryLight,
    borderWidth: 1,
    borderColor: Brand.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: { flex: 1, minWidth: 0, gap: 1 },
  label: { fontSize: 10, fontWeight: '700', color: Brand.textMuted, textTransform: 'uppercase', letterSpacing: 0.4 },
  value: { fontSize: 13, fontWeight: '700', color: Brand.text },
});
