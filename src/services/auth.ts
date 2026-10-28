import type { Tecnico } from '@/types/models';
import { ApiError } from './apiError';

/**
 * R1: identificación del técnico.
 *
 * La prueba permite datos quemados y MockAPI solo tiene los recursos
 * `medidores` y `lecturas`, así que las credenciales se validan en el
 * teléfono. La clave nunca se guarda: la sesión conserva solo el perfil.
 */
const CREDENCIALES = { codigo: 'EMP-001', clave: 'epmaps2026' } as const;

const TECNICO: Tecnico = {
  codigo: CREDENCIALES.codigo,
  nombre: 'Oscar Vásquez',
  zona: 'Ruta Norte · Pichincha',
};

export async function login(codigo: string, clave: string): Promise<Tecnico> {
  // Pequeña espera para que el botón muestre su estado de carga.
  await new Promise((resolve) => setTimeout(resolve, 400));

  // Se limpian espacios accidentales del teclado o del autocompletado.
  const usuario = codigo.trim().toUpperCase();
  if (usuario !== CREDENCIALES.codigo || clave.trim() !== CREDENCIALES.clave) {
    throw new ApiError('CREDENCIALES', 'Código de empleado o clave incorrectos.');
  }
  return TECNICO;
}
