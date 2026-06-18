import { useCallback, useEffect, useRef, useState } from 'react';

type Player = 'X' | 'O';
type Cell = Player | null;
type Board = Cell[];
type Difficulty = 'easy' | 'medium' | 'hard';

const LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
];

const checkWin = (b: Board): Player | null => {
  for (const [a, c, d] of LINES) {
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
  }
  return null;
};

const getAvailable = (b: Board) => {
  const av = [];
  for (let i = 0; i < 9; i++) if (!b[i]) av.push(i);
  return av;
};

const minimax = (b: Board, isMax: boolean, alpha: number, beta: number): number => {
  const w = checkWin(b);
  if (w === 'O') return 10;
  if (w === 'X') return -10;
  if (b.every(c => c !== null)) return 0;

  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (b[i]) continue;
      b[i] = 'O';
      best = Math.max(best, minimax(b, false, alpha, beta));
      b[i] = null;
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (b[i]) continue;
      b[i] = 'X';
      best = Math.min(best, minimax(b, true, alpha, beta));
      b[i] = null;
      beta = Math.min(beta, best);
      if (beta <= alpha) break;
    }
    return best;
  }
};

const aiMove = (b: Board, diff: Difficulty): number => {
  const av = getAvailable(b);
  if (av.length === 0) return -1;
  
  if (diff === 'easy') {
    return av[Math.floor(Math.random() * av.length)];
  }
  
  if (diff === 'medium') {
    // 40% chance random
    if (Math.random() < 0.4) {
      return av[Math.floor(Math.random() * av.length)];
    }
  }

  // hard or medium(60%) uses minimax
  let bestVal = -Infinity, bestMove = -1;
  for (let i = 0; i < 9; i++) {
    if (b[i]) continue;
    b[i] = 'O';
    const val = minimax(b, false, -Infinity, Infinity);
    b[i] = null;
    if (val > bestVal) { bestVal = val; bestMove = i; }
  }
  // Fallback to random if minimax somehow fails (shouldn't)
  return bestMove !== -1 ? bestMove : av[0];
};

export function TicTacToeGame() {
  const [diff, setDiff] = useState<Difficulty>('hard');
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [turn, setTurn] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | null>(null);
  const [draw, setDraw] = useState(false);
  const [winLine, setWinLine] = useState<number[] | null>(null);
  const [stats, setStats] = useState({ wins: 0, losses: 0, draws: 0 });
  const aiThinking = useRef(false);

  const checkResult = useCallback((b: Board) => {
    const w = checkWin(b);
    if (w) {
      setWinner(w);
      const line = LINES.find(([a, c, d]) => b[a] === w && b[c] === w && b[d] === w);
      setWinLine(line ?? null);
      setStats(s => w === 'X' ? { ...s, wins: s.wins + 1 } : { ...s, losses: s.losses + 1 });
      return true;
    }
    if (b.every(c => c !== null)) {
      setDraw(true);
      setStats(s => ({ ...s, draws: s.draws + 1 }));
      return true;
    }
    return false;
  }, []);

  const play = (i: number) => {
    if (board[i] || winner || draw || turn !== 'X' || aiThinking.current) return;
    const nb = [...board];
    nb[i] = 'X';
    setBoard(nb);
    if (!checkResult(nb)) {
      setTurn('O');
    }
  };

  // AI turn
  useEffect(() => {
    if (turn !== 'O' || winner || draw) return;
    aiThinking.current = true;
    const t = setTimeout(() => {
      const b = [...board];
      const move = aiMove(b, diff);
      if (move >= 0) {
        b[move] = 'O';
        setBoard(b);
        checkResult(b);
      }
      setTurn('X');
      aiThinking.current = false;
    }, 400);
    return () => clearTimeout(t);
  }, [turn, winner, draw, board, checkResult, diff]);

  const reset = () => {
    setBoard(Array(9).fill(null)); setTurn('X'); setWinner(null); setDraw(false); setWinLine(null);
  };
  
  // reset on diff change
  useEffect(() => {
    if (board.some(c => c !== null) && !winner && !draw) reset();
  }, [diff]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full max-w-[320px] items-center justify-between px-1 flex-wrap gap-2">
        <div className="flex gap-3">
          <div><p className="font-mono text-[10px] uppercase text-white/40">Wins</p><p className="text-xl font-bold text-emerald-400">{stats.wins}</p></div>
          <div><p className="font-mono text-[10px] uppercase text-white/40">Draws</p><p className="text-xl font-bold text-white">{stats.draws}</p></div>
          <div><p className="font-mono text-[10px] uppercase text-white/40">Losses</p><p className="text-xl font-bold text-red-400">{stats.losses}</p></div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex rounded-lg overflow-hidden border border-white/10">
            {(['easy','medium','hard'] as Difficulty[]).map(d => (
              <button key={d} onClick={() => setDiff(d)}
                className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition ${diff === d ? 'bg-indigo-400 text-slate-950' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>{d}</button>
            ))}
          </div>
          <button type="button" className="h-8 rounded-lg bg-indigo-400 px-4 text-xs font-bold text-slate-950 transition hover:bg-indigo-300" onClick={reset}>
            New
          </button>
        </div>
      </div>

      <div className="grid w-full max-w-[280px] grid-cols-3 gap-3 aspect-square">
        {board.map((cell, i) => {
          const isWin = winLine?.includes(i);
          return (
            <button
              key={i}
              type="button"
              onClick={() => play(i)}
              className={`flex items-center justify-center rounded-2xl text-4xl font-black transition-all duration-200 ${
                cell
                  ? isWin
                    ? 'bg-white/20 border-2 border-white/40 scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                    : 'bg-white/10 border border-white/15'
                  : 'bg-white/5 border border-white/10 hover:bg-white/15 hover:scale-105 cursor-pointer'
              }`}
              style={{ color: cell === 'X' ? '#4ade80' : cell === 'O' ? '#f87171' : 'transparent' }}
            >
              {cell ?? '·'}
            </button>
          );
        })}
      </div>

      {(winner || draw) && (
        <div className="text-center">
          <p className={`text-lg font-bold ${winner === 'X' ? 'text-emerald-400' : draw ? 'text-white' : 'text-red-400'}`}>
            {winner === 'X' ? '🎉 You Win!' : draw ? '🤝 Draw!' : '🤖 AI Wins!'}
          </p>
        </div>
      )}

      {!winner && !draw && (
        <p className="text-sm text-white/50">{turn === 'X' ? 'Your turn (X)' : '🤖 AI is thinking...'}</p>
      )}
    </div>
  );
}
