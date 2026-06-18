import { useEffect, useRef, useState } from 'react';

const W = 320, H = 480;
const SHIP_W = 24, SHIP_H = 30;
const BULLET_R = 3;

type Difficulty = 'easy' | 'medium' | 'hard';
type Bullet = { x: number; y: number; active: boolean };
type Enemy = { x: number; y: number; w: number; h: number; vy: number; hp: number; active: boolean; type: 'basic' | 'tough' | 'fast' };
type Star = { x: number; y: number; vy: number; s: number };

const SETTINGS: Record<Difficulty, { spawnRate: number, enemySpeedMult: number }> = {
  easy:   { spawnRate: 100, enemySpeedMult: 0.5 },
  medium: { spawnRate: 70, enemySpeedMult: 1.0 },
  hard:   { spawnRate: 40, enemySpeedMult: 1.5 },
};

export function SpaceGame() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [diff, setDiff] = useState<Difficulty>('medium');
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [best, setBest] = useState(() => {
    try { return Number(localStorage.getItem('space_best') ?? 0); } catch { return 0; }
  });

  const s = useRef({
    px: W / 2, py: H - 50,
    bullets: [] as Bullet[],
    enemies: [] as Enemy[],
    stars: [] as Star[],
    score: 0, over: false, started: false, frame: 0, lastShot: 0
  });

  const reset = () => {
    s.current = {
      px: W / 2, py: H - 50,
      bullets: [], enemies: [], stars: s.current.stars,
      score: 0, over: false, started: false, frame: 0, lastShot: 0
    };
    setScore(0); setOver(false); setStarted(false);
  };

  // init stars
  useEffect(() => {
    const stars: Star[] = [];
    for (let i = 0; i < 50; i++) {
      stars.push({ x: Math.random() * W, y: Math.random() * H, vy: 0.5 + Math.random() * 2, s: 1 + Math.random() * 2 });
    }
    s.current.stars = stars;
  }, []);

  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const move = (cx: number, cy: number) => {
      const rect = cv.getBoundingClientRect();
      const rx = (cx - rect.left) * (W / rect.width);
      const ry = (cy - rect.top) * (H / rect.height);
      s.current.px = Math.max(SHIP_W/2, Math.min(W - SHIP_W/2, rx));
      s.current.py = Math.max(SHIP_H/2, Math.min(H - SHIP_H/2, ry));
      if (!s.current.started && !s.current.over) {
        s.current.started = true;
        setStarted(true);
      }
    };
    const mm = (e: MouseEvent) => move(e.clientX, e.clientY);
    const tm = (e: TouchEvent) => { e.preventDefault(); move(e.touches[0].clientX, e.touches[0].clientY); };
    cv.addEventListener('mousemove', mm);
    cv.addEventListener('touchmove', tm, { passive: false });
    return () => { cv.removeEventListener('mousemove', mm); cv.removeEventListener('touchmove', tm); };
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

      // BG
      ctx.fillStyle = '#020617'; ctx.fillRect(0, 0, W, H);

      // Stars
      ctx.fillStyle = '#fff';
      for (const star of st.stars) {
        star.y += star.vy * (st.started ? 2 : 0.5);
        if (star.y > H) { star.y = 0; star.x = Math.random() * W; }
        ctx.globalAlpha = star.s / 3;
        ctx.fillRect(star.x, star.y, star.s, star.s);
      }
      ctx.globalAlpha = 1;

      if (st.started && !st.over) {
        st.frame++;

        // Shoot
        if (st.frame - st.lastShot > 10) {
          st.bullets.push({ x: st.px, y: st.py - SHIP_H/2, active: true });
          st.bullets.push({ x: st.px - 8, y: st.py - SHIP_H/4, active: true });
          st.bullets.push({ x: st.px + 8, y: st.py - SHIP_H/4, active: true });
          st.lastShot = st.frame;
        }

        // Spawn Enemies
        if (st.frame % cfg.spawnRate === 0) {
          const r = Math.random();
          const type = r > 0.8 ? 'tough' : r > 0.6 ? 'fast' : 'basic';
          const ew = type === 'tough' ? 30 : type === 'fast' ? 16 : 24;
          st.enemies.push({
            x: ew/2 + Math.random() * (W - ew), y: -30,
            w: ew, h: ew,
            vy: (type === 'fast' ? 2.5 : type === 'tough' ? 1.0 : 1.5) * cfg.enemySpeedMult,
            hp: type === 'tough' ? 5 : 1,
            active: true, type
          });
        }

        // Move Bullets
        for (const b of st.bullets) {
          b.y -= 8;
          if (b.y < -10) b.active = false;
        }

        // Move Enemies & Collisions
        for (const e of st.enemies) {
          if (!e.active) continue;
          e.y += e.vy;
          if (e.y > H + 30) { e.active = false; continue; }

          // Player collision
          if (Math.abs(e.x - st.px) < (e.w + SHIP_W)/2 * 0.7 && Math.abs(e.y - st.py) < (e.h + SHIP_H)/2 * 0.7) {
            st.over = true; setOver(true);
            break;
          }

          // Bullet collision
          for (const b of st.bullets) {
            if (!b.active) continue;
            if (Math.abs(b.x - e.x) < e.w/2 + BULLET_R && Math.abs(b.y - e.y) < e.h/2 + BULLET_R) {
              b.active = false;
              e.hp--;
              if (e.hp <= 0) {
                e.active = false;
                st.score += e.type === 'tough' ? 50 : e.type === 'fast' ? 30 : 10;
                setScore(st.score);
                setBest(prev => { const nb = Math.max(prev, st.score); try { localStorage.setItem('space_best', String(nb)); } catch {} return nb; });
              }
            }
          }
        }

        st.bullets = st.bullets.filter(b => b.active);
        st.enemies = st.enemies.filter(e => e.active);
      }

      // Draw Bullets
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 10;
      for (const b of st.bullets) {
        ctx.beginPath(); ctx.arc(b.x, b.y, BULLET_R, 0, Math.PI*2); ctx.fill();
      }
      ctx.shadowBlur = 0;

      // Draw Enemies
      for (const e of st.enemies) {
        ctx.fillStyle = e.type === 'tough' ? '#ef4444' : e.type === 'fast' ? '#fde047' : '#a855f7';
        ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 8;
        ctx.beginPath();
        if (e.type === 'tough') {
          ctx.moveTo(e.x, e.y + e.h/2); ctx.lineTo(e.x - e.w/2, e.y - e.h/2); ctx.lineTo(e.x + e.w/2, e.y - e.h/2);
        } else if (e.type === 'fast') {
          ctx.moveTo(e.x, e.y + e.h/2); ctx.lineTo(e.x - e.w/2, e.y - e.h/4); ctx.lineTo(e.x + e.w/2, e.y - e.h/4);
        } else {
          ctx.rect(e.x - e.w/2, e.y - e.h/2, e.w, e.h);
        }
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // Draw Ship
      if (!st.over || st.frame % 10 < 5) {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(st.px, st.py - SHIP_H/2);
        ctx.lineTo(st.px - SHIP_W/2, st.py + SHIP_H/2);
        ctx.lineTo(st.px, st.py + SHIP_H/4);
        ctx.lineTo(st.px + SHIP_W/2, st.py + SHIP_H/2);
        ctx.fill();
        // Thruster
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.moveTo(st.px - 6, st.py + SHIP_H/2);
        ctx.lineTo(st.px, st.py + SHIP_H/2 + Math.random()*15);
        ctx.lineTo(st.px + 6, st.py + SHIP_H/2);
        ctx.fill();
      }

      if (!st.started) {
        ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = '14px monospace'; ctx.textAlign = 'center';
        ctx.fillText('Move mouse to start & shoot', W / 2, H / 2);
      }

      id = requestAnimationFrame(loop);
    };

    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [diff, over]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full max-w-[340px] items-center justify-between px-1 flex-wrap gap-2">
        <div className="flex gap-4">
          <div><p className="font-mono text-[10px] uppercase text-white/40">Score</p><p className="text-xl font-bold text-white">{score}</p></div>
          <div><p className="font-mono text-[10px] uppercase text-white/40">Best</p><p className="text-xl font-bold text-sky-400">{best}</p></div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex rounded-lg overflow-hidden border border-white/10">
            {(['easy','medium','hard'] as Difficulty[]).map(d => (
              <button key={d} onClick={() => { if (!started) setDiff(d); }}
                className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition ${diff === d ? 'bg-sky-400 text-slate-950' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>{d}</button>
            ))}
          </div>
          <button type="button" className="h-8 rounded-lg bg-sky-400 px-3 text-xs font-bold text-slate-950 transition hover:bg-sky-300" onClick={reset}>
            {over ? 'Retry' : 'Reset'}
          </button>
        </div>
      </div>

      <canvas ref={ref} width={W} height={H} className="w-full max-w-[340px] rounded-xl border border-sky-400/15 cursor-crosshair touch-none" />

      {over && (
        <div className="text-center">
          <p className="text-lg font-bold text-red-400">💥 Ship Destroyed!</p>
          <p className="text-sm text-white/50">Score: {score} | Click Retry</p>
        </div>
      )}

      <p className="text-xs text-white/30">Auto-fire • Move mouse/finger to steer</p>
    </div>
  );
}
