import { appRegistry } from '../../apps/appRegistry';
import { desktopItems } from '../../files/desktopItems';
import { usePacStore } from '../../store/usePacStore';
import { Terminal, Gamepad2, Globe, User, FolderGit2, FileText, Folder, Image, Trash2 } from 'lucide-react';
import type { AppId } from '../../core/types';
import { sounds } from '../../utils/sound';

export function Dock() {
  const openApp = usePacStore((state) => state.openApp);
  const windows = usePacStore((state) => state.windows);
  
  const dockItems: { appId: AppId; kind: string }[] = [
    { appId: 'fileExplorer', kind: 'app' },
    { appId: 'gallery', kind: 'app' },
    { appId: 'games', kind: 'app' },
    { appId: 'browser', kind: 'app' },
    { appId: 'terminal', kind: 'app' },
    { appId: 'trash', kind: 'folder' },
  ];

  const getIconForApp = (appId: string) => {
    switch (appId) {
      case 'terminal': return <Terminal size={24} strokeWidth={1.5} className="text-white" />;
      case 'games': return <Gamepad2 size={24} strokeWidth={1.5} className="text-white" />;
      case 'browser': return <Globe size={24} strokeWidth={1.5} className="text-white" />;
      case 'fileExplorer': return <Folder size={24} strokeWidth={1.5} className="text-white" />;
      case 'gallery': return <Image size={24} strokeWidth={1.5} className="text-white" />;
      case 'trash': return <Trash2 size={24} strokeWidth={1.5} className="text-white" />;
      default: return <Folder size={24} strokeWidth={1.5} className="text-white" />;
    }
  };

  const getBackgroundForApp = (appId: string) => {
    switch (appId) {
      case 'terminal': return 'bg-gradient-to-br from-zinc-800 to-black border-zinc-600/50';
      case 'games': return 'bg-gradient-to-br from-zinc-800 to-black border-zinc-600/50';
      case 'browser': return 'bg-gradient-to-br from-zinc-800 to-black border-zinc-600/50';
      default: return 'bg-gradient-to-br from-zinc-800 to-black border-zinc-600/50';
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 z-[9000] flex -translate-x-1/2 items-end gap-3 rounded-[2rem] bg-white/5 p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-3xl border border-white/10">
      {dockItems.map((item) => {
        const app = appRegistry[item.appId];
        const isOpen = windows.some(w => w.appId === item.appId);
        
        return (
          <div key={item.appId} className="relative group flex flex-col items-center">
            {/* Tooltip */}
            <div className="absolute -top-12 scale-0 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 bg-zinc-800/80 backdrop-blur-xl text-white text-xs py-1.5 px-3 rounded-lg whitespace-nowrap border border-white/10 shadow-xl font-medium tracking-wide">
              {app.label}
            </div>
            
            <button
              type="button"
              className={`flex h-[56px] w-[56px] items-center justify-center rounded-[16px] shadow-lg transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-4 group-hover:scale-[1.2] hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] border-t border-l ${getBackgroundForApp(item.appId)}`}
              onClick={() => { openApp(item.appId); }}
              onMouseEnter={() => sounds.playHover()}
            >
              {getIconForApp(item.appId)}
            </button>
            {isOpen && (
              <div className="absolute -bottom-2 h-1 w-1 rounded-full bg-white opacity-80" />
            )}
          </div>
        );
      })}
    </div>
  );
}
