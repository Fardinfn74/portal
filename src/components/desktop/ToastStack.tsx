import { AnimatePresence, motion } from 'framer-motion';
import { useGhostStore } from '../../store/useGhostStore';

export function ToastStack() {
  const toasts = useGhostStore((state) => state.toasts);

  return (
    <div className="pointer-events-none absolute right-4 top-4 z-[10000] flex w-[min(92vw,360px)] flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 24, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 24, scale: 0.98 }}
            className="rounded-[7px] border border-emerald-300/20 bg-slate-950/88 px-4 py-3 text-sm text-slate-100 shadow-ghost backdrop-blur"
          >
            {toast.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
