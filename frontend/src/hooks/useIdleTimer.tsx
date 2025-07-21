import { useState, useEffect, useRef } from 'react';

export const useIdleTimer = (timeout: number, onIdle: () => void) => {
  const [isIdle, setIsIdle] = useState(false);
  const timeoutId = useRef<number | null>(null);

  const startTimer = () => {
    timeoutId.current = window.setTimeout(() => {
      setIsIdle(true);
      onIdle();
    }, timeout);
  };

  const resetTimer = () => {
    if (timeoutId.current) {
      window.clearTimeout(timeoutId.current);
    }
    startTimer();
  };

  const handleEvent = () => {
    if (isIdle) return;
    resetTimer();
  };

  useEffect(() => {
    startTimer();

    window.addEventListener('mousemove', handleEvent);
    window.addEventListener('keydown', handleEvent);
    window.addEventListener('touchstart', handleEvent);

    return () => {
      if (timeoutId.current) {
        window.clearTimeout(timeoutId.current);
      }
      window.removeEventListener('mousemove', handleEvent);
      window.removeEventListener('keydown', handleEvent);
      window.removeEventListener('touchstart', handleEvent);
    };
  }, [timeout, onIdle]);

  return { isIdle, resetTimer };
};
