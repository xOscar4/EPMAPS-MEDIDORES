/** Estados que el técnico puede reportar en campo (R5). */
export type EstadoMedidor = "normal" | "inaccesible" | "danado";

/** Ciclo de vida de una lectura dentro del outbox (R9). */
export type EstadoSync = "pendiente" | "enviando" | "error";

export interface Tecnico {
  codigo: string;
  nombre: string;
  zona: string;
}

/** Los siete datos que envía el sistema de la oficina (R3). */
export interface Medidor {
  codigo: string;
  direccion: string;
  sector: string;
  cuenta: string;
  estado: "activo" | "suspendido";
  ultimaLectura: number;
  fechaUltimaLectura: string;
  promedioMensual: number;
}

/** Lectura confirmada por el sistema de la oficina. */
export interface LecturaServidor {
  id: string;
  idempotencia: string;
  medidorCodigo: string;
  fecha: string;
  periodo: string;
  estadoMedidor: EstadoMedidor;
  lectura: number | null;
  motivo: string | null;
  descripcion: string | null;
  consumo: number;
  promedio: number;
  anomalia: boolean;
  confirmoAnomalia: boolean;
  fotoUri: string | null;
  tecnicoCodigo: string;
  enviadoEn: string;
}

/** Lectura que aún vive en el teléfono y puede corregirse (R10). */
export interface LecturaLocal {
  id: string;
  idempotencia: string;
  medidorCodigo: string;
  fecha: string;
  periodo: string;
  estadoMedidor: EstadoMedidor;
  lectura: number | null;
  motivo: string | null;
  descripcion: string | null;
  consumo: number;
  promedio: number;
  anomalia: boolean;
  confirmoAnomalia: boolean;
  fotoUri: string | null;
  tecnicoCodigo: string;
  creadoEn: string;
  estadoSync: EstadoSync;
  error?: string;
}

/** Campos que se guardan mientras el técnico llena el formulario (R8). */
export interface FormLectura {
  estado: EstadoMedidor | null;
  fechaLectura: string;
  lectura: string;
  motivo: string;
  descripcion: string;
  fotoUri: string | null;
  confirmoAnomalia: boolean;
}

export interface BorradorLectura extends FormLectura {
  codigo: string;
  actualizadoEn: string;
}
