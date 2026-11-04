import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { Chip } from '@/components/ui/chip';
import { Brand } from '@/constants/brand';
import { Icons } from '@/constants/icons';
import { CameraModal } from './camera-modal';

interface Props {
  fotoUri: string | null;
  requerida: boolean;
  error?: string;
  onChange: (uri: string | null) => void;
}

/** R7: foto obligatoria en casos anómalos o dañados; opcional en el resto. */
export function PhotoPicker({ fotoUri, requerida, error, onChange }: Props) {
  const [abierta, setAbierta] = useState(false);

  return (
    <View className="gap-[9px]">
      <View className="flex-row items-center justify-between">
        <Text className="text-[14px] font-extrabold text-brand-text">Foto del medidor</Text>
        <Chip
          label={requerida ? 'Obligatoria' : 'Opcional'}
          tone={requerida ? 'warning' : 'neutral'}
          icon={requerida ? Icons.warning : Icons.camera}
        />
      </View>

      {fotoUri ? (
        <View className="overflow-hidden rounded-[16px] border border-brand-glass-border bg-white">
          <Image
            source={{ uri: fotoUri }}
            style={{ width: '100%', height: 180, backgroundColor: Brand.surfaceAlt }}
            contentFit="cover"
          />
          <View className="gap-2 p-2.5">
            <View className="flex-row items-center gap-[5px]">
              <AppIcon name={Icons.cloudDone} size={14} color={Brand.success} />
              <Text className="text-[11px] font-bold text-brand-success">
                Guardada en el teléfono
              </Text>
            </View>
            <View className="flex-row gap-2">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Repetir foto"
                onPress={() => setAbierta(true)}
                className="min-h-[36px] flex-1 flex-row items-center justify-center gap-[5px] rounded-[10px] border border-brand-glass-border bg-[#F1F8FC]"
              >
                <AppIcon name={Icons.camera} size={15} color={Brand.primary} />
                <Text className="text-[11px] font-extrabold text-brand-primary">Repetir</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Quitar foto"
                onPress={() => onChange(null)}
                className="min-h-[36px] flex-1 flex-row items-center justify-center gap-[5px] rounded-[10px] border border-brand-glass-border bg-[#F1F8FC]"
              >
                <AppIcon name={Icons.trash} size={15} color={Brand.danger} />
                <Text className="text-[11px] font-extrabold text-brand-danger">Quitar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tomar foto del medidor"
          onPress={() => setAbierta(true)}
          style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
          className={`items-center gap-1 rounded-[16px] border-[1.5px] border-dashed px-4 py-[22px] ${
            error
              ? 'border-[rgba(179,38,30,0.50)] bg-[#FFF8F8]'
              : 'border-[rgba(11,92,142,0.28)] bg-[#F8FCFE]'
          }`}
        >
          <View className="mb-[3px] h-[54px] w-[54px] items-center justify-center rounded-[17px] border border-brand-glass-border bg-brand-primary-light">
            <AppIcon name={Icons.photoAdd} size={26} color={Brand.primary} />
          </View>
          <Text className="text-[14px] font-extrabold text-brand-text">Tomar foto</Text>
          <Text className="text-center text-[11px] text-brand-muted">
            Encuadra la carátula y el número del medidor.
          </Text>
        </Pressable>
      )}

      {error ? (
        <Text className="text-[12px] font-semibold text-brand-danger">{error}</Text>
      ) : null}
      <Text className="text-[10px] leading-[15px] text-brand-muted">
        La foto se copia a la memoria del teléfono: sigue disponible aunque la app se cierre.
      </Text>

      <CameraModal
        visible={abierta}
        requerida={requerida}
        onClose={() => setAbierta(false)}
        onCapture={(uri) => onChange(uri)}
      />
    </View>
  );
}
