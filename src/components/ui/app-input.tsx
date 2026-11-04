import {
    Text,
    TextInput,
    View,
    type StyleProp,
    type TextInputProps,
    type ViewStyle,
} from "react-native";

import { Brand } from "@/constants/brand";

interface Props extends TextInputProps {
  label: string;
  error?: string;
  hint?: string;
  right?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

/** Campo de texto con etiqueta, ayuda y error, para no repetir estilos. */
export function AppInput({
  label,
  error,
  hint,
  right,
  containerStyle,
  style,
  ...rest
}: Props) {
  return (
    <View className="min-w-0 gap-1.5" style={containerStyle}>
      <Text className="text-[11px] font-extrabold uppercase tracking-[0.6px] text-brand-primary-dark">
        {label}
      </Text>
      <View
        className={`min-h-[54px] flex-row items-center gap-2 rounded-[16px] border px-3.5 ${
          error
            ? "border-[rgba(184,59,52,0.45)] bg-[#FFF7F7]"
            : "border-brand-glass-border bg-brand-glass-field"
        }`}
      >
        <TextInput
          placeholderTextColor={Brand.textMuted}
          className="min-w-0 flex-1 py-[11px] text-[16px] text-brand-text"
          style={style}
          {...rest}
        />
        {right}
      </View>
      {error ? (
        <Text className="text-[12px] font-semibold text-brand-danger">
          {error}
        </Text>
      ) : null}
      {!error && hint ? (
        <Text className="text-[11px] leading-[15px] text-brand-muted">
          {hint}
        </Text>
      ) : null}
    </View>
  );
}
