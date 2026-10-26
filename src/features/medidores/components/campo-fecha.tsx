import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AppIcon } from '@/components/ui/app-icon';
import { Brand, Radius } from '@/constants/brand';
import { Icons } from '@/constants/icons';
import { fechaDesdeISO, fechaISO, formatearFecha } from '@/utils/format';

interface Props {
  label: string;
  /** Fecha en formato YYYY-MM-DD. */
  value: string;
  onChange: (iso: string) => void;
  error?: string;
  hint?: string;
  maximumDate?: Date;
}

/**
 * Selector de fecha con el calendario nativo de Android/iOS
 * (`@react-native-community/datetimepicker`, incluido en Expo Go).
 */
export function CampoFecha({ label, value, onChange, error, hint, maximumDate }: Props) {
  const [abierto, setAbierto] = useState(false);
  const fecha = value ? fechaDesdeISO(value) : new Date();

  const cambiar = (_evento: { nativeEvent: { timestamp: number } }, nueva: Date) => {
    onChange(fechaISO(nueva));
    // En Android el diálogo se cierra al elegir; en iOS queda visible hasta "Listo".
    if (Platform.OS === 'android') setAbierto(false);
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>{label}</ThemedText>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value ? formatearFecha(value) : 'sin fecha'}`}
        onPress={() => setAbierto(true)}
        style={({ pressed }) => [
          styles.field,
          error ? styles.fieldError : null,
          pressed && styles.pressed,
        ]}>
        <AppIcon name={Icons.calendar} size={18} color={Brand.primary} />
        <Text style={[styles.value, !value && styles.placeholder]}>
          {value ? formatearFecha(value) : 'Selecciona una fecha'}
        </Text>
        <AppIcon name={Icons.chevronRight} size={16} color={Brand.textMuted} />
      </Pressable>

      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
      {!error && hint ? <ThemedText style={styles.hint}>{hint}</ThemedText> : null}

      {abierto && Platform.OS !== 'web' ? (
        <View style={Platform.OS === 'ios' ? styles.panel : undefined}>
          <DateTimePicker
            value={fecha}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
            maximumDate={maximumDate ?? new Date()}
            locale="es-EC"
            themeVariant="light"
            onValueChange={cambiar}
            onDismiss={() => setAbierto(false)}
          />
          {Platform.OS === 'ios' ? (
            <Pressable onPress={() => setAbierto(false)} style={styles.done}>
              <Text style={styles.doneText}>Listo</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
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
  pressed: { opacity: 0.8 },
  value: { flex: 1, fontSize: 16, color: Brand.text, paddingVertical: 12, textTransform: 'capitalize' },
  placeholder: { color: Brand.textMuted, textTransform: 'none' },
  error: { color: Brand.danger, fontSize: 12, fontWeight: '600' },
  hint: { color: Brand.textMuted, fontSize: 12 },
  panel: {
    borderWidth: 1,
    borderColor: Brand.border,
    borderRadius: Radius.md,
    backgroundColor: Brand.surface,
    paddingVertical: 4,
  },
  done: { alignSelf: 'flex-end', paddingHorizontal: 16, paddingVertical: 10 },
  doneText: { color: Brand.primary, fontSize: 14, fontWeight: '800' },
});
