import { useRouter } from "expo-router";
import { useState } from "react";
import { Keyboard, Text, View } from "react-native";

import { AppButton } from "@/components/ui/app-button";
import { AppIcon } from "@/components/ui/app-icon";
import { AppInput } from "@/components/ui/app-input";
import { Card } from "@/components/ui/card";
import { Brand } from "@/constants/brand";
import { Icons } from "@/constants/icons";
import { esCodigoValido, normalizarCodigo } from "@/utils/validators";

/**
 * R2: la consulta solo se dispara con MED- y seis dígitos.
 * Mientras el código está incompleto no se navega ni se consulta nada.
 */
export function BuscarMedidor() {
  const router = useRouter();
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");

  const consultar = () => {
    if (!esCodigoValido(codigo)) {
      setError("El código debe tener el formato MED-000000 (seis dígitos).");
      return;
    }
    setError("");
    Keyboard.dismiss();
    router.push({
      pathname: "/medidor/[codigo]",
      params: { codigo: normalizarCodigo(codigo) },
    });
  };

  return (
    <Card>
      <View className="mb-3.5 flex-row items-center gap-2.5">
        <View className="h-[42px] w-[42px] items-center justify-center rounded-[14px] border border-brand-border bg-[#EAF5FC]">
          <AppIcon name={Icons.search} size={19} color={Brand.primary} />
        </View>
        <View className="flex-1 gap-0.5">
          <Text className="text-[18px] font-extrabold tracking-[-0.2px] text-brand-text">
            Consultar un medidor
          </Text>
          <Text className="text-[12px] text-brand-muted">
            Salta directo a un código de tu zona.
          </Text>
        </View>
      </View>
      <AppInput
        label="Código del medidor"
        value={codigo}
        onChangeText={(valor) => {
          setCodigo(valor.toUpperCase());
          if (error) setError("");
        }}
        placeholder="MED-100001"
        autoCapitalize="characters"
        autoCorrect={false}
        maxLength={10}
        error={error}
        hint="Formato: MED- seguido de 6 dígitos"
        onSubmitEditing={consultar}
        returnKeyType="search"
      />
      <View className="mt-0.5 gap-2.5">
        <AppButton
          title="Consultar medidor"
          icon={Icons.search}
          variant="secondary"
          onPress={consultar}
        />
        <AppButton
          title="Añadir medidor"
          icon={Icons.add}
          variant="ghost"
          onPress={() => router.push("/nuevo-medidor")}
        />
      </View>
      <Text className="mt-1 text-[11px] text-brand-muted">
        Si el código está incompleto, la app no hace ninguna consulta ni gasta
        datos.
      </Text>
      <View className="mt-0.5 flex-row items-center gap-1.5">
        <View className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
        <Text className="flex-1 text-[11px] font-semibold text-brand-primary-dark">
          Los datos quedan guardados para consultarlos sin señal.
        </Text>
      </View>
    </Card>
  );
}
