import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Keyboard, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppIcon } from '@/components/ui/app-icon';
import { AppInput } from '@/components/ui/app-input';
import { Card } from '@/components/ui/card';
import { Brand, Radius } from '@/constants/brand';
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
        <View style={styles.headingIcon}>
          <AppIcon name={Icons.search} size={19} color={Brand.primary} />
        </View>
        <View style={styles.headingTexts}>
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
      <View style={styles.actions}>
        <AppButton title="Consultar medidor" icon={Icons.search} variant="secondary" onPress={consultar} />
        <AppButton
          title="Añadir medidor"
          icon={Icons.add}
          variant="ghost"
          onPress={() => router.push('/nuevo-medidor')}
        />
      </View>
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
  heading: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  headingIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    backgroundColor: 'rgba(228,242,250,0.9)',
    borderWidth: 1,
    borderColor: Brand.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingTexts: { flex: 1, gap: 2 },
  title: { fontSize: 17, fontWeight: '800', color: Brand.text, letterSpacing: -0.2 },
  subtitle: { fontSize: 12, color: Brand.textMuted },
  actions: { gap: 10, marginTop: 2 },
  note: { fontSize: 11, color: Brand.textMuted, marginTop: 4 },
  brandLine: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Brand.accent },
  brandText: { fontSize: 11, color: Brand.primaryDark, fontWeight: '600', flex: 1 },
});
