import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

type BootScreenProps = {
  onComplete: () => void;
};

const bootLines = [
  '>> INITIALIZING PACOS KERNEL 6.12.0-PORTFOLIO',
  '>> CHECKING SYSTEM INTEGRITY... DONE',
  '>> MOUNTING VOLUMES [ /HOME/FARDIN ]... OK',
  '>> STARTING WINDOW_COMPOSITOR.BIN',
  '>> LOADING DESKTOP_ENVIRONMENT',
  '>> CONNECTING TO PACMAN_DAEMON',
  '>> SYSTEM READY. REDIRECTING TO LOGIN_SHELL...',
];

export function BootScreen({ onComplete }: BootScreenProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const timings = useMemo(() => bootLines.map((_, index) => 150 + index * 200), []);

  useEffect(() => {
    const timers = timings.map((time, index) =>
      window.setTimeout(() => {
        setVisibleLines((lines) => [...lines, bootLines[index]]);
      }, time),
    );

    const completeTimer = window.setTimeout(onComplete, bootLines.length * 200 + 600);

    return () => {
      timers.forEach(window.clearTimeout);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete, timings]);

  return (
    <section className="grid h-full w-full place-items-center bg-black">
      <div className="w-full max-w-4xl px-6 font-mono">
        <div className="mb-12 flex items-center justify-between border-b border-white/10 pb-4 text-[10px] tracking-[0.2em] uppercase text-white/40">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-white/80 shadow-[0_0_8px_#fff]" />
            Secure System Boot
          </span>
          <span>TTY-01</span>
        </div>

        <div className="min-h-64 space-y-3 font-mono text-sm sm:text-base">
          {visibleLines.map((line, idx) => (
            <motion.p
              key={line}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={`${
                idx === visibleLines.length - 1
                  ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                  : 'text-white/70'
              }`}
            >
              <span className="mr-3 opacity-30">[{idx.toString().padStart(2, '0')}]</span>
              {line}
            </motion.p>
          ))}
          <motion.p
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="text-white drop-shadow-[0_0_10px_#fff]"
          >
            _
          </motion.p>
        </div>
      </div>
    </section>
  );
}
