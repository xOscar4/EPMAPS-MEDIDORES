import { Pressable, Text, View } from "react-native";

import { AppGradient } from "./app-gradient";

interface Opcion {
  key: string;
  label: string;
  count?: number;
}

interface Props {
  options: Opcion[];
  value: string;
  onChange: (key: string) => void;
}

export function Segmented({ options, value, onChange }: Props) {
  return (
    <View className="flex-row gap-1 rounded-[18px] border border-[rgba(13,94,140,0.10)] bg-[#ECF5FA] p-1">
      {options.map((opcion) => {
        const activa = opcion.key === value;
        return (
          <Pressable
            key={opcion.key}
            accessibilityRole="button"
            accessibilityState={{ selected: activa }}
            onPress={() => onChange(opcion.key)}
            className="min-h-[44px] min-w-0 flex-1 flex-row items-center justify-center gap-1 overflow-hidden rounded-[14px] px-0.5"
          >
            {activa ? (
              <AppGradient
                colors={["#FFFFFF", "#F1FAFD"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                className="absolute inset-0 rounded-[14px] border border-[rgba(13,94,140,0.10)]"
                pointerEvents="none"
              />
            ) : null}
            <Text
              className={`shrink text-[11px] ${
                activa
                  ? "font-extrabold text-brand-primary-deep"
                  : "font-bold text-brand-muted"
              }`}
              numberOfLines={1}
            >
              {opcion.label}
            </Text>
            {typeof opcion.count === "number" ? (
              <View
                className={`h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 ${
                  activa ? "bg-[#DFF7F8]" : "bg-[#DDECF7]"
                }`}
              >
                <Text
                  className={`text-[9px] font-extrabold ${
                    activa ? "text-brand-accent-deep" : "text-brand-muted"
                  }`}
                >
                  {opcion.count}
                </Text>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}
