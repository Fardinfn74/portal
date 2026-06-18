import type { DesktopItem } from '../../core/types';
import { appRegistry } from '../../apps/appRegistry';

type DesktopIconProps = {
  item: DesktopItem;
  onOpen: () => void;
};

export function DesktopIcon({ item, onOpen }: DesktopIconProps) {
  const app = appRegistry[item.appId];

  return (
    <button
      type="button"
      onDoubleClick={onOpen}
      onClick={onOpen}
      className="group flex h-[82px] w-[88px] flex-col items-center justify-start gap-2 rounded-[6px] border border-transparent p-2 text-center transition hover:border-white/15 hover:bg-white/8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-300"
      title={`Open ${item.label}`}
    >
      {item.kind === 'folder' ? (
        <span className="ghost-folder-icon mt-1" style={{ backgroundColor: app.accent }} />
      ) : (
        <span className="ghost-app-icon" style={{ boxShadow: `0 0 22px ${app.accent}44` }}>
          {app.iconText}
        </span>
      )}
      <span className="max-w-full break-words text-[11px] font-medium leading-tight text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
        {item.label}
      </span>
    </button>
  );
}
