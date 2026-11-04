/**
 * Indicador de seguridad de la contraseña.
 *
 * Regla sencilla, sin requisitos ocultos: mientras más largo y variado sea el
 * texto, más alto es el nivel. Se usa en Registro y en Cambiar contraseña.
 */

export type NivelClave = 'debil' | 'media' | 'fuerte';

export interface ResultadoClave {
  nivel: NivelClave;
  etiqueta: string;
  porcentaje: number;
  sugerencia: string;
}

export function medirClave(clave: string): ResultadoClave {
  if (!clave) {
    return {
      nivel: 'debil',
      etiqueta: 'Débil',
      porcentaje: 0,
      sugerencia: 'Usa al menos 8 caracteres.',
    };
  }

  let puntos = 0;
  if (clave.length >= 8) puntos += 1;
  if (clave.length >= 12) puntos += 1;
  if (/[a-z]/.test(clave) && /[A-Z]/.test(clave)) puntos += 1;
  if (/\d/.test(clave)) puntos += 1;
  if (/[^A-Za-z0-9]/.test(clave)) puntos += 1;

  if (puntos <= 2) {
    return {
      nivel: 'debil',
      etiqueta: 'Débil',
      porcentaje: 33,
      sugerencia: 'Agrega mayúsculas, números o símbolos.',
    };
  }

  if (puntos <= 4) {
    return {
      nivel: 'media',
      etiqueta: 'Media',
      porcentaje: 66,
      sugerencia: 'Agrega un símbolo o unos caracteres más.',
    };
  }

  return {
    nivel: 'fuerte',
    etiqueta: 'Fuerte',
    porcentaje: 100,
    sugerencia: 'Contraseña difícil de adivinar.',
  };
}
