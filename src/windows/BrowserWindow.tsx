import { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Home, Search, ShieldAlert } from 'lucide-react';

const DEFAULT_URL = 'https://en.wikipedia.org/wiki/Main_Page';

export function BrowserWindow() {
  const [urlInput, setUrlInput] = useState(DEFAULT_URL);
  const [currentUrl, setCurrentUrl] = useState(DEFAULT_URL);
  const [history, setHistory] = useState<string[]>([DEFAULT_URL]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const navigateTo = (newUrl: string) => {
    let finalUrl = newUrl.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }
    
    // Check if trying to load common blocked sites to provide a better error
    if (finalUrl.includes('google.com') || finalUrl.includes('youtube.com') || finalUrl.includes('facebook.com')) {
      setHasError(true);
    } else {
      setHasError(false);
    }

    setUrlInput(finalUrl);
    setCurrentUrl(finalUrl);
    setIsLoading(true);

    const newHistory = history.slice(0, historyIdx + 1);
    newHistory.push(finalUrl);
    setHistory(newHistory);
    setHistoryIdx(newHistory.length - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput !== currentUrl) {
      navigateTo(urlInput);
    }
  };

  const goBack = () => {
    if (historyIdx > 0) {
      const newIdx = historyIdx - 1;
      setHistoryIdx(newIdx);
      const prevUrl = history[newIdx];
      setCurrentUrl(prevUrl);
      setUrlInput(prevUrl);
      setIsLoading(true);
      setHasError(false);
    }
  };

  const goForward = () => {
    if (historyIdx < history.length - 1) {
      const newIdx = historyIdx + 1;
      setHistoryIdx(newIdx);
      const nextUrl = history[newIdx];
      setCurrentUrl(nextUrl);
      setUrlInput(nextUrl);
      setIsLoading(true);
      setHasError(false);
    }
  };

  const reload = () => {
    if (iframeRef.current) {
      setIsLoading(true);
      setHasError(false);
      // Force iframe reload by re-setting src
      const current = currentUrl;
      setCurrentUrl('');
      setTimeout(() => setCurrentUrl(current), 10);
    }
  };

  const goHome = () => {
    navigateTo(DEFAULT_URL);
  };

  return (
    <div className="flex h-full flex-col bg-slate-50">
      {/* Browser Chrome / Toolbar */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-100 p-2 text-slate-600">
        <div className="flex gap-1">
          <button 
            onClick={goBack} 
            disabled={historyIdx === 0}
            className="rounded p-1.5 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <button 
            onClick={goForward} 
            disabled={historyIdx === history.length - 1}
            className="rounded p-1.5 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <ArrowRight size={16} />
          </button>
          <button 
            onClick={reload} 
            className={`rounded p-1.5 hover:bg-slate-200 transition-colors ${isLoading ? 'animate-spin' : ''}`}
          >
            <RotateCw size={16} />
          </button>
          <button 
            onClick={goHome} 
            className="rounded p-1.5 hover:bg-slate-200 transition-colors"
          >
            <Home size={16} />
          </button>
        </div>

        {/* Address Bar */}
        <form onSubmit={handleSubmit} className="flex flex-1 items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1 focus-within:border-sky-400 focus-within:ring-1 focus-within:ring-sky-400">
          <Search size={14} className="text-slate-400" />
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-800 outline-none"
            placeholder="Search or enter web address"
          />
        </form>
      </div>

      {/* Content Area */}
      <div className="relative flex-1 bg-white">
        {hasError && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
            <ShieldAlert size={48} className="mb-4 text-red-400" />
            <h2 className="mb-2 text-xl font-bold text-slate-800">Connection Refused by Host</h2>
            <p className="max-w-md text-sm text-slate-600">
              The website you are trying to visit ({currentUrl}) blocks itself from being embedded inside other websites for security reasons (X-Frame-Options / CSP).
            </p>
            <p className="mt-4 text-sm text-slate-500">
              Try visiting sites like <b>wikipedia.org</b>, <b>bing.com</b>, or your own projects!
            </p>
          </div>
        )}
        
        {currentUrl && (
          <iframe
            ref={iframeRef}
            src={currentUrl}
            className={`h-full w-full border-none transition-opacity duration-300 ${hasError ? 'opacity-0' : 'opacity-100'}`}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            title="Browser"
          />
        )}
      </div>
    </div>
  );
}
