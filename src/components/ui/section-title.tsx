import { Text, View } from "react-native";

import { Brand } from "@/constants/brand";
import { AppGradient } from "./app-gradient";

interface Props {
  index: string;
  title: string;
  subtitle?: string;
}

/** Título de sección con gota numerada y filete de agua. */
export function SectionTitle({ index, title, subtitle }: Props) {
  return (
    <View className="flex-row items-center gap-3">
      <AppGradient
        colors={[Brand.deepMid, Brand.deepEnd, Brand.accentBright]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="h-8 w-8 items-center justify-center rounded-[12px] border border-white/40"
      >
        <Text className="text-[12px] font-extrabold text-white">{index}</Text>
      </AppGradient>
      <View className="min-w-0 flex-1 gap-px">
        <Text className="text-[16px] font-extrabold tracking-[-0.2px] text-brand-text">
          {title}
        </Text>
        {subtitle ? (
          <Text className="text-[11px] font-semibold text-brand-muted">
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
