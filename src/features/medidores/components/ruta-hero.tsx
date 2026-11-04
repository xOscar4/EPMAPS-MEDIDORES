import { Text, View } from "react-native";

import { AppGradient } from "@/components/ui/app-gradient";
import { AppIcon } from "@/components/ui/app-icon";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatTile } from "@/components/ui/stat-tile";
import { WaterGlow, WaterWaves } from "@/components/ui/water-decor";
import { Brand } from "@/constants/brand";
import { Icons } from "@/constants/icons";
import type { Tecnico } from "@/types/models";
import { fechaLarga, saludo } from "@/utils/format";

interface Props {
  tecnico: Tecnico;
  total: number;
  registrados: number;
  porEnviar: number;
  online: boolean;
}

/** Encabezado de la jornada: saludo, avance y estado de la cola. */
export function RutaHero({
  tecnico,
  total,
  registrados,
  porEnviar,
  online,
}: Props) {
  const avance = total > 0 ? registrados / total : 0;
  const primerNombre = tecnico.nombre.split(" ")[0];

  return (
    <AppGradient
      colors={[Brand.deepStart, Brand.deepMid, Brand.deepEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="gap-[3px] overflow-hidden rounded-b-[34px] border-b border-white/[0.15] px-[18px] pb-5 pt-[18px]"
    >
      <WaterGlow style={{ right: -80, top: -110 }} opacity={0.62} />
      <WaterGlow
        tone={Brand.aqua}
        size={180}
        style={{ left: -90, bottom: -60 }}
        opacity={0.34}
      />
      <WaterWaves opacity={0.16} />

      <View className="mb-2.5 flex-row items-center justify-between gap-2">
        <View className="shrink flex-row items-center gap-[5px] rounded-full border border-white/[0.22] bg-white/10 px-[9px] py-1">
          <AppIcon name={Icons.drop} size={12} color="#CFF6FA" />
          <Text className="shrink text-[9px] font-extrabold tracking-[1px] text-[#DDF6FA]">
            EPMAPS · CAMPO
          </Text>
        </View>
        <View
          className={`flex-row items-center gap-[5px] rounded-full border px-[9px] py-1 ${
            online
              ? "border-white/[0.28] bg-white/[0.15]"
              : "border-[rgba(255,217,163,0.40)] bg-[rgba(143,83,0,0.26)]"
          }`}
        >
          <View
            className={`h-1.5 w-1.5 rounded-full ${
              online ? "bg-[#8CF0C4]" : "bg-[#FFD9A3]"
            }`}
          />
          <AppIcon
            name={online ? Icons.wifi : Icons.wifiOff}
            size={12}
            color="#FFFFFF"
          />
          <Text className="text-[10px] font-extrabold tracking-[0.2px] text-white">
            {online ? "En línea" : "Sin señal"}
          </Text>
        </View>
      </View>

      <Text className="text-[10px] font-extrabold tracking-[1.2px] text-[#D9F5FA]">
        {fechaLarga().toUpperCase()}
      </Text>
      <Text className="text-[28px] font-extrabold tracking-[-0.5px] text-white">
        {saludo()}, {primerNombre}
      </Text>
      <View className="mb-3.5 flex-row items-center gap-1.5">
        <AppIcon name={Icons.route} size={13} color={Brand.aqua} />
        <Text className="text-[11px] font-bold text-[#D8F0F7]">{tecnico.zona}</Text>
      </View>

      <View className="gap-2.5 rounded-[22px] border border-white/20 bg-white/10 p-3.5">
        <View className="flex-row items-end justify-between gap-2.5">
          <View className="min-w-0 flex-1">
            <Text className="text-[9px] font-extrabold tracking-[1.1px] text-[#BEECF4]">
              AVANCE DE HOY
            </Text>
            <Text className="text-[18px] font-extrabold tracking-[-0.3px] text-white">
              {registrados} de {total} medidores
            </Text>
          </View>
          <View className="flex-row items-end gap-px">
            <Text className="text-[22px] font-extrabold text-white">
              {Math.round(avance * 100)}
            </Text>
            <Text className="mb-1 text-[11px] font-extrabold text-[#BCECF4]">%</Text>
          </View>
        </View>

        <ProgressBar value={avance} />

        <View className="mt-1.5 flex-row gap-2">
          <StatTile
            value={total - registrados}
            label="Por visitar"
            icon={Icons.timer}
            appearance="glass"
          />
          <StatTile
            value={registrados}
            label="Registrados"
            icon={Icons.check}
            tone="success"
            appearance="glass"
          />
          <StatTile
            value={porEnviar}
            label="Por enviar"
            icon={Icons.cloudDone}
            tone={porEnviar > 0 ? "warning" : "neutral"}
            appearance="glass"
          />
        </View>
      </View>

      <View className="mt-2.5 flex-row items-center gap-1.5 rounded-[14px] border border-white/[0.15] bg-white/[0.08] px-2.5 py-[7px]">
        <AppIcon
          name={online ? Icons.sync : Icons.wifiOff}
          size={11}
          color="#BFE4EF"
        />
        <Text className="flex-1 text-[10px] leading-[15px] text-[#E5F9FF]" numberOfLines={2}>
          {online
            ? "Con señal: la ruta y las lecturas se sincronizan solas"
            : "Sin señal: sigues trabajando con la copia guardada"}
        </Text>
      </View>
    </AppGradient>
  );
}
