import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

type BootScreenProps = {
  onComplete: () => void;
};

const bootLines = [
  '[  OK  ] Loading GhostOS kernel modules',
  '[  OK  ] Mounting /home/fardin portfolio volume',
  '[  OK  ] Starting xterm service',
  '[  OK  ] Initializing window compositor',
  '[  OK  ] Loading Pacman assistant daemon',
  '[  OK  ] Calibrating ghost dragon cursor sensor',
  '[  OK  ] Starting GhostOS desktop target',
];

export function BootScreen({ onComplete }: BootScreenProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [showLogo, setShowLogo] = useState(false);
  const timings = useMemo(() => bootLines.map((_, index) => 220 + index * 230), []);

  useEffect(() => {
    const timers = timings.map((time, index) =>
      window.setTimeout(() => {
        setVisibleLines((lines) => [...lines, bootLines[index]]);
      }, time),
    );

    const logoTimer = window.setTimeout(() => setShowLogo(true), 2050);
    const completeTimer = window.setTimeout(onComplete, 3350);

    return () => {
      timers.forEach(window.clearTimeout);
      window.clearTimeout(logoTimer);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete, timings]);

  return (
    <section className="grid h-full w-full place-items-center bg-black">
      <div className="w-full max-w-4xl px-6 font-mono">
        <div className="mb-8 flex items-center justify-between border-b border-white/20 pb-3 text-xs text-white/80">
          <span>GhostOS secure boot</span>
          <span>tty1</span>
        </div>

        <div className="min-h-64 space-y-2 text-sm text-white font-light sm:text-base">
          {visibleLines.map((line) => (
            <motion.p
              key={line}
              initial={{ opacity: 0, x: -15, filter: 'blur(4px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
            >
              {line}
            </motion.p>
          ))}
          <motion.p
            animate={{ opacity: [0.35, 1, 0.35], textShadow: ["0 0 5px #fff", "0 0 15px #fff", "0 0 5px #fff"] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,1)]"
          >
            _
          </motion.p>
        </div>

        {showLogo && (
          <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(12px)', scale: 0.9 }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 text-center"
          >
            <motion.h1 
              initial={{ textShadow: "0 0 0px rgba(255,255,255,0)" }}
              animate={{ textShadow: ["0 0 10px rgba(255,255,255,0.5)", "0 0 30px rgba(255,255,255,0.9)", "0 0 10px rgba(255,255,255,0.5)"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="font-mono text-3xl font-bold tracking-[0.2em] uppercase text-white sm:text-5xl drop-shadow-[0_0_25px_rgba(255,255,255,1)]"
            >
              GhostOS
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="mt-4 text-sm font-light tracking-widest text-white/70 uppercase"
            >
              launching portfolio desktop session
            </motion.p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
