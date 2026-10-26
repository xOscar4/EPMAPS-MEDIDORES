import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Brand, Radius } from '@/constants/brand';
import { Icons } from '@/constants/icons';
import { formatearNumero } from '@/utils/format';

interface Props {
  lectura: number | null;
  anterior: number;
  promedio: number;
  consumo: number;
  anomalia: boolean;
  inaccesible: boolean;
  confirmado: boolean;
  onConfirmar: () => void;
  error?: string;
}

/** R6: muestra la resta y alerta cuando supera el triple del promedio. */
export function ConsumoResumen({
  lectura,
  anterior,
  promedio,
  consumo,
  anomalia,
  inaccesible,
  confirmado,
  onConfirmar,
  error,
}: Props) {
  if (inaccesible) {
    return (
      <Card style={styles.mutedCard}>
        <AppIcon name={Icons.block} size={22} color={Brand.textMuted} />
        <View style={styles.mutedTexts}>
          <Text style={styles.mutedTitle}>Consumo no disponible</Text>
          <Text style={styles.mutedText}>
            El medidor está inaccesible. Se registra el motivo y no se calcula consumo.
          </Text>
        </View>
      </Card>
    );
  }

  if (lectura === null) {
    return (
      <Card style={styles.mutedCard}>
        <AppIcon name={Icons.speed} size={22} color={Brand.textMuted} />
        <View style={styles.mutedTexts}>
          <Text style={styles.mutedTitle}>Aún no hay lectura</Text>
          <Text style={styles.mutedText}>
            Al ingresar la lectura actual verás el consumo y la alerta por consumo alto.
          </Text>
        </View>
      </Card>
    );
  }

  const limite = promedio * 3;
  const avance = limite > 0 ? Math.min(1, consumo / limite) : 1;

  return (
    <Card style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.eyebrow}>CONSUMO DEL MES</Text>
        <Chip
          label={anomalia ? 'Revisar' : 'Dentro del promedio'}
          tone={anomalia ? 'warning' : 'success'}
          icon={anomalia ? Icons.warning : Icons.check}
        />
      </View>

      <View style={styles.amountRow}>
        <Text style={[styles.amount, anomalia && styles.amountAlert]}>{formatearNumero(consumo)}</Text>
        <Text style={styles.unit}>m³</Text>
      </View>
      <Text style={styles.formula}>
        Lectura actual {formatearNumero(lectura)} − anterior {formatearNumero(anterior)}
      </Text>

      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${avance * 100}%`, backgroundColor: anomalia ? Brand.warning : Brand.accent },
          ]}
        />
      </View>
      <View style={styles.legendRow}>
        <Text style={styles.legend}>Promedio {formatearNumero(promedio, 0)} m³</Text>
        <Text style={styles.legend}>Alerta {formatearNumero(limite, 0)} m³</Text>
      </View>

      {anomalia ? (
        <View style={styles.alertBox}>
          <View style={styles.alertHeader}>
            <AppIcon name={Icons.warning} size={18} color={Brand.warning} />
            <Text style={styles.alertTitle}>Consumo mayor al triple del promedio</Text>
          </View>
          <Text style={styles.alertText}>
            Revisa que la lectura y el medidor sean correctos antes de continuar. La lectura se
            guardará como anómala para que la oficina la verifique.
          </Text>
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: confirmado }}
            onPress={onConfirmar}
            style={[styles.confirm, confirmado && styles.confirmActive]}>
            <AppIcon
              name={confirmado ? Icons.check : Icons.info}
              size={17}
              color={confirmado ? Brand.success : Brand.warning}
            />
            <Text style={[styles.confirmText, confirmado && styles.confirmTextActive]}>
              {confirmado ? 'Confirmado: revisé el medidor' : 'Confirmo que revisé el medidor'}
            </Text>
          </Pressable>
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: 6 },
  mutedCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  mutedTexts: { flex: 1, gap: 2 },
  mutedTitle: { fontSize: 14, fontWeight: '800', color: Brand.text },
  mutedText: { fontSize: 12, lineHeight: 17, color: Brand.textMuted },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eyebrow: { fontSize: 10, fontWeight: '800', color: Brand.textMuted, letterSpacing: 1 },
  amountRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  amount: { fontSize: 42, lineHeight: 48, fontWeight: '800', color: Brand.primaryDark },
  amountAlert: { color: Brand.warning },
  unit: { fontSize: 15, fontWeight: '700', color: Brand.textMuted, marginBottom: 8 },
  formula: { fontSize: 12, color: Brand.textMuted, marginTop: -6 },
  track: {
    height: 9,
    borderRadius: Radius.pill,
    backgroundColor: Brand.surfaceAlt,
    overflow: 'hidden',
    marginTop: 8,
  },
  fill: { height: '100%', borderRadius: Radius.pill },
  legendRow: { flexDirection: 'row', justifyContent: 'space-between' },
  legend: { fontSize: 10, color: Brand.textMuted, fontWeight: '600' },
  alertBox: {
    marginTop: 8,
    backgroundColor: Brand.warningSoft,
    borderRadius: Radius.md,
    padding: 13,
    gap: 7,
  },
  alertHeader: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  alertTitle: { flex: 1, fontSize: 13, fontWeight: '800', color: Brand.warning },
  alertText: { fontSize: 11, lineHeight: 17, color: '#6B4300' },
  confirm: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E3C58A',
    backgroundColor: '#FFF9EC',
    borderRadius: 12,
    padding: 10,
  },
  confirmActive: { borderColor: Brand.success, backgroundColor: Brand.successSoft },
  confirmText: { flex: 1, fontSize: 12, fontWeight: '700', color: Brand.warning },
  confirmTextActive: { color: Brand.success },
  error: { fontSize: 11, fontWeight: '700', color: Brand.danger },
});
