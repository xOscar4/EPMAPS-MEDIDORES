import { LinearGradient } from 'expo-linear-gradient';
import { usePathname, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppIcon } from '@/components/ui/app-icon';
import { Brand, Radius, Shadows } from '@/constants/brand';
import { Icons } from '@/constants/icons';
import type { BorradorLectura } from '@/types/models';
import { useAuth } from '@/features/auth/auth-provider';
import { borrarBorrador, leerBorrador } from './draft';

/**
 * R8: al abrir la app se ofrece continuar o descartar el registro inconcluso.
 * Se oculta si el técnico ya está dentro de la pantalla de lectura.
 */
export function DraftGate() {
  const { tecnico } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [borrador, setBorrador] = useState<BorradorLectura | null>(null);

  useEffect(() => {
    if (!tecnico || pathname.startsWith('/lectura')) return;
    let activo = true;
    leerBorrador().then((guardado) => {
      if (activo && guardado) setBorrador(guardado);
    });
    return () => {
      activo = false;
    };
  }, [tecnico, pathname]);

  if (!borrador) return null;

  const continuar = () => {
    const codigo = borrador.codigo;
    setBorrador(null);
    router.push({ pathname: '/lectura/[codigo]', params: { codigo, continuar: '1' } });
  };

  const descartar = async () => {
    await borrarBorrador();
    setBorrador(null);
  };

  return (
    <Modal transparent visible animationType="fade" onRequestClose={continuar}>
      <LinearGradient
        colors={['rgba(4,41,63,0.74)', 'rgba(10,74,117,0.58)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.overlay}>
        <LinearGradient
          colors={['rgba(255,255,255,0.98)', 'rgba(255,255,255,0.88)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}>
          <View pointerEvents="none" style={styles.dropMark}>
            <AppIcon name={Icons.drop} size={120} color={Brand.primary} />
          </View>
          <View style={styles.iconBox}>
            <AppIcon name={Icons.timer} size={30} color={Brand.warning} />
          </View>
          <Text style={styles.title}>Tienes un registro sin terminar</Text>
          <Text style={styles.message}>
            Empezaste la lectura del medidor <Text style={styles.code}>{borrador.codigo}</Text>. Puedes
            continuar donde la dejaste o descartarla.
          </Text>
          <AppButton title="Continuar registro" icon={Icons.arrowForward} onPress={continuar} />
          <AppButton title="Descartar y empezar de nuevo" variant="ghost" onPress={() => void descartar()} />
        </LinearGradient>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Brand.glassBorder,
    padding: 24,
    gap: 12,
    overflow: 'hidden',
    ...Shadows.floating,
  },
  dropMark: { position: 'absolute', right: -30, top: -20, opacity: 0.06 },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 19,
    backgroundColor: 'rgba(255,241,214,0.9)',
    borderWidth: 1,
    borderColor: Brand.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
  },
  title: { fontSize: 20, fontWeight: '800', color: Brand.text, letterSpacing: -0.3 },
  message: { fontSize: 14, lineHeight: 21, color: Brand.textMuted, marginBottom: 6 },
  code: { fontWeight: '800', color: Brand.primary },
});
