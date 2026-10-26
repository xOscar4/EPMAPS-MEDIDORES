import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Keyboard, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppInput } from '@/components/ui/app-input';
import { Card } from '@/components/ui/card';
import { Brand } from '@/constants/brand';
import { Icons } from '@/constants/icons';
import { esCodigoValido, normalizarCodigo } from '@/utils/validators';

/**
 * R2: la consulta solo se dispara con MED- y seis dígitos.
 * Mientras el código está incompleto no se navega ni se consulta nada.
 */
export function BuscarMedidor() {
  const router = useRouter();
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');

  const consultar = () => {
    if (!esCodigoValido(codigo)) {
      setError('El código debe tener el formato MED-000000 (seis dígitos).');
      return;
    }
    setError('');
    Keyboard.dismiss();
    router.push({
      pathname: '/medidor/[codigo]',
      params: { codigo: normalizarCodigo(codigo) },
    });
  };

  return (
    <Card>
      <View style={styles.heading}>
        <View>
          <Text style={styles.title}>Consultar un medidor</Text>
          <Text style={styles.subtitle}>Salta directo a un código de tu zona.</Text>
        </View>
      </View>
      <AppInput
        label="Código del medidor"
        value={codigo}
        onChangeText={(valor) => {
          setCodigo(valor.toUpperCase());
          if (error) setError('');
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
      <AppButton title="Consultar medidor" icon={Icons.search} variant="secondary" onPress={consultar} />
      <AppButton title="Añadir medidor" icon={Icons.add} variant="ghost" onPress={() => router.push('/nuevo-medidor')} />
      <Text style={styles.note}>
        Si el código está incompleto, la app no hace ninguna consulta ni gasta datos.
      </Text>
      <View style={styles.brandLine}>
        <View style={styles.dot} />
        <Text style={styles.brandText}>Los datos quedan guardados para consultarlos sin señal.</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  heading: { marginBottom: 12, gap: 2 },
  title: { fontSize: 16, fontWeight: '800', color: Brand.text },
  subtitle: { fontSize: 12, color: Brand.textMuted },
  note: { fontSize: 11, color: Brand.textMuted, marginTop: 2 },
  brandLine: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Brand.accent },
  brandText: { fontSize: 11, color: Brand.primaryDark, fontWeight: '600', flex: 1 },
});
