import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { Chip } from '@/components/ui/chip';
import { Brand, Radius, Shadows } from '@/constants/brand';
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
    <View style={styles.wrapper}>
      <View style={styles.heading}>
        <Text style={styles.title}>Foto del medidor</Text>
        <Chip
          label={requerida ? 'Obligatoria' : 'Opcional'}
          tone={requerida ? 'warning' : 'neutral'}
          icon={requerida ? Icons.warning : Icons.camera}
        />
      </View>

      {fotoUri ? (
        <View style={styles.preview}>
          <Image source={{ uri: fotoUri }} style={styles.image} contentFit="cover" />
          <View style={styles.previewBar}>
            <View style={styles.saved}>
              <AppIcon name={Icons.cloudDone} size={14} color={Brand.success} />
              <Text style={styles.savedText}>Guardada en el teléfono</Text>
            </View>
            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Repetir foto"
                onPress={() => setAbierta(true)}
                style={styles.action}>
                <AppIcon name={Icons.camera} size={15} color={Brand.primary} />
                <Text style={styles.actionText}>Repetir</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Quitar foto"
                onPress={() => onChange(null)}
                style={styles.action}>
                <AppIcon name={Icons.trash} size={15} color={Brand.danger} />
                <Text style={[styles.actionText, { color: Brand.danger }]}>Quitar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tomar foto del medidor"
          onPress={() => setAbierta(true)}
          style={({ pressed }) => [styles.empty, error ? styles.emptyError : null, pressed && styles.pressed]}>
          <View style={styles.emptyIcon}>
            <AppIcon name={Icons.photoAdd} size={26} color={Brand.primary} />
          </View>
          <Text style={styles.emptyTitle}>Tomar foto</Text>
          <Text style={styles.emptyText}>Encuadra la carátula y el número del medidor.</Text>
        </Pressable>
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Text style={styles.note}>
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

const styles = StyleSheet.create({
  wrapper: { gap: 9 },
  heading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 14, fontWeight: '800', color: Brand.text },
  preview: {
    borderRadius: Radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Brand.glassBorder,
    backgroundColor: 'rgba(255,255,255,0.60)',
    ...Shadows.card,
  },
  image: { width: '100%', height: 190, backgroundColor: Brand.surfaceAlt },
  previewBar: { padding: 10, gap: 8 },
  saved: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  savedText: { fontSize: 11, fontWeight: '700', color: Brand.success },
  actions: { flexDirection: 'row', gap: 8 },
  action: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    minHeight: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.70)',
    borderWidth: 1,
    borderColor: Brand.glassBorderSoft,
  },
  actionText: { fontSize: 11, fontWeight: '800', color: Brand.primary },
  empty: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: 22,
    paddingHorizontal: 16,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(10,92,142,0.25)',
    backgroundColor: 'rgba(255,255,255,0.42)',
  },
  emptyError: { borderColor: 'rgba(179,38,30,0.45)', backgroundColor: 'rgba(255,247,247,0.75)' },
  pressed: { opacity: 0.8 },
  emptyIcon: {
    width: 54,
    height: 54,
    borderRadius: 17,
    backgroundColor: 'rgba(228,242,250,0.95)',
    borderWidth: 1,
    borderColor: Brand.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
    ...Shadows.card,
  },
  emptyTitle: { fontSize: 14, fontWeight: '800', color: Brand.text },
  emptyText: { fontSize: 11, color: Brand.textMuted, textAlign: 'center' },
  error: { fontSize: 12, fontWeight: '600', color: Brand.danger },
  note: { fontSize: 10, lineHeight: 15, color: Brand.textMuted },
});
