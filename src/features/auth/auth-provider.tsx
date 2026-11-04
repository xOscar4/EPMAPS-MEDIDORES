/**
 * Contexto de sesión: el único lugar de la app que habla con Firebase Auth.
 *
 * Las pantallas no importan Firebase directamente; llaman a las funciones de
 * este contexto. Así la lógica de autenticación queda separada de la interfaz.
 */
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
  type User,
} from 'firebase/auth';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { auth } from '@/config/firebase';
import { asyncStoragePersister, queryClient } from '@/services/queryClient';
import type { Tecnico } from '@/types/models';

/** Zona operativa que ya mostraba la aplicación antes de Firebase. */
const ZONA_POR_DEFECTO = 'Ruta Norte · Pichincha';

interface AuthContexto {
  /** Usuario de Firebase, o null si nadie ha iniciado sesión. */
  usuario: User | null;
  /** Perfil compatible con las pantallas existentes (solo si el correo está verificado). */
  tecnico: Tecnico | null;
  /** Nombre del perfil, siempre actualizado tras updateProfile. */
  nombre: string | null;
  correo: string | null;
  emailVerificado: boolean;
  /** true mientras Firebase revisa si hay una sesión guardada. */
  cargando: boolean;
  iniciarSesion: (correo: string, clave: string) => Promise<void>;
  registrarse: (nombre: string, correo: string, clave: string) => Promise<void>;
  enviarCorreoRecuperacion: (correo: string) => Promise<void>;
  enviarVerificacion: () => Promise<void>;
  /** Recarga el perfil desde Firebase y devuelve si el correo ya está verificado. */
  recargarUsuario: () => Promise<boolean>;
  actualizarNombre: (nombre: string) => Promise<void>;
  cambiarClave: (claveActual: string, claveNueva: string) => Promise<void>;
  cerrarSesion: () => Promise<void>;
}

const AuthContext = createContext<AuthContexto | null>(null);

/** El correo sirve como código cuando el perfil no trae displayName. */
function nombreDesdeUsuario(usuario: User): string | null {
  if (usuario.displayName) return usuario.displayName;
  return usuario.email ? usuario.email.split('@')[0] : null;
}

/** El código de técnico se deriva del correo; si no hay, del UID. */
function codigoDesdeUsuario(usuario: User): string {
  const local = usuario.email?.split('@')[0];
  return (local || `TEC-${usuario.uid.slice(0, 6)}`).toUpperCase();
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [nombre, setNombre] = useState<string | null>(null);
  // updateProfile y reload() modifican el mismo objeto `user`: este contador
  // obliga a volver a dibujar para que se lea el estado nuevo.
  const [, forzarPerfil] = useState(0);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // onAuthStateChanged se dispara al arrancar (con la sesión guardada o null)
    // y cada vez que alguien inicia o cierra sesión.
    const cancelarSuscripcion = onAuthStateChanged(auth, (usuarioFirebase) => {
      setUsuario(usuarioFirebase);
      setNombre(usuarioFirebase ? nombreDesdeUsuario(usuarioFirebase) : null);
      forzarPerfil((valor) => valor + 1);
      setCargando(false);
    });
    return cancelarSuscripcion;
  }, []);

  const iniciarSesion = useCallback(async (correo: string, clave: string) => {
    await signInWithEmailAndPassword(auth, correo.trim(), clave);
  }, []);

  const registrarse = useCallback(
    async (nombreCompleto: string, correo: string, clave: string) => {
      // Crear la cuenta también inicia la sesión.
      const credencial = await createUserWithEmailAndPassword(
        auth,
        correo.trim(),
        clave,
      );
      const nombreLimpio = nombreCompleto.trim();
      // El nombre se guarda en el perfil de Firebase (campo displayName).
      await updateProfile(credencial.user, { displayName: nombreLimpio });
      setNombre(nombreLimpio);
      forzarPerfil((valor) => valor + 1);
      // El correo de verificación permite confirmar que la cuenta es real.
      await sendEmailVerification(credencial.user);
    },
    [],
  );

  const enviarCorreoRecuperacion = useCallback(async (correo: string) => {
    // Si el correo no existe, Firebase no lanza error (protección contra
    // enumeración de cuentas); la pantalla muestra un mensaje neutro.
    await sendPasswordResetEmail(auth, correo.trim());
  }, []);

  const enviarVerificacion = useCallback(async () => {
    const actual = auth.currentUser;
    if (!actual) throw new Error('No hay una sesión activa.');
    if (actual.emailVerified) return;
    await sendEmailVerification(actual);
  }, []);

  const recargarUsuario = useCallback(async () => {
    const actual = auth.currentUser;
    if (!actual) return false;
    await actual.reload();
    setNombre(nombreDesdeUsuario(actual));
    forzarPerfil((valor) => valor + 1);
    return actual.emailVerified;
  }, []);

  const actualizarNombre = useCallback(async (nombreNuevo: string) => {
    const actual = auth.currentUser;
    if (!actual) throw new Error('No hay una sesión activa.');
    const nombreLimpio = nombreNuevo.trim();
    await updateProfile(actual, { displayName: nombreLimpio });
    setNombre(nombreLimpio);
    forzarPerfil((valor) => valor + 1);
  }, []);

  const cambiarClave = useCallback(
    async (claveActual: string, claveNueva: string) => {
      const actual = auth.currentUser;
      if (!actual?.email) throw new Error('No hay una sesión activa.');

      // updatePassword rechaza la operación con "auth/requires-recent-login"
      // si la sesión no es reciente: primero confirmamos la identidad.
      const credencial = EmailAuthProvider.credential(
        actual.email,
        claveActual,
      );
      await reauthenticateWithCredential(actual, credencial);
      await updatePassword(actual, claveNueva);
    },
    [],
  );

  const cerrarSesion = useCallback(async () => {
    await signOut(auth);
    // La caché y la cola offline pertenecen al técnico que salió.
    queryClient.clear();
    await asyncStoragePersister.removeClient();
  }, []);

  // Se calcula en cada render (es barato) para que reload() y updateProfile
  // se reflejen sin depender de que cambie la referencia del usuario.
  const tecnico: Tecnico | null =
    usuario?.email && usuario.emailVerified
      ? {
          codigo: codigoDesdeUsuario(usuario),
          nombre: (nombre || usuario.email.split('@')[0]).trim(),
          zona: ZONA_POR_DEFECTO,
        }
      : null;

  const valor: AuthContexto = {
    usuario,
    tecnico,
    nombre,
    correo: usuario?.email ?? null,
    emailVerificado: usuario?.emailVerified ?? false,
    cargando,
    iniciarSesion,
    registrarse,
    enviarCorreoRecuperacion,
    enviarVerificacion,
    recargarUsuario,
    actualizarNombre,
    cambiarClave,
    cerrarSesion,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContexto {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return contexto;
}
