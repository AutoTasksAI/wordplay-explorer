import { useCallback, useEffect, useState } from "react";

/**
 * True when `value` is still undefined after `ms` (e.g. Convex query stuck loading).
 */
export function useLoadingTimeout(value: unknown, ms = 8000): boolean {
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (value !== undefined) {
      setTimedOut(false);
      return;
    }
    const id = window.setTimeout(() => setTimedOut(true), ms);
    return () => window.clearTimeout(id);
  }, [value, ms]);

  return value === undefined && timedOut;
}

export function useRetryKey() {
  const [key, setKey] = useState(0);
  const retry = useCallback(() => {
    setKey((k) => k + 1);
    window.location.reload();
  }, []);
  return { key, retry };
}
