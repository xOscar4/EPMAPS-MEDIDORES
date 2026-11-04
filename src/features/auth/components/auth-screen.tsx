import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppGradient } from '@/components/ui/app-gradient';
import { AppIcon } from '@/components/ui/app-icon';
import {
  WaterGlow,
  WaterRipples,
  WaterWaves,
} from '@/components/ui/water-decor';
import { Brand, Shadows } from '@/constants/brand';
import { Icons } from '@/constants/icons';

interface Props {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  /** Si se recibe, se muestra el botón de volver. */
  onBack?: () => void;
  footer?: React.ReactNode;
}

/**
 * Estructura común de las pantallas de cuenta: encabezado de agua, tarjeta de
 * vidrio y desplazamiento con el teclado. Mantiene la misma identidad del Login.
 */
export function AuthScreen({
  eyebrow,
  title,
  subtitle,
  children,
  onBack,
  footer,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 28 + insets.bottom }}
        keyboardShouldPersistTaps="handled"
      >
        <AppGradient
          colors={[Brand.deepStart, Brand.deepMid, Brand.deepEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="gap-2 overflow-hidden rounded-b-[32px] px-6 pb-12 pt-8"
        >
          <WaterGlow style={{ right: -90, top: -90 }} opacity={0.55} />
          <WaterRipples
            size={180}
            tone="rgba(255,255,255,0.14)"
            style={{ right: -56, top: -20 }}
          />
          <WaterWaves opacity={0.14} />

          {onBack ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Volver"
              onPress={onBack}
              hitSlop={10}
              className="mb-2 h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/[0.15]"
            >
              <AppIcon name={Icons.arrowBack} size={18} color="#FFFFFF" />
            </Pressable>
          ) : null}

          <Text className="text-[10px] font-extrabold tracking-[1.4px] text-[#B9E7EF]">
            {eyebrow}
          </Text>
          <Text className="text-[30px] font-extrabold leading-[35px] tracking-[-0.6px] text-white">
            {title}
          </Text>
          <Text className="text-[13px] leading-5 text-[#D6EAF3]">{subtitle}</Text>
        </AppGradient>

        <View
          className="mx-[18px] -mt-7 gap-3 rounded-[28px] border border-brand-border bg-white p-5"
          style={Shadows.floating}
        >
          {children}
        </View>

        {footer ? <View className="mt-5 px-6">{footer}</View> : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
