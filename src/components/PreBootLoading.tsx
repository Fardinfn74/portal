import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type PreBootLoadingProps = {
  onComplete: () => void;
};

export function PreBootLoading({ onComplete }: PreBootLoadingProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 3000; // 3 seconds for loading
    const interval = 30;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-black text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="mb-8 flex flex-col items-center"
      >
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-white/10 blur-2xl animate-pulse" />
          <img
            src="/pacOS.jpg"
            alt="pacOS Logo"
            className="relative z-10 h-32 w-32 rounded-full object-cover border-2 border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          />
        </div>
        <h1 className="text-4xl font-bold tracking-[0.3em] uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
          pacOS
        </h1>
      </motion.div>

      <div className="w-64 overflow-hidden rounded-full border border-white/20 bg-white/5 p-1 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
        <motion.div
          className="h-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: 'linear' }}
        />
      </div>

      <p className="mt-4 text-[10px] font-mono tracking-widest text-white/40 uppercase">
        Initializing System... {Math.round(progress)}%
      </p>
    </div>
  );
}
