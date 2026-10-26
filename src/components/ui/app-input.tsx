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
  container: { gap: 7 },
  label: { fontSize: 13, fontWeight: '700', color: Brand.textMuted, letterSpacing: 0.3 },
  field: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.surface,
    borderRadius: Radius.md,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  fieldError: { borderColor: Brand.danger, backgroundColor: '#FFFAFA' },
  input: { flex: 1, fontSize: 16, color: Brand.text, paddingVertical: 12 },
  error: { color: Brand.danger, fontSize: 12, fontWeight: '600' },
  hint: { color: Brand.textMuted, fontSize: 12 },
});
