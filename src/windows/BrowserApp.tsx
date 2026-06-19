import { FormEvent, useMemo, useState } from 'react';
import { usePacStore } from '../store/usePacStore';

const pages: Record<string, { title: string; body: string; links: Array<{ label: string; app: 'projects' | 'resume' | 'contact' | 'hackathons' }> }> = {
  'pac://home': {
    title: 'PacOS',
    body: 'Internal browser page for browsing Fardin portfolio routes without leaving the desktop.',
    links: [
      { label: 'Projects', app: 'projects' },
      { label: 'Resume', app: 'resume' },
      { label: 'Contact', app: 'contact' },
    ],
  },
  'pac://projects': {
    title: 'Projects Index',
    body: 'Selected builds include PacOS, CTF Writeup Engine, CampusConnect, and SafePath AI.',
    links: [
      { label: 'Open Projects Folder', app: 'projects' },
      { label: 'Open Hackathons', app: 'hackathons' },
    ],
  },
  'pac://contact': {
    title: 'Contact Route',
    body: 'Use the Contact folder for email, socials, availability, and a quick message template.',
    links: [
      { label: 'Open Contact', app: 'contact' },
      { label: 'Open Resume', app: 'resume' },
    ],
  },
};

const normalizeUrl = (value: string) => {
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return 'pac://home';
  if (trimmed in pages) return trimmed;
  if (trimmed.includes('project')) return 'pac://projects';
  if (trimmed.includes('contact')) return 'pac://contact';
  return trimmed.startsWith('pac://') ? trimmed : `pac://${trimmed}`;
};

export function BrowserApp() {
  const [url, setUrl] = useState('pac://home');
  const [draft, setDraft] = useState('pac://home');
  const openApp = usePacStore((state) => state.openApp);
  const page = useMemo(() => pages[url], [url]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const nextUrl = normalizeUrl(draft);
    setUrl(nextUrl);
    setDraft(nextUrl);
  };

  return (
    <div className="flex h-full flex-col bg-slate-950 text-slate-100">
      <form
        onSubmit={submit}
        className="flex shrink-0 items-center gap-2 border-b border-white/10 bg-black p-3"
      >
        <button
          type="button"
          className="grid h-8 w-8 place-items-center rounded-[6px] border border-white/20 bg-white/10 text-sm text-white hover:bg-white/20 transition-colors"
          onClick={() => {
            setUrl('pac://home');
            setDraft('pac://home');
          }}
          title="Home"
        >
          ⌂
        </button>
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          className="h-8 min-w-0 flex-1 rounded-[6px] border border-white/20 bg-black/50 px-3 font-mono text-xs text-white outline-none focus:border-white focus:shadow-[0_0_10px_rgba(255,255,255,0.2)] transition-all"
          aria-label="Pac browser URL"
        />
        <button
          type="submit"
          className="h-8 rounded-[6px] bg-white px-4 text-xs font-bold text-black hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all"
        >
          Go
        </button>
      </form>

      <div className="pac-scrollbar min-h-0 flex-1 overflow-y-auto p-5 bg-black">
        {page ? (
          <div className="mx-auto max-w-3xl">
            <p className="font-mono text-xs text-white/50 tracking-widest uppercase">{url}</p>
            <h3 className="mt-3 text-2xl font-bold text-white tracking-wider uppercase">{page.title}</h3>
            <p className="mt-3 leading-7 text-slate-300 font-light">{page.body}</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {page.links.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => openApp(link.app)}
                  className="rounded-[7px] border border-white/20 bg-white/5 p-4 text-left transition-all hover:border-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                >
                  <span className="block text-sm font-bold text-white tracking-wide">{link.label}</span>
                  <span className="mt-1 block text-xs text-white/40 font-mono">dispatch://open/{link.app}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-2xl rounded-[7px] border border-white/20 bg-white/5 p-5">
            <p className="font-mono text-xs text-white/50 uppercase tracking-widest">404 route not mounted</p>
            <h3 className="mt-3 text-xl font-bold text-white tracking-wider uppercase">{url}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300 font-light">
              Pac Browser only has local routes. Try pac://home, pac://projects, or
              pac://contact.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
