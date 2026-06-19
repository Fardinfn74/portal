import { motion } from 'framer-motion';

type ImageViewerWindowProps = {
  src: string;
  alt: string;
};

export function ImageViewerWindow({ src, alt }: ImageViewerWindowProps) {
  return (
    <div className="flex h-full w-full flex-col bg-slate-950 overflow-hidden">
      <div className="flex-1 relative overflow-auto p-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full scale-150 opacity-20 pointer-events-none" />
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full object-contain shadow-[0_0_50px_rgba(255,255,255,0.1)] relative z-10 rounded-sm"
          />
        </motion.div>
      </div>
      <div className="bg-white/5 border-t border-white/10 px-4 py-2 flex items-center justify-between text-[11px] font-mono text-white/50">
        <div className="flex gap-4">
          <span>{alt}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>PACOS_VIEWER_V1.0</span>
        </div>
      </div>
    </div>
  );
}
