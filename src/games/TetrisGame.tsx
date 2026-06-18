import { useCallback, useEffect, useRef, useState } from 'react';

const COLS = 10;
const ROWS = 20;

type Piece = { shape: number[][]; color: string; glow: string };
type Difficulty = 'easy' | 'medium' | 'hard';

const PIECES: Piece[] = [
  { shape: [[1,1,1,1]], color: '#67e8f9', glow: 'rgba(103,232,249,0.5)' },
  { shape: [[1,1],[1,1]], color: '#fde047', glow: 'rgba(253,224,71,0.5)' },
  { shape: [[0,1,0],[1,1,1]], color: '#c084fc', glow: 'rgba(192,132,252,0.5)' },
  { shape: [[1,0,0],[1,1,1]], color: '#fb923c', glow: 'rgba(251,146,60,0.5)' },
  { shape: [[0,0,1],[1,1,1]], color: '#60a5fa', glow: 'rgba(96,165,250,0.5)' },
  { shape: [[0,1,1],[1,1,0]], color: '#4ade80', glow: 'rgba(74,222,128,0.5)' },
  { shape: [[1,1,0],[0,1,1]], color: '#f87171', glow: 'rgba(248,113,113,0.5)' },
];

const SETTINGS: Record<Difficulty, { baseSpeed: number, speedMultiplier: number, scoreMultiplier: number }> = {
  easy:   { baseSpeed: 800, speedMultiplier: 30, scoreMultiplier: 1 },
  medium: { baseSpeed: 500, speedMultiplier: 45, scoreMultiplier: 2 },
  hard:   { baseSpeed: 300, speedMultiplier: 60, scoreMultiplier: 3 },
};

type Board = (string | null)[][];

const emptyBoard = (): Board => Array.from({ length: ROWS }, () => Array(COLS).fill(null));
const randPiece = () => PIECES[Math.floor(Math.random() * PIECES.length)];

const rotate = (s: number[][]): number[][] => {
  const R = s.length, C = s[0].length;
  return Array.from({ length: C }, (_, c) => Array.from({ length: R }, (_, r) => s[R - 1 - r][c]));
};

const valid = (board: Board, shape: number[][], row: number, col: number) => {
  for (let r = 0; r < shape.length; r++)
    for (let c = 0; c < shape[r].length; c++)
      if (shape[r][c]) {
        const nr = row + r, nc = col + c;
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return false;
        if (board[nr][nc]) return false;
      }
  return true;
};

