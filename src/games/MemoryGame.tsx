import { useEffect, useState } from 'react';

const EMOJIS = ['🐉','⚡','🔮','🎮','💎','🌟','🎯','🧩','🚀','🎲','🏆','🔥','🧊','🌈','🌺','🍀'];

type Card = { id: number; emoji: string; flipped: boolean; matched: boolean };
type Difficulty = 'easy' | 'medium' | 'hard';

const SETTINGS: Record<Difficulty, { pairs: number, cols: number }> = {
  easy:   { pairs: 6,  cols: 4 }, // 12 cards
  medium: { pairs: 8,  cols: 4 }, // 16 cards
  hard:   { pairs: 12, cols: 6 }, // 24 cards
};

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const makeCards = (pairsCount: number): Card[] => {
  const selected = EMOJIS.slice(0, pairsCount);
  const pairs = [...selected, ...selected];
  return shuffle(pairs).map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }));
};

export function MemoryGame() {
  const [diff, setDiff] = useState<Difficulty>('medium');
  const [cards, setCards] = useState<Card[]>(() => makeCards(SETTINGS.medium.pairs));
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [time, setTime] = useState(0);
  const [started, setStarted] = useState(false);
  const [best, setBest] = useState(() => {
    try { return Number(localStorage.getItem('memory_best') ?? 0); } catch { return 0; }
  });

  const cfg = SETTINGS[diff];
  const won = matches === cfg.pairs;

  useEffect(() => {
    if (!started || won) return;
    const t = setInterval(() => setTime(v => v + 1), 1000);
    return () => clearInterval(t);
  }, [started, won]);

  useEffect(() => {
    if (won && (best === 0 || moves < best)) {
      setBest(moves);
      try { localStorage.setItem('memory_best', String(moves)); } catch {}
    }
  }, [won, moves, best]);

  useEffect(() => {
    if (!started && !won) {
      const cfg = SETTINGS[diff];
      setCards(makeCards(cfg.pairs));
      setSelected([]); setMoves(0); setMatches(0); setTime(0); setStarted(false);
    }
  }, [diff]);

  const flip = (id: number) => {
    if (selected.length >= 2) return;
    const card = cards[id];
    if (card.flipped || card.matched) return;
    if (!started) setStarted(true);

    const next = cards.map(c => c.id === id ? { ...c, flipped: true } : c);
    const nextSel = [...selected, id];
    setCards(next);
    setSelected(nextSel);

    if (nextSel.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = nextSel;
      if (next[a].emoji === next[b].emoji) {
        setTimeout(() => {
          setCards(prev => prev.map(c => c.id === a || c.id === b ? { ...c, matched: true } : c));
          setMatches(m => m + 1);
          setSelected([]);
        }, 400);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => c.id === a || c.id === b ? { ...c, flipped: false } : c));
          setSelected([]);
        }, 800);
      }
    }
  };

  const reset = () => {
    setCards(makeCards(cfg.pairs)); setSelected([]); setMoves(0); setMatches(0); setTime(0); setStarted(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full max-w-[420px] items-center justify-between px-1 flex-wrap gap-2">
        <div className="flex gap-4">
          <div><p className="font-mono text-[10px] uppercase text-white/40">Moves</p><p className="text-xl font-bold text-white">{moves}</p></div>
          <div><p className="font-mono text-[10px] uppercase text-white/40">Pairs</p><p className="text-xl font-bold text-pink-300">{matches}/{cfg.pairs}</p></div>
          <div><p className="font-mono text-[10px] uppercase text-white/40">Time</p><p className="text-xl font-bold text-white">{time}s</p></div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex rounded-lg overflow-hidden border border-white/10">
            {(['easy','medium','hard'] as Difficulty[]).map(d => (
              <button key={d} onClick={() => { if (!started) setDiff(d); }}
                className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition ${diff === d ? 'bg-pink-400 text-slate-950' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>{d}</button>
            ))}
          </div>
          <button type="button" className="h-8 rounded-lg bg-pink-400 px-4 text-xs font-bold text-slate-950 transition hover:bg-pink-300" onClick={reset}>New</button>
        </div>
      </div>

      <div className={`grid w-full max-w-[420px] gap-3`} style={{ gridTemplateColumns: `repeat(${cfg.cols}, minmax(0, 1fr))` }}>
        {cards.map(card => (
          <button
            key={card.id}
            type="button"
            onClick={() => flip(card.id)}
            className={`aspect-square rounded-xl ${cfg.cols > 4 ? 'text-2xl' : 'text-3xl'} font-bold transition-all duration-300 ${
              card.matched
                ? 'bg-pink-500/20 border border-pink-400/30 scale-95'
                : card.flipped
                  ? 'bg-white/15 border border-white/30 scale-105'
                  : 'bg-white/8 border border-white/10 hover:bg-white/15 hover:scale-105 cursor-pointer'
            }`}
            style={{ perspective: '600px' }}
          >
            <span className={`block transition-all duration-300 ${card.flipped || card.matched ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
              {card.emoji}
            </span>
          </button>
        ))}
      </div>

      {won && (
        <div className="text-center">
          <p className="text-lg font-bold text-emerald-400">🎉 You matched all pairs!</p>
          <p className="text-sm text-white/50">Completed in {moves} moves and {time}s</p>
        </div>
      )}

      <p className="text-xs text-white/30">Click cards to flip • Match all pairs to win</p>
    </div>
  );
}
