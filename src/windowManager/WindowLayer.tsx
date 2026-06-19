import { usePacStore } from '../store/usePacStore';
import { WindowFrame } from './WindowFrame';

export function WindowLayer() {
  const windows = usePacStore((state) => state.windows);

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {windows
        .filter((pacWindow) => !pacWindow.minimized)
        .map((pacWindow) => (
          <WindowFrame key={pacWindow.id} window={pacWindow} />
        ))}
    </div>
  );
}