export function TetrisGame() {
  const [diff, setDiff] = useState<Difficulty>('medium');
  const [board, setBoard] = useState<Board>(emptyBoard);
  const [cur, setCur] = useState<Piece>(randPiece);
  const [next, setNext] = useState<Piece>(randPiece);
  const [pos, setPos] = useState({ r: 0, c: 3 });
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [over, setOver] = useState(false);
  const [running, setRunning] = useState(false);
  const [best, setBest] = useState(() => {
    try { return Number(localStorage.getItem('tetris_best') ?? 0); } catch { return 0; }
  });

  const bRef = useRef(board);
  const cRef = useRef(cur);
  const pRef = useRef(pos);
  const oRef = useRef(over);
  bRef.current = board; cRef.current = cur; pRef.current = pos; oRef.current = over;

  const lock = useCallback(() => {
    const b = bRef.current.map(r => [...r]);
    const piece = cRef.current;
    const p = pRef.current;
    for (let r = 0; r < piece.shape.length; r++)
      for (let c = 0; c < piece.shape[r].length; c++)
        if (piece.shape[r][c]) b[p.r + r][p.c + c] = piece.color;

    let cleared = 0;
    const nb: (string | null)[][] = [];
    for (let r = 0; r < ROWS; r++) {
      if (b[r].every(cell => cell !== null)) cleared++;
      else nb.push(b[r]);
    }
    while (nb.length < ROWS) nb.unshift(Array(COLS).fill(null));

    if (cleared) {
      const cfg = SETTINGS[diff];
      const pts = [0, 100, 300, 500, 800][cleared] ?? 800;
      setScore(s => {
        const ns = s + pts * level * cfg.scoreMultiplier;
        setBest(b => { const nb = Math.max(b, ns); try { localStorage.setItem('tetris_best', String(nb)); } catch {} return nb; });
        return ns;
      });
      setLines(l => {
        const nl = l + cleared;
        setLevel(Math.floor(nl / 10) + 1);
        return nl;
      });
    }

    setBoard(nb);
    const np = next;
    const sc = Math.floor((COLS - np.shape[0].length) / 2);
    if (!valid(nb, np.shape, 0, sc)) {
      setOver(true); setRunning(false); return;
    }
    setCur(np); setNext(randPiece()); setPos({ r: 0, c: sc });
  }, [next, level, diff]);

  useEffect(() => {
    if (!running || over) return;
    const cfg = SETTINGS[diff];
    const speed = Math.max(50, cfg.baseSpeed - (level - 1) * cfg.speedMultiplier);
    const timer = setInterval(() => {
      setPos(prev => {
        if (valid(bRef.current, cRef.current.shape, prev.r + 1, prev.c))
          return { ...prev, r: prev.r + 1 };
        lock();
        return prev;
      });
    }, speed);
    return () => clearInterval(timer);
  }, [running, over, level, lock, diff]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (oRef.current) return;
      const p = pRef.current, piece = cRef.current, b = bRef.current;
      switch (e.key.toLowerCase()) {
        case 'arrowleft': case 'a':
          e.preventDefault(); e.stopPropagation();
          if (valid(b, piece.shape, p.r, p.c - 1)) setPos({ ...p, c: p.c - 1 });
          break;
        case 'arrowright': case 'd':
          e.preventDefault(); e.stopPropagation();
          if (valid(b, piece.shape, p.r, p.c + 1)) setPos({ ...p, c: p.c + 1 });
          break;
        case 'arrowdown': case 's':
          e.preventDefault(); e.stopPropagation();
          if (valid(b, piece.shape, p.r + 1, p.c)) setPos({ ...p, r: p.r + 1 });
          break;
        case 'arrowup': case 'w': {
          e.preventDefault(); e.stopPropagation();
          const rot = rotate(piece.shape);
          for (const offset of [0, -1, 1, -2, 2]) {
            if (valid(b, rot, p.r, p.c + offset)) {
              setCur({ ...piece, shape: rot });
              if (offset !== 0) setPos({ ...p, c: p.c + offset });
              break;
            }
          }
          break;
        }
        case ' ':
          e.preventDefault(); e.stopPropagation();
          let dr = p.r;
          while (valid(b, piece.shape, dr + 1, p.c)) dr++;
          setPos({ ...p, r: dr });
          setTimeout(() => lock(), 0);
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lock]);

  const reset = () => {
    const p = randPiece();
    setBoard(emptyBoard()); setCur(p); setNext(randPiece());
    setPos({ r: 0, c: Math.floor((COLS - p.shape[0].length) / 2) });
    setScore(0); setLines(0); setLevel(1); setOver(false); setRunning(false);
  };

  // Ghost piece
  let ghostR = pos.r;
  while (valid(board, cur.shape, ghostR + 1, pos.c)) ghostR++;

  const getCell = (r: number, c: number): { color: string; glow?: boolean; ghost?: boolean } | null => {
    for (let pr = 0; pr < cur.shape.length; pr++)
      for (let pc = 0; pc < cur.shape[pr].length; pc++)
        if (cur.shape[pr][pc] && pos.r + pr === r && pos.c + pc === c)
          return { color: cur.color, glow: true };
    for (let pr = 0; pr < cur.shape.length; pr++)
      for (let pc = 0; pc < cur.shape[pr].length; pc++)
        if (cur.shape[pr][pc] && ghostR + pr === r && pos.c + pc === c)
          return { color: cur.color, ghost: true };
    if (board[r][c]) return { color: board[r][c]! };
    return null;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full max-w-[460px] items-center justify-between px-1 flex-wrap gap-2">
        <div className="flex gap-4">
          <div><p className="font-mono text-[10px] uppercase text-white/40">Score</p><p className="text-xl font-bold text-white">{score}</p></div>
          <div><p className="font-mono text-[10px] uppercase text-white/40">Best</p><p className="text-xl font-bold text-purple-300">{best}</p></div>
          <div><p className="font-mono text-[10px] uppercase text-white/40">Level</p><p className="text-xl font-bold text-white">{level}</p></div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex rounded-lg overflow-hidden border border-white/10">
            {(['easy','medium','hard'] as Difficulty[]).map(d => (
              <button key={d} onClick={() => { if (!running) setDiff(d); }}
                className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition ${diff === d ? 'bg-purple-400 text-slate-950' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>{d}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4 w-full max-w-[460px]">
        <div
          className="grid flex-1 rounded-xl border border-purple-400/15 bg-slate-900/50 p-1"
          style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`, aspectRatio: `${COLS}/${ROWS}` }}
        >
          {Array.from({ length: ROWS * COLS }, (_, i) => {
            const r = Math.floor(i / COLS), c = i % COLS;
            const cell = getCell(r, c);
            return (
              <div
                key={i}
                className="m-[0.5px] rounded-[2px] transition-colors duration-75"
                style={
                  cell?.ghost
                    ? { border: '1px dashed', borderColor: cell.color + '40' }
                    : cell
                      ? { backgroundColor: cell.color, boxShadow: cell.glow ? `0 0 6px ${cell.color}66` : undefined }
                      : { backgroundColor: 'rgba(255,255,255,0.025)' }
                }
              />
            );
          })}
        </div>

        <div className="flex w-28 flex-col gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="font-mono text-[10px] uppercase text-white/40 mb-2">Next</p>
            <div className="flex justify-center">
              <div className="inline-grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${next.shape[0].length}, 16px)` }}>
                {next.shape.flatMap((row, r) =>
                  row.map((cell, c) => (
                    <div key={`${r}-${c}`} className="rounded-[2px]" style={{ width: 16, height: 16, backgroundColor: cell ? next.color : 'transparent' }} />
                  ))
                )}
              </div>
            </div>
          </div>
          <button type="button" className="h-9 rounded-lg bg-purple-400 px-3 text-xs font-bold text-slate-950 transition hover:bg-purple-300" onClick={() => { if (over) reset(); setRunning(v => !v); }}>
            {over ? 'Retry' : running ? 'Pause' : 'Start'}
          </button>
          <button type="button" className="h-8 rounded-lg border border-white/15 bg-white/5 px-3 text-xs text-white/70 transition hover:bg-white/10" onClick={reset}>Reset</button>
        </div>
      </div>

      {over && (
        <div className="text-center">
          <p className="text-lg font-bold text-red-400">Game Over!</p>
          <p className="text-sm text-white/50">Score: {score} | Level: {level}</p>
        </div>
      )}
    </div>
  );
}
