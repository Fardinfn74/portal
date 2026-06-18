import { useEffect, useRef, useState } from 'react';

const W = 320, H = 480;
const D_W = 20, D_H = 20; // Doodle size
const P_W = 60, P_H = 10; // Platform size
const GRAVITY = 0.35, JUMP = -8.5;

type Difficulty = 'easy' | 'medium' | 'hard';
type Platform = { x: number; y: number; type: 'normal' | 'moving' | 'breakable'; dir?: number };

const SETTINGS: Record<Difficulty, { platDist: number, movingChance: number, breakChance: number }> = {
  easy:   { platDist: 60, movingChance: 0.05, breakChance: 0.05 },
  medium: { platDist: 85, movingChance: 0.2, breakChance: 0.1 },
  hard:   { platDist: 110, movingChance: 0.4, breakChance: 0.2 },
};

export function JumperGame() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [diff, setDiff] = useState<Difficulty>('medium');
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [best, setBest] = useState(() => {
    try { return Number(localStorage.getItem('jumper_best') ?? 0); } catch { return 0; }
  });

  const keys = useRef({ left: false, right: false });

  const s = useRef({
    px: W / 2, py: H / 2, vy: 0,
    plats: [] as Platform[],
    score: 0, over: false, started: false, maxScore: 0,
    camY: 0
  });

  const initPlats = (cfg: { platDist: number, movingChance: number, breakChance: number }) => {
    const p: Platform[] = [{ x: W/2 - P_W/2, y: H - 20, type: 'normal' }]; // starting platform directly under player
    for (let i = 1; i < 15; i++) {
      const typeRoll = Math.random();
      const type = typeRoll < cfg.breakChance ? 'breakable' : typeRoll < cfg.breakChance + cfg.movingChance ? 'moving' : 'normal';
      p.push({
        x: Math.random() * (W - P_W),
        y: H - 20 - i * cfg.platDist + (Math.random() * 20 - 10),
        type,
        dir: type === 'moving' ? (Math.random() > 0.5 ? 1 : -1) : 0
      });
    }
    return p;
  };

  const reset = () => {
    s.current = { px: W / 2, py: H / 2, vy: JUMP, plats: initPlats(SETTINGS[diff]), score: 0, over: false, started: true, maxScore: 0, camY: 0 };
    setScore(0); setOver(false); setStarted(true);
  };

  // Start immediately on mount or difficulty change
  useEffect(() => {
    if (!started && !over) {
      reset();
    }
  }, [diff]);

  useEffect(() => {
    const onKeyD = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') keys.current.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd') keys.current.right = true;
    };
    const onKeyU = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') keys.current.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd') keys.current.right = false;
    };
    window.addEventListener('keydown', onKeyD);
    window.addEventListener('keyup', onKeyU);
    return () => { window.removeEventListener('keydown', onKeyD); window.removeEventListener('keyup', onKeyU); };
  }, []);

  useEffect(() => {
    if (over) return;
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d'); if (!ctx) return;
    let id: number;

    const loop = () => {
      const st = s.current;
      const cfg = SETTINGS[diff];
      ctx.clearRect(0, 0, W, H);

      // BG grid
      ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1;
      for (let i = 0; i < W; i += 20) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke(); }
      for (let i = (st.camY % 20); i < H; i += 20) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke(); }

      if (st.started && !st.over) {
        st.vy += GRAVITY;
        st.py += st.vy;

        // Move horizontally
        if (keys.current.left) st.px -= 5;
        if (keys.current.right) st.px += 5;

        // Screen wrap
        if (st.px < -D_W) st.px = W;
        if (st.px > W) st.px = -D_W;

        // Camera scroll
        if (st.py < H / 2) {
          const diffY = H / 2 - st.py;
          st.py = H / 2;
          st.camY += diffY;
          st.maxScore += diffY;
          st.score = Math.floor(st.maxScore / 10);
          setScore(st.score);
          setBest(b => { const nb = Math.max(b, st.score); try { localStorage.setItem('jumper_best', String(nb)); } catch {} return nb; });
          for (const p of st.plats) p.y += diffY;
        }

        // Platform logic
        for (const p of st.plats) {
          if (p.type === 'moving') {
            p.x += (p.dir ?? 1) * 2;
            if (p.x < 0 || p.x > W - P_W) p.dir = -(p.dir ?? 1);
          }
          // Collision: falling down, doodle bottom crosses platform top
          if (st.vy > 0 && st.py + D_H/2 >= p.y && st.py - st.vy + D_H/2 <= p.y + P_H && st.px + D_W/2 > p.x && st.px - D_W/2 < p.x + P_W) {
            if (p.type === 'breakable') {
              p.y = 9999; // break it
            } else {
              st.vy = JUMP;
            }
          }
        }

        // Remove old plats, spawn new ones
        st.plats = st.plats.filter(p => p.y < H);
        while (st.plats.length < 15) {
          const highestY = Math.min(...st.plats.map(p => p.y));
          const typeRoll = Math.random();
          const type = typeRoll < cfg.breakChance ? 'breakable' : typeRoll < cfg.breakChance + cfg.movingChance ? 'moving' : 'normal';
          st.plats.push({
            x: Math.random() * (W - P_W),
            y: highestY - cfg.platDist + (Math.random() * 20 - 10),
            type, dir: type === 'moving' ? (Math.random() > 0.5 ? 1 : -1) : 0
          });
        }

        if (st.py > H) { st.over = true; setOver(true); }
      }

      // Draw Platforms
      for (const p of st.plats) {
        if (p.type === 'normal') ctx.fillStyle = '#22c55e';
        else if (p.type === 'moving') ctx.fillStyle = '#3b82f6';
        else ctx.fillStyle = '#b45309'; // breakable
        ctx.beginPath(); ctx.roundRect(p.x, p.y, P_W, P_H, 4); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillRect(p.x, p.y, P_W, 3);
      }

      // Draw Doodle
      ctx.fillStyle = '#a3e635';
      ctx.beginPath(); ctx.roundRect(st.px - D_W/2, st.py - D_H/2, D_W, D_H, 6); ctx.fill();
      // Eyes
      ctx.fillStyle = '#000';
      ctx.beginPath(); ctx.arc(st.px - 3, st.py - 2, 2, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(st.px + 5, st.py - 2, 2, 0, Math.PI*2); ctx.fill();
      // Snout
      ctx.fillStyle = '#84cc16';
      ctx.beginPath(); ctx.ellipse(st.px + (keys.current.right ? 6 : keys.current.left ? -6 : 0), st.py + 4, 6, 3, 0, 0, Math.PI*2); ctx.fill();

      id = requestAnimationFrame(loop);
    };

    id = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(id);
    };
  }, [diff, over]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full max-w-[340px] items-center justify-between px-1 flex-wrap gap-2">
        <div className="flex gap-4">
          <div><p className="font-mono text-[10px] uppercase text-white/40">Score</p><p className="text-xl font-bold text-white">{score}</p></div>
          <div><p className="font-mono text-[10px] uppercase text-white/40">Best</p><p className="text-xl font-bold text-lime-400">{best}</p></div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex rounded-lg overflow-hidden border border-white/10">
            {(['easy','medium','hard'] as Difficulty[]).map(d => (
              <button key={d} onClick={() => setDiff(d)}
                className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition ${diff === d ? 'bg-lime-400 text-slate-950' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>{d}</button>
            ))}
          </div>
          <button type="button" className="h-8 rounded-lg bg-lime-400 px-3 text-xs font-bold text-slate-950 transition hover:bg-lime-300" onClick={reset}>
            {over ? 'Retry' : 'Reset'}
          </button>
        </div>
      </div>

      <canvas ref={ref} width={W} height={H} className="w-full max-w-[340px] rounded-xl border border-lime-400/15 cursor-none touch-none bg-white" />

      {over && (
        <div className="text-center">
          <p className="text-lg font-bold text-red-400">💥 You fell!</p>
          <p className="text-sm text-white/50">Score: {score} | Click Retry</p>
        </div>
      )}

      <p className="text-xs text-white/30">Arrows or A/D to steer • Wraps around edges</p>
    </div>
  );
}
