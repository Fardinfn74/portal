import { motion } from 'framer-motion';
import { useState, WheelEvent } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

type ImageViewerWindowProps = {
  src: string;
  alt: string;
};

export function ImageViewerWindow({ src, alt }: ImageViewerWindowProps) {
  const [scale, setScale] = useState(1);

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.25, 4));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.25, 0.25));
  const handleReset = () => setScale(1);

  const handleWheel = (e: WheelEvent) => {
    if (e.ctrlKey) {
      if (e.deltaY < 0) handleZoomIn();
      else handleZoomOut();
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-slate-950 overflow-hidden" onWheel={handleWheel}>
      <div className="flex-1 relative overflow-hidden p-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="relative group cursor-grab active:cursor-grabbing"
        >
          <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full scale-150 opacity-20 pointer-events-none" />
          <img
            src={src}
            alt={alt}
            draggable={false}
            className="max-w-full max-h-full object-contain shadow-[0_0_50px_rgba(255,255,255,0.1)] relative z-10 rounded-sm"
          />
        </motion.div>

        {/* Floating Zoom Controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 shadow-2xl z-20">
          <button
            onClick={handleZoomOut}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut size={18} />
          </button>
          <div className="w-12 text-center text-[11px] font-mono font-bold text-white/50">
            {Math.round(scale * 100)}%
          </div>
          <button
            onClick={handleZoomIn}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn size={18} />
          </button>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <button
            onClick={handleReset}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
            title="Reset Zoom"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>
      <div className="bg-white/5 border-t border-white/10 px-4 py-2 flex items-center justify-between text-[11px] font-mono text-white/50">
        <div className="flex gap-4">
          <span>{alt}</span>
          <span className="hidden sm:inline opacity-30">|</span>
          <span className="hidden sm:inline opacity-30 italic">Ctrl + Scroll to Zoom</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>PACOS_VIEWER_V2.0</span>
        </div>
      </div>
    </div>
  );
}
