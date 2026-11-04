import { Pressable, Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { Brand } from '@/constants/brand';
import { Icons } from '@/constants/icons';
import type { EstadoMedidor } from '@/types/models';

interface Opcion {
  key: EstadoMedidor;
  label: string;
  hint: string;
  icon: (typeof Icons)[keyof typeof Icons];
}

/** R5: los tres estados posibles, con lo que exige cada uno. */
const OPCIONES: Opcion[] = [
  { key: 'normal', label: 'Normal', hint: 'Toma lectura', icon: Icons.check },
  { key: 'inaccesible', label: 'Inaccesible', hint: 'Solo motivo', icon: Icons.block },
  { key: 'danado', label: 'Dañado', hint: 'Foto y detalle', icon: Icons.waterDamage },
];

interface Props {
  value: EstadoMedidor | null;
  onChange: (valor: EstadoMedidor) => void;
  error?: string;
}

export function EstadoPicker({ value, onChange, error }: Props) {
  return (
    <View className="gap-[7px]">
      <View className="flex-row gap-2">
        {OPCIONES.map((opcion) => {
          const activo = value === opcion.key;
          return (
            <Pressable
              key={opcion.key}
              accessibilityRole="radio"
              accessibilityState={{ selected: activo }}
              onPress={() => onChange(opcion.key)}
              style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
              className={`min-h-[112px] min-w-0 flex-1 items-center gap-[3px] rounded-[16px] border p-[9px] ${
                activo
                  ? 'border-[rgba(11,92,142,0.45)] bg-brand-primary-light'
                  : 'border-brand-glass-border bg-[#F7FBFD]'
              }`}
            >
              <View className="mb-0.5 h-9 w-9 items-center justify-center rounded-[12px] border border-brand-glass-border bg-white">
                <AppIcon name={opcion.icon} size={20} color={activo ? Brand.primaryDark : Brand.textMuted} />
              </View>
              <Text
                className={`text-center text-[12px] font-extrabold ${
                  activo ? 'text-brand-primary-deep' : 'text-brand-text'
                }`}
              >
                {opcion.label}
              </Text>
              <Text className="text-center text-[10px] text-brand-muted">{opcion.hint}</Text>
            </Pressable>
          );
        })}
      </View>
      {error ? (
        <Text className="text-[12px] font-semibold text-brand-danger">{error}</Text>
      ) : null}
    </View>
  );
}
