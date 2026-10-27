import { StyleSheet, Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Brand } from '@/constants/brand';
import { Icons } from '@/constants/icons';
import type { Medidor } from '@/types/models';
import { formatearFecha, formatearNumero } from '@/utils/format';

interface Props {
  medidor: Medidor;
  porEnviar?: boolean;
}

/** Los siete datos de R3, resumidos para no perder contexto mientras se llena. */
export function MedidorResumen({ medidor, porEnviar }: Props) {
  return (
    <Card style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.codeBox}>
          <AppIcon name={Icons.drop} size={18} color={Brand.primary} />
          <Text style={styles.codigo}>{medidor.codigo}</Text>
        </View>
        <Chip
          label={porEnviar ? 'Corrigiendo pendiente' : 'Consulta guardada'}
          tone={porEnviar ? 'warning' : 'info'}
          icon={porEnviar ? Icons.edit : Icons.cloudDone}
        />
      </View>

      <Text style={styles.direccion}>{medidor.direccion}</Text>
      <Text style={styles.sector}>{medidor.sector} · Cuenta {medidor.cuenta}</Text>

      <View style={styles.metrics}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Lectura anterior</Text>
          <Text style={styles.metricValue}>{formatearNumero(medidor.ultimaLectura, 0)} m³</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Promedio mensual</Text>
          <Text style={styles.metricValue}>{formatearNumero(medidor.promedioMensual, 0)} m³</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Última visita</Text>
          <Text style={styles.metricValue}>{formatearFecha(medidor.fechaUltimaLectura)}</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: 5 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  codeBox: { flexDirection: 'row', alignItems: 'center', gap: 7, flexShrink: 1 },
  codigo: { fontSize: 18, fontWeight: '800', color: Brand.text, letterSpacing: 0.4, flexShrink: 1 },
  direccion: { fontSize: 13, fontWeight: '600', color: Brand.text },
  sector: { fontSize: 11, color: Brand.textMuted },
  metrics: { flexDirection: 'row', gap: 8, marginTop: 8 },
  metric: {
    flex: 1,
    minWidth: 0,
    backgroundColor: '#F7FBFD',
    borderWidth: 1,
    borderColor: Brand.glassBorder,
    borderRadius: 12,
    padding: 8,
    gap: 2,
  },
  metricLabel: { fontSize: 9, fontWeight: '700', color: Brand.textMuted, textTransform: 'uppercase', letterSpacing: 0.3 },
  metricValue: { fontSize: 12, fontWeight: '800', color: Brand.primaryDark },
});
