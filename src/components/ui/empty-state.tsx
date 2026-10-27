import { StyleSheet, Text, View } from 'react-native';

import { Brand, Radius } from '@/constants/brand';
import type { IconName } from '@/constants/icons';
import { AppIcon } from './app-icon';

interface Props {
  icon: IconName;
  title: string;
  message: string;
}

export function EmptyState({ icon, title, message }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <AppIcon name={icon} size={30} color={Brand.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    gap: 8,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Brand.glassBorder,
    backgroundColor: 'rgba(252,254,255,0.94)',
  },
  iconBox: {
    width: 62,
    height: 62,
    borderRadius: Radius.pill,
    backgroundColor: Brand.primaryLight,
    borderWidth: 1,
    borderColor: Brand.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: { fontSize: 16, fontWeight: '800', color: Brand.text, textAlign: 'center' },
  message: { fontSize: 12, lineHeight: 18, color: Brand.textMuted, textAlign: 'center' },
});
