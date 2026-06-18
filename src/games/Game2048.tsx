import { useCallback, useEffect, useState } from 'react';

const SIZE = 4;
type Grid = number[][];

const empty = (): Grid => Array.from({ length: SIZE }, () => Array(SIZE).fill(0));

const addRandom = (g: Grid): Grid => {
  const free: [number, number][] = [];
  g.forEach((row, r) => row.forEach((v, c) => { if (v === 0) free.push([r, c]); }));
  if (free.length === 0) return g;
  const [r, c] = free[Math.floor(Math.random() * free.length)];
  const ng = g.map(row => [...row]);
  ng[r][c] = Math.random() < 0.9 ? 2 : 4;
  return ng;
};

const slide = (row: number[]): { result: number[]; score: number } => {
  const filtered = row.filter(v => v !== 0);
  let score = 0;
  const merged: number[] = [];
  let i = 0;
  while (i < filtered.length) {
    if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
      const val = filtered[i] * 2;
      merged.push(val);
      score += val;
      i += 2;
    } else {
      merged.push(filtered[i]);
      i++;
    }
  }
  while (merged.length < SIZE) merged.push(0);
  return { result: merged, score };
};

const moveLeft = (g: Grid): { grid: Grid; score: number } => {
  let total = 0;
  const ng = g.map(row => { const { result, score } = slide(row); total += score; return result; });
  return { grid: ng, score: total };
};

const moveRight = (g: Grid): { grid: Grid; score: number } => {
  let total = 0;
  const ng = g.map(row => { const { result, score } = slide([...row].reverse()); total += score; return result.reverse(); });
  return { grid: ng, score: total };
};

const transpose = (g: Grid): Grid => g[0].map((_, c) => g.map(row => row[c]));

const moveUp = (g: Grid): { grid: Grid; score: number } => {
  const { grid, score } = moveLeft(transpose(g));
  return { grid: transpose(grid), score };
};

const moveDown = (g: Grid): { grid: Grid; score: number } => {
  const { grid, score } = moveRight(transpose(g));
  return { grid: transpose(grid), score };
};

const gridsEqual = (a: Grid, b: Grid) => a.every((row, r) => row.every((v, c) => v === b[r][c]));

const canMove = (g: Grid): boolean => {
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) {
      if (g[r][c] === 0) return true;
      if (c + 1 < SIZE && g[r][c] === g[r][c + 1]) return true;
      if (r + 1 < SIZE && g[r][c] === g[r + 1][c]) return true;
    }
  return false;
};

const TILE_COLORS: Record<number, { bg: string; text: string }> = {
  2: { bg: '#e8e0d4', text: '#776e65' },
  4: { bg: '#ede0c8', text: '#776e65' },
  8: { bg: '#f2b179', text: '#f9f6f2' },
  16: { bg: '#f59563', text: '#f9f6f2' },
  32: { bg: '#f67c5f', text: '#f9f6f2' },
  64: { bg: '#f65e3b', text: '#f9f6f2' },
  128: { bg: '#edcf72', text: '#f9f6f2' },
  256: { bg: '#edcc61', text: '#f9f6f2' },
  512: { bg: '#edc850', text: '#f9f6f2' },
  1024: { bg: '#edc53f', text: '#f9f6f2' },
  2048: { bg: '#edc22e', text: '#f9f6f2' },
};

const getTileStyle = (v: number): { bg: string; text: string } =>
  TILE_COLORS[v] ?? { bg: '#3c3a32', text: '#f9f6f2' };

export function Game2048() {
  const [grid, setGrid] = useState<Grid>(() => addRandom(addRandom(empty())));
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [won, setWon] = useState(false);
  const [best, setBest] = useState(() => {
    try { return Number(localStorage.getItem('2048_best') ?? 0); } catch { return 0; }
  });

  const move = useCallback((dir: 'left' | 'right' | 'up' | 'down') => {
    if (over) return;
    const fn = { left: moveLeft, right: moveRight, up: moveUp, down: moveDown }[dir];
    const { grid: ng, score: pts } = fn(grid);
    if (gridsEqual(grid, ng)) return;
    const withNew = addRandom(ng);
    setGrid(withNew);
    setScore(s => {
      const ns = s + pts;
      setBest(b => { const nb = Math.max(b, ns); try { localStorage.setItem('2048_best', String(nb)); } catch {} return nb; });
      return ns;
    });
    if (withNew.flat().includes(2048) && !won) setWon(true);
    if (!canMove(withNew)) setOver(true);
  }, [grid, over, won]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, 'left' | 'right' | 'up' | 'down'> = {
        arrowleft: 'left', arrowright: 'right', arrowup: 'up', arrowdown: 'down',
        a: 'left', d: 'right', w: 'up', s: 'down',
      };
      const dir = map[e.key.toLowerCase()];
      if (dir) { e.preventDefault(); e.stopPropagation(); move(dir); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [move]);

  // Touch support
  const touchRef = useState<{ x: number; y: number } | null>(null);
  useEffect(() => {
    let start: { x: number; y: number } | null = null;
    const onStart = (e: TouchEvent) => { start = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
    const onEnd = (e: TouchEvent) => {
      if (!start) return;
      const dx = e.changedTouches[0].clientX - start.x;
      const dy = e.changedTouches[0].clientY - start.y;
      if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;
      if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 'right' : 'left');
      else move(dy > 0 ? 'down' : 'up');
      start = null;
    };
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchend', onEnd, { passive: true });
    return () => { window.removeEventListener('touchstart', onStart); window.removeEventListener('touchend', onEnd); };
  }, [move]);

  const reset = () => {
    setGrid(addRandom(addRandom(empty())));
    setScore(0); setOver(false); setWon(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full max-w-[380px] items-center justify-between px-1">
        <div className="flex gap-4">
          <div><p className="font-mono text-[10px] uppercase text-white/40">Score</p><p className="text-xl font-bold text-white">{score}</p></div>
          <div><p className="font-mono text-[10px] uppercase text-white/40">Best</p><p className="text-xl font-bold text-yellow-300">{best}</p></div>
        </div>
        <button type="button" className="h-8 rounded-lg bg-yellow-500 px-4 text-xs font-bold text-slate-950 transition hover:bg-yellow-400" onClick={reset}>
          New Game
        </button>
      </div>

      <div className="grid aspect-square w-full max-w-[380px] gap-3 rounded-2xl bg-[#bbada0]/40 p-3" style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))` }}>
        {grid.flatMap((row, r) =>
          row.map((val, c) => {
            const style = val > 0 ? getTileStyle(val) : null;
            return (
              <div
                key={`${r}-${c}`}
                className={`flex items-center justify-center rounded-lg font-bold transition-all duration-100 ${
                  val > 0 ? 'scale-100' : 'scale-95'
                }`}
                style={{
                  backgroundColor: style?.bg ?? 'rgba(255,255,255,0.06)',
                  color: style?.text ?? 'transparent',
                  fontSize: val >= 1024 ? '18px' : val >= 128 ? '22px' : '26px',
                }}
              >
                {val > 0 ? val : ''}
              </div>
            );
          })
        )}
      </div>

      {(won || over) && (
        <div className="text-center">
          <p className={`text-lg font-bold ${won ? 'text-yellow-300' : 'text-red-400'}`}>
            {won ? '🎉 You reached 2048!' : 'No moves left!'}
          </p>
          <p className="text-sm text-white/50">Score: {score}</p>
        </div>
      )}

      <p className="text-xs text-white/30">Arrow keys or WASD to slide tiles • Swipe on mobile</p>
    </div>
  );
}
