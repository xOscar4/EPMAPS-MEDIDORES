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
    codigo: "MED-100001",
    direccion: "Av. Amazonas N34-120 y Naciones Unidas",
    sector: "Iñaquito",
    cuenta: "0012345678",
    estado: "activo",
    ultimaLectura: 245,
    fechaUltimaLectura: "2026-09-12",
    promedioMensual: 18,
  },
  {
    codigo: "MED-100002",
    direccion: "Calle Los Nogales 45",
    sector: "Cumbayá",
    cuenta: "0012345679",
    estado: "activo",
    ultimaLectura: 132,
    fechaUltimaLectura: "2026-09-14",
    promedioMensual: 12,
  },
  {
    codigo: "MED-100003",
    direccion: "Pasaje El Río 12",
    sector: "Nono",
    cuenta: "0012345680",
    estado: "activo",
    ultimaLectura: 50,
    fechaUltimaLectura: "2026-09-10",
    promedioMensual: 8,
  },
  {
    codigo: "MED-100004",
    direccion: "Vía Lloa km 4",
    sector: "Lloa",
    cuenta: "0012345681",
    estado: "activo",
    ultimaLectura: 310,
    fechaUltimaLectura: "2026-09-08",
    promedioMensual: 20,
  },
  {
    codigo: "MED-100005",
    direccion: "Calle Principal, junto a la plaza",
    sector: "Pacto",
    cuenta: "0012345682",
    estado: "activo",
    ultimaLectura: 75,
    fechaUltimaLectura: "2026-09-11",
    promedioMensual: 10,
  },
  {
    codigo: "MED-100006",
    direccion: "Av. Central 8",
    sector: "Nanegalito",
    cuenta: "0012345683",
    estado: "activo",
    ultimaLectura: 420,
    fechaUltimaLectura: "2026-09-09",
    promedioMensual: 25,
  },
  {
    codigo: "MED-100007",
    direccion: "Calle Bolívar 23",
    sector: "Calacalí",
    cuenta: "0012345684",
    estado: "suspendido",
    ultimaLectura: 180,
    fechaUltimaLectura: "2026-09-13",
    promedioMensual: 15,
  },
  {
    codigo: "MED-100008",
    direccion: "Calle 3, La Carolina",
    sector: "La Carolina",
    cuenta: "0012345685",
    estado: "activo",
    ultimaLectura: 95,
    fechaUltimaLectura: "2026-09-15",
    promedioMensual: 11,
  },
  {
    codigo: "MED-100009",
    direccion: "Urbanización Las Acacias 77",
    sector: "Tumbaco",
    cuenta: "0012345686",
    estado: "activo",
    ultimaLectura: 210,
    fechaUltimaLectura: "2026-09-16",
    promedioMensual: 17,
  },
  {
    codigo: "MED-100010",
    direccion: "Avenida de los Shyris 44",
    sector: "Shyris",
    cuenta: "0012345687",
    estado: "activo",
    ultimaLectura: 170,
    fechaUltimaLectura: "2026-09-15",
    promedioMensual: 14,
  },
  {
    codigo: "MED-100011",
    direccion: "Parque Central, lote 9",
    sector: "San Antonio",
    cuenta: "0012345688",
    estado: "suspendido",
    ultimaLectura: 260,
    fechaUltimaLectura: "2026-09-12",
    promedioMensual: 19,
  },
  {
    codigo: "MED-100012",
    direccion: "Calle El Sauce 12-18",
    sector: "Quitumbe",
    cuenta: "0012345689",
    estado: "activo",
    ultimaLectura: 120,
    fechaUltimaLectura: "2026-09-18",
    promedioMensual: 13,
  },
  {
    codigo: "MED-100013",
    direccion: "Hacienda La Merced 5",
    sector: "Chiriboga",
    cuenta: "0012345690",
    estado: "activo",
    ultimaLectura: 365,
    fechaUltimaLectura: "2026-09-14",
    promedioMensual: 22,
  },
  {
    codigo: "MED-100014",
    direccion: "Calle La Pradera 66",
    sector: "Conocoto",
    cuenta: "0012345691",
    estado: "activo",
    ultimaLectura: 88,
    fechaUltimaLectura: "2026-09-17",
    promedioMensual: 9,
  },
  {
    codigo: "MED-100015",
    direccion: "Bulevar de los Pinos 34",
    sector: "Puembo",
    cuenta: "0012345692",
    estado: "suspendido",
    ultimaLectura: 295,
    fechaUltimaLectura: "2026-09-11",
    promedioMensual: 21,
  },
  {
    codigo: "MED-100016",
    direccion: "Jardines del Valle 128",
    sector: "Bellavista",
    cuenta: "0012345693",
    estado: "activo",
    ultimaLectura: 142,
    fechaUltimaLectura: "2026-09-19",
    promedioMensual: 12,
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

  if (process.argv.includes("--reset-lecturas")) {
    const lecturas = await pedir(`${base}/lecturas`);
    for (const lectura of lecturas) {
      await fetch(`${base}/lecturas/${lectura.id}`, { method: "DELETE" });
    }
    console.log(`Lecturas eliminadas: ${lecturas.length}`);
  }

  const existentes = await pedir(`${base}/medidores`);

  for (const medidor of medidores) {
    const actual = existentes.find((item) => item.codigo === medidor.codigo);
    if (actual) {
      await pedir(`${base}/medidores/${actual.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(medidor),
      });
      console.log(`Actualizado ${medidor.codigo}`);
    } else {
      await pedir(`${base}/medidores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(medidor),
      });
      console.log(`Creado ${medidor.codigo}`);
    }
  }

  const final = await pedir(`${base}/medidores`);
  const lecturas = await pedir(`${base}/lecturas`);
  console.log(`Medidores en MockAPI: ${final.length}`);
  console.log(`Lecturas en MockAPI: ${lecturas.length}`);
} catch (error) {
  console.error("No se pudo preparar MockAPI:", error.message);
  process.exit(1);
}
