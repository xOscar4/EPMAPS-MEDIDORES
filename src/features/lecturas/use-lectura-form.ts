import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

import type { BorradorLectura, FormLectura, LecturaLocal } from '@/types/models';
import {
  consumoDe,
  esConsumoAnomalo,
  hayDatos,
  numeroDesdeTexto,
  validarFormulario,
} from '@/utils/validators';
import { useAuth } from '@/features/auth/auth-provider';
import { useMedidor } from '@/features/medidores/hooks';
import { borrarBorrador, guardarBorrador, leerBorrador, limpiarBorrador } from './draft';
import { persistirLectura, type ResultadoGuardado } from './guardar-lectura';
import { useHistorial } from './hooks';
import { useOutbox } from './outbox-provider';

const VACIO: FormLectura = {
  estado: null,
  lectura: '',
  motivo: '',
  descripcion: '',
  fotoUri: null,
  confirmoAnomalia: false,
};

const desdeLectura = (lectura: LecturaLocal): FormLectura => ({
  estado: lectura.estadoMedidor,
  lectura: lectura.lectura !== null ? String(lectura.lectura) : '',
  motivo: lectura.motivo ?? '',
  descripcion: lectura.descripcion ?? '',
  fotoUri: lectura.fotoUri,
  confirmoAnomalia: lectura.confirmoAnomalia,
});

export function useLecturaForm(codigo: string, lecturaId?: string, continuar?: boolean) {
  const { tecnico } = useAuth();
  const { lecturas, cargando: cargandoOutbox, guardar, actualizar } = useOutbox();
  const medidorQuery = useMedidor(codigo);
  const { data: historial = [] } = useHistorial();
  const [form, setForm] = useState<FormLectura>(VACIO);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [cargando, setCargando] = useState(true);
  const [borrador, setBorrador] = useState<BorradorLectura | null>(null);
  const [guardando, setGuardando] = useState(false);
  const inicializado = useRef(false);
  const guardadoOk = useRef(false);

  const existente = lecturas.find((item) => item.id === lecturaId);
  const noEncontrada = Boolean(lecturaId) && !cargandoOutbox && !existente;

  useEffect(() => {
    if (inicializado.current || cargandoOutbox) return;
    inicializado.current = true;
    void (async () => {
      if (existente) {
        setForm(desdeLectura(existente));
      } else if (!lecturaId) {
        const guardado = await leerBorrador();
        if (guardado?.codigo === codigo) {
          if (continuar) setForm(guardado);
          else setBorrador(guardado);
        }
      }
      setCargando(false);
    })();
  }, [cargandoOutbox, codigo, continuar, existente, lecturaId]);

  useEffect(() => {
    if (guardadoOk.current || cargando || existente || borrador || !hayDatos(form)) return;
    const timer = setTimeout(() => {
      void guardarBorrador({ codigo, ...form, actualizadoEn: new Date().toISOString() });
    }, 250);
    return () => clearTimeout(timer);
  }, [form, codigo, cargando, existente, borrador]);

  // R8: si el usuario manda la app al fondo, se guarda de inmediato.
  useEffect(() => {
    if (guardadoOk.current || existente || !hayDatos(form)) return;
    const sub = AppState.addEventListener('change', (estado) => {
      if (estado === 'active') return;
      void guardarBorrador({ codigo, ...form, actualizadoEn: new Date().toISOString() });
    });
    return () => sub.remove();
  }, [form, codigo, existente]);

  const setCampo = <K extends keyof FormLectura>(campo: K, valor: FormLectura[K]) => {
    setForm((previo) => {
      const siguiente = { ...previo, [campo]: valor };
      if (campo === 'lectura' || campo === 'estado') siguiente.confirmoAnomalia = false;
      return siguiente;
    });
    const clave = campo === 'confirmoAnomalia' ? 'confirmacion' : campo === 'fotoUri' ? 'foto' : campo;
    setErrores((previos) => ({
      ...previos,
      [clave]: '',
      ...(campo === 'lectura' || campo === 'estado' ? { confirmacion: '' } : {}),
    }));
  };

  const lectura = form.estado === 'inaccesible' ? null : numeroDesdeTexto(form.lectura);
  const medidor = medidorQuery.data;
  const consumo = medidor && lectura !== null ? consumoDe(lectura, medidor.ultimaLectura) : 0;
  const anomalia =
    medidor && lectura !== null ? esConsumoAnomalo(consumo, medidor.promedioMensual) : false;
  const fotoRequerida = anomalia || form.estado === 'danado';

  const validar = () => {
    const encontrados = validarFormulario(form, fotoRequerida, anomalia);
    setErrores(encontrados);
    return Object.keys(encontrados).length === 0;
  };

  const guardarLectura = async (): Promise<ResultadoGuardado> => {
    if (!tecnico || !medidor) return { ok: false, mensaje: 'Faltan los datos del medidor.' };
    if (!validar()) return { ok: false, mensaje: 'Revisa los campos marcados.' };
    setGuardando(true);
    try {
      const resultado = await persistirLectura({
        codigo,
        form,
        medidor,
        tecnico,
        existente,
        lecturas,
        historial,
        guardar,
        actualizar,
      });
      if (resultado.ok) {
        guardadoOk.current = true;
        await limpiarBorrador();
      }
      return resultado;
    } catch {
      return { ok: false, mensaje: 'No se pudo guardar en el teléfono. Intenta de nuevo.' };
    } finally {
      setGuardando(false);
    }
  };

  const continuarBorrador = () => {
    if (!borrador) return;
    setForm(borrador);
    setBorrador(null);
  };

  const descartarBorrador = async () => {
    await borrarBorrador();
    setBorrador(null);
  };

  return {
    form,
    setCampo,
    errores,
    cargando: cargando || cargandoOutbox,
    guardando,
    medidor,
    medidorQuery,
    existente,
    noEncontrada,
    borrador,
    continuarBorrador,
    descartarBorrador,
    consumo,
    anomalia,
    fotoRequerida,
    guardarLectura,
  };
}
