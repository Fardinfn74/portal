import { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import { desktopItems } from '../files/desktopItems';
import { usePacStore } from '../store/usePacStore';
import { pacManAscii } from '../assets/pacAscii';
import type { AppId } from '../core/types';

const prompt = '\x1b[37mfardin@pacOS\x1b[0m:\x1b[37m~\x1b[0m$ ';

const appAliases: Record<string, AppId> = {
  projects: 'projects',
  resume: 'resume',
  contact: 'contact',
  terminal: 'terminal',
  games: 'games',
  game: 'games',
  browser: 'browser',
  about: 'about',
};

export function TerminalApp() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const terminalRef = useRef<Terminal | null>(null);
  const inputRef = useRef('');
  const lockedRef = useRef(false);
  const timersRef = useRef<number[]>([]);
  const openApp = usePacStore((state) => state.openApp);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const term = new Terminal({
      cursorBlink: true,
      convertEol: true,
      fontFamily: 'Cascadia Code, Consolas, monospace',
      fontSize: 13,
      theme: {
        background: '#000000',
        foreground: '#ffffff',
        cursor: '#ffffff',
        green: '#f0f0f0',
        cyan: '#cccccc',
        yellow: '#aaaaaa',
        red: '#888888',
      },
      allowTransparency: true,
    });

    terminalRef.current = term;
    term.open(container);

    const fit = () => {
      const rect = container.getBoundingClientRect();
      const cols = Math.max(40, Math.floor(rect.width / 8.2));
      const rows = Math.max(12, Math.floor(rect.height / 17.2));
      term.resize(cols, rows);
    };

    const resizeObserver = new ResizeObserver(fit);
    resizeObserver.observe(container);
    fit();

    const writePrompt = () => term.write(prompt);

    const writeHelp = () => {
      term.writeln('Available commands:');
      term.writeln('  neofetch        show pacOS system info');
      term.writeln('  ls              list desktop items');
      term.writeln('  cat about.txt   print short bio');
      term.writeln('  clear           clear terminal');
      term.writeln('  help            show commands');
      term.writeln('  whoami          show current visitor identity');
      term.writeln('  sudo whoami     test privileged identity');
      term.writeln('  hack            run harmless fake hacking animation');
      term.writeln('  sudo make coffee');
      term.writeln('  rm -rf /');
      term.writeln('  open projects|resume|contact|terminal|games|browser');
    };

    const runHack = () => {
      lockedRef.current = true;
      const lines = [
        'starting harmless pacOS lab animation...',
        'scanning 127.0.0.1 ports: 22 closed, 80 simulated, 443 simulated',
        'loading matrix payload: [##########] 100%',
        'decrypting portfolio vault: ACCESS VISUAL ONLY',
        'injecting neon packets into canvas wallpaper',
        'result: no systems touched, viewer impressed',
      ];

      lines.forEach((line, index) => {
        const timer = window.setTimeout(() => {
          term.writeln(`\x1b[32m[pac-lab]\x1b[0m ${line}`);
          if (index === lines.length - 1) {
            lockedRef.current = false;
            writePrompt();
          }
        }, 260 + index * 420);
        timersRef.current.push(timer);
      });
    };

    const runCommand = (rawCommand: string) => {
      const command = rawCommand.trim();
      const normalized = command.toLowerCase();

      if (!command) {
        writePrompt();
        return;
      }

      if (normalized === 'clear') {
        term.clear();
        writePrompt();
        return;
      }

      if (normalized === 'help') {
        writeHelp();
      } else if (normalized === 'neofetch') {
        term.writeln('\x1b[37m' + pacManAscii + '\x1b[0m');
        term.writeln('\x1b[37mOS:\x1b[0m pacOS');
        term.writeln('\x1b[37mUser:\x1b[0m Fardin');
        term.writeln('\x1b[37mRole:\x1b[0m CSE student / frontend engineer');
        term.writeln('\x1b[37mShell:\x1b[0m pacsh');
        term.writeln('\x1b[37mStack:\x1b[0m React, TypeScript, Tailwind, Zustand, xterm.js');
      } else if (normalized === 'ls') {
        term.writeln(desktopItems.map((item) => `${item.label}${item.kind === 'folder' ? '/' : ''}`).join('  '));
      } else if (normalized === 'cat about.txt') {
        term.writeln('Fardin is a CSE student building React + TypeScript interfaces, cybersecurity lab notes, CTF tools, and immersive portfolio systems.');
      } else if (normalized === 'whoami') {
        term.writeln('visitor');
      } else if (normalized === 'sudo whoami') {
        term.writeln('\x1b[31mauthentication failed:\x1b[0m visitor is not in the pac sudoers file');
      } else if (normalized === 'sudo make coffee') {
        term.writeln('\x1b[33merror:\x1b[0m coffee daemon missing. Try hydration manually.');
      } else if (normalized === 'rm -rf /') {
        term.writeln('\x1b[31mdenied:\x1b[0m pacOS mounted portfolio volume as read-protected');
      } else if (normalized === 'hack') {
        runHack();
        return;
      } else if (normalized.startsWith('open ')) {
        const target = normalized.replace('open ', '').trim();
        const appId = appAliases[target];
        if (appId) {
          openApp(appId);
          term.writeln(`dispatch://open/${appId}`);
        } else {
          term.writeln(`pacsh: no app alias "${target}"`);
        }
      } else {
        term.writeln(`pacsh: command not found: ${command}`);
        term.writeln('type "help" for available commands');
      }

      writePrompt();
    };

    const handleData = (data: string) => {
      if (lockedRef.current) {
        return;
      }

      Array.from(data).forEach((char) => {
        if (char === '\r') {
          term.write('\r\n');
          runCommand(inputRef.current);
          inputRef.current = '';
          return;
        }

        if (char === '\u0003') {
          term.write('^C\r\n');
          inputRef.current = '';
          writePrompt();
          return;
        }

        if (char === '\u007F') {
          if (inputRef.current.length > 0) {
            inputRef.current = inputRef.current.slice(0, -1);
            term.write('\b \b');
          }
          return;
        }

        if (char >= ' ' && char <= '~') {
          inputRef.current += char;
          term.write(char);
        }
      });
    };

    term.writeln('\x1b[37mpacOS Terminal\x1b[0m - type "help" to list commands.');
    term.writeln('Session mounted at /home/fardin.');
    writePrompt();

    const disposable = term.onData(handleData);

    return () => {
      timersRef.current.forEach(window.clearTimeout);
      disposable.dispose();
      resizeObserver.disconnect();
      term.dispose();
      terminalRef.current = null;
    };
  }, [openApp]);

  return <div ref={containerRef} className="h-full w-full bg-black p-2" />;
}
