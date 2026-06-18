import { useEffect, useRef, useState } from 'react';

const W = 480, H = 360;
const BALL_R = 7;
const ROWS = 5, BCOLS = 9, BH = 16, BPAD = 5, BTOP = 35;
const COLORS = ['#f87171','#fb923c','#fde047','#4ade80','#60a5fa'];

type Brick = { x: number; y: number; w: number; alive: boolean; color: string };
type Difficulty = 'easy' | 'medium' | 'hard';

const SETTINGS: Record<Difficulty, { paddleW: number, speedX: number, speedY: number }> = {
  easy:   { paddleW: 110, speedX: 2.5, speedY: -2.5 },
  medium: { paddleW: 90,  speedX: 3.5, speedY: -3.5 },
  hard:   { paddleW: 70,  speedX: 4.5, speedY: -4.5 },
};

export function BreakoutGame() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [diff, setDiff] = useState<Difficulty>('easy');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [over, setOver] = useState(false);
  const [won, setWon] = useState(false);
  const [running, setRunning] = useState(false);
  const [best, setBest] = useState(() => {
    try { return Number(localStorage.getItem('breakout_best') ?? 0); } catch { return 0; }
  });

  const s = useRef({
    px: W / 2 - SETTINGS.easy.paddleW / 2,
    bx: W / 2, by: H - 35,
    dx: SETTINGS.easy.speedX, dy: SETTINGS.easy.speedY,
    bricks: [] as Brick[],
    score: 0, lives: 3, over: false, won: false,
  });

  const mkBricks = () => {
    const bricks: Brick[] = [];
    const bw = (W - BPAD * (BCOLS + 1)) / BCOLS;
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < BCOLS; c++)
        bricks.push({ x: BPAD + c * (bw + BPAD), y: BTOP + r * (BH + BPAD), w: bw, alive: true, color: COLORS[r] });
    return bricks;
  };

  const resetBall = () => {
    const cfg = SETTINGS[diff];
    s.current.bx = W / 2; s.current.by = H - 35;
    s.current.dx = cfg.speedX * (Math.random() > 0.5 ? 1 : -1); s.current.dy = cfg.speedY;
  };

  const reset = () => {
    const cfg = SETTINGS[diff];
    const st = s.current;
    st.px = W / 2 - cfg.paddleW / 2; st.bricks = mkBricks(); st.score = 0; st.lives = 3; st.over = false; st.won = false;
    resetBall(); setScore(0); setLives(3); setOver(false); setWon(false); setRunning(false);
  };

  useEffect(() => { s.current.bricks = mkBricks(); }, []);

  // Update speed/paddle if difficulty changes while not running
  useEffect(() => {
    if (!running && !over && !won) {
      reset();
    }
  }, [diff]);

  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const move = (cx: number) => {
      const cfg = SETTINGS[diff];
      const rect = cv.getBoundingClientRect();
      const rx = (cx - rect.left) * (W / rect.width);
      s.current.px = Math.max(0, Math.min(W - cfg.paddleW, rx - cfg.paddleW / 2));
    };
    const mm = (e: MouseEvent) => move(e.clientX);
    const tm = (e: TouchEvent) => { e.preventDefault(); move(e.touches[0].clientX); };
    cv.addEventListener('mousemove', mm);
    cv.addEventListener('touchmove', tm, { passive: false });
    return () => { cv.removeEventListener('mousemove', mm); cv.removeEventListener('touchmove', tm); };
  }, [diff]);

  useEffect(() => {
    if (!running || over || won) return;
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d'); if (!ctx) return;
    let id: number;
    const cfg = SETTINGS[diff];

    const loop = () => {
      const st = s.current;
      if (st.over || st.won) return;
      st.bx += st.dx; st.by += st.dy;
      if (st.bx - BALL_R <= 0 || st.bx + BALL_R >= W) st.dx = -st.dx;
      if (st.by - BALL_R <= 0) st.dy = -st.dy;
      if (st.by + BALL_R >= H - 12 - 6 && st.bx >= st.px && st.bx <= st.px + cfg.paddleW && st.dy > 0) {
        st.dy = -st.dy;
        // More angle control on harder difficulty since paddle is smaller
        st.dx = cfg.speedX * 1.5 * ((st.bx - st.px) / cfg.paddleW - 0.5);
      }
      if (st.by + BALL_R >= H) {
        st.lives--; setLives(st.lives);
        if (st.lives <= 0) { st.over = true; setOver(true); setRunning(false); return; }
        resetBall();
      }
      for (const br of st.bricks) {
        if (!br.alive) continue;
        if (st.bx + BALL_R > br.x && st.bx - BALL_R < br.x + br.w && st.by + BALL_R > br.y && st.by - BALL_R < br.y + BH) {
          br.alive = false; st.dy = -st.dy; st.score += 10;
          setScore(st.score);
          setBest(b => { const nb = Math.max(b, st.score); try { localStorage.setItem('breakout_best', String(nb)); } catch {} return nb; });
          break;
        }
      }
      if (st.bricks.every(b => !b.alive)) { st.won = true; setWon(true); setRunning(false); return; }

      // Draw
      ctx.clearRect(0, 0, W, H);
      for (const br of st.bricks) {
        if (!br.alive) continue;
        ctx.fillStyle = br.color;
        ctx.shadowColor = br.color; ctx.shadowBlur = 6;
        ctx.beginPath(); ctx.roundRect(br.x, br.y, br.w, BH, 4); ctx.fill();
      }
      ctx.shadowBlur = 0;

      // Paddle
      const grad = ctx.createLinearGradient(st.px, 0, st.px + cfg.paddleW, 0);
      grad.addColorStop(0, '#e2e8f0'); grad.addColorStop(1, '#94a3b8');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.roundRect(st.px, H - 12 - 6, cfg.paddleW, 12, 6); ctx.fill();

      // Ball
      ctx.fillStyle = '#fbbf24'; ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 14;
      ctx.beginPath(); ctx.arc(st.bx, st.by, BALL_R, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;

      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [running, over, won, diff]);

  // Initial draw
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d'); if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    const cfg = SETTINGS[diff];
    for (const br of s.current.bricks) { ctx.fillStyle = br.color; ctx.beginPath(); ctx.roundRect(br.x, br.y, br.w, BH, 4); ctx.fill(); }
    ctx.fillStyle = '#e2e8f0'; ctx.beginPath(); ctx.roundRect(s.current.px, H - 12 - 6, cfg.paddleW, 12, 6); ctx.fill();
    ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(s.current.bx, s.current.by, BALL_R, 0, Math.PI * 2); ctx.fill();
  }, [diff, running]); // redraw on diff change

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full max-w-[500px] items-center justify-between px-1 flex-wrap gap-2">
        <div className="flex gap-4">
          <div><p className="font-mono text-[10px] uppercase text-white/40">Score</p><p className="text-xl font-bold text-white">{score}</p></div>
          <div><p className="font-mono text-[10px] uppercase text-white/40">Best</p><p className="text-xl font-bold text-amber-300">{best}</p></div>
          <div><p className="font-mono text-[10px] uppercase text-white/40">Lives</p><p className="text-xl font-bold text-white">{'❤️'.repeat(lives)}</p></div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex rounded-lg overflow-hidden border border-white/10">
            {(['easy','medium','hard'] as Difficulty[]).map(d => (
              <button key={d} onClick={() => { if (!running) setDiff(d); }}
                className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition ${diff === d ? 'bg-amber-400 text-slate-950' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>{d}</button>
            ))}
          </div>
          <button type="button" className="h-8 rounded-lg bg-amber-400 px-3 text-xs font-bold text-slate-950 transition hover:bg-amber-300" onClick={() => { if (over) reset(); setRunning(v => !v); }}>
            {over ? 'Retry' : running ? 'Pause' : 'Start'}
          </button>
          <button type="button" className="h-8 rounded-lg border border-white/15 bg-white/5 px-3 text-xs text-white/70 transition hover:bg-white/10" onClick={reset}>Reset</button>
        </div>
      </div>

      <canvas ref={ref} width={W} height={H} className="w-full max-w-[500px] rounded-xl border border-amber-400/15 bg-slate-900/50" />

      {(won || over) && (
        <div className="text-center">
          <p className={`text-lg font-bold ${won ? 'text-emerald-400' : 'text-red-400'}`}>
            {won ? '🎉 All bricks destroyed!' : 'Game Over!'}
          </p>
          <p className="text-sm text-white/50">Score: {score}</p>
        </div>
      )}

      <p className="text-xs text-white/30">Move mouse to control paddle</p>
    </div>
  );
}
