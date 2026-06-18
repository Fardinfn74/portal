import type { AppId } from '../core/types';
import { BrowserApp } from './BrowserApp';
import { FileExplorerWindow } from './FileExplorerWindow';
import { GamesHub } from './GamesHub';
import { TerminalApp } from '../terminal/TerminalApp';
import { fileSystem } from '../files/fileData';

type AppWindowContentProps = {
  appId: AppId;
};

export function AppWindowContent({ appId }: AppWindowContentProps) {
  if (appId === 'terminal') {
    return <TerminalApp />;
  }

  if (appId === 'games') {
    return <GamesHub />;
  }

  if (appId === 'browser') {
    return <BrowserApp />;
  }

  if (appId in fileSystem) {
    return <FileExplorerWindow appId={appId as keyof typeof fileSystem} />;
  }

  return (
    <div className="grid h-full place-items-center bg-slate-950 p-6 text-sm text-slate-400">
      App not found.
    </div>
  );
}
