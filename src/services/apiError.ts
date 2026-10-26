/** Códigos de error comunes al mock local y a MockAPI. */
export type ApiErrorCode = 'CREDENCIALES' | 'NO_ENCONTRADO' | 'DUPLICADA' | 'RED';

export class ApiError extends Error {
  constructor(public codigo: ApiErrorCode, mensaje: string) {
    super(mensaje);
    this.name = 'ApiError';
  }
}
