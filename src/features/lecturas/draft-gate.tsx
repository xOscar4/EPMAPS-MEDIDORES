import { usePathname, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppIcon } from '@/components/ui/app-icon';
import { Brand, Radius } from '@/constants/brand';
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
      <View style={styles.overlay}>
        <View style={styles.card}>
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
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 30, 46, 0.62)',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: Brand.surface,
    borderRadius: Radius.xl,
    padding: 24,
    gap: 12,
  },
  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: Brand.warningSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 20, fontWeight: '800', color: Brand.text },
  message: { fontSize: 14, lineHeight: 21, color: Brand.textMuted, marginBottom: 6 },
  code: { fontWeight: '800', color: Brand.primary },
});
