import {
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { Brand, Radius } from '@/constants/brand';
import { ThemedText } from '@/components/themed-text';

interface Props extends TextInputProps {
  label: string;
  error?: string;
  hint?: string;
  right?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

/** Campo de texto con etiqueta, ayuda y error, para no repetir estilos. */
export function AppInput({ label, error, hint, right, containerStyle, style, ...rest }: Props) {
  return (
    <View style={[styles.container, containerStyle]}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <View style={[styles.field, error ? styles.fieldError : null]}>
        <TextInput
          placeholderTextColor={Brand.textMuted}
          style={[styles.input, style]}
          {...rest}
        />
        {right}
      </View>
      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
      {!error && hint ? <ThemedText style={styles.hint}>{hint}</ThemedText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6, minWidth: 0 },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: Brand.primaryDark,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  field: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: 'rgba(11,92,142,0.18)',
    backgroundColor: Brand.glassField,
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fieldError: { borderColor: 'rgba(179,38,30,0.55)', backgroundColor: '#FFF8F8' },
  input: { flex: 1, minWidth: 0, fontSize: 16, color: Brand.text, paddingVertical: 11 },
  error: { color: Brand.danger, fontSize: 12, fontWeight: '600' },
  hint: { color: Brand.textMuted, fontSize: 11, lineHeight: 15 },
});
