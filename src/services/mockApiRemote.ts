import axios from 'axios';

import type { EstadoMedidor, LecturaLocal, LecturaServidor, Medidor } from '@/types/models';
import { ApiError } from './apiError';

/**
 * Sistema de la oficina real simulado con MockAPI.
 *
 * Recursos:
 *  - GET/POST /medidores
 *  - GET/POST /lecturas
 *
 * La URL se configura con EXPO_PUBLIC_MOCKAPI_URL. Si no existe, la fachada
 * `mockApi.ts` usa el mock local (mockApiLocal.ts) como fallback.
 */
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_MOCKAPI_URL,
  timeout: 10000,
});

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

/** MockAPI puede devolver un objeto o un arreglo según el filtro. */
function comoLista<T>(data: T[] | T): T[] {
  if (Array.isArray(data)) return data;
  return data ? [data] : [];
}

/** Normaliza los campos que MockAPI guarda como texto. */
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
