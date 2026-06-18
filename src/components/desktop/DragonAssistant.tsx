import { useEffect, useRef } from 'react';
import { useGhostStore } from '../../store/useGhostStore';

interface Point {
  x: number;
  y: number;
  angle: number;
}

// Draw a four-pointed sparkle star at (x, y)
function drawSparkle(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  // Vertical diamond
  ctx.moveTo(x, y - size);
  ctx.quadraticCurveTo(x + size * 0.15, y - size * 0.15, x + size * 0.4, y);
  ctx.quadraticCurveTo(x + size * 0.15, y + size * 0.15, x, y + size);
  ctx.quadraticCurveTo(x - size * 0.15, y + size * 0.15, x - size * 0.4, y);
  ctx.quadraticCurveTo(x - size * 0.15, y - size * 0.15, x, y - size);
  ctx.fill();
  // Horizontal diamond
  ctx.beginPath();
  ctx.moveTo(x - size, y);
  ctx.quadraticCurveTo(x - size * 0.15, y - size * 0.15, x, y - size * 0.4);
  ctx.quadraticCurveTo(x + size * 0.15, y - size * 0.15, x + size, y);
  ctx.quadraticCurveTo(x + size * 0.15, y + size * 0.15, x, y + size * 0.4);
  ctx.quadraticCurveTo(x - size * 0.15, y + size * 0.15, x - size, y);
  ctx.fill();
  ctx.restore();
}

