import { StyleSheet, Text, View } from 'react-native';

import { Brand, Radius } from '@/constants/brand';

interface Props {
  index: string;
  title: string;
  subtitle?: string;
}

export function SectionTitle({ index, title, subtitle }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.index}>
        <Text style={styles.indexText}>{index}</Text>
      </View>
      <View style={styles.texts}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  index: {
    width: 30,
    height: 30,
    borderRadius: Radius.pill,
    backgroundColor: Brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  texts: { flex: 1, gap: 1 },
  title: { fontSize: 16, fontWeight: '800', color: Brand.text },
  subtitle: { fontSize: 12, color: Brand.textMuted },
});
