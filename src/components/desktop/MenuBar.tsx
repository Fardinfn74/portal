import { useEffect, useState } from 'react';
import { Wifi, Battery, Search, Settings2, Command } from 'lucide-react';
import { useGhostStore } from '../../store/useGhostStore';

export function MenuBar() {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const windows = useGhostStore((state) => state.windows);

  const activeWindow = windows.reduce((highest, current) => {
    if (current.minimized) return highest;
    if (!highest) return current;
    return current.zIndex > highest.zIndex ? current : highest;
  }, null as typeof windows[0] | null);

  const activeWindowTitle = activeWindow ? activeWindow.title : '';

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        new Intl.DateTimeFormat(undefined, {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }).format(now)
      );
      setDate(
        new Intl.DateTimeFormat(undefined, {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }).format(now)
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 left-0 z-[9999] flex h-7 w-full items-center justify-between bg-black/40 px-3 text-sm text-slate-100 backdrop-blur-md border-b border-white/10">
      <div className="flex h-full items-center gap-4">
        <button className="flex h-full items-center px-1 hover:bg-white/10 transition-colors rounded">
          <Command size={14} className="opacity-90" />
        </button>
        {activeWindowTitle && (
          <button className="flex h-full items-center px-2 font-bold hover:bg-white/10 transition-colors rounded">
            {activeWindowTitle}
          </button>
        )}
      </div>

      <div className="flex h-full items-center gap-3 text-xs">
        <button className="flex h-full items-center px-1 hover:bg-white/10 transition-colors rounded">
          <Wifi size={14} className="opacity-90" />
        </button>
        <button className="flex h-full items-center px-1 hover:bg-white/10 transition-colors rounded">
          <Battery size={14} className="opacity-90" />
        </button>
        <button className="flex h-full items-center px-1 hover:bg-white/10 transition-colors rounded">
          <Search size={14} className="opacity-90" />
        </button>
        <button className="flex h-full items-center px-1 hover:bg-white/10 transition-colors rounded">
          <Settings2 size={14} className="opacity-90" />
        </button>
        <button className="flex h-full items-center px-2 hover:bg-white/10 transition-colors rounded">
          <span>{date}</span>
          <span className="ml-2">{time}</span>
        </button>
      </div>
    </header>
  );
}
