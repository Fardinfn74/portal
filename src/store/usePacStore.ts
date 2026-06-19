import { create } from 'zustand';
import { appRegistry } from '../apps/appRegistry';
import type { AppId, PacWindow, Position, Size, Toast } from '../core/types';
import { createId } from '../utils/id';
import { sounds } from '../utils/sound';

type PacStore = {
  windows: PacWindow[];
  nextZIndex: number;
  developerMode: boolean;
  toasts: Toast[];
  dragonEnabled: boolean;
  dragonSpeed: number;
  activeImage: { src: string; alt: string } | null;
  setActiveImage: (image: { src: string; alt: string } | null) => void;
  openApp: (appId: AppId) => string;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  moveWindow: (id: string, position: Position) => void;
  resizeWindow: (id: string, size: Size) => void;
  setDeveloperMode: (enabled: boolean) => void;
  pushToast: (text: string) => string;
  removeToast: (id: string) => void;
  setDragonEnabled: (enabled: boolean) => void;
  setDragonSpeed: (speed: number) => void;
};

const buildWindow = (appId: AppId, zIndex: number, openCount: number): PacWindow => {
  const app = appRegistry[appId];
  const offset = openCount % 6;

  return {
    id: createId(appId),
    appId,
    title: app.title,
    position: {
      x: 82 + offset * 34,
      y: 74 + offset * 28,
    },
    size: app.defaultSize,
    zIndex,
    minimized: false,
    maximized: false,
  };
};

export const usePacStore = create<PacStore>((set, get) => ({
  windows: [],
  nextZIndex: 10,
  developerMode: false,
  toasts: [],
  dragonEnabled: typeof window !== 'undefined' ? localStorage.getItem('pac_man_enabled') !== 'false' : true,
  dragonSpeed: (typeof window !== 'undefined' && Number(localStorage.getItem('pac_man_speed'))) || 8,
  activeImage: null,

  setActiveImage: (activeImage) => set({ activeImage }),

  openApp: (appId) => {
    const state = get();
    const existing = state.windows.find((window) => window.appId === appId);
    const zIndex = state.nextZIndex + 1;

    if (existing) {
      sounds.playWindowOpen();
      set({
        windows: state.windows.map((window) =>
          window.id === existing.id
            ? { ...window, minimized: false, zIndex }
            : window,
        ),
        nextZIndex: zIndex,
      });
      return existing.id;
    }

    const newWindow = buildWindow(appId, zIndex, state.windows.length);
    sounds.playWindowOpen();
    set({
      windows: [...state.windows, newWindow],
      nextZIndex: zIndex,
    });
    return newWindow.id;
  },

  closeWindow: (id) => {
    sounds.playWindowClose();
    set((state) => ({
      windows: state.windows.filter((window) => window.id !== id),
    }));
  },

  minimizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((window) =>
        window.id === id ? { ...window, minimized: true } : window,
      ),
    }));
  },

  restoreWindow: (id) => {
    const zIndex = get().nextZIndex + 1;
    set((state) => ({
      windows: state.windows.map((window) =>
        window.id === id ? { ...window, minimized: false, zIndex } : window,
      ),
      nextZIndex: zIndex,
    }));
  },

  focusWindow: (id) => {
    const state = get();
    const target = state.windows.find((window) => window.id === id);

    if (!target || target.zIndex === state.nextZIndex) {
      return;
    }

    const zIndex = state.nextZIndex + 1;
    set({
      windows: state.windows.map((window) =>
        window.id === id ? { ...window, zIndex, minimized: false } : window,
      ),
      nextZIndex: zIndex,
    });
  },

  toggleMaximize: (id) => {
    const zIndex = get().nextZIndex + 1;
    set((state) => ({
      windows: state.windows.map((window) =>
        window.id === id
          ? {
              ...window,
              maximized: !window.maximized,
              minimized: false,
              zIndex,
            }
          : window,
      ),
      nextZIndex: zIndex,
    }));
  },

  moveWindow: (id, position) => {
    set((state) => ({
      windows: state.windows.map((window) =>
        window.id === id && !window.maximized ? { ...window, position } : window,
      ),
    }));
  },

  resizeWindow: (id, size) => {
    set((state) => ({
      windows: state.windows.map((window) =>
        window.id === id ? { ...window, size } : window,
      ),
    }));
  },

  setDeveloperMode: (enabled) => {
    set({ developerMode: enabled });
  },

  pushToast: (text) => {
    const id = createId('toast');
    set((state) => ({
      toasts: [...state.toasts, { id, text }],
    }));
    window.setTimeout(() => get().removeToast(id), 3600);
    return id;
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },


  setDragonEnabled: (dragonEnabled) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pac_man_enabled', String(dragonEnabled));
    }
    set({ dragonEnabled });
  },

  setDragonSpeed: (dragonSpeed) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pac_man_speed', String(dragonSpeed));
    }
    set({ dragonSpeed });
  },
}));
