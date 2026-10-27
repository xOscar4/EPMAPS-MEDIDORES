import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/app-button';
import { AppIcon } from '@/components/ui/app-icon';
import { Brand } from '@/constants/brand';
import { Icons } from '@/constants/icons';
import { guardarFoto } from '../foto';

interface Props {
  visible: boolean;
  requerida: boolean;
  onClose: () => void;
  onCapture: (uri: string) => void;
}

/** R7: cámara con explicación del permiso y salida cuando la foto es opcional. */
export function CameraModal({ visible, requerida, onClose, onCapture }: Props) {
  // Al cerrar se desmonta el contenido, así la cámara y sus estados vuelven a cero.
  if (!visible) return null;
  return <ContenidoCamara requerida={requerida} onClose={onClose} onCapture={onCapture} />;
}

function ContenidoCamara({ requerida, onClose, onCapture }: Omit<Props, 'visible'>) {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [lista, setLista] = useState(false);
  const [capturando, setCapturando] = useState(false);
  const camara = useRef<CameraView>(null);

  const tomarFoto = async () => {
    if (!camara.current || !lista || capturando) return;
    setCapturando(true);
    try {
      const foto = await camara.current.takePictureAsync({ quality: 0.45 });
      if (foto?.uri) {
        const uri = await guardarFoto(foto.uri, `medidor-${Date.now()}`);
        onCapture(uri);
        onClose();
      }
    } catch {
      Alert.alert('Cámara', 'No se pudo tomar la foto. Intenta de nuevo.');
    } finally {
      setCapturando(false);
    }
  };

  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <View style={styles.screen}>
        <LinearGradient
          colors={['#041A26', '#07334A', '#0A4A6B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        {permission?.granted ? (
          <>
            <CameraView
              ref={camara}
              style={StyleSheet.absoluteFill}
              facing="back"
              onCameraReady={() => setLista(true)}
              onMountError={() => Alert.alert('Cámara', 'La cámara no está disponible.')}
            />
            <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
              <Pressable onPress={onClose} style={styles.close} accessibilityLabel="Cerrar cámara">
                <AppIcon name={Icons.close} size={26} color="#FFFFFF" />
              </Pressable>
              <Text style={styles.topTitle}>Foto del medidor</Text>
              <View style={{ width: 38 }} />
            </View>
            <View style={styles.frame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
            <View style={[styles.shutterBar, { paddingBottom: insets.bottom + 24 }]}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Tomar foto"
                disabled={!lista || capturando}
                onPress={() => void tomarFoto()}
                style={[styles.shutter, (!lista || capturando) && styles.shutterDisabled]}>
                {capturando ? <ActivityIndicator color={Brand.primary} /> : null}
              </Pressable>
              <Text style={styles.shutterText}>Encuadra la carátula y el número</Text>
            </View>
          </>
        ) : (
          <View style={styles.permission}>
            <View style={styles.permissionIcon}>
              <AppIcon name={Icons.camera} size={34} color="#FFFFFF" />
            </View>
            <Text style={styles.permissionTitle}>Necesitamos la cámara</Text>
            <Text style={styles.permissionText}>
              La foto respalda la lectura y evita reclamos del cliente. Solo se toma cuando tú lo
              decides y se guarda en este teléfono hasta que se envíe.
            </Text>
            {!permission ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <View style={styles.permissionActions}>
                <AppButton
                  title={permission.canAskAgain ? 'Permitir acceso' : 'Abrir ajustes'}
                  icon={Icons.camera}
                  onPress={() =>
                    permission.canAskAgain ? void requestPermission() : void Linking.openSettings()
                  }
                />
                {!requerida ? (
                  <AppButton title="Continuar sin foto" variant="secondary" onPress={onClose} />
                ) : (
                  <Text style={styles.required}>
                    En este caso la foto es obligatoria: el consumo es anómalo o el medidor está dañado.
                  </Text>
                )}
                <AppButton title="Cancelar" variant="ghost" onPress={onClose} />
              </View>
            )}
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0A4A6B' },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  close: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  topTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  frame: { position: 'absolute', top: '24%', left: 24, right: 24, bottom: '28%' },
  corner: { position: 'absolute', width: 34, height: 34, borderColor: '#FFFFFF' },
  topLeft: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 12 },
  topRight: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 12 },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 12 },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 12 },
  shutterBar: { position: 'absolute', bottom: 0, left: 0, right: 0, alignItems: 'center', gap: 10 },
  shutter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#FFFFFF',
    borderWidth: 5,
    borderColor: 'rgba(255,255,255,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterDisabled: { opacity: 0.6 },
  shutterText: { color: '#D7E5EC', fontSize: 12, fontWeight: '600' },
  permission: { flex: 1, justifyContent: 'center', padding: 28, gap: 14 },
  permissionIcon: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionTitle: { color: '#FFFFFF', fontSize: 24, fontWeight: '800' },
  permissionText: { color: '#C9DEEA', fontSize: 14, lineHeight: 21 },
  permissionActions: { gap: 10, marginTop: 8 },
  required: { color: '#FFD9A3', fontSize: 12, lineHeight: 18, fontWeight: '600' },
});
