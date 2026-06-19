import type { AppId, Size } from '../core/types';

export type AppDefinition = {
  title: string;
  label: string;
  kind: 'folder' | 'app';
  defaultSize: Size;
  accent: string;
  iconText: string;
};

export const appRegistry: Record<AppId, AppDefinition> = {
  about: {
    title: 'About_Me',
    label: 'About_Me',
    kind: 'folder',
    defaultSize: { w: 720, h: 500 },
    accent: '#ffffff',
    iconText: 'A',
  },
  projects: {
    title: 'Projects',
    label: 'Projects',
    kind: 'folder',
    defaultSize: { w: 820, h: 560 },
    accent: '#e4e4e7',
    iconText: 'P',
  },
  skills: {
    title: 'Skills',
    label: 'Skills',
    kind: 'folder',
    defaultSize: { w: 740, h: 520 },
    accent: '#d4d4d8',
    iconText: 'S',
  },
  experience: {
    title: 'Experience',
    label: 'Experience',
    kind: 'folder',
    defaultSize: { w: 760, h: 510 },
    accent: '#d4d4d8',
    iconText: 'X',
  },
  education: {
    title: 'Education',
    label: 'Education',
    kind: 'folder',
    defaultSize: { w: 710, h: 500 },
    accent: '#e4e4e7',
    iconText: 'E',
  },
  certificates: {
    title: 'Certificates',
    label: 'Certificates',
    kind: 'folder',
    defaultSize: { w: 740, h: 510 },
    accent: '#a1a1aa',
    iconText: 'C',
  },
  contact: {
    title: 'Contact',
    label: 'Contact',
    kind: 'folder',
    defaultSize: { w: 720, h: 500 },
    accent: '#ffffff',
    iconText: '@',
  },
  resume: {
    title: 'Resume',
    label: 'Resume',
    kind: 'folder',
    defaultSize: { w: 780, h: 560 },
    accent: '#ffffff',
    iconText: 'R',
  },
  terminal: {
    title: 'Pac Terminal',
    label: 'Terminal',
    kind: 'app',
    defaultSize: { w: 780, h: 470 },
    accent: '#ffffff',
    iconText: '>',
  },
  games: {
    title: 'Games',
    label: 'Games',
    kind: 'app',
    defaultSize: { w: 820, h: 600 },
    accent: '#d4d4d8',
    iconText: '*',
  },
  browser: {
    title: 'Pac Browser',
    label: 'Browser',
    kind: 'app',
    defaultSize: { w: 860, h: 560 },
    accent: '#e4e4e7',
    iconText: 'W',
  },
  fileExplorer: {
    title: 'File Explorer',
    label: 'Files',
    kind: 'app',
    defaultSize: { w: 820, h: 540 },
    accent: '#ffffff',
    iconText: 'F',
  },
  trash: {
    title: 'Trash',
    label: 'Trash',
    kind: 'folder',
    defaultSize: { w: 600, h: 400 },
    accent: '#ffffff',
    iconText: 'T',
  },
  imageViewer: {
    title: 'Image Viewer',
    label: 'Viewer',
    kind: 'app',
    defaultSize: { w: 800, h: 600 },
    accent: '#ffffff',
    iconText: 'I',
  },
};
