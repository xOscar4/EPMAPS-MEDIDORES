/**
 * Carga los medidores de demostración en el proyecto de MockAPI.
 *
 * Uso:
 *   node scripts/seed-mockapi.mjs
 *   node scripts/seed-mockapi.mjs --reset-lecturas
 *
 * La URL se puede cambiar con la variable MOCKAPI_URL.
 */
const base = (
  process.env.MOCKAPI_URL ?? "https://6ade67884e88f1bba4a5218d.mockapi.io"
).replace(/\/$/, "");

const medidores = [
  {
    codigo: "MED-000001",
    direccion: "Av. Los Alisos 101",
    sector: "Centro Norte",
    cuenta: "0000000001",
    estado: "activo",
    ultimaLectura: 145,
    fechaUltimaLectura: "2026-10-01",
    promedioMensual: 18,
  },
  {
    codigo: "MED-000002",
    direccion: "Calle San Martín 22",
    sector: "San Pedro",
    cuenta: "0000000002",
    estado: "activo",
    ultimaLectura: 180,
    fechaUltimaLectura: "2026-10-02",
    promedioMensual: 20,
  },
  {
    codigo: "MED-000003",
    direccion: "Pasaje El Sol 14",
    sector: "La Floresta",
    cuenta: "0000000003",
    estado: "activo",
    ultimaLectura: 205,
    fechaUltimaLectura: "2026-10-03",
    promedioMensual: 22,
  },
  {
    codigo: "MED-000004",
    direccion: "Vía La Esperanza 44",
    sector: "El Bosque",
    cuenta: "0000000004",
    estado: "suspendido",
    ultimaLectura: 130,
    fechaUltimaLectura: "2026-10-04",
    promedioMensual: 16,
  },
  {
    codigo: "MED-000005",
    direccion: "Calle de las Flores 76",
    sector: "Los Pinos",
    cuenta: "0000000005",
    estado: "activo",
    ultimaLectura: 220,
    fechaUltimaLectura: "2026-10-05",
    promedioMensual: 24,
  },
  {
    codigo: "MED-000006",
    direccion: "Avenida Libertad 89",
    sector: "Las Acacias",
    cuenta: "0000000006",
    estado: "activo",
    ultimaLectura: 260,
    fechaUltimaLectura: "2026-10-06",
    promedioMensual: 26,
  },
  {
    codigo: "MED-000007",
    direccion: "Calle Rumiñahui 15",
    sector: "Puembo",
    cuenta: "0000000007",
    estado: "activo",
    ultimaLectura: 170,
    fechaUltimaLectura: "2026-10-07",
    promedioMensual: 19,
  },
  {
    codigo: "MED-000008",
    direccion: "Jardín del Valle 28",
    sector: "Bellavista",
    cuenta: "0000000008",
    estado: "activo",
    ultimaLectura: 195,
    fechaUltimaLectura: "2026-10-08",
    promedioMensual: 21,
  },
];

async function pedir(url, opciones) {
  const res = await fetch(url, opciones);
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}: ${url}`);
  }
  return res.json();
}

try {
  console.log(`MockAPI: ${base}`);

  const existentes = await pedir(`${base}/medidores`);
  for (const medidor of existentes) {
    await fetch(`${base}/medidores/${medidor.id}`, { method: "DELETE" });
  }
  console.log(`Medidores eliminados: ${existentes.length}`);

  const lecturas = await pedir(`${base}/lecturas`);
  for (const lectura of lecturas) {
    await fetch(`${base}/lecturas/${lectura.id}`, { method: "DELETE" });
  }
  console.log(`Lecturas eliminadas: ${lecturas.length}`);

  for (const medidor of medidores) {
    await pedir(`${base}/medidores`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(medidor),
    });
    console.log(`Creado ${medidor.codigo}`);
  }

  const final = await pedir(`${base}/medidores`);
  const lecturasFinales = await pedir(`${base}/lecturas`);
  console.log(`Medidores en MockAPI: ${final.length}`);
  console.log(`Lecturas en MockAPI: ${lecturasFinales.length}`);
} catch (error) {
  console.error("No se pudo preparar MockAPI:", error.message);
  process.exit(1);
}
