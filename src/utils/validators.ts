import type { FormLectura } from '@/types/models';

/** R2: el código debe ser MED- y seis dígitos, ni más ni menos. */
export const CODIGO_REGEX = /^MED-\d{6}$/;

export function normalizarCodigo(valor: string): string {
  return valor.trim().toUpperCase().replace(/\s+/g, '');
}

export function esCodigoValido(valor: string): boolean {
  return CODIGO_REGEX.test(normalizarCodigo(valor));
}

/** Acepta coma o punto decimal: 123,4 y 123.4 son la misma lectura. */
export function numeroDesdeTexto(valor: string): number | null {
  if (!valor.trim()) return null;
  const numero = Number(valor.trim().replace(',', '.'));
  return Number.isFinite(numero) ? numero : null;
}

export function esLecturaValida(valor: string): boolean {
  return /^\d{1,7}([.,]\d{1,3})?$/.test(valor.trim());
}

/** El medidor puede marcar menos que el mes anterior por un cambio de equipo. */
export function consumoDe(actual: number, anterior: number): number {
  return Math.max(0, Number((actual - anterior).toFixed(2)));
}

/** R6: más del triple del promedio mensual se considera anómalo. */
export function esConsumoAnomalo(consumo: number, promedio: number): boolean {
  if (promedio <= 0) return consumo > 0;
  return consumo > promedio * 3;
}

export function hayDatos(form: FormLectura): boolean {
  return Boolean(
    form.estado || form.lectura || form.motivo || form.descripcion || form.fotoUri,
  );
}

/** R5, R6 y R7: reglas del formulario en una función pura y fácil de probar. */
export function validarFormulario(
  form: FormLectura,
  fotoRequerida: boolean,
  anomalia: boolean,
): Record<string, string> {
  const errores: Record<string, string> = {};

  if (!form.estado) {
    errores.estado = 'Selecciona el estado del medidor.';
    return errores;
  }

  if (form.estado === 'normal') {
    if (!form.lectura.trim()) errores.lectura = 'La lectura es obligatoria.';
    else if (!esLecturaValida(form.lectura)) errores.lectura = 'Ingresa un número válido.';
  }

  if (form.estado === 'inaccesible' && form.motivo.trim().length < 3) {
    errores.motivo = 'Describe el motivo (mínimo 3 caracteres).';
  }

  if (form.estado === 'danado') {
    if (form.descripcion.trim().length < 3) {
      errores.descripcion = 'Describe el daño (mínimo 3 caracteres).';
    }
    if (form.lectura.trim() && !esLecturaValida(form.lectura)) {
      errores.lectura = 'La lectura debe ser numérica.';
    }
  }

  if (anomalia && !form.confirmoAnomalia) {
    errores.confirmacion = 'Confirma que revisaste el medidor.';
  }

  if (fotoRequerida && !form.fotoUri) {
    errores.foto = 'La foto es obligatoria en este caso.';
  }

  return errores;
}
