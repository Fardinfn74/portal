import { useMemo, useRef, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import type { PacWindow, Position, Size } from '../core/types';
import { usePacStore } from '../store/usePacStore';
import { AppWindowContent } from '../windows/AppWindowContent';

type WindowFrameProps = {
  window: PacWindow;
};

type DragState = {
  pointerId: number;
  startX: number;
  startY: number;
  startPosition: Position;
};

type ResizeState = {
  pointerId: number;
  startX: number;
  startY: number;
  startSize: Size;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function WindowFrame({ window: pacWindow }: WindowFrameProps) {
  const focusWindow = usePacStore((state) => state.focusWindow);
  const moveWindow = usePacStore((state) => state.moveWindow);
  const resizeWindow = usePacStore((state) => state.resizeWindow);
  const closeWindow = usePacStore((state) => state.closeWindow);
  const minimizeWindow = usePacStore((state) => state.minimizeWindow);
  const toggleMaximize = usePacStore((state) => state.toggleMaximize);
  const activeImage = usePacStore((state) => state.activeImage);
  const dragRef = useRef<DragState | null>(null);
  const resizeRef = useRef<ResizeState | null>(null);

  const style = useMemo<CSSProperties>(() => {
    if (pacWindow.maximized) {
      return {
        zIndex: pacWindow.zIndex,
        left: 8,
        top: 8,
        width: 'calc(100vw - 16px)',
        height: 'calc(100vh - var(--taskbar-height) - 18px)',
      };
    }

    return {
      zIndex: pacWindow.zIndex,
      left: pacWindow.position.x,
      top: pacWindow.position.y,
      width: pacWindow.size.w,
      height: pacWindow.size.h,
    };
  }, [
    pacWindow.maximized,
    pacWindow.position.x,
    pacWindow.position.y,
    pacWindow.size.h,
    pacWindow.size.w,
    pacWindow.zIndex,
  ]);

  const onDragPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || pacWindow.maximized) {
      return;
    }

    focusWindow(pacWindow.id);
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startPosition: pacWindow.position,
    };
  };

  const onDragPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    const maxX = Math.max(12, globalThis.window.innerWidth - pacWindow.size.w - 12);
    const maxY = Math.max(12, globalThis.window.innerHeight - pacWindow.size.h - 58);
    moveWindow(pacWindow.id, {
      x: clamp(drag.startPosition.x + event.clientX - drag.startX, 8, maxX),
      y: clamp(drag.startPosition.y + event.clientY - drag.startY, 8, maxY),
    });
  };

  const stopDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const onResizePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || pacWindow.maximized) {
      return;
    }

    event.stopPropagation();
    focusWindow(pacWindow.id);
    event.currentTarget.setPointerCapture(event.pointerId);
    resizeRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startSize: pacWindow.size,
    };
  };

  const onResizePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const resize = resizeRef.current;
    if (!resize || resize.pointerId !== event.pointerId) {
      return;
    }

    resizeWindow(pacWindow.id, {
      w: clamp(resize.startSize.w + event.clientX - resize.startX, 360, globalThis.window.innerWidth - 30),
      h: clamp(resize.startSize.h + event.clientY - resize.startY, 280, globalThis.window.innerHeight - 68),
    });
  };

  const stopResize = (event: React.PointerEvent<HTMLDivElement>) => {
    if (resizeRef.current?.pointerId === event.pointerId) {
      resizeRef.current = null;
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <motion.article
      className="pointer-events-auto absolute flex min-h-[280px] min-w-[360px] flex-col overflow-hidden rounded-[8px] border border-white/30 bg-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-2xl"
      style={style}
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.18 }}
      onPointerDown={() => focusWindow(pacWindow.id)}
      aria-label={pacWindow.title}
    >
      <div
        className="flex h-10 shrink-0 cursor-grab items-center justify-between border-b border-white/20 bg-white/20 px-3 active:cursor-grabbing"
        onPointerDown={onDragPointerDown}
        onPointerMove={onDragPointerMove}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        onDoubleClick={() => toggleMaximize(pacWindow.id)}
      >
        <div className="flex min-w-0 items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
          <h2 className="truncate font-mono text-xs font-semibold text-white uppercase tracking-wider">
            {pacWindow.appId === 'imageViewer'
              ? (activeImage?.alt || pacWindow.title)
              : pacWindow.title}
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="grid h-6 w-6 place-items-center rounded-[5px] text-white transition hover:bg-white/20"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => minimizeWindow(pacWindow.id)}
            aria-label={`Minimize ${pacWindow.title}`}
            title="Minimize"
          >
            -
          </button>
          <button
            type="button"
            className="grid h-6 w-6 place-items-center rounded-[5px] text-white transition hover:bg-white/20"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => toggleMaximize(pacWindow.id)}
            aria-label={`${pacWindow.maximized ? 'Restore' : 'Maximize'} ${pacWindow.title}`}
            title={pacWindow.maximized ? 'Restore' : 'Maximize'}
          >
            {pacWindow.maximized ? '▣' : '□'}
          </button>
          <button
            type="button"
            className="grid h-6 w-6 place-items-center rounded-[5px] text-white transition hover:bg-white/20 hover:text-red-400"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => closeWindow(pacWindow.id)}
            aria-label={`Close ${pacWindow.title}`}
            title="Close"
          >
            x
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <AppWindowContent appId={pacWindow.appId} />
      </div>

      {!pacWindow.maximized && (
        <div
          className="absolute bottom-0 right-0 h-5 w-5 cursor-nwse-resize"
          onPointerDown={onResizePointerDown}
          onPointerMove={onResizePointerMove}
          onPointerUp={stopResize}
          onPointerCancel={stopResize}
          aria-hidden="true"
        >
          <div className="absolute bottom-1 right-1 h-2.5 w-2.5 border-b border-r border-white/35" />
        </div>
      )}
    </motion.article>
  );
}
