import type {
    FormLectura,
    LecturaLocal,
    LecturaServidor,
    Medidor,
    Tecnico,
} from "@/types/models";
import { fechaDesdeISO, fechaISO, periodoDeFecha } from "@/utils/format";
import {
    consumoDe,
    esConsumoAnomalo,
    esLecturaMenor,
    numeroDesdeTexto,
} from "@/utils/validators";
import { borrarFoto } from "./foto";

interface Argumentos {
  codigo: string;
  form: FormLectura;
  medidor: Medidor;
  tecnico: Tecnico;
  existente?: LecturaLocal;
  lecturas: LecturaLocal[];
  historial: LecturaServidor[];
  guardar: (lectura: LecturaLocal) => Promise<void>;
  actualizar: (id: string, cambios: Partial<LecturaLocal>) => Promise<void>;
}

export interface ResultadoGuardado {
  ok: boolean;
  mensaje?: string;
}

/** Convierte el formulario en una lectura del outbox o actualiza la pendiente. */
export async function persistirLectura({
  codigo,
  form,
  medidor,
  tecnico,
  existente,
  lecturas,
  historial,
  guardar,
  actualizar,
}: Argumentos): Promise<ResultadoGuardado> {
  if (!form.estado)
    return { ok: false, mensaje: "Selecciona el estado del medidor." };

  const lectura =
    form.estado === "inaccesible" ? null : numeroDesdeTexto(form.lectura);
  if (form.estado === "normal" && lectura === null) {
    return {
      ok: false,
      mensaje: "La lectura es obligatoria para un medidor normal.",
    };
  }

  const consumo =
    lectura !== null ? consumoDe(lectura, medidor.ultimaLectura) : 0;
  const anomalia =
    lectura !== null
      ? esConsumoAnomalo(consumo, medidor.promedioMensual)
      : false;
  const lecturaMenor =
    lectura !== null ? esLecturaMenor(lectura, medidor.ultimaLectura) : false;
  const requiereConfirmacion = anomalia || lecturaMenor;
  const fechaLectura = form.fechaLectura || fechaISO(new Date());
  const periodo = periodoDeFecha(fechaLectura);

  if (
    medidor.fechaUltimaLectura &&
    fechaDesdeISO(fechaLectura).getTime() <
      fechaDesdeISO(medidor.fechaUltimaLectura).getTime()
  ) {
    return {
      ok: false,
      mensaje:
        "La fecha de la lectura no puede ser anterior a la última lectura registrada.",
    };
  }

  const repetida =
    lecturas.find(
      (item) =>
        item.medidorCodigo === codigo &&
        (item.fecha === fechaLectura || item.periodo === periodo) &&
        item.id !== existente?.id,
    ) ??
    historial.find(
      (item) =>
        item.medidorCodigo === codigo &&
        (item.fecha === fechaLectura || item.periodo === periodo) &&
        item.id !== existente?.id,
    );

  if (repetida) {
    return {
      ok: false,
      mensaje:
        "Este medidor ya tiene una lectura registrada en esta fecha o mes.",
    };
  }

  const base: Omit<
    LecturaLocal,
    "id" | "idempotencia" | "creadoEn" | "estadoSync"
  > = {
    medidorCodigo: codigo,
    fecha: fechaLectura,
    periodo,
    estadoMedidor: form.estado,
    lectura,
    motivo: form.estado === "inaccesible" ? form.motivo.trim() : null,
    descripcion: form.estado === "danado" ? form.descripcion.trim() : null,
    consumo,
    promedio: medidor.promedioMensual,
    anomalia,
    confirmoAnomalia: requiereConfirmacion ? form.confirmoAnomalia : false,
    fotoUri: form.fotoUri,
    tecnicoCodigo: tecnico.codigo,
  };

  if (existente) {
    if (existente.fotoUri && existente.fotoUri !== form.fotoUri) {
      await borrarFoto(existente.fotoUri);
    }
    await actualizar(existente.id, {
      ...base,
      estadoSync: "pendiente",
      error: undefined,
    });
    return { ok: true };
  }

  const ahora = Date.now();
  await guardar({
    ...base,
    id: `loc-${ahora}`,
    idempotencia: `${codigo}-${periodo}-${ahora}-${Math.random().toString(36).slice(2, 8)}`,
    creadoEn: new Date(ahora).toISOString(),
    estadoSync: "pendiente",
  });
  return { ok: true };
}
