import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { login } from '@/services/auth';
import { asyncStoragePersister, queryClient } from '@/services/queryClient';
import type { Tecnico } from '@/types/models';
import { borrarSesion, guardarSesion, leerSesion } from './session';

interface AuthContexto {
  tecnico: Tecnico | null;
  cargando: boolean;
  iniciarSesion: (codigo: string, clave: string) => Promise<void>;
  cerrarSesion: () => Promise<void>;
}

const AuthContext = createContext<AuthContexto | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [tecnico, setTecnico] = useState<Tecnico | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    leerSesion()
      .then(setTecnico)
      .finally(() => setCargando(false));
  }, []);

  const iniciarSesion = useCallback(async (codigo: string, clave: string) => {
    const usuario = await login(codigo, clave);
    await guardarSesion(usuario);
    setTecnico(usuario);
  }, []);

  const cerrarSesion = useCallback(async () => {
    await borrarSesion();
    queryClient.clear();
    await asyncStoragePersister.removeClient();
    setTecnico(null);
  }, []);

  const valor = useMemo(
    () => ({ tecnico, cargando, iniciarSesion, cerrarSesion }),
    [tecnico, cargando, iniciarSesion, cerrarSesion],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContexto {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return contexto;
}
