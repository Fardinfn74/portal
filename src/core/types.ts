export type AppId =
  | 'about'
  | 'projects'
  | 'skills'
  | 'hackathons'
  | 'experience'
  | 'education'
  | 'certificates'
  | 'blogs'
  | 'contact'
  | 'resume'
  | 'terminal'
  | 'games'
  | 'browser'
  | 'fileExplorer'
  | 'gallery'
  | 'trash';

export type Position = {
  x: number;
  y: number;
};

export type Size = {
  w: number;
  h: number;
};

export type PacWindow = {
  id: string;
  appId: AppId;
  title: string;
  position: Position;
  size: Size;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
};

export type DesktopItem = {
  appId: AppId;
  label: string;
  kind: 'folder' | 'app';
};

export type Toast = {
  id: string;
  text: string;
};
