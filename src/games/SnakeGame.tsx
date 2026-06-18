import { useEffect, useMemo, useRef, useState } from 'react';

type Cell = { x: number; y: number };
type Direction = { x: number; y: number };
type Difficulty = 'easy' | 'medium' | 'hard';

const BOARD = 20;
const START_SNAKE: Cell[] = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
const START_DIR: Direction = { x: 1, y: 0 };

const SPEEDS: Record<Difficulty, number> = { easy: 180, medium: 130, hard: 85 };

const same = (a: Cell, b: Cell) => a.x === b.x && a.y === b.y;
const key = (c: Cell) => `${c.x}:${c.y}`;

const randomFood = (snake: Cell[]): Cell => {
  const occ = new Set(snake.map(key));
  const free: Cell[] = [];
  for (let y = 0; y < BOARD; y++)
    for (let x = 0; x < BOARD; x++)
      if (!occ.has(`${x}:${y}`)) free.push({ x, y });
  return free[Math.floor(Math.random() * free.length)] ?? { x: 15, y: 10 };
};

const dirFromKey = (k: string): Direction | null => {
  switch (k.toLowerCase()) {
    case 'arrowup': case 'w': return { x: 0, y: -1 };
    case 'arrowdown': case 's': return { x: 0, y: 1 };
    case 'arrowleft': case 'a': return { x: -1, y: 0 };
    case 'arrowright': case 'd': return { x: 1, y: 0 };
    default: return null;
  }
};

const wrap = (v: number) => ((v % BOARD) + BOARD) % BOARD;

export function SnakeGame() {
  const [diff, setDiff] = useState<Difficulty>('easy');
  const [snake, setSnake] = useState<Cell[]>(START_SNAKE);
  const [food, setFood] = useState<Cell>(() => randomFood(START_SNAKE));
  const [dir, setDir] = useState<Direction>(START_DIR);
  const [running, setRunning] = useState(false);
  const [over, setOver] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => {
    try { return Number(localStorage.getItem('snake_best') ?? 0); } catch { return 0; }
  });
  const dirRef = useRef(dir);
  const foodRef = useRef(food);
  useEffect(() => { dirRef.current = dir; }, [dir]);
  useEffect(() => { foodRef.current = food; }, [food]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const next = dirFromKey(e.key);
      if (!next) return;
      e.preventDefault(); e.stopPropagation();
      const cur = dirRef.current;
      if (cur.x + next.x === 0 && cur.y + next.y === 0) return;
      setDir(next);
      setRunning(true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!running || over) return;
    const timer = setInterval(() => {
      setSnake(prev => {
        const head = prev[0];
        // Wrap around walls instead of dying
        const next = { x: wrap(head.x + dirRef.current.x), y: wrap(head.y + dirRef.current.y) };
        // Only die if hitting yourself
        const hitSelf = prev.some(p => same(p, next));
        if (hitSelf) { setRunning(false); setOver(true); return prev; }
        const ns = [next, ...prev];
        if (same(next, foodRef.current)) {
          setScore(s => {
            const ns2 = s + 10;
            setBest(b => { const nb = Math.max(b, ns2); try { localStorage.setItem('snake_best', String(nb)); } catch {} return nb; });
            return ns2;
          });
          setFood(randomFood(ns));
        } else { ns.pop(); }
        return ns;
      });
    }, SPEEDS[diff]);
    return () => clearInterval(timer);
  }, [over, running, diff]);

  const cells = useMemo(() => new Set(snake.map(key)), [snake]);
  const reset = () => { setSnake(START_SNAKE); setFood(randomFood(START_SNAKE)); setDir(START_DIR); setRunning(false); setOver(false); setScore(0); };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full max-w-[500px] items-center justify-between px-1 flex-wrap gap-2">
        <div className="flex gap-3">
          <div><p className="font-mono text-[10px] uppercase text-white/40">Score</p><p className="text-xl font-bold text-white">{score}</p></div>
          <div><p className="font-mono text-[10px] uppercase text-white/40">Best</p><p className="text-xl font-bold text-emerald-300">{best}</p></div>
          <div><p className="font-mono text-[10px] uppercase text-white/40">Length</p><p className="text-xl font-bold text-white">{snake.length}</p></div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex rounded-lg overflow-hidden border border-white/10">
            {(['easy','medium','hard'] as Difficulty[]).map(d => (
              <button key={d} onClick={() => { if (!running) setDiff(d); }}
                className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition ${diff === d ? 'bg-emerald-400 text-slate-950' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>{d}</button>
            ))}
          </div>
          <button className="h-8 rounded-lg bg-emerald-400 px-3 text-xs font-bold text-slate-950 transition hover:bg-emerald-300" onClick={() => { if (over) reset(); setRunning(v => !v); }}>
            {over ? 'Retry' : running ? 'Pause' : 'Start'}
          </button>
          <button className="h-8 rounded-lg border border-white/15 bg-white/5 px-3 text-xs text-white/70 hover:bg-white/10" onClick={reset}>Reset</button>
        </div>
      </div>
      <div className="grid aspect-square w-full max-w-[500px] rounded-xl border border-emerald-400/15 bg-slate-900/50 p-1"
        style={{ gridTemplateColumns: `repeat(${BOARD}, minmax(0, 1fr))` }}>
        {Array.from({ length: BOARD * BOARD }, (_, i) => {
          const c = { x: i % BOARD, y: Math.floor(i / BOARD) };
          const isHead = same(c, snake[0]);
          const isBody = cells.has(key(c));
          const isFood = same(c, food);
          const tailIdx = isBody ? snake.findIndex(s => same(s, c)) : -1;
          const opacity = isBody ? Math.max(0.4, 1 - tailIdx * 0.03) : 1;
          return (
            <div key={i} className={`m-[0.5px] rounded-[3px] transition-all duration-75 ${
              isHead ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] scale-110'
              : isBody ? 'bg-emerald-400' : isFood ? 'bg-amber-300 shadow-[0_0_12px_rgba(252,211,77,0.8)] animate-pulse' : 'bg-white/[0.03]'
            }`} style={isBody && !isHead ? { opacity } : undefined} />
          );
        })}
      </div>
      {over && <div className="text-center"><p className="text-lg font-bold text-red-400">Game Over!</p><p className="text-sm text-white/50">Score: {score}</p></div>}
      <p className="text-xs text-white/30">Arrow keys or WASD • Wraps around walls • Only self-collision kills</p>
    </div>
  );
}
