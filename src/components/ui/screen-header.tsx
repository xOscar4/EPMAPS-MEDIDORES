import { Pressable, Text, View } from "react-native";

import { Brand, Shadows } from "@/constants/brand";
import { Icons } from "@/constants/icons";
import { AppGradient } from "./app-gradient";
import { AppIcon } from "./app-icon";

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
}

/** Encabezado común de las pantallas fuera de las tabs. */
export function ScreenHeader({ title, subtitle, onBack, right }: Props) {
  return (
    <View className="flex-row items-center gap-3 overflow-hidden border-b border-brand-border bg-white/95 px-4 py-3.5">
      {onBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver"
          onPress={onBack}
          className="h-[42px] w-[42px] items-center justify-center rounded-[14px] border border-[rgba(13,94,140,0.12)] bg-[#F4FAFF]"
          style={({ pressed }) => [Shadows.card, pressed && { opacity: 0.7 }]}
        >
          <AppIcon name={Icons.arrowBack} size={20} color={Brand.primaryDark} />
        </Pressable>
      ) : null}
      <View className="min-w-0 flex-1 gap-0.5">
        <Text
          className="text-[20px] font-extrabold tracking-[-0.3px] text-brand-text"
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            className="text-[11px] font-bold tracking-[0.2px] text-brand-accent-deep"
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
      <AppGradient
        colors={[Brand.accentBright, Brand.accent, "rgba(15,166,180,0)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="absolute bottom-0 left-0 right-0 h-0.5"
        pointerEvents="none"
      />
    </View>
  );
}
