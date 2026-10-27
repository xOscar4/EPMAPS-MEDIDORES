import { LinearGradient } from 'expo-linear-gradient';
import { Modal, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppIcon } from '@/components/ui/app-icon';
import { Brand, Radius, Shadows } from '@/constants/brand';
import type { IconName } from '@/constants/icons';
import { Icons } from '@/constants/icons';

type Tono = 'success' | 'warning' | 'info';

interface Props {
  visible: boolean;
  icon?: IconName;
  tone?: Tono;
  title: string;
  message: string;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  /** Se dispara con el botón atrás de Android; por defecto repite la acción principal. */
  onRequestClose?: () => void;
}

const TONOS = {
  success: { fondo: '#E2F6EC', icono: '#0E6B45' },
  warning: { fondo: Brand.warningSoft, icono: Brand.warning },
  info: { fondo: Brand.primaryLight, icono: Brand.primary },
} as const;

/** Diálogo modal del sistema visual: mismo vidrio, gota y botones que el resto. */
export function AppDialog({
  visible,
  icon = Icons.verified,
  tone = 'success',
  title,
  message,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  onRequestClose,
}: Props) {
  const colores = TONOS[tone];

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onRequestClose ?? onPrimary}>
      <LinearGradient
        colors={['rgba(4,41,63,0.74)', 'rgba(10,74,117,0.58)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.overlay}>
        <LinearGradient
          colors={['#FFFFFF', '#F6FBFD']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}>
          <View pointerEvents="none" style={styles.dropMark}>
            <AppIcon name={Icons.drop} size={130} color={Brand.primary} />
          </View>

          <View style={[styles.iconBox, { backgroundColor: colores.fondo }]}>
            <AppIcon name={icon} size={28} color={colores.icono} />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.actions}>
            <AppButton title={primaryLabel} onPress={onPrimary} />
            {secondaryLabel && onSecondary ? (
              <AppButton title={secondaryLabel} variant="ghost" onPress={onSecondary} />
            ) : null}
          </View>
        </LinearGradient>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', padding: 22 },
  card: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Brand.glassBorder,
    padding: 22,
    gap: 10,
    overflow: 'hidden',
    ...Shadows.floating,
  },
  dropMark: { position: 'absolute', right: -34, top: -24, opacity: 0.06 },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Brand.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  title: { fontSize: 20, fontWeight: '800', color: Brand.text, letterSpacing: -0.3, lineHeight: 25 },
  message: { fontSize: 13.5, lineHeight: 20, color: Brand.textMuted },
  actions: { gap: 8, marginTop: 8 },
});
