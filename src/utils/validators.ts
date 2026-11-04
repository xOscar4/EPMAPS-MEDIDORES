import type { FormLectura } from "@/types/models";
import { fechaDesdeISO } from "@/utils/format";

/** R2: el código debe ser MED- y seis dígitos, ni más ni menos. */
export const CODIGO_REGEX = /^MED-\d{6}$/;

export function normalizarCodigo(valor: string): string {
  return valor.trim().toUpperCase().replace(/\s+/g, "");
}

export function esCodigoValido(valor: string): boolean {
  return CODIGO_REGEX.test(normalizarCodigo(valor));
}

/** Acepta coma o punto decimal: 123,4 y 123.4 son la misma lectura. */
export function numeroDesdeTexto(valor: string): number | null {
  if (!valor.trim()) return null;
  const numero = Number(valor.trim().replace(",", "."));
  return Number.isFinite(numero) ? numero : null;
}

export function esLecturaValida(valor: string): boolean {
  return /^\d{1,7}([.,]\d{1,3})?$/.test(valor.trim());
}

/** El medidor puede marcar menos que el mes anterior por un cambio de equipo. */
export function consumoDe(actual: number, anterior: number): number {
  return Math.max(0, Number((actual - anterior).toFixed(2)));
}

/** Una lectura menor a la anterior solo es válida si cambiaron el medidor. */
export function esLecturaMenor(actual: number, anterior: number): boolean {
  return actual < anterior;
}

/** R6: más del triple del promedio mensual se considera anómalo. */
export function esConsumoAnomalo(consumo: number, promedio: number): boolean {
  if (promedio <= 0) return consumo > 0;
  return consumo > promedio * 3;
}

export function hayDatos(form: FormLectura): boolean {
  return Boolean(
    form.estado ||
    form.fechaLectura ||
    form.lectura ||
    form.motivo ||
    form.descripcion ||
    form.fotoUri,
  );
}

export function esFechaValida(fecha: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha ?? "")) return false;
  const [anio, mes, dia] = fecha.split("-").map(Number);
  const fechaLocal = new Date(anio, mes - 1, dia);
  return (
    fechaLocal.getFullYear() === anio &&
    fechaLocal.getMonth() === mes - 1 &&
    fechaLocal.getDate() === dia
  );
}

export function esFechaLecturaValida(
  fecha: string,
  ultimaLectura?: string,
): boolean {
  if (!esFechaValida(fecha)) return false;
  if (!ultimaLectura) return true;
  const elegida = fechaDesdeISO(fecha);
  const ultima = fechaDesdeISO(ultimaLectura);
  return elegida >= ultima;
}

/** R5, R6 y R7: reglas del formulario en una función pura y fácil de probar. */
export function validarFormulario(
  form: FormLectura,
  fotoRequerida: boolean,
  anomalia: boolean,
  lecturaMenor = false,
  ultimaLectura?: string,
): Record<string, string> {
  const errores: Record<string, string> = {};

  if (!form.estado) {
    errores.estado = "Selecciona el estado del medidor.";
    return errores;
  }

  if (!esFechaValida(form.fechaLectura)) {
    errores.fechaLectura = "Selecciona una fecha válida para la lectura.";
    return errores;
  }

  if (
    ultimaLectura &&
    !esFechaLecturaValida(form.fechaLectura, ultimaLectura)
  ) {
    errores.fechaLectura =
      "La fecha de la lectura no puede ser anterior a la última lectura registrada.";
  }

  if (form.estado === "normal") {
    if (!form.lectura.trim()) errores.lectura = "La lectura es obligatoria.";
    else if (!esLecturaValida(form.lectura))
      errores.lectura = "Ingresa un número válido.";
  }

  if (form.estado === "inaccesible" && form.motivo.trim().length < 3) {
    errores.motivo = "Describe el motivo (mínimo 3 caracteres).";
  }

  if (form.estado === "danado") {
    if (form.descripcion.trim().length < 3) {
      errores.descripcion = "Describe el daño (mínimo 3 caracteres).";
    }
    if (form.lectura.trim() && !esLecturaValida(form.lectura)) {
      errores.lectura = "La lectura debe ser numérica.";
    }
  }

  if (anomalia && !form.confirmoAnomalia) {
    errores.confirmacion = "Confirma que revisaste el medidor.";
  }

  // El medidor no puede retroceder: solo se acepta si lo reemplazaron.
  if (lecturaMenor && !anomalia && !form.confirmoAnomalia) {
    errores.confirmacion = "Confirma que el medidor fue reemplazado.";
  }

  if (fotoRequerida && !form.fotoUri) {
    errores.foto = "La foto es obligatoria en este caso.";
  }

  return errores;
}
