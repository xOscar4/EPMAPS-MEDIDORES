import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import type { EstadoMedidor, LecturaLocal, LecturaServidor, Medidor } from '@/types/models';
import { ApiError } from './apiError';

/**
 * Sistema de la oficina: MockAPI real.
 *
 * Recursos:
 *  - GET /medidores
 *  - GET /medidores?codigo=MED-100001
 *  - GET /lecturas
 *  - POST /lecturas
 *
 * La URL se puede cambiar con EXPO_PUBLIC_MOCKAPI_URL. Si la variable no
 * existe se usa la URL de la prueba, de modo que el APK siempre queda
 * conectado y no hay ningún backend simulado dentro del teléfono.
 */
export const MOCKAPI_URL =
  process.env.EXPO_PUBLIC_MOCKAPI_URL ?? 'https://6ade67884e88f1bba4a5218d.mockapi.io';

const api = axios.create({ baseURL: MOCKAPI_URL, timeout: 10000 });

/**
 * R3 y R4: la caché de TanStack Query se guarda en AsyncStorage. Además,
 * cada medidor consultado se guarda aquí para poder abrirlo sin Internet
 * incluso si la caché de consultas se limpia.
 */
const MEDIDOR_KEY = 'EPMAPS_MEDIDORES_VISTOS';

interface LecturaApi {
  id: string;
  idempotencia?: string;
  medidorCodigo?: string;
  periodo?: string;
  estadoMedidor?: string;
  lectura?: number | string | null;
  motivo?: string | null;
  descripcion?: string | null;
  consumo?: number | string;
  promedio?: number | string;
  anomalia?: boolean;
  confirmoAnomalia?: boolean;
  fotoUri?: string | null;
  tecnicoCodigo?: string;
  enviadoEn?: string;
}

/** MockAPI devuelve un arreglo al listar y un objeto al filtrar por id. */
function comoLista<T>(data: T[] | T): T[] {
  if (Array.isArray(data)) return data;
  return data ? [data] : [];
}

/** Normaliza los campos que MockAPI puede guardar como texto. */
function aServidor(raw: LecturaApi): LecturaServidor {
  const estado = (raw.estadoMedidor ?? 'normal') as EstadoMedidor;
  const tieneLectura =
    estado !== 'inaccesible' &&
    raw.lectura !== null &&
    raw.lectura !== undefined &&
    raw.lectura !== '';

  return {
    id: String(raw.id),
    idempotencia: String(raw.idempotencia ?? ''),
    medidorCodigo: String(raw.medidorCodigo ?? ''),
    periodo: String(raw.periodo ?? ''),
    estadoMedidor: estado,
    lectura: tieneLectura ? Number(raw.lectura) : null,
    motivo: raw.motivo ? String(raw.motivo) : null,
    descripcion: raw.descripcion ? String(raw.descripcion) : null,
    consumo: Number(raw.consumo ?? 0),
    promedio: Number(raw.promedio ?? 0),
    anomalia: Boolean(raw.anomalia),
    confirmoAnomalia: Boolean(raw.confirmoAnomalia),
    fotoUri: raw.fotoUri ? String(raw.fotoUri) : null,
    tecnicoCodigo: String(raw.tecnicoCodigo ?? ''),
    enviadoEn: String(raw.enviadoEn ?? ''),
  };
}

async function leerVistos(): Promise<Record<string, Medidor>> {
  try {
    const raw = await AsyncStorage.getItem(MEDIDOR_KEY);
    return raw ? (JSON.parse(raw) as Record<string, Medidor>) : {};
  } catch {
    return {};
  }
}

/** Guarda una copia del medidor para las consultas sin conexión (R3). */
export async function guardarMedidorVisto(medidor: Medidor): Promise<void> {
  const vistos = await leerVistos();
  await AsyncStorage.setItem(
    MEDIDOR_KEY,
    JSON.stringify({ ...vistos, [medidor.codigo]: medidor }),
  );
}

/** Guarda la ruta completa en una sola escritura, sin condiciones de carrera. */
export async function guardarMedidoresVistos(medidores: Medidor[]): Promise<void> {
  const vistos = await leerVistos();
  const siguientes = { ...vistos };
  for (const medidor of medidores) siguientes[medidor.codigo] = medidor;
  await AsyncStorage.setItem(MEDIDOR_KEY, JSON.stringify(siguientes));
}

/** Devuelve la copia local de un medidor ya consultado, o `null`. */
export async function leerMedidorVisto(codigo: string): Promise<Medidor | null> {
  const vistos = await leerVistos();
  return vistos[codigo] ?? null;
}

export async function getRuta(): Promise<Medidor[]> {
  const { data } = await api.get<Medidor[]>('/medidores');
  return comoLista(data).sort((a, b) => a.codigo.localeCompare(b.codigo));
}

export async function getMedidor(codigo: string): Promise<Medidor> {
  const { data } = await api.get<Medidor[]>('/medidores', { params: { codigo } });
  const medidor = comoLista(data)[0];
  if (!medidor) {
    throw new ApiError('NO_ENCONTRADO', 'No existe un medidor con ese código.');
  }
  return medidor;
}

export async function getLecturasEnviadas(): Promise<LecturaServidor[]> {
  const { data } = await api.get<LecturaApi[]>('/lecturas');
  return comoLista(data)
    .map(aServidor)
    .sort((a, b) => b.enviadoEn.localeCompare(a.enviadoEn));
}

/**
 * R9: antes de insertar se busca la misma idempotencia. Si el envío anterior
 * llegó al servidor pero se perdió la respuesta, el reintento devuelve la
 * lectura existente en lugar de crear otra.
 */
export async function enviarLectura(lectura: LecturaLocal): Promise<LecturaServidor> {
  const { data: previas } = await api.get<LecturaApi[]>('/lecturas', {
    params: { idempotencia: lectura.idempotencia },
  });
  const repetida = comoLista(previas)[0];
  if (repetida) return aServidor(repetida);

  // R10: MockAPI no impone un índice único; la app verifica antes de insertar.
  const { data: duplicadas } = await api.get<LecturaApi[]>('/lecturas', {
    params: { medidorCodigo: lectura.medidorCodigo, periodo: lectura.periodo },
  });
  if (comoLista(duplicadas).length > 0) {
    throw new ApiError('DUPLICADA', 'Ya existe una lectura de este medidor en el mes.');
  }

  const {
    id: _id,
    estadoSync: _estado,
    error: _error,
    creadoEn: _creado,
    ...base
  } = lectura;

  const { data } = await api.post<LecturaApi>('/lecturas', {
    ...base,
    // MockAPI acepta null; se conserva para distinguir "sin lectura" de 0 m³.
    lectura: base.lectura,
    motivo: base.motivo ?? '',
    descripcion: base.descripcion ?? '',
    fotoUri: base.fotoUri ?? '',
    enviadoEn: new Date().toISOString(),
  });

  return aServidor(data);
}
