import { useEffect, useRef, useState } from 'react';

const W = 320, H = 480;
const BIRD_X = 80, BIRD_R = 14;

type Difficulty = 'easy' | 'medium' | 'hard';
type Pipe = { x: number; topH: number };

const SETTINGS: Record<Difficulty, { pipeW: number, gap: number, speed: number, gravity: number, jump: number, freq: number }> = {
  easy:   { pipeW: 52, gap: 160, speed: 1.5, gravity: 0.25, jump: -5.5, freq: 120 },
  medium: { pipeW: 52, gap: 130, speed: 2.0, gravity: 0.35, jump: -6.5, freq: 100 },
  hard:   { pipeW: 52, gap: 110, speed: 2.5, gravity: 0.45, jump: -7.5, freq: 90 },
};

export function FlappyGame() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [diff, setDiff] = useState<Difficulty>('easy');
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [best, setBest] = useState(() => {
    try { return Number(localStorage.getItem('flappy_best') ?? 0); } catch { return 0; }
  });

  const s = useRef({
    by: H / 2, vy: 0,
    pipes: [] as Pipe[],
    score: 0, over: false, started: false,
    frame: 0,
  });

  const jump = () => {
    if (s.current.over) return;
    if (!s.current.started) s.current.started = true;
    s.current.vy = SETTINGS[diff].jump;
    if (!started) setStarted(true);
  };

  const reset = () => {
    s.current = { by: H / 2, vy: 0, pipes: [], score: 0, over: false, started: false, frame: 0 };
    setScore(0); setOver(false); setStarted(false);
  };

  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d'); if (!ctx) return;
    let id: number;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowUp') { e.preventDefault(); e.stopPropagation(); jump(); }
    };
    const onClick = () => jump();
    window.addEventListener('keydown', onKey);
    cv.addEventListener('click', onClick);
    cv.addEventListener('touchstart', onClick, { passive: true });

    const loop = () => {
      const st = s.current;
      const cfg = SETTINGS[diff];
      ctx.clearRect(0, 0, W, H);

      // BG gradient
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#0f172a'); bg.addColorStop(1, '#1e293b');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      // Ground
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, H - 40, W, 40);
      ctx.fillStyle = '#475569';
      ctx.fillRect(0, H - 40, W, 3);

      if (st.started && !st.over) {
        st.vy += cfg.gravity;
        st.by += st.vy;
        st.frame++;

        // Spawn pipes
        if (st.frame % cfg.freq === 0) {
          const topH = 60 + Math.random() * (H - cfg.gap - 140);
          st.pipes.push({ x: W, topH });
        }

        // Move pipes & score
        for (const p of st.pipes) {
          p.x -= cfg.speed;
          if (Math.abs(p.x + cfg.pipeW / 2 - BIRD_X) < cfg.speed) {
            st.score++;
            setScore(st.score);
            setBest(b => { const nb = Math.max(b, st.score); try { localStorage.setItem('flappy_best', String(nb)); } catch {} return nb; });
          }
        }
        st.pipes = st.pipes.filter(p => p.x + cfg.pipeW > -10);

        // Collision
        if (st.by - BIRD_R <= 0 || st.by + BIRD_R >= H - 40) {
          st.over = true; setOver(true);
        }
        for (const p of st.pipes) {
          if (BIRD_X + BIRD_R > p.x && BIRD_X - BIRD_R < p.x + cfg.pipeW) {
            if (st.by - BIRD_R < p.topH || st.by + BIRD_R > p.topH + cfg.gap) {
              st.over = true; setOver(true);
            }
          }
        }
      }

      // Draw pipes
      for (const p of st.pipes) {
        const grad = ctx.createLinearGradient(p.x, 0, p.x + cfg.pipeW, 0);
        grad.addColorStop(0, '#4ade80'); grad.addColorStop(1, '#22c55e');
        ctx.fillStyle = grad;
        // Top pipe
        ctx.beginPath(); ctx.roundRect(p.x, 0, cfg.pipeW, p.topH, [0, 0, 8, 8]); ctx.fill();
        // Bottom pipe
        ctx.beginPath(); ctx.roundRect(p.x, p.topH + cfg.gap, cfg.pipeW, H - p.topH - cfg.gap, [8, 8, 0, 0]); ctx.fill();
        // Caps
        ctx.fillStyle = '#86efac';
        ctx.fillRect(p.x - 4, p.topH - 18, cfg.pipeW + 8, 18);
        ctx.fillRect(p.x - 4, p.topH + cfg.gap, cfg.pipeW + 8, 18);
      }

      // Bird
      const angle = Math.min(Math.max(st.vy * 4, -30), 70) * (Math.PI / 180);
      ctx.save();
      ctx.translate(BIRD_X, st.by);
      ctx.rotate(angle);
      // Body
      ctx.fillStyle = '#fbbf24'; ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.ellipse(0, 0, BIRD_R + 2, BIRD_R, 0, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
      // Eye
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(6, -4, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.arc(7, -4, 2.5, 0, Math.PI * 2); ctx.fill();
      // Beak
      ctx.fillStyle = '#f97316'; ctx.beginPath(); ctx.moveTo(12, 0); ctx.lineTo(20, -2); ctx.lineTo(12, 4); ctx.fill();
      // Wing
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath(); ctx.ellipse(-4, 3, 8, 5, -0.3 + Math.sin(st.frame * 0.3) * 0.4, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      // Score display
      ctx.fillStyle = '#fff'; ctx.font = 'bold 32px monospace'; ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 4;
      ctx.fillText(String(st.score), W / 2, 60);
      ctx.shadowBlur = 0;

      if (!st.started) {
        ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = '14px monospace'; ctx.textAlign = 'center';
        ctx.fillText('Click or Space to start', W / 2, H / 2 + 50);
      }

      id = requestAnimationFrame(loop);
    };

    id = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('keydown', onKey);
      cv.removeEventListener('click', onClick);
      cv.removeEventListener('touchstart', onClick);
    };
  }, [diff]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full max-w-[340px] items-center justify-between px-1 flex-wrap gap-2">
        <div className="flex gap-4">
          <div><p className="font-mono text-[10px] uppercase text-white/40">Score</p><p className="text-xl font-bold text-white">{score}</p></div>
          <div><p className="font-mono text-[10px] uppercase text-white/40">Best</p><p className="text-xl font-bold text-green-300">{best}</p></div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex rounded-lg overflow-hidden border border-white/10">
            {(['easy','medium','hard'] as Difficulty[]).map(d => (
              <button key={d} onClick={() => { if (!started) setDiff(d); }}
                className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition ${diff === d ? 'bg-green-400 text-slate-950' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>{d}</button>
            ))}
          </div>
          <button type="button" className="h-8 rounded-lg bg-green-400 px-3 text-xs font-bold text-slate-950 transition hover:bg-green-300" onClick={reset}>
            {over ? 'Retry' : 'Reset'}
          </button>
        </div>
      </div>

      <canvas
        ref={ref}
        width={W}
        height={H}
        className="w-full max-w-[340px] rounded-xl border border-green-400/15 cursor-pointer"
      />

      {over && (
        <div className="text-center">
          <p className="text-lg font-bold text-red-400">💥 Crashed!</p>
          <p className="text-sm text-white/50">Score: {score} | Click Retry</p>
        </div>
      )}

      <p className="text-xs text-white/30">Click or Space to flap</p>
    </div>
  );
}
