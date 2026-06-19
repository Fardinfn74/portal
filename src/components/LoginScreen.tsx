import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { sounds } from '../utils/sound';

type LoginScreenProps = {
  onComplete: () => void;
};

const username = 'fardin';
const password = 'pacdragon';

export function LoginScreen({ onComplete }: LoginScreenProps) {
  const [typedUser, setTypedUser] = useState('');
  const [typedPassword, setTypedPassword] = useState('');
  const [status, setStatus] = useState('waiting for credential injector');

  useEffect(() => {
    const timers: number[] = [];

    username.split('').forEach((char, index) => {
      timers.push(
        window.setTimeout(() => {
          setTypedUser((current) => current + char);
          setStatus('auto filling username');
          sounds.playType();
        }, 300 + index * 100),
      );
    });

    password.split('').forEach((char, index) => {
      timers.push(
        window.setTimeout(() => {
          setTypedPassword((current) => current + char);
          setStatus('auto filling password');
          sounds.playType();
        }, 1100 + index * 70),
      );
    });

    timers.push(window.setTimeout(() => setStatus('authenticating session'), 2000));
    timers.push(window.setTimeout(() => {
      setStatus('login accepted');
      sounds.playLogin();
    }, 2400));
    timers.push(window.setTimeout(onComplete, 2800));

    return () => {
      timers.forEach(window.clearTimeout);
    };
  }, [onComplete]);

  return (
    <section className="relative flex h-full w-full items-center justify-center overflow-hidden bg-black font-mono">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(255,255,255,0.08),transparent_33%),linear-gradient(180deg,#020617,#000)]" />
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:34px_34px]" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative w-[min(92vw,420px)] rounded-[12px] border border-white/20 bg-black/90 p-8 shadow-[0_0_40px_rgba(255,255,255,0.1)] backdrop-blur-2xl"
      >
        <div className="mb-8 flex flex-col items-center">
          <div className="relative mb-6 h-32 w-32 overflow-hidden rounded-full border-2 border-white/20 bg-white/5 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            <img 
              src="/profile.png"
              alt="Profile" 
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
          <h2 className="font-mono text-2xl font-light tracking-widest text-white shadow-white/50 drop-shadow-md">
            GUEST USER
          </h2>
          <p className="mt-2 font-mono text-xs tracking-widest text-white/50">
            SYSTEM ADMINISTRATOR
          </p>
        </div>

        <label className="mb-4 block">
          <span className="mb-2 block text-xs uppercase tracking-widest text-white/40">User</span>
          <div className="h-11 rounded-[6px] border border-white/20 bg-white/5 px-3 py-2 font-mono text-sm text-white shadow-inner">
            {typedUser}
            <span className="animate-pulse drop-shadow-[0_0_5px_rgba(255,255,255,1)]">_</span>
          </div>
        </label>

        <label className="mb-5 block">
          <span className="mb-2 block text-xs uppercase tracking-widest text-white/40">Password</span>
          <div className="h-11 rounded-[6px] border border-white/20 bg-white/5 px-3 py-2 font-mono text-sm text-white shadow-inner">
            {'*'.repeat(typedPassword.length)}
            <span className="animate-pulse drop-shadow-[0_0_5px_rgba(255,255,255,1)]">_</span>
          </div>
        </label>

        <motion.div
          animate={status === 'login accepted' ? { scale: [1, 1.03, 1] } : undefined}
          className="grid h-11 place-items-center rounded-[6px] bg-white text-sm font-bold text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]"
        >
          {status === 'login accepted' ? 'Entering Desktop' : 'Login'}
        </motion.div>
      </motion.div>
    </section>
  );
}
