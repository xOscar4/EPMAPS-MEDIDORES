import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { Brand } from '@/constants/brand';
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
    <View className="gap-[7px]">
      <Text className="text-[11px] font-extrabold uppercase tracking-[0.8px] text-brand-primary-dark">
        {label}
      </Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value ? formatearFecha(value) : 'sin fecha'}`}
        onPress={() => setAbierto(true)}
        style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
        className={`min-h-[52px] flex-row items-center gap-2 rounded-[16px] border px-3.5 ${
          error
            ? 'border-[rgba(179,38,30,0.55)] bg-[#FFF8F8]'
            : 'border-[rgba(11,92,142,0.18)] bg-brand-glass-field'
        }`}
      >
        <AppIcon name={Icons.calendar} size={18} color={Brand.primary} />
        <Text
          className={`min-w-0 flex-1 py-[11px] text-[16px] ${
            value ? 'capitalize text-brand-text' : 'text-brand-muted'
          }`}
        >
          {value ? formatearFecha(value) : 'Selecciona una fecha'}
        </Text>
        <AppIcon name={Icons.chevronRight} size={16} color={Brand.textMuted} />
      </Pressable>

      {error ? (
        <Text className="text-[12px] font-semibold text-brand-danger">{error}</Text>
      ) : null}
      {!error && hint ? (
        <Text className="text-[11px] leading-[15px] text-brand-muted">{hint}</Text>
      ) : null}

      {abierto && Platform.OS !== 'web' ? (
        <View
          className={
            Platform.OS === 'ios'
              ? 'overflow-hidden rounded-[16px] border border-brand-glass-border bg-white py-1'
              : undefined
          }
        >
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
            <Pressable onPress={() => setAbierto(false)} className="self-end px-4 py-2.5">
              <Text className="text-[14px] font-extrabold text-brand-primary">Listo</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
