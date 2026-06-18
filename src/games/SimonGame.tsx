import { useCallback, useEffect, useRef, useState } from 'react';

const COLORS = ['#f87171', '#4ade80', '#60a5fa', '#fde047'];
const LIGHT_COLORS = ['#fca5a5', '#86efac', '#93c5fd', '#fef08a'];

export function SimonGame() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSeq, setPlayerSeq] = useState<number[]>([]);
  const [activeBtn, setActiveBtn] = useState<number | null>(null);
  const [phase, setPhase] = useState<'idle' | 'showing' | 'input' | 'over'>('idle');
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => {
    try { return Number(localStorage.getItem('simon_best') ?? 0); } catch { return 0; }
  });
  const timeoutRef = useRef<number[]>([]);

  const clearTimeouts = () => {
    timeoutRef.current.forEach(clearTimeout);
    timeoutRef.current = [];
  };

  const flash = useCallback((idx: number, duration = 400) => {
    setActiveBtn(idx);
    return new Promise<void>(resolve => {
      const t = window.setTimeout(() => {
        setActiveBtn(null);
        const t2 = window.setTimeout(resolve, 150);
        timeoutRef.current.push(t2);
      }, duration);
      timeoutRef.current.push(t);
    });
  }, []);

  const playSequence = useCallback(async (seq: number[]) => {
    setPhase('showing');
    await new Promise<void>(r => { const t = window.setTimeout(r, 500); timeoutRef.current.push(t); });
    for (const idx of seq) {
      await flash(idx, Math.max(200, 500 - seq.length * 20));
    }
    setPhase('input');
    setPlayerSeq([]);
  }, [flash]);

  const startGame = useCallback(() => {
    clearTimeouts();
    const first = Math.floor(Math.random() * 4);
    const seq = [first];
    setSequence(seq);
    setScore(0);
    setPhase('showing');
    playSequence(seq);
  }, [playSequence]);

  const addToSequence = useCallback(() => {
    const next = Math.floor(Math.random() * 4);
    setSequence(prev => {
      const ns = [...prev, next];
      playSequence(ns);
      return ns;
    });
  }, [playSequence]);

  const handlePress = useCallback(async (idx: number) => {
    if (phase !== 'input') return;

    await flash(idx, 250);
    const nextPlayer = [...playerSeq, idx];
    setPlayerSeq(nextPlayer);

    const step = nextPlayer.length - 1;
    if (sequence[step] !== idx) {
      // Wrong!
      setPhase('over');
      const finalScore = sequence.length - 1;
      setScore(finalScore);
      setBest(b => {
        const nb = Math.max(b, finalScore);
        try { localStorage.setItem('simon_best', String(nb)); } catch {}
        return nb;
      });
      return;
    }

    if (nextPlayer.length === sequence.length) {
      // Round complete!
      setScore(sequence.length);
      setBest(b => {
        const nb = Math.max(b, sequence.length);
        try { localStorage.setItem('simon_best', String(nb)); } catch {}
        return nb;
      });
      await new Promise<void>(r => { const t = window.setTimeout(r, 600); timeoutRef.current.push(t); });
      addToSequence();
    }
  }, [phase, playerSeq, sequence, flash, addToSequence]);

  useEffect(() => { return () => clearTimeouts(); }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full max-w-[380px] items-center justify-between px-1">
        <div className="flex gap-4">
          <div><p className="font-mono text-[10px] uppercase text-white/40">Round</p><p className="text-xl font-bold text-white">{score}</p></div>
          <div><p className="font-mono text-[10px] uppercase text-white/40">Best</p><p className="text-xl font-bold text-blue-300">{best}</p></div>
          <div><p className="font-mono text-[10px] uppercase text-white/40">Status</p><p className="text-sm font-bold text-white/60">
            {phase === 'idle' ? 'Ready' : phase === 'showing' ? 'Watch...' : phase === 'input' ? 'Your turn!' : 'Game Over'}
          </p></div>
        </div>
        <button
          type="button"
          className="h-8 rounded-lg bg-blue-400 px-4 text-xs font-bold text-slate-950 transition hover:bg-blue-300"
          onClick={startGame}
        >
          {phase === 'over' ? 'Retry' : phase === 'idle' ? 'Start' : 'Restart'}
        </button>
      </div>

      <div className="grid w-full max-w-[320px] grid-cols-2 gap-4 aspect-square">
        {[0, 1, 2, 3].map(idx => (
          <button
            key={idx}
            type="button"
            disabled={phase !== 'input'}
            onClick={() => handlePress(idx)}
            className="rounded-3xl border-2 transition-all duration-150 active:scale-95"
            style={{
              backgroundColor: activeBtn === idx ? LIGHT_COLORS[idx] : COLORS[idx],
              borderColor: activeBtn === idx ? '#fff' : 'rgba(255,255,255,0.15)',
              opacity: activeBtn === idx ? 1 : 0.6,
              boxShadow: activeBtn === idx ? `0 0 30px ${COLORS[idx]}88` : 'none',
              cursor: phase === 'input' ? 'pointer' : 'default',
            }}
          />
        ))}
      </div>

      {phase === 'over' && (
        <div className="text-center">
          <p className="text-lg font-bold text-red-400">Wrong! Game Over</p>
          <p className="text-sm text-white/50">You reached round {score}</p>
        </div>
      )}

      <p className="text-xs text-white/30">Watch the pattern, then repeat it • Gets harder each round</p>
    </div>
  );
}
