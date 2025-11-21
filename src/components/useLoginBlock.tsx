import { useEffect, useState } from "react";

export function useLoginBlock() {
  const [blockedUntil, setBlockedUntil] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);

  // Cargar bloqueo desde localStorage al iniciar
  useEffect(() => {
    const saved = localStorage.getItem("loginBlockedUntil");
    if (saved) {
      const time = parseInt(saved, 10);
      if (Date.now() < time) {
        setBlockedUntil(time);
        setSecondsLeft(Math.ceil((time - Date.now()) / 1000));
      }
    }
  }, []);

  // Contador regresivo
  useEffect(() => {
    if (!blockedUntil) return;

    const interval = setInterval(() => {
      const remaining = blockedUntil - Date.now();
      if (remaining <= 0) {
        setBlockedUntil(null);
        setSecondsLeft(0);
        localStorage.removeItem("loginBlockedUntil");
        clearInterval(interval);
      } else {
        setSecondsLeft(Math.ceil(remaining / 1000));
      }
    }, 500);

    return () => clearInterval(interval);
  }, [blockedUntil]);

  // Activar el bloqueo
  const blockFor = (seconds: number) => {
    const until = Date.now() + seconds * 1000;
    setBlockedUntil(until);
    localStorage.setItem("loginBlockedUntil", until.toString());
  };

  return { blockedUntil, secondsLeft, blockFor, isBlocked: !!blockedUntil };
}
