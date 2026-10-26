import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { Brand, Radius, Shadows } from '@/constants/brand';
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
      <LinearGradient
        colors={['rgba(255,255,255,0.95)', 'rgba(226,244,252,0.85)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.iconBox}>
        <AppIcon name={icon} size={30} color={Brand.primary} />
      </LinearGradient>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 34,
    paddingHorizontal: 24,
    gap: 8,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Brand.glassBorderSoft,
    backgroundColor: 'rgba(255,255,255,0.38)',
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Brand.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    ...Shadows.card,
  },
  title: { fontSize: 16, fontWeight: '800', color: Brand.text, textAlign: 'center' },
  message: { fontSize: 12, lineHeight: 18, color: Brand.textMuted, textAlign: 'center' },
});
