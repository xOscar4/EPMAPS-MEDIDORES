import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  Pressable,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/app-button';
import { AppGradient } from '@/components/ui/app-gradient';
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
      <View className="flex-1 bg-[#0A4A6B]">
        <AppGradient
          colors={['#041A26', '#07334A', '#0A4A6B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="absolute inset-0"
          pointerEvents="none"
        />
        {permission?.granted ? (
          <>
            <CameraView
              ref={camara}
              className="absolute inset-0"
              facing="back"
              onCameraReady={() => setLista(true)}
              onMountError={() => Alert.alert('Cámara', 'La cámara no está disponible.')}
            />
            <View
              className="absolute left-0 right-0 top-0 flex-row items-center justify-between px-[18px]"
              style={{ paddingTop: insets.top + 10 }}
            >
              <Pressable
                onPress={onClose}
                className="h-[38px] w-[38px] items-center justify-center rounded-full bg-black/40"
                accessibilityLabel="Cerrar cámara"
              >
                <AppIcon name={Icons.close} size={26} color="#FFFFFF" />
              </Pressable>
              <Text className="text-[14px] font-extrabold text-white">
                Foto del medidor
              </Text>
              <View className="w-[38px]" />
            </View>
            <View className="absolute bottom-[28%] left-6 right-6 top-[24%]">
              <View className="absolute left-0 top-0 h-[34px] w-[34px] rounded-tl-[12px] border-l-[3px] border-t-[3px] border-white" />
              <View className="absolute right-0 top-0 h-[34px] w-[34px] rounded-tr-[12px] border-r-[3px] border-t-[3px] border-white" />
              <View className="absolute bottom-0 left-0 h-[34px] w-[34px] rounded-bl-[12px] border-b-[3px] border-l-[3px] border-white" />
              <View className="absolute bottom-0 right-0 h-[34px] w-[34px] rounded-br-[12px] border-b-[3px] border-r-[3px] border-white" />
            </View>
            <View
              className="absolute bottom-0 left-0 right-0 items-center gap-2.5"
              style={{ paddingBottom: insets.bottom + 24 }}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Tomar foto"
                disabled={!lista || capturando}
                onPress={() => void tomarFoto()}
                className={`h-[76px] w-[76px] items-center justify-center rounded-full border-[5px] border-white/[0.45] bg-white ${
                  !lista || capturando ? 'opacity-60' : ''
                }`}
              >
                {capturando ? <ActivityIndicator color={Brand.primary} /> : null}
              </Pressable>
              <Text className="text-[12px] font-semibold text-[#D7E5EC]">
                Encuadra la carátula y el número
              </Text>
            </View>
          </>
        ) : (
          <View className="flex-1 justify-center gap-3.5 p-7">
            <View className="h-[72px] w-[72px] items-center justify-center rounded-[22px] border border-white/[0.28] bg-white/[0.15]">
              <AppIcon name={Icons.camera} size={34} color="#FFFFFF" />
            </View>
            <Text className="text-[24px] font-extrabold text-white">
              Necesitamos la cámara
            </Text>
            <Text className="text-[14px] leading-[21px] text-[#C9DEEA]">
              La foto respalda la lectura y evita reclamos del cliente. Solo se toma cuando tú lo
              decides y se guarda en este teléfono hasta que se envíe.
            </Text>
            {!permission ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <View className="mt-2 gap-2.5">
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
                  <Text className="text-[12px] font-semibold leading-[18px] text-[#FFD9A3]">
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
