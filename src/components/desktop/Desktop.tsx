import { useEffect } from 'react';
import { desktopItems } from '../../files/desktopItems';
import { usePacStore } from '../../store/usePacStore';
import { fileSystem } from '../../files/fileData';
import { AnimatedWallpaper } from './AnimatedWallpaper';
import { DragonAssistant } from './DragonAssistant';
import { DesktopIcon } from './DesktopIcon';
import { WindowLayer } from '../../windowManager/WindowLayer';
import { MenuBar } from './MenuBar';
import { Dock } from './Dock';
import { WidgetsPanel } from './WidgetsPanel';
import { PacmanAssistant } from '../../pacman/PacmanAssistant';
import { ToastStack } from './ToastStack';
import { useKonamiCode } from '../../utils/useKonamiCode';
import { sounds } from '../../utils/sound';

export function Desktop() {
  const openApp = usePacStore((state) => state.openApp);
  const setDeveloperMode = usePacStore((state) => state.setDeveloperMode);
  const pushToast = usePacStore((state) => state.pushToast);

  useKonamiCode(() => {
    setDeveloperMode(true);
    pushToast('Developer mode unlocked');
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      openApp('welcome');
    }, 1000);
    return () => clearTimeout(timer);
  }, [openApp]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!['Control', 'Shift', 'Alt', 'Meta'].includes(event.key)) {
        sounds.playType();
      }

      if ((event.ctrlKey || event.metaKey) && event.altKey && event.key.toLowerCase() === 't') {
        event.preventDefault();
        openApp('terminal');
      }
    };

    const onMouseDown = () => {
      sounds.playClick();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('mousedown', onMouseDown);
    
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('mousedown', onMouseDown);
    };
  }, [openApp]);

  const setActiveImage = usePacStore((state) => state.setActiveImage);

  const handleOpen = (appId: string) => {
    if (appId.startsWith('cert_')) {
      const certIndex = parseInt(appId.split('_')[1]) - 1;
      const cert = fileSystem.certificates.entries[certIndex];
      if (cert) {
        setActiveImage({ src: cert.fields.url as string, alt: cert.name });
        openApp('imageViewer');
        return;
      }
    }
    openApp(appId as any);
  };

  return (
    <section className="relative h-full w-full overflow-hidden bg-black">
      <AnimatedWallpaper />
      <DragonAssistant />
      <MenuBar />
      <WidgetsPanel />

      <div className="absolute left-4 top-12 z-10 grid max-h-[calc(100vh-100px)] grid-flow-col grid-rows-8 gap-x-6 gap-y-4 sm:grid-rows-8">
        {desktopItems.map((item) => (
          <DesktopIcon key={item.appId} item={item} onOpen={() => handleOpen(item.appId)} />
        ))}
      </div>

      <WindowLayer />
      <PacmanAssistant />
      <ToastStack />
      <Dock />
    </section>
  );
}
