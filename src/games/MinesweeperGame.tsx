import { useCallback, useEffect, useState } from 'react';

type Cell = { mine: boolean; revealed: boolean; flagged: boolean; adj: number };
type Board = Cell[][];
type Difficulty = 'easy' | 'medium' | 'hard';

const SETTINGS: Record<Difficulty, { size: number, mines: number }> = {
  easy:   { size: 8, mines: 10 },
  medium: { size: 10, mines: 15 },
  hard:   { size: 14, mines: 35 },
};

const COLORS: Record<number, string> = {
  1: '#60a5fa', 2: '#4ade80', 3: '#f87171', 4: '#818cf8',
  5: '#fb923c', 6: '#67e8f9', 7: '#f472b6', 8: '#a78bfa',
};

const makeBoard = (size: number, mines: number): Board => {
  const b: Board = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({ mine: false, revealed: false, flagged: false, adj: 0 }))
  );
  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * size), c = Math.floor(Math.random() * size);
    if (!b[r][c].mine) { b[r][c].mine = true; placed++; }
  }
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++) {
      if (b[r][c].mine) continue;
      let n = 0;
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < size && nc >= 0 && nc < size && b[nr][nc].mine) n++;
        }
      b[r][c].adj = n;
    }
  return b;
};

export function MinesweeperGame() {
  const [diff, setDiff] = useState<Difficulty>('medium');
  const [board, setBoard] = useState<Board>(() => makeBoard(SETTINGS.medium.size, SETTINGS.medium.mines));
  const [over, setOver] = useState(false);
  const [won, setWon] = useState(false);
  const [flags, setFlags] = useState(0);
  const [time, setTime] = useState(0);
  const [started, setStarted] = useState(false);
  const [best, setBest] = useState(() => {
    try { return Number(localStorage.getItem('mine_best') ?? 0); } catch { return 0; }
  });

  useEffect(() => {
    if (!started || over || won) return;
    const t = setInterval(() => setTime(v => v + 1), 1000);
    return () => clearInterval(t);
  }, [started, over, won]);

  // Handle diff change
  useEffect(() => {
    const cfg = SETTINGS[diff];
    setBoard(makeBoard(cfg.size, cfg.mines));
    setOver(false); setWon(false); setFlags(0); setTime(0); setStarted(false);
  }, [diff]);

  const checkWin = useCallback((b: Board) =>
    b.every(row => row.every(c => c.mine || c.revealed)), []);

  const flood = useCallback((b: Board, r: number, c: number) => {
    const cfg = SETTINGS[diff];
    if (r < 0 || r >= cfg.size || c < 0 || c >= cfg.size) return;
    if (b[r][c].revealed || b[r][c].flagged || b[r][c].mine) return;
    b[r][c].revealed = true;
    if (b[r][c].adj === 0)
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) flood(b, r + dr, c + dc);
  }, [diff]);

  const reveal = (r: number, c: number) => {
    if (over || won) return;
    const cell = board[r][c];
    if (cell.revealed || cell.flagged) return;
    if (!started) setStarted(true);
    if (cell.mine) {
      const nb = board.map(row => row.map(c => ({ ...c })));
      nb.forEach(row => row.forEach(c => { if (c.mine) c.revealed = true; }));
      setBoard(nb); setOver(true); return;
    }
    const nb = board.map(row => row.map(c => ({ ...c })));
    flood(nb, r, c);
    setBoard(nb);
    if (checkWin(nb)) {
      setWon(true);
      if (best === 0 || time < best) {
        setBest(time);
        try { localStorage.setItem('mine_best', String(time)); } catch {}
      }
    }
  };

  const flag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (over || won || board[r][c].revealed) return;
    if (!started) setStarted(true);
    const nb = board.map(row => row.map(c => ({ ...c })));
    nb[r][c].flagged = !nb[r][c].flagged;
    setBoard(nb);
    setFlags(f => nb[r][c].flagged ? f + 1 : f - 1);
  };

  const reset = () => {
    const cfg = SETTINGS[diff];
    setBoard(makeBoard(cfg.size, cfg.mines)); setOver(false); setWon(false); setFlags(0); setTime(0); setStarted(false);
  };

  const cfg = SETTINGS[diff];
  const revealed = board.flat().filter(c => c.revealed && !c.mine).length;
  const total = cfg.size * cfg.size - cfg.mines;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full max-w-[420px] items-center justify-between px-1 flex-wrap gap-2">
        <div className="flex gap-4">
          <div><p className="font-mono text-[10px] uppercase text-white/40">Mines</p><p className="text-xl font-bold text-white">{cfg.mines - flags}</p></div>
          <div><p className="font-mono text-[10px] uppercase text-white/40">Time</p><p className="text-xl font-bold text-cyan-300">{time}s</p></div>
          <div><p className="font-mono text-[10px] uppercase text-white/40">Progress</p><p className="text-xl font-bold text-white">{Math.round((revealed / total) * 100)}%</p></div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex rounded-lg overflow-hidden border border-white/10">
            {(['easy','medium','hard'] as Difficulty[]).map(d => (
              <button key={d} onClick={() => { if (!started) setDiff(d); }}
                className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition ${diff === d ? 'bg-cyan-400 text-slate-950' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>{d}</button>
            ))}
          </div>
          <button type="button" className="h-8 rounded-lg bg-cyan-400 px-4 text-xs font-bold text-slate-950 transition hover:bg-cyan-300" onClick={reset}>New</button>
        </div>
      </div>

      <div
        className="grid aspect-square w-full max-w-[420px] gap-[3px] rounded-xl border border-cyan-400/15 bg-slate-900/50 p-2"
        style={{ gridTemplateColumns: `repeat(${cfg.size}, minmax(0, 1fr))` }}
      >
        {board.flatMap((row, r) =>
          row.map((cell, c) => {
            let bg = 'bg-white/10 hover:bg-white/20 cursor-pointer';
            let content = '';
            let style: React.CSSProperties = {};

            if (cell.revealed) {
              if (cell.mine) { bg = 'bg-red-500/30'; content = '💣'; }
              else {
                bg = 'bg-white/[0.04]';
                if (cell.adj > 0) { content = String(cell.adj); style = { color: COLORS[cell.adj] }; }
              }
            } else if (cell.flagged) { content = '🚩'; }

            return (
              <button
                key={`${r}-${c}`}
                type="button"
                className={`flex items-center justify-center rounded-md ${cfg.size > 10 ? 'text-xs' : 'text-sm'} font-bold transition-all ${bg} ${cell.revealed ? '' : 'active:scale-90'}`}
                style={style}
                onClick={() => reveal(r, c)}
                onContextMenu={e => flag(e, r, c)}
              >
                {content}
              </button>
            );
          })
        )}
      </div>

      {(won || over) && (
        <div className="text-center">
          <p className={`text-lg font-bold ${won ? 'text-emerald-400' : 'text-red-400'}`}>
            {won ? '🎉 You Win!' : '💥 Game Over!'}
          </p>
          <p className="text-sm text-white/50">{won ? `Cleared in ${time}s` : 'Click New Game to try again'}</p>
        </div>
      )}

      <p className="text-xs text-white/30">Left click to reveal • Right click to flag</p>
    </div>
  );
}
