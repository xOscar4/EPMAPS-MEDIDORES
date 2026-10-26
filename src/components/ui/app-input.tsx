import {
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { Brand, Radius, Shadows } from '@/constants/brand';
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
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: Brand.primaryDark,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  field: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: 'rgba(10,92,142,0.12)',
    backgroundColor: Brand.glassField,
    borderRadius: Radius.md,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    ...Shadows.card,
  },
  fieldError: { borderColor: 'rgba(179,38,30,0.45)', backgroundColor: 'rgba(255,247,247,0.92)' },
  input: { flex: 1, fontSize: 16, color: Brand.text, paddingVertical: 12 },
  error: { color: Brand.danger, fontSize: 12, fontWeight: '600' },
  hint: { color: Brand.textMuted, fontSize: 11, lineHeight: 15 },
});
