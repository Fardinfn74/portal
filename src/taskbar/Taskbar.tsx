import { appRegistry } from '../apps/appRegistry';
import { desktopItems } from '../files/desktopItems';
import { usePacStore } from '../store/usePacStore';

export function Taskbar() {
  const windows = usePacStore((state) => state.windows);
  const openApp = usePacStore((state) => state.openApp);
  const restoreWindow = usePacStore((state) => state.restoreWindow);
  const focusWindow = usePacStore((state) => state.focusWindow);
  const developerMode = usePacStore((state) => state.developerMode);
  const time = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());

  return (
    <footer className="absolute bottom-0 left-0 z-[9000] flex h-[var(--taskbar-height)] w-full items-center gap-2 border-t border-white/10 bg-black/72 px-3 text-slate-100 shadow-[0_-8px_32px_rgba(0,0,0,0.38)] backdrop-blur-xl">
      <button
        type="button"
        className="flex h-9 shrink-0 items-center gap-2 rounded-[6px] border border-emerald-300/25 bg-emerald-300/10 px-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-300/18"
        onClick={() => openApp('terminal')}
        title="Open Terminal"
      >
        <span className="grid h-5 w-5 place-items-center rounded bg-emerald-300 text-xs font-black text-slate-950">
          P
        </span>
        pacOS
      </button>

      <div className="hidden h-8 items-center gap-1 border-l border-white/10 pl-2 md:flex">
        {desktopItems.slice(0, 6).map((item) => {
          const app = appRegistry[item.appId];
          return (
            <button
              key={item.appId}
              type="button"
              className="grid h-8 w-8 place-items-center rounded-[6px] text-xs font-bold text-slate-100 transition hover:bg-white/10"
              style={{ borderBottom: `2px solid ${app.accent}` }}
              onClick={() => openApp(item.appId)}
              title={app.label}
            >
              {app.iconText}
            </button>
          );
        })}
      </div>

      <div className="pac-scrollbar flex min-w-0 flex-1 items-center gap-2 overflow-x-auto px-1">
        {windows.map((pacWindow) => (
          <button
            key={pacWindow.id}
            type="button"
            onClick={() =>
              pacWindow.minimized ? restoreWindow(pacWindow.id) : focusWindow(pacWindow.id)
            }
            className={`h-8 max-w-[180px] shrink-0 truncate rounded-[6px] border px-3 text-xs transition ${
              pacWindow.minimized
                ? 'border-white/10 bg-white/5 text-slate-400'
                : 'border-emerald-300/20 bg-white/10 text-slate-100 hover:bg-white/14'
            }`}
            title={pacWindow.title}
          >
            {pacWindow.title}
          </button>
        ))}
      </div>

      <div className="flex shrink-0 items-center gap-3 font-mono text-xs text-slate-300">
        {developerMode && <span className="hidden text-amber-200 sm:inline">DEV</span>}
        <span className="hidden sm:inline">eth0 online</span>
        <span>{time}</span>
      </div>
    </footer>
  );
}
