import type { Medidor, Tecnico } from '@/types/models';

/** Credenciales de la prueba. En producción vendrían del sistema de la oficina. */
export const CREDENCIALES = { codigo: 'EMP-001', clave: 'epmaps2026' } as const;

export const TECNICO_DEMO: Tecnico = {
  codigo: CREDENCIALES.codigo,
  nombre: 'Andrea Salazar',
  zona: 'Ruta Norte · Pichincha',
};

/** Ruta simulada: incluye casos normales, dañado, inaccesible y anómalo. */
export const MEDIDORES: Medidor[] = [
  {
    codigo: 'MED-100001',
    direccion: 'Av. Amazonas N34-120 y Naciones Unidas',
    sector: 'Iñaquito',
    cuenta: '0012345678',
    estado: 'activo',
    ultimaLectura: 245,
    fechaUltimaLectura: '2026-09-12',
    promedioMensual: 18,
  },
  {
    codigo: 'MED-100002',
    direccion: 'Calle Los Nogales 45',
    sector: 'Cumbayá',
    cuenta: '0012345679',
    estado: 'activo',
    ultimaLectura: 132,
    fechaUltimaLectura: '2026-09-14',
    promedioMensual: 12,
  },
  {
    codigo: 'MED-100003',
    direccion: 'Pasaje El Río 12',
    sector: 'Nono',
    cuenta: '0012345680',
    estado: 'activo',
    ultimaLectura: 50,
    fechaUltimaLectura: '2026-09-10',
    promedioMensual: 8,
  },
  {
    codigo: 'MED-100004',
    direccion: 'Vía Lloa km 4',
    sector: 'Lloa',
    cuenta: '0012345681',
    estado: 'activo',
    ultimaLectura: 310,
    fechaUltimaLectura: '2026-09-08',
    promedioMensual: 20,
  },
  {
    codigo: 'MED-100005',
    direccion: 'Calle Principal, junto a la plaza',
    sector: 'Pacto',
    cuenta: '0012345682',
    estado: 'activo',
    ultimaLectura: 75,
    fechaUltimaLectura: '2026-09-11',
    promedioMensual: 10,
  },
  {
    codigo: 'MED-100006',
    direccion: 'Av. Central 8',
    sector: 'Nanegalito',
    cuenta: '0012345683',
    estado: 'activo',
    ultimaLectura: 420,
    fechaUltimaLectura: '2026-09-09',
    promedioMensual: 25,
  },
  {
    codigo: 'MED-100007',
    direccion: 'Calle Bolívar 23',
    sector: 'Calacalí',
    cuenta: '0012345684',
    estado: 'suspendido',
    ultimaLectura: 180,
    fechaUltimaLectura: '2026-09-13',
    promedioMensual: 15,
  },
  {
    codigo: 'MED-100008',
    direccion: 'Calle 3, La Carolina',
    sector: 'La Carolina',
    cuenta: '0012345685',
    estado: 'activo',
    ultimaLectura: 95,
    fechaUltimaLectura: '2026-09-15',
    promedioMensual: 11,
  },
];
