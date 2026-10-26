import * as local from './mockApiLocal';
import * as remoto from './mockApiRemote';

export { ApiError } from './apiError';
export type { ApiErrorCode } from './apiError';

/**
 * Fachada del sistema de la oficina.
 *
 * Con EXPO_PUBLIC_MOCKAPI_URL definida se usa MockAPI; sin ella se usa el
 * mock local, que permite trabajar completamente sin internet.
 */
export const usaMockApiRemoto = Boolean(process.env.EXPO_PUBLIC_MOCKAPI_URL);

/** El login sigue siendo local: el mock no expone credenciales por HTTP. */
export const login = local.login;

export const getRuta = usaMockApiRemoto ? remoto.getRuta : local.getRuta;
export const getMedidor = usaMockApiRemoto ? remoto.getMedidor : local.getMedidor;
export const getLecturasEnviadas = usaMockApiRemoto
  ? remoto.getLecturasEnviadas
  : local.getLecturasEnviadas;
export const enviarLectura = usaMockApiRemoto ? remoto.enviarLectura : local.enviarLectura;
