import { useEffect, useRef } from 'react';

const sequence = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export function useKonamiCode(onUnlock: () => void) {
  const indexRef = useRef(0);
  const unlockedRef = useRef(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (unlockedRef.current) {
        return;
      }

      const expected = sequence[indexRef.current];
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

      if (key === expected) {
        indexRef.current += 1;
        if (indexRef.current === sequence.length) {
          unlockedRef.current = true;
          onUnlock();
        }
      } else {
        indexRef.current = key === sequence[0] ? 1 : 0;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onUnlock]);
}
