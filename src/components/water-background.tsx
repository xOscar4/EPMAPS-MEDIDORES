import { View } from "react-native";

import { AppGradient } from "@/components/ui/app-gradient";

interface Props {
  tone?: string;
  size?: number;
}

/** Fondo de agua: degradado y gotas difusas detrás de toda la app. */
export function WaterBackground({ tone, size = 240 }: Props) {
  return (
    <View pointerEvents="none" className="absolute inset-0 overflow-hidden">
      <AppGradient
        colors={["#F5FAFD", "#E7F4FB", "#DDF6F4"]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        className="absolute inset-0"
      />
      <View className="absolute right-[-110px] top-[-60px] h-[280px] w-[280px] rounded-full bg-[rgba(27,184,198,0.08)]" />
      <View className="absolute left-[-90px] top-[38%] h-[190px] w-[190px] rounded-full bg-[rgba(127,210,232,0.12)]" />
      <View className="absolute bottom-[-150px] left-[-140px] h-[320px] w-[320px] rounded-full bg-[rgba(18,166,180,0.06)]" />
      <View className="absolute left-[-200px] top-[130px] h-24 w-[560px] rotate-[-16deg] rounded-full bg-[rgba(18,166,180,0.06)]" />
      <View className="absolute bottom-[180px] right-[-240px] h-24 w-[560px] rotate-[12deg] rounded-full bg-[rgba(127,210,232,0.12)]" />
      {tone ? (
        <View
          className="absolute rounded-full"
          style={{ width: size, height: size, backgroundColor: tone }}
        />
      ) : null}
    </View>
  );
}
