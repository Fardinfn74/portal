import { useMemo, useRef, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import type { GhostWindow, Position, Size } from '../core/types';
import { useGhostStore } from '../store/useGhostStore';
import { AppWindowContent } from '../windows/AppWindowContent';

type WindowFrameProps = {
  window: GhostWindow;
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

export function WindowFrame({ window: ghostWindow }: WindowFrameProps) {
  const focusWindow = useGhostStore((state) => state.focusWindow);
  const moveWindow = useGhostStore((state) => state.moveWindow);
  const resizeWindow = useGhostStore((state) => state.resizeWindow);
  const closeWindow = useGhostStore((state) => state.closeWindow);
  const minimizeWindow = useGhostStore((state) => state.minimizeWindow);
  const toggleMaximize = useGhostStore((state) => state.toggleMaximize);
  const dragRef = useRef<DragState | null>(null);
  const resizeRef = useRef<ResizeState | null>(null);

  const style = useMemo<CSSProperties>(() => {
    if (ghostWindow.maximized) {
      return {
        zIndex: ghostWindow.zIndex,
        left: 8,
        top: 8,
        width: 'calc(100vw - 16px)',
        height: 'calc(100vh - var(--taskbar-height) - 18px)',
      };
    }

    return {
      zIndex: ghostWindow.zIndex,
      left: ghostWindow.position.x,
      top: ghostWindow.position.y,
      width: ghostWindow.size.w,
      height: ghostWindow.size.h,
    };
  }, [
    ghostWindow.maximized,
    ghostWindow.position.x,
    ghostWindow.position.y,
    ghostWindow.size.h,
    ghostWindow.size.w,
    ghostWindow.zIndex,
  ]);

  const onDragPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || ghostWindow.maximized) {
      return;
    }

    focusWindow(ghostWindow.id);
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startPosition: ghostWindow.position,
    };
  };

  const onDragPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    const maxX = Math.max(12, globalThis.window.innerWidth - ghostWindow.size.w - 12);
    const maxY = Math.max(12, globalThis.window.innerHeight - ghostWindow.size.h - 58);
    moveWindow(ghostWindow.id, {
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
    if (event.button !== 0 || ghostWindow.maximized) {
      return;
    }

    event.stopPropagation();
    focusWindow(ghostWindow.id);
    event.currentTarget.setPointerCapture(event.pointerId);
    resizeRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startSize: ghostWindow.size,
    };
  };

  const onResizePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const resize = resizeRef.current;
    if (!resize || resize.pointerId !== event.pointerId) {
      return;
    }

    resizeWindow(ghostWindow.id, {
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
      onPointerDown={() => focusWindow(ghostWindow.id)}
      aria-label={ghostWindow.title}
    >
      <div
        className="flex h-10 shrink-0 cursor-grab items-center justify-between border-b border-white/20 bg-white/20 px-3 active:cursor-grabbing"
        onPointerDown={onDragPointerDown}
        onPointerMove={onDragPointerMove}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        onDoubleClick={() => toggleMaximize(ghostWindow.id)}
      >
        <div className="flex min-w-0 items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
          <h2 className="truncate font-mono text-xs font-semibold text-white uppercase tracking-wider">
            {ghostWindow.title}
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="grid h-6 w-6 place-items-center rounded-[5px] text-white transition hover:bg-white/20"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => minimizeWindow(ghostWindow.id)}
            aria-label={`Minimize ${ghostWindow.title}`}
            title="Minimize"
          >
            -
          </button>
          <button
            type="button"
            className="grid h-6 w-6 place-items-center rounded-[5px] text-white transition hover:bg-white/20"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => toggleMaximize(ghostWindow.id)}
            aria-label={`${ghostWindow.maximized ? 'Restore' : 'Maximize'} ${ghostWindow.title}`}
            title={ghostWindow.maximized ? 'Restore' : 'Maximize'}
          >
            {ghostWindow.maximized ? '▣' : '□'}
          </button>
          <button
            type="button"
            className="grid h-6 w-6 place-items-center rounded-[5px] text-white transition hover:bg-white/20 hover:text-red-400"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => closeWindow(ghostWindow.id)}
            aria-label={`Close ${ghostWindow.title}`}
            title="Close"
          >
            x
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <AppWindowContent appId={ghostWindow.appId} />
      </div>

      {!ghostWindow.maximized && (
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
