import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

/**
 * Tracks connectivity (FR-S-6, DESIGN.md §7 "Offline").
 *
 * Offline sync is deferred (D-21), so this is used to warn and to pause writes —
 * never to queue them.
 */

function subscribe(onChange: () => void): () => void {
  window.addEventListener('online', onChange);
  window.addEventListener('offline', onChange);

  return () => {
    window.removeEventListener('online', onChange);
    window.removeEventListener('offline', onChange);
  };
}

function getSnapshot(): boolean {
  return navigator.onLine;
}

function getServerSnapshot(): boolean {
  return true;
}

export function useOnlineStatus(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** True when the device just came back online, for a short confirmation window. */
export function useJustReconnected(online: boolean, durationMs = 3000): boolean {
  const [justReconnected, setJustReconnected] = useState(false);
  const wasOnline = useRef(online);

  useEffect(() => {
    const cameBackOnline = online && !wasOnline.current;
    wasOnline.current = online;

    if (!cameBackOnline) {
      setJustReconnected(false);
      return undefined;
    }

    setJustReconnected(true);
    const timer = setTimeout(() => setJustReconnected(false), durationMs);
    return () => clearTimeout(timer);
  }, [online, durationMs]);

  return justReconnected;
}
