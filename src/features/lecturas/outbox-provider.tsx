import { useQueryClient } from '@tanstack/react-query';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AppState } from 'react-native';

import { useNetworkStatus } from '@/hooks/use-network-status';
import type { LecturaLocal } from '@/types/models';
import { borrarFoto } from './foto';
import {
  actualizarLectura,
  agregarLectura,
  eliminarLectura,
  leerOutbox,
} from './outbox';
import { sincronizarCola } from './sync';

interface OutboxContexto {
  lecturas: LecturaLocal[];
  pendientes: number;
  conError: number;
  cargando: boolean;
  sincronizando: boolean;
  ultimoError: string | null;
  guardar: (lectura: LecturaLocal) => Promise<void>;
  actualizar: (id: string, cambios: Partial<LecturaLocal>) => Promise<void>;
  eliminar: (id: string) => Promise<void>;
  sincronizar: () => Promise<void>;
  refrescar: () => Promise<void>;
}

const OutboxContext = createContext<OutboxContexto | null>(null);

export function OutboxProvider({ children }: { children: React.ReactNode }) {
  const [lecturas, setLecturas] = useState<LecturaLocal[]>([]);
  const [cargando, setCargando] = useState(true);
  const [sincronizando, setSincronizando] = useState(false);
  const [ultimoError, setUltimoError] = useState<string | null>(null);
  const enCurso = useRef(false);
  const onlineRef = useRef(true);
  const yaSincronizo = useRef(false);
  const queryClient = useQueryClient();
  const { online } = useNetworkStatus();

  useEffect(() => {
    onlineRef.current = online;
    if (!online) yaSincronizo.current = false;
  }, [online]);

  const refrescar = useCallback(async () => {
    setLecturas(await leerOutbox());
    setCargando(false);
  }, []);

  const sincronizar = useCallback(async () => {
    if (enCurso.current || !onlineRef.current) return;
    enCurso.current = true;
    setSincronizando(true);
    setUltimoError(null);
    try {
      const resultado = await sincronizarCola();
      setLecturas(resultado.items);
      if (resultado.enviadas > 0) {
        await queryClient.invalidateQueries({ queryKey: ['lecturas'] });
        await queryClient.invalidateQueries({ queryKey: ['medidores'] });
      }
      if (resultado.falloRed) {
        setUltimoError('No se pudo enviar. Se reintentará al recuperar la conexión.');
      } else if (resultado.errores > 0) {
        setUltimoError('Algunas lecturas necesitan revisión en el historial.');
      }
    } catch {
      setUltimoError('No se pudo sincronizar. Intenta de nuevo.');
    } finally {
      enCurso.current = false;
      setSincronizando(false);
    }
  }, [queryClient]);

  const programarEnvio = useCallback(() => {
    if (!onlineRef.current) return;
    setTimeout(() => void sincronizar(), 600);
  }, [sincronizar]);

  const guardar = useCallback(
    async (lectura: LecturaLocal) => {
      setLecturas(await agregarLectura(lectura));
      programarEnvio();
    },
    [programarEnvio],
  );

  const actualizar = useCallback(
    async (id: string, cambios: Partial<LecturaLocal>) => {
      setLecturas(await actualizarLectura(id, cambios));
      programarEnvio();
    },
    [programarEnvio],
  );

  const eliminar = useCallback(async (id: string) => {
    const item = (await leerOutbox()).find((lectura) => lectura.id === id);
    if (item?.fotoUri) await borrarFoto(item.fotoUri);
    setLecturas(await eliminarLectura(id));
    setUltimoError(null);
  }, []);

  useEffect(() => {
    void refrescar();
  }, [refrescar]);

  useEffect(() => {
    if (cargando || !online || yaSincronizo.current) return;
    yaSincronizo.current = true;
    const timer = setTimeout(() => void sincronizar(), 800);
    return () => clearTimeout(timer);
  }, [cargando, online, sincronizar]);

  const pendientes = lecturas.filter((item) => item.estadoSync !== 'error').length;
  const conError = lecturas.length - pendientes;

  /**
   * R9: si un envío falla (por ejemplo, la red vuelve pero aún no responde),
   * se reintenta solo cada 20 segundos. Antes solo se intentaba al recuperar
   * la conexión una vez, así que un fallo dejaba la cola detenida.
   */
  useEffect(() => {
    if (!online || pendientes === 0) return;
    const timer = setInterval(() => void sincronizar(), 20000);
    return () => clearInterval(timer);
  }, [online, pendientes, sincronizar]);

  /** Al volver a la app desde segundo plano también se intenta sincronizar. */
  useEffect(() => {
    const sub = AppState.addEventListener('change', (estado) => {
      if (estado === 'active' && onlineRef.current) void sincronizar();
    });
    return () => sub.remove();
  }, [sincronizar]);

  const valor = useMemo(
    () => ({
      lecturas,
      pendientes,
      conError,
      cargando,
      sincronizando,
      ultimoError,
      guardar,
      actualizar,
      eliminar,
      sincronizar,
      refrescar,
    }),
    [lecturas, pendientes, conError, cargando, sincronizando, ultimoError, guardar, actualizar, eliminar, sincronizar, refrescar],
  );

  return <OutboxContext.Provider value={valor}>{children}</OutboxContext.Provider>;
}

export function useOutbox(): OutboxContexto {
  const contexto = useContext(OutboxContext);
  if (!contexto) throw new Error('useOutbox debe usarse dentro de OutboxProvider');
  return contexto;
}
