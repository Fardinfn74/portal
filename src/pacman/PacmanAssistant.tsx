import { FormEvent, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePacStore } from '../store/usePacStore';
import type { AppId } from '../core/types';
import { GasterBlasterIcon } from '../components/GasterBlasterIcon';

type Message = {
  id: string;
  from: 'pacman' | 'visitor';
  text: string;
};

const actionMap: Array<{ keys: string[]; appId: AppId; response: string }> = [
  {
    keys: ['project', 'projects'],
    appId: 'projects',
    response: 'Opening the Projects folder. The pacOS build and CTF tools are in there.',
  },
  {
    keys: ['resume', 'cv'],
    appId: 'resume',
    response: 'Opening Resume. Recruiter-friendly data is organized as structured files.',
  },
  {
    keys: ['contact', 'email', 'social'],
    appId: 'contact',
    response: 'Opening Contact. You can find email, socials, and availability there.',
  },
  {
    keys: ['terminal', 'shell'],
    appId: 'terminal',
    response: 'Opening Terminal. Try neofetch, ls, help, or hack.',
  },
  {
    keys: ['play', 'game', 'games', 'snake'],
    appId: 'games',
    response: 'Opening Pac Arcade. Snake is ready.',
  },
];

const initialMessages: Message[] = [
  {
    id: 'welcome',
    from: 'pacman',
    text: 'Hi, I am Pacman. Ask me to open projects, resume, contact, terminal, or play game.',
  },
];

export function PacmanAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const openApp = usePacStore((state) => state.openApp);
  const developerMode = usePacStore((state) => state.developerMode);

  const quickActions = useMemo(
    () => [
      { label: 'Projects', value: 'open projects' },
      { label: 'Resume', value: 'open resume' },
      { label: 'Contact', value: 'open contact' },
      { label: 'Terminal', value: 'open terminal' },
      { label: 'Game', value: 'play game' },
    ],
    [],
  );

  const respond = (text: string) => {
    const normalized = text.toLowerCase();
    const action = actionMap.find((item) => item.keys.some((key) => normalized.includes(key)));
    const visitorMessage: Message = {
      id: `visitor-${Date.now()}`,
      from: 'visitor',
      text,
    };

    if (action) {
      openApp(action.appId);
    }

    const pacmanMessage: Message = {
      id: `pacman-${Date.now()}`,
      from: 'pacman',
      text: action
        ? action.response
        : developerMode
          ? 'Developer mode is unlocked. I can still open projects, resume, contact, terminal, or games.'
          : 'I can route this desktop. Try: open projects, open resume, open contact, open terminal, or play game.',
    };

    setMessages((current) => [...current, visitorMessage, pacmanMessage]);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const text = input.trim();
    if (!text) {
      return;
    }

    setInput('');
    respond(text);
  };

  return (
    <div className="absolute bottom-4 right-4 z-[9500]">
      <AnimatePresence>
        {open && (
          <motion.section
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            className="mb-3 flex h-[min(70vh,430px)] w-[min(92vw,340px)] flex-col overflow-hidden rounded-[8px] border border-white/20 bg-slate-950/94 shadow-[0_0_20px_rgba(255,255,255,0.15)] backdrop-blur-xl"
            aria-label="Pacman assistant chat"
          >
            <header className="flex shrink-0 items-center justify-between border-b border-white/10 px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 overflow-hidden rounded-full border border-white/40 bg-black flex items-center justify-center text-white">
                  <img src="/pacman.png" className="h-full w-full object-cover invert" alt="Pacman" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Pacman</h3>
                  <p className="font-mono text-[11px] text-zinc-400">assistant online</p>
                </div>
              </div>
              <button
                type="button"
                className="grid h-7 w-7 place-items-center rounded-[5px] text-slate-300 transition hover:bg-white/10"
                onClick={() => setOpen(false)}
                aria-label="Close Pacman chat"
              >
                ×
              </button>
            </header>

            <div className="pac-scrollbar flex-1 space-y-2 overflow-y-auto p-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[88%] rounded-[7px] px-3 py-2 text-sm leading-5 ${
                    message.from === 'pacman'
                      ? 'mr-auto bg-white/10 text-white'
                      : 'ml-auto bg-zinc-800/80 text-white'
                  }`}
                >
                  {message.text}
                </div>
              ))}
            </div>

            <div className="flex shrink-0 flex-wrap gap-1.5 border-t border-white/10 px-3 py-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  className="rounded-[5px] border border-white/10 bg-white/7 px-2 py-1 text-[11px] text-slate-200 transition hover:bg-white/12"
                  onClick={() => respond(action.value)}
                >
                  {action.label}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="flex shrink-0 gap-2 border-t border-white/10 p-3">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask Pacman..."
                className="h-9 min-w-0 flex-1 rounded-[6px] border border-white/10 bg-black/45 px-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-white/50 focus:shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                aria-label="Message Pacman"
              />
              <button
                type="submit"
                className="h-9 rounded-[6px] bg-white px-3 text-xs font-bold text-black shadow-[0_0_10px_rgba(255,255,255,0.3)]"
              >
                Send
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-black shadow-[0_0_20px_rgba(255,255,255,0.3)] backdrop-blur transition hover:scale-[1.03] hover:bg-zinc-900 hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white text-white"
        aria-label="Open Pacman assistant"
        title="Pacman assistant"
      >
        <img src="/pacman.png" className="h-8 w-8 object-cover invert" alt="Pacman" />
      </button>
    </div>
  );
}
