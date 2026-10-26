import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

/**
 * R9: conecta NetInfo con TanStack Query.
 * TanStack usa este estado para pausar reintentos y mostrar caché sin red.
 */
export function useNetworkStatus() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const aplicar = (estado: NetInfoState) => {
      const conectado = Boolean(estado.isConnected && estado.isInternetReachable !== false);
      setOnline(conectado);
      onlineManager.setOnline(conectado);
    };

    const unsubscribe = NetInfo.addEventListener(aplicar);
    NetInfo.fetch().then(aplicar).catch(() => setOnline(false));

    return unsubscribe;
  }, []);

  return { online };
}
