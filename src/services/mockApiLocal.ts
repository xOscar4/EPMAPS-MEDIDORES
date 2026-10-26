import AsyncStorage from '@react-native-async-storage/async-storage';

import type { LecturaLocal, LecturaServidor, Medidor, Tecnico } from '@/types/models';
import { ApiError } from './apiError';
import { CREDENCIALES, MEDIDORES, TECNICO_DEMO } from './seed';

/**
 * Sistema de la oficina simulado localmente.
 * Se usa como fallback cuando no hay `EXPO_PUBLIC_MOCKAPI_URL` o para
 * trabajar sin internet. Guarda las lecturas en AsyncStorage.
 */
const DB_KEY = 'EPMAPS_MOCK_LECTURAS';

const esperar = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function leerDb(): Promise<LecturaServidor[]> {
  try {
    const raw = await AsyncStorage.getItem(DB_KEY);
    return raw ? (JSON.parse(raw) as LecturaServidor[]) : [];
  } catch {
    return [];
  }
}

async function guardarDb(lecturas: LecturaServidor[]): Promise<void> {
  await AsyncStorage.setItem(DB_KEY, JSON.stringify(lecturas));
}

export async function login(codigo: string, clave: string): Promise<Tecnico> {
  await esperar(600);
  const usuario = codigo.trim().toUpperCase();
  if (usuario !== CREDENCIALES.codigo || clave !== CREDENCIALES.clave) {
    throw new ApiError('CREDENCIALES', 'Código de empleado o clave incorrectos.');
  }
  return TECNICO_DEMO;
}

export async function getRuta(): Promise<Medidor[]> {
  await esperar(700);
  return MEDIDORES;
}

export async function getMedidor(codigo: string): Promise<Medidor> {
  await esperar(900);
  const medidor = MEDIDORES.find((item) => item.codigo === codigo);
  if (!medidor) {
    throw new ApiError('NO_ENCONTRADO', 'No existe un medidor con ese código.');
  }
  return medidor;
}

export async function getLecturasEnviadas(): Promise<LecturaServidor[]> {
  await esperar(350);
  const lecturas = await leerDb();
  return lecturas.sort((a, b) => b.enviadoEn.localeCompare(a.enviadoEn));
}

/** Envío idempotente: repetir la misma lectura no crea otra (R9). */
export async function enviarLectura(lectura: LecturaLocal): Promise<LecturaServidor> {
  await esperar(1200);
  const lecturas = await leerDb();
  const repetida = lecturas.find((item) => item.idempotencia === lectura.idempotencia);
  if (repetida) return repetida;

  const duplicada = lecturas.some(
    (item) => item.medidorCodigo === lectura.medidorCodigo && item.periodo === lectura.periodo,
  );
  if (duplicada) {
    throw new ApiError('DUPLICADA', 'Ya existe una lectura de este medidor en el mes.');
  }

  const { estadoSync: _estado, error: _error, creadoEn: _creado, ...base } = lectura;
  const nueva: LecturaServidor = { ...base, enviadoEn: new Date().toISOString() };
  await guardarDb([...lecturas, nueva]);
  return nueva;
}
