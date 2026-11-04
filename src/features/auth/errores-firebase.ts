/**
 * Traduce los códigos de error de Firebase Auth a mensajes claros en español.
 * Cada pantalla puede reemplazar un código cuando allí significa otra cosa.
 */
import { FirebaseError } from 'firebase/app';

const mensajes: Record<string, string> = {
  // Firebase ya no distingue entre correo inexistente y contraseña incorrecta:
  // ambos casos llegan como auth/invalid-credential.
  'auth/invalid-credential':
    'El correo o la contraseña no coinciden. Revisa los datos e inténtalo de nuevo.',
  'auth/wrong-password':
    'El correo o la contraseña no coinciden. Revisa los datos e inténtalo de nuevo.',
  'auth/user-not-found':
    'El correo o la contraseña no coinciden. Revisa los datos e inténtalo de nuevo.',
  'auth/invalid-email':
    'El correo no tiene un formato válido. Ejemplo: nombre.apellido@epn.edu.ec',
  'auth/missing-email': 'Escribe tu correo para continuar.',
  'auth/missing-password': 'Escribe tu contraseña para continuar.',
  'auth/email-already-in-use':
    'Ya existe una cuenta con ese correo. Inicia sesión o recupera tu contraseña.',
  'auth/weak-password': 'La contraseña es muy débil. Usa al menos 8 caracteres.',
  'auth/password-does-not-meet-requirements':
    'La contraseña no cumple la política del proyecto. Combina mayúsculas, minúsculas y números.',
  'auth/too-many-requests':
    'Hubo demasiados intentos seguidos. Espera unos minutos y vuelve a intentarlo.',
  'auth/network-request-failed':
    'No hay conexión con Firebase. Revisa tu internet e inténtalo otra vez.',
  'auth/requires-recent-login':
    'Por seguridad, cierra sesión, vuelve a ingresar y repite el cambio.',
  'auth/user-disabled':
    'Esta cuenta fue deshabilitada. Comunícate con el administrador.',
  // Suele aparecer cuando falta habilitar el proveedor en la consola.
  'auth/operation-not-allowed':
    'El acceso con correo y contraseña no está habilitado en la consola de Firebase.',
  'auth/invalid-api-key':
    'La configuración de Firebase no es válida. Revisa el archivo .env.local.',
};

export function mensajeDeError(
  error: unknown,
  reemplazos: Record<string, string> = {},
): string {
  if (error instanceof FirebaseError) {
    if (reemplazos[error.code]) return reemplazos[error.code];
    if (mensajes[error.code]) return mensajes[error.code];
    if (error.code.startsWith('auth/api-key-not-valid')) {
      return mensajes['auth/invalid-api-key'];
    }
    // Para errores no previstos mostramos el código: ayuda a depurar.
    return `No se pudo completar la operación (${error.code}).`;
  }
  return 'Ocurrió un error inesperado. Inténtalo de nuevo.';
}
