const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const MESES_LARGOS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

/** Convierte 2026-09-12 en "12 sep 2026". */
export function formatearFecha(iso: string): string {
  const [anio, mes, dia] = iso.slice(0, 10).split('-').map(Number);
  if (!anio || !mes || !dia) return iso;
  return `${dia} ${MESES[mes - 1]} ${anio}`;
}

/** Convierte una fecha ISO completa en "12 sep 2026 · 14:30". */
export function formatearFechaHora(iso: string): string {
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return iso;
  const hora = `${String(fecha.getHours()).padStart(2, '0')}:${String(fecha.getMinutes()).padStart(2, '0')}`;
  return `${formatearFecha(iso)} · ${hora}`;
}

/** Formato de números con coma decimal, sin depender de Intl. */
export function formatearNumero(valor: number, decimales = 1): string {
  if (!Number.isFinite(valor)) return '0';
  const redondeado = Number(valor.toFixed(decimales));
  const [entero, decimal] = String(redondeado).split('.');
  const miles = entero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return decimal ? `${miles},${decimal}` : miles;
}

/** Periodo mensual usado para impedir duplicados (R10). */
export function periodoActual(fecha = new Date()): string {
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
}

/** Convierte 2026-10 en \"octubre 2026\" para el historial. */
export function formatearPeriodo(periodo: string): string {
  const [anio, mes] = periodo.split('-').map(Number);
  if (!anio || !mes) return periodo;
  const nombre = MESES_LARGOS[mes - 1] ?? periodo;
  return `${nombre.charAt(0).toUpperCase()}${nombre.slice(1)} ${anio}`;
}

/** Texto del encabezado: "Lunes, 26 de octubre". */
export function fechaLarga(fecha = new Date()): string {
  const dia = DIAS[fecha.getDay()];
  return `${dia.charAt(0).toUpperCase()}${dia.slice(1)}, ${fecha.getDate()} de ${MESES_LARGOS[fecha.getMonth()]}`;
}

export function saludo(fecha = new Date()): string {
  const hora = fecha.getHours();
  if (hora < 12) return 'Buenos días';
  if (hora < 19) return 'Buenas tardes';
  return 'Buenas noches';
}
