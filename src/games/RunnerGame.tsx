import { useEffect, useRef, useState } from 'react';

const W = 320, H = 480;
const VANISH_Y = 120;
const PLAYER_BASE_Y = 400;
const LANE_WIDTH_BOTTOM = 90;

type Lane = -1 | 0 | 1;
type ObstacleType = 'low' | 'high' | 'coin';

type Obstacle = {
  id: number;
  lane: Lane;
  dist: number; // 100 (far) to 0 (player) to -20 (behind)
  type: ObstacleType;
  active: boolean;
};

type Difficulty = 'easy' | 'medium' | 'hard';

const SETTINGS: Record<Difficulty, { speed: number, spawnRate: number }> = {
  easy:   { speed: 0.8, spawnRate: 60 },
  medium: { speed: 1.2, spawnRate: 45 },
  hard:   { speed: 1.7, spawnRate: 30 },
};

export function RunnerGame() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [diff, setDiff] = useState<Difficulty>('medium');
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [over, setOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [best, setBest] = useState(() => {
    try { return Number(localStorage.getItem('runner_best') ?? 0); } catch { return 0; }
  });

  const s = useRef({
    lane: 0 as Lane,
    jumpY: 0,
    vy: 0,
    slide: 0,
    obstacles: [] as Obstacle[],
    score: 0, coins: 0, over: false, started: false, frame: 0,
    obsId: 0
  });

  const reset = () => {
    s.current = {
      lane: 0, jumpY: 0, vy: 0, slide: 0,
      obstacles: [], score: 0, coins: 0, over: false, started: false, frame: 0, obsId: 0
    };
    setScore(0); setCoins(0); setOver(false); setStarted(false);
  };

  useEffect(() => {
    if (!started && !over) reset();
  }, [diff]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (s.current.over) return;
      if (!s.current.started) { s.current.started = true; setStarted(true); }

      switch (e.key) {
        case 'ArrowLeft': case 'a':
          if (s.current.lane > -1) s.current.lane--;
          break;
        case 'ArrowRight': case 'd':
          if (s.current.lane < 1) s.current.lane++;
          break;
        case 'ArrowUp': case 'w': case ' ':
          e.preventDefault();
          if (s.current.jumpY === 0 && s.current.slide === 0) {
            s.current.vy = 8; // Jump impulse
          }
          break;
        case 'ArrowDown': case 's':
          e.preventDefault();
          if (s.current.jumpY === 0) {
            s.current.slide = 30; // Slide frames
          } else {
            s.current.vy = -10; // Fast fall
          }
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (over) return;
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d'); if (!ctx) return;
    let animId: number;

    let touchStartX = 0;
    let touchStartY = 0;

    const onTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      if (!s.current.started) { s.current.started = true; setStarted(true); }
    };

    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 30 && s.current.lane < 1) s.current.lane++;
        if (dx < -30 && s.current.lane > -1) s.current.lane--;
      } else {
        if (dy < -30 && s.current.jumpY === 0 && s.current.slide === 0) s.current.vy = 8;
        if (dy > 30) {
          if (s.current.jumpY === 0) s.current.slide = 30;
          else s.current.vy = -10;
        }
      }
    };

    cv.addEventListener('touchstart', onTouchStart, { passive: true });
    cv.addEventListener('touchend', onTouchEnd, { passive: true });

    const loop = () => {
      const st = s.current;
      const cfg = SETTINGS[diff];
      ctx.clearRect(0, 0, W, H);

      // BG gradient
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#0f172a'); bg.addColorStop(0.3, '#1e293b'); bg.addColorStop(1, '#334155');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      // Draw horizon
      ctx.fillStyle = '#0ea5e9';
      ctx.fillRect(0, 0, W, VANISH_Y);
      ctx.fillStyle = '#bae6fd';
      ctx.beginPath(); ctx.arc(W/2, VANISH_Y, 40, Math.PI, 0); ctx.fill(); // sun/moon

      if (st.started && !st.over) {
        st.frame++;
        st.score += cfg.speed * 0.1;

        // Player physics
        if (st.jumpY > 0 || st.vy !== 0) {
          st.jumpY += st.vy;
          st.vy -= 0.6; // gravity
          if (st.jumpY <= 0) { st.jumpY = 0; st.vy = 0; }
        }
        if (st.slide > 0) st.slide--;

        // Spawn obstacles
        if (st.frame % cfg.spawnRate === 0) {
          const lanes = [-1, 0, 1] as Lane[];
          // Pick 1 or 2 lanes
          const numObs = Math.random() > 0.7 ? 2 : 1;
          for (let i=0; i<numObs; i++) {
            const laneIdx = Math.floor(Math.random() * lanes.length);
            const lane = lanes.splice(laneIdx, 1)[0];
            const r = Math.random();
            const type = r > 0.6 ? 'coin' : r > 0.3 ? 'low' : 'high';
            st.obstacles.push({ id: st.obsId++, lane, dist: 100, type, active: true });
          }
        }

        // Update obstacles
        for (const ob of st.obstacles) {
          if (!ob.active) continue;
          ob.dist -= cfg.speed;

          // Collision check (when dist is near 0)
          if (ob.dist > -5 && ob.dist < 5 && ob.lane === st.lane) {
            if (ob.type === 'coin') {
              ob.active = false;
              st.coins++;
              st.score += 50;
              setCoins(st.coins);
            } else if (ob.type === 'low') { // Jump over
              if (st.jumpY < 20) { st.over = true; setOver(true); }
            } else if (ob.type === 'high') { // Slide under
              if (st.slide === 0) { st.over = true; setOver(true); }
            }
          }
        }
        st.obstacles = st.obstacles.filter(o => o.dist > -20 && o.active);
        
        if (st.frame % 10 === 0) {
          setScore(Math.floor(st.score));
          setBest(b => { const nb = Math.max(b, Math.floor(st.score)); try { localStorage.setItem('runner_best', String(nb)); } catch {} return nb; });
        }
      }

      // Draw pseudo-3D
      const getProj = (lane: number, dist: number, yOffset: number = 0) => {
        // scale 0 at 100, 1 at 0
        const scale = 100 / (dist + 100); 
        const y = VANISH_Y + (PLAYER_BASE_Y - VANISH_Y) * scale;
        const x = W/2 + (lane * LANE_WIDTH_BOTTOM) * scale;
        return { x, y: y - yOffset * scale, scale };
      };

      // Draw lines
      ctx.strokeStyle = '#475569'; ctx.lineWidth = 2;
      for (let l of [-1.5, -0.5, 0.5, 1.5]) {
        ctx.beginPath();
        ctx.moveTo(W/2, VANISH_Y);
        ctx.lineTo(W/2 + l * LANE_WIDTH_BOTTOM * 2, H);
        ctx.stroke();
      }

      // Ground markers (moving)
      ctx.fillStyle = '#64748b';
      const offset = (st.frame * cfg.speed * 2) % 20;
      for (let d = 100; d > 0; d -= 20) {
        const dist = d - offset;
        const p1 = getProj(-1.5, dist);
        const p2 = getProj(1.5, dist);
        ctx.fillRect(p1.x, p1.y, p2.x - p1.x, 2 * p1.scale);
      }

      // Sort obstacles by distance descending (draw furthest first)
      const sorted = [...st.obstacles].sort((a,b) => b.dist - a.dist);

      for (const ob of sorted) {
        if (!ob.active) continue;
        const p = getProj(ob.lane, ob.dist);
        const w = 40 * p.scale;
        
        if (ob.type === 'coin') {
          const bounce = Math.sin(st.frame * 0.1) * 10;
          const py = getProj(ob.lane, ob.dist, 20 + bounce).y;
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath(); ctx.ellipse(p.x, py, w/2, w/2, 0, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath(); ctx.ellipse(p.x, py, w/3, w/3, 0, 0, Math.PI*2); ctx.fill();
        } else if (ob.type === 'low') {
          const h = 40 * p.scale;
          ctx.fillStyle = '#ef4444';
          ctx.beginPath(); ctx.roundRect(p.x - w/2, p.y - h, w, h, 4 * p.scale); ctx.fill();
          // Stripes
          ctx.fillStyle = '#fca5a5';
          ctx.fillRect(p.x - w/2, p.y - h/2 - 2*p.scale, w, 4*p.scale);
        } else if (ob.type === 'high') {
          const h = 30 * p.scale;
          const archH = 60 * p.scale;
          ctx.fillStyle = '#8b5cf6';
          // Arch pillars
          ctx.fillRect(p.x - w/2, p.y - archH, 8*p.scale, archH);
          ctx.fillRect(p.x + w/2 - 8*p.scale, p.y - archH, 8*p.scale, archH);
          // Arch top
          ctx.fillRect(p.x - w/2, p.y - archH, w, h);
        }
      }

      // Draw Player
      const pp = getProj(st.lane, 0, st.jumpY);
      const pw = 30 * pp.scale;
      let ph = 50 * pp.scale;
      let yOff = 0;

      if (st.slide > 0) {
        ph = 25 * pp.scale;
        yOff = 25 * pp.scale;
      }

      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#0ea5e9'; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.roundRect(pp.x - pw/2, pp.y - ph + yOff, pw, ph, 8 * pp.scale); ctx.fill();
      ctx.shadowBlur = 0;
      
      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.beginPath(); ctx.ellipse(pp.x, getProj(st.lane, 0).y, pw/1.5, pw/4, 0, 0, Math.PI*2); ctx.fill();

      if (!st.started && !st.over) {
        ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('Press Start or Arrow Keys', W / 2, H / 2);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animId);
      cv.removeEventListener('touchstart', onTouchStart);
      cv.removeEventListener('touchend', onTouchEnd);
    };
  }, [diff, over]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full max-w-[340px] items-center justify-between px-1 flex-wrap gap-2">
        <div className="flex gap-4">
          <div><p className="font-mono text-[10px] uppercase text-white/40">Score</p><p className="text-xl font-bold text-white">{Math.floor(score)}</p></div>
          <div><p className="font-mono text-[10px] uppercase text-white/40">Coins</p><p className="text-xl font-bold text-amber-400">{coins}</p></div>
          <div><p className="font-mono text-[10px] uppercase text-white/40">Best</p><p className="text-xl font-bold text-sky-400">{best}</p></div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex rounded-lg overflow-hidden border border-white/10">
            {(['easy','medium','hard'] as Difficulty[]).map(d => (
              <button key={d} onClick={() => { if (!started) setDiff(d); }}
                className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition ${diff === d ? 'bg-sky-400 text-slate-950' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>{d}</button>
            ))}
          </div>
          <button type="button" className="h-8 rounded-lg bg-sky-400 px-3 text-xs font-bold text-slate-950 transition hover:bg-sky-300" onClick={() => {
            if (over) { reset(); }
            else {
              const next = !started;
              s.current.started = next;
              setStarted(next);
            }
          }}>
            {over ? 'Retry' : started ? 'Pause' : 'Start'}
          </button>
          <button type="button" className="h-8 rounded-lg border border-white/15 bg-white/5 px-3 text-xs text-white/70 transition hover:bg-white/10" onClick={reset}>
            Reset
          </button>
        </div>
      </div>

      <canvas ref={ref} width={W} height={H} className="w-full max-w-[340px] rounded-xl border border-sky-400/15 bg-black" />

      {over && (
        <div className="text-center">
          <p className="text-lg font-bold text-red-400">💥 Crashed!</p>
          <p className="text-sm text-white/50">Score: {Math.floor(score)} | Coins: {coins}</p>
        </div>
      )}

      <p className="text-xs text-white/30 text-center max-w-[300px]">
        ⬅️ ➡️ to change lanes<br/>
        ⬆️ to jump over RED obstacles<br/>
        ⬇️ to slide under PURPLE obstacles
      </p>
    </div>
  );
}
