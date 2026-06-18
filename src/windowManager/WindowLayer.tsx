import { useGhostStore } from '../store/useGhostStore';
import { WindowFrame } from './WindowFrame';

export function WindowLayer() {
  const windows = useGhostStore((state) => state.windows);

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {windows
        .filter((ghostWindow) => !ghostWindow.minimized)
        .map((ghostWindow) => (
          <WindowFrame key={ghostWindow.id} window={ghostWindow} />
        ))}
    </div>
  );
}
