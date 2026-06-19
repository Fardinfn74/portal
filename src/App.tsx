import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Desktop } from './components/desktop/Desktop';
import { LoginScreen } from './components/LoginScreen';
import { BootScreen } from './components/BootScreen';

type Phase = 'boot' | 'login' | 'desktop';

export default function App() {
  const [phase, setPhase] = useState<Phase>('boot');

  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'PacOS';

    return () => {
      document.title = originalTitle;
    };
  }, []);

  return (
    <>
      <main className="h-screen w-screen overflow-hidden bg-black text-slate-100">
        <AnimatePresence mode="wait">
          {phase === 'boot' && (
            <motion.div
              key="boot"
              className="h-full w-full"
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.55 }}
            >
              <BootScreen onComplete={() => setPhase('login')} />
            </motion.div>
          )}

          {phase === 'login' && (
            <motion.div
              key="login"
              className="h-full w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
            >
              <LoginScreen onComplete={() => setPhase('desktop')} />
            </motion.div>
          )}

          {phase === 'desktop' && (
            <motion.div
              key="desktop"
              className="h-full w-full"
              initial={{ opacity: 0, scale: 1.015 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <Desktop />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
    </>
  );
}