// Draw a small dot
function drawDot(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, alpha: number) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function DragonAssistant() {
  const dragonEnabled = useGhostStore((state) => state.dragonEnabled);
  const dragonSpeed = useGhostStore((state) => state.dragonSpeed);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 400,
  });
  const pointsRef = useRef<Point[]>([]);
  const timeRef = useRef(0);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const logoProgressRef = useRef(1); // 1 = fully logo, 0 = fully follow

  // Initialize segment chain
  useEffect(() => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const pts: Point[] = [];
    const numSegs = 40; // More segments = longer serpentine tail

    for (let i = 0; i < numSegs; i++) {
      pts.push({ x: cx, y: cy + i * 10, angle: Math.PI / 2 });
    }
    pointsRef.current = pts;
    lastMouseRef.current = { x: cx, y: cy };
  }, []);

  // Animation loop
  useEffect(() => {
    if (!dragonEnabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    let flapPhase = 0;
    let currentFlapAmp = 0.12;
    let currentFlapFreq = 0.018;

    type DragonState = 'INITIAL' | 'FOLLOW' | 'WANDER' | 'RETURN' | 'LOGO';
    let state: DragonState = 'INITIAL';
    let stateTimer = Date.now();
    let lastMouseActive = Date.now();

    const mouseHandler = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      lastMouseActive = Date.now();
      if (state === 'LOGO' || state === 'WANDER' || state === 'RETURN') {
        state = 'FOLLOW';
      }
    };
    window.addEventListener('mousemove', mouseHandler);
    
    const clickHandler = () => {
      if (state === 'LOGO' || state === 'WANDER' || state === 'RETURN') {
        state = 'FOLLOW';
        lastMouseActive = Date.now();
      }
    };
    window.addEventListener('click', clickHandler);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const segLen = 10;

    const animate = () => {
      timeRef.current += 1;
      const t = timeRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pts = pointsRef.current;
      if (!pts.length) { raf = requestAnimationFrame(animate); return; }

      const now = Date.now();

      // State transitions
      if (state === 'INITIAL') {
        if (now - stateTimer > 3000) {
          state = 'FOLLOW';
          lastMouseActive = now;
        }
      } else if (state === 'FOLLOW') {
        if (now - lastMouseActive > 3000) { // 3 seconds idle
          state = 'WANDER';
          stateTimer = now;
        }
      } else if (state === 'WANDER') {
        if (now - stateTimer > 30000) { // 30 seconds wander
          state = 'RETURN'; // Fly to center first
        }
      } else if (state === 'RETURN') {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const distToCenter = Math.hypot(cx - pts[0].x, cy - pts[0].y);
        // Once close to center, coil up
        if (distToCenter < 80) {
          state = 'LOGO';
        }
      }

      // ── Physics ───────────────────────────────────────────────
      let tx = mouseRef.current.x;
      let ty = mouseRef.current.y;
      
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;

      if (state === 'WANDER') {
        // Move around the desktop smoothly
        // Slower movement, majestic sweeping arcs
        tx = cx + Math.sin(t * 0.003) * (cx * 0.7) + Math.sin(t * 0.005) * (cx * 0.2);
        ty = cy + Math.cos(t * 0.004) * (cy * 0.7) + Math.cos(t * 0.006) * (cy * 0.2);
      } else if (state === 'LOGO' || state === 'INITIAL' || state === 'RETURN') {
        tx = cx;
        ty = cy;
      }

      const dm = Math.hypot(tx - lastMouseRef.current.x, ty - lastMouseRef.current.y);
      if (dm < 0.5 && state === 'FOLLOW') {
        // Idle drift
        tx += Math.sin(t * 0.018) * 2;
        ty += Math.cos(t * 0.013) * 1.5;
      } else {
        lastMouseRef.current = { x: tx, y: ty };
      }

      const dh = Math.hypot(tx - pts[0].x, ty - pts[0].y);
      const isLogo = state === 'INITIAL' || state === 'LOGO';

      const targetLogo = isLogo ? 1 : 0;
      logoProgressRef.current += (targetLogo - logoProgressRef.current) * 0.03; // Smooth 1-second transition
      const logoProgress = logoProgressRef.current;

      // 1. Head Movement (Blend follow and logo)
      const lerp = (dragonSpeed / 100) * 0.75;
      const headTargetX = tx * (1 - logoProgress) + cx * logoProgress;
      const headTargetY = ty * (1 - logoProgress) + cy * logoProgress;
      
      const combinedLerp = lerp * (1 - logoProgress) + 0.05 * logoProgress;
      pts[0].x += (headTargetX - pts[0].x) * combinedLerp;
      pts[0].y += (headTargetY - pts[0].y) * combinedLerp;

      if (dh > 1 && !isLogo) {
        const targetAngle = Math.atan2(ty - pts[0].y, tx - pts[0].x);
        let diff = targetAngle - pts[0].angle;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        pts[0].angle += diff * 0.15;
      } else if (isLogo) {
        let diff = Math.PI / 2 - pts[0].angle;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        pts[0].angle += diff * 0.05;
      }

      // 2. Spiral Force (Applies smoothly based on logoProgress)
      if (logoProgress > 0.01) {
        let currentTheta = -Math.PI / 2;
        let currentRadius = 35;
        
        for (let i = 1; i < pts.length; i++) {
          const targetX = cx + Math.cos(currentTheta) * currentRadius;
          const targetY = cy + Math.sin(currentTheta) * currentRadius;
          
          // Pull proportionally to logo progress
          pts[i].x += (targetX - pts[i].x) * (0.03 * logoProgress);
          pts[i].y += (targetY - pts[i].y) * (0.03 * logoProgress);
          
          const dTheta = segLen / currentRadius;
          currentTheta += dTheta;
          currentRadius += (24 / (Math.PI * 2)) * dTheta;
        }
      }

      // 3. Chain Physics (Always applied to ensure structural integrity)
      for (let i = 1; i < pts.length; i++) {
        const prev = pts[i - 1];
        const cur = pts[i];
        const dx = cur.x - prev.x;
        const dy = cur.y - prev.y;
        const dist = Math.hypot(dx, dy);
        
        // Always enforce exactly segLen distance or at least segLen
        // If logoProgress > 0.01, we strictly enforce exact distance to prevent coil scrunching
        // Otherwise, standard rope constraints (dist > segLen)
        if (dist > segLen || logoProgress > 0.01) {
          if (dist > 0.001) {
            const a = Math.atan2(dy, dx);
            cur.x = prev.x + Math.cos(a) * segLen;
            cur.y = prev.y + Math.sin(a) * segLen;
            cur.angle = a;
          }
        }
      }

      // ── Global draw settings ──────────────────────────────────
      ctx.save();
      ctx.translate(pts[0].x, pts[0].y);
      ctx.scale(0.8, 0.8); // Scale down the entire dragon visually
      ctx.translate(-pts[0].x, -pts[0].y);

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = 'rgba(255,255,255,0.7)';
      ctx.shadowBlur = 8;

      // ── 1. Draw Spine ─────────────────────────────────────────
      // Upper body (thicker, elegant taper)
      ctx.strokeStyle = 'rgba(255,255,255,0.85)';
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        // Smooth curve through points
        if (i < pts.length - 1) {
          const mx = (pts[i].x + pts[i + 1].x) / 2;
          const my = (pts[i].y + pts[i + 1].y) / 2;
          ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
        } else {
          ctx.lineTo(pts[i].x, pts[i].y);
        }
      }
      // Taper: draw the spine path with a gradient of lineWidth
      // We'll actually stroke multiple sub-paths for taper effect
      ctx.stroke();

      // Redraw spine in segments with tapering lineWidth
      for (let i = 0; i < pts.length - 1; i++) {
        const progress = i / (pts.length - 1);
        // Body is thickest near segment 2-5, thins toward head and tail
        let w: number;
        if (i < 3) {
          w = 1.8 + progress * 4; // head → shoulder: thin to medium
        } else if (i < 8) {
          w = 2.5 - (i - 3) * 0.15; // chest: medium
        } else {
          w = Math.max(0.4, 2.0 * (1 - (i - 8) / (pts.length - 9))); // tail: taper to thin
        }
        ctx.lineWidth = w;
        ctx.strokeStyle = `rgba(255,255,255,${0.9 - progress * 0.4})`;
        ctx.beginPath();
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[i + 1].x, pts[i + 1].y);
        ctx.stroke();
      }

      // ── 2. Chest/torso organic curves ─────────────────────────
      // Draw subtle parallel body lines near chest (segments 2-7)
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = 'rgba(255,255,255,0.45)';
      for (let i = 2; i <= 7; i++) {
        const p = pts[i];
        const perp = p.angle + Math.PI / 2;
        const bulge = Math.sin(((i - 2) / 5) * Math.PI) * 6;
        // Left curve
        const lx = p.x + Math.cos(perp) * bulge;
        const ly = p.y + Math.sin(perp) * bulge;
        // Right curve
        const rx = p.x + Math.cos(perp + Math.PI) * bulge;
        const ry = p.y + Math.sin(perp + Math.PI) * bulge;
        if (i === 2) {
          ctx.beginPath();
          ctx.moveTo(lx, ly);
        } else {
          ctx.lineTo(lx, ly);
        }
        if (i === 7) ctx.stroke();
      }
      for (let i = 2; i <= 7; i++) {
        const p = pts[i];
        const perp = p.angle - Math.PI / 2;
        const bulge = Math.sin(((i - 2) / 5) * Math.PI) * 6;
        const rx = p.x + Math.cos(perp) * bulge;
        const ry = p.y + Math.sin(perp) * bulge;
        if (i === 2) {
          ctx.beginPath();
          ctx.moveTo(rx, ry);
        } else {
          ctx.lineTo(rx, ry);
        }
        if (i === 7) ctx.stroke();
      }

      // ── 3. Wings ──────────────────────────────────────────────
      const wingAnchor = pts[3];
      const wAngle = wingAnchor.angle; // points towards the tail
      const headAngle = wAngle + Math.PI; // points towards the head
      
      const targetFlapAmp = dh > 2 ? 0.35 : 0.12;
      const targetFlapFreq = dh > 2 ? 0.08 : 0.02;
      currentFlapAmp += (targetFlapAmp - currentFlapAmp) * 0.1;
      currentFlapFreq += (targetFlapFreq - currentFlapFreq) * 0.1;
      flapPhase += currentFlapFreq;
      const flap = Math.sin(flapPhase) * currentFlapAmp;

      // Helper: draw one wing
      const drawWing = (side: 1 | -1) => {
        const s = side; // +1 = left, -1 = right
        
        // Single arm bone ("half hand") pointing outwards and slightly back
        const armAngle = headAngle + s * (Math.PI / 2 + 0.2) + s * flap;
        const armLength = 35; // Half of the previous full arm
        const wristX = wingAnchor.x + Math.cos(armAngle) * armLength;
        const wristY = wingAnchor.y + Math.sin(armAngle) * armLength;

        // Draw the single arm bone
        ctx.strokeStyle = 'rgba(255,255,255,0.85)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(wingAnchor.x, wingAnchor.y);
        ctx.lineTo(wristX, wristY);
        ctx.stroke();

        // Fingers directly from the wrist sweeping back towards the tail
        const forearmA = armAngle + s * 0.3; // Fingers fan out slightly further back
        const fingers = [
          { da: -s * 0.1, len: 72 },    // top finger
          { da: s * 0.35, len: 104 },   // mid-upper
          { da: s * 0.85, len: 85 },    // mid-lower
          { da: s * 1.3, len: 55 },     // bottom finger
        ];

        const tips: { x: number; y: number }[] = [];
        ctx.lineWidth = 1.0;
        ctx.strokeStyle = 'rgba(255,255,255,0.8)';
        fingers.forEach((f) => {
          const fa = forearmA + f.da;
          const fx = wristX + Math.cos(fa) * f.len;
          const fy = wristY + Math.sin(fa) * f.len;
          tips.push({ x: fx, y: fy });

          ctx.beginPath();
          ctx.moveTo(wristX, wristY);
          // Slight curve to make bones elegant
          const cpx = wristX + Math.cos(fa) * f.len * 0.5 + Math.cos(fa + s * 0.2) * 3;
          const cpy = wristY + Math.sin(fa) * f.len * 0.5 + Math.sin(fa + s * 0.2) * 3;
          ctx.quadraticCurveTo(cpx, cpy, fx, fy);
          ctx.stroke();
        });

        // Webbing membrane between finger tips with scalloped inward curves
        ctx.lineWidth = 0.7;
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.beginPath();
        // From first tip, curve between each successive pair of tips
        ctx.moveTo(tips[0].x, tips[0].y);
        for (let k = 1; k < tips.length; k++) {
          const prev = tips[k - 1];
          const next = tips[k];
          // Scalloped curve: control point is pulled inward toward wrist
          const mx = (prev.x + next.x) / 2;
          const my = (prev.y + next.y) / 2;
          // Pull toward wrist for scallop effect
          const pullX = (wristX - mx) * 0.3;
          const pullY = (wristY - my) * 0.3;
          ctx.quadraticCurveTo(mx + pullX, my + pullY, next.x, next.y);
        }
        ctx.stroke();

        // Inner webbing lines (subtle structural curves from wrist to finger mids)
        ctx.lineWidth = 0.4;
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        tips.forEach((tip, k) => {
          if (k === 0) return;
          ctx.beginPath();
          ctx.moveTo(wristX, wristY);
          const midTipX = (tip.x + wristX) / 2;
          const midTipY = (tip.y + wristY) / 2;
          ctx.quadraticCurveTo(midTipX, midTipY, tip.x, tip.y);
          ctx.stroke();
        });

        // Sparkles on the wing membrane
        const sparklePositions = [
          { idx: 0, t1: 0.4, size: 4, alpha: 0.5 + Math.sin(t * 0.03 + 0) * 0.2 },
          { idx: 1, t1: 0.55, size: 6, alpha: 0.6 + Math.sin(t * 0.025 + 1) * 0.2 },
          { idx: 2, t1: 0.45, size: 3.5, alpha: 0.4 + Math.sin(t * 0.04 + 2) * 0.15 },
          { idx: 1, t1: 0.3, size: 3, alpha: 0.35 + Math.sin(t * 0.02 + 3) * 0.15 },
        ];
        sparklePositions.forEach((sp) => {
          if (sp.idx >= tips.length) return;
          const tip = tips[sp.idx];
          const sx = wristX + (tip.x - wristX) * sp.t1;
          const sy = wristY + (tip.y - wristY) * sp.t1;
          drawSparkle(ctx, sx, sy, sp.size, sp.alpha);
        });
      };

      const wingAlpha = 1 - logoProgressRef.current;
      if (wingAlpha > 0.01) {
        ctx.save();
        ctx.globalAlpha = wingAlpha;
        drawWing(1);   // Left wing
        drawWing(-1);  // Right wing
        ctx.restore();
      }

      // ── 4. Head ───────────────────────────────────────────────
      const head = pts[0];
      const ha = head.angle;

      ctx.save();
      ctx.translate(head.x, head.y);
      ctx.rotate(ha);

      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 10;

      // Sleek pointed head — diamond/spear shape (like the reference)
      // The head points in the +x direction (forward)
      ctx.beginPath();
      // Tip of snout
      ctx.moveTo(20, 0);
      // Right side of head
      ctx.quadraticCurveTo(12, -3.5, 6, -5);
      // Crown bump right
      ctx.quadraticCurveTo(0, -7, -6, -5);
      // Back of skull
      ctx.quadraticCurveTo(-10, -3, -10, 0);
      // Left side mirror
      ctx.quadraticCurveTo(-10, 3, -6, 5);
      ctx.quadraticCurveTo(0, 7, 6, 5);
      ctx.quadraticCurveTo(12, 3.5, 20, 0);
      ctx.stroke();

      // Crown/horn spike at top of skull
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-2, -5.5);
      ctx.quadraticCurveTo(-5, -14, -1, -20);
      ctx.stroke();
      // Mirror crown spike
      ctx.beginPath();
      ctx.moveTo(-2, 5.5);
      ctx.quadraticCurveTo(-5, 14, -1, 20);
      ctx.stroke();

      // Central crown spike (taller)
      ctx.beginPath();
      ctx.moveTo(-4, -4);
      ctx.lineTo(-8, -10);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-4, 4);
      ctx.lineTo(-8, 10);
      ctx.stroke();

      // Tiny eye dots
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.beginPath();
      ctx.arc(6, -2.5, 1.2, 0, Math.PI * 2);
      ctx.arc(6, 2.5, 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Nose/snout center line
      ctx.lineWidth = 0.6;
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.beginPath();
      ctx.moveTo(18, 0);
      ctx.lineTo(8, 0);
      ctx.stroke();

      ctx.restore();

      // Sparkle at the center of the body (near wing joint)
      drawSparkle(ctx, wingAnchor.x, wingAnchor.y, 7, 0.6 + Math.sin(t * 0.03) * 0.2);

      // ── 5. Tail sparkles & dots ───────────────────────────────
      // Scatter small sparkles and dots along the tail
      for (let i = 10; i < pts.length; i += 3) {
        const p = pts[i];
        const progress = (i - 10) / (pts.length - 10);
        const perp = p.angle + Math.PI / 2;

        // Small dots on alternating sides of the tail
        const dotOffset = 3 + Math.sin(t * 0.02 + i) * 1.5;
        const sideSign = i % 2 === 0 ? 1 : -1;
        drawDot(
          ctx,
          p.x + Math.cos(perp) * dotOffset * sideSign,
          p.y + Math.sin(perp) * dotOffset * sideSign,
          Math.max(0.5, 1.2 - progress * 0.8),
          0.35 - progress * 0.15
        );
      }

      // A few sparkles along the tail
      const sparkleSegs = [12, 18, 25, 33];
      sparkleSegs.forEach((si, k) => {
        if (si >= pts.length) return;
        const p = pts[si];
        const progress = si / pts.length;
        drawSparkle(
          ctx, p.x, p.y,
          Math.max(2, 5 - progress * 4),
          0.4 + Math.sin(t * 0.025 + k * 1.5) * 0.2
        );
      });

      // ── 6. Tail tip curl ──────────────────────────────────────
      // Draw a gentle flowing curl at the very end
      const tailEnd = pts[pts.length - 1];
      const tailPrev = pts[pts.length - 2];
      const ta = Math.atan2(tailEnd.y - tailPrev.y, tailEnd.x - tailPrev.x);

      ctx.lineWidth = 0.6;
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.beginPath();
      ctx.moveTo(tailEnd.x, tailEnd.y);
      const curlLen = 15;
      const curlEnd1X = tailEnd.x + Math.cos(ta) * curlLen;
      const curlEnd1Y = tailEnd.y + Math.sin(ta) * curlLen;
      const ctrlCurl = ta + Math.PI / 3;
      ctx.quadraticCurveTo(
        tailEnd.x + Math.cos(ctrlCurl) * curlLen * 0.7,
        tailEnd.y + Math.sin(ctrlCurl) * curlLen * 0.7,
        curlEnd1X, curlEnd1Y
      );
      ctx.stroke();

      ctx.restore(); // Restore global dragon scale transform

      raf = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, [dragonEnabled, dragonSpeed]);

  if (!dragonEnabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 h-full w-full pointer-events-none z-[2]"
    />
  );
}
