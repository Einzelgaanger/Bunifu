import { useEffect, useRef, useState } from "react";

/**
 * Keeps a loading/skeleton state visible for at least `minMs` after work starts,
 * so ultra-fast responses don't flash empty→content. Long requests still end as soon as data arrives.
 */
export function usePerceivedLoading(isLoading: boolean, minMs = 200): boolean {
  const [display, setDisplay] = useState(isLoading);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (isLoading) {
      startRef.current = Date.now();
      setDisplay(true);
      return;
    }

    const started = startRef.current;
    if (started == null) {
      setDisplay(false);
      return;
    }

    const elapsed = Date.now() - started;
    const wait = Math.max(0, minMs - elapsed);
    const t = window.setTimeout(() => {
      setDisplay(false);
      startRef.current = null;
    }, wait);
    return () => window.clearTimeout(t);
  }, [isLoading, minMs]);

  return display;
}
