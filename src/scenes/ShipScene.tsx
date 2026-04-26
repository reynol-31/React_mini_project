import { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────────
   ShipScene — Ocean placeholder awaiting FBX ship model
   Renders an animated ocean canvas + cinematic overlay.
   Drop your FBX file into:  public/models/ship.fbx
   Then replace this component with a Three.js / react-three-fiber
   scene that loads and floats the model on the ocean surface.
   ─────────────────────────────────────────────────────────────── */

interface Wave {
  y: number;
  amplitude: number;
  frequency: number;
  phase: number;
  speed: number;
  alpha: number;
  color: string;
}

const WAVE_CONFIGS: Omit<Wave, 'y'>[] = [
  { amplitude: 18, frequency: 0.008, phase: 0,    speed: 0.008, alpha: 0.18, color: '0,140,180' },
  { amplitude: 14, frequency: 0.012, phase: 1.2,  speed: 0.012, alpha: 0.14, color: '0,160,200' },
  { amplitude: 10, frequency: 0.018, phase: 2.5,  speed: 0.016, alpha: 0.22, color: '0,180,210' },
  { amplitude:  7, frequency: 0.025, phase: 0.8,  speed: 0.022, alpha: 0.28, color: '0,200,220' },
  { amplitude:  5, frequency: 0.034, phase: 3.1,  speed: 0.028, alpha: 0.18, color: '100,230,230' },
];

export default function ShipScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const tRef      = useRef<number>(0);
  const wRef      = useRef(0);
  const hRef      = useRef(0);

  /* ── wave drawer ─────────────────────────────────────────── */
  const draw = useCallback((ts: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = wRef.current;
    const H = hRef.current;
    tRef.current = ts * 0.001;

    ctx.clearRect(0, 0, W, H);

    /* Sky-to-ocean gradient */
    const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
    skyGrad.addColorStop(0,   '#000d1a');
    skyGrad.addColorStop(0.42, '#001e3c');
    skyGrad.addColorStop(0.6,  '#00243a');
    skyGrad.addColorStop(1,    '#001428');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H);

    /* Moonlight glow on horizon */
    const moonGlow = ctx.createRadialGradient(W * 0.5, H * 0.4, 0, W * 0.5, H * 0.4, W * 0.5);
    moonGlow.addColorStop(0,   'rgba(180,230,255,0.06)');
    moonGlow.addColorStop(0.5, 'rgba(100,180,220,0.03)');
    moonGlow.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = moonGlow;
    ctx.fillRect(0, 0, W, H);

    /* Moon */
    const moonX = W * 0.72;
    const moonY = H * 0.16;
    const moonR = 28;
    const mGrad = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, moonR * 3.5);
    mGrad.addColorStop(0,   'rgba(240,240,255,0.95)');
    mGrad.addColorStop(0.3, 'rgba(220,225,255,0.7)');
    mGrad.addColorStop(0.6, 'rgba(180,200,255,0.15)');
    mGrad.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = mGrad;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonR * 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(245,248,255,0.95)';
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
    ctx.fill();

    /* Moonlight reflection on water */
    const horizon = H * 0.58;
    const refGrad = ctx.createLinearGradient(W * 0.5, horizon, W * 0.5, H);
    refGrad.addColorStop(0,   'rgba(200,230,255,0.12)');
    refGrad.addColorStop(0.3, 'rgba(180,220,255,0.06)');
    refGrad.addColorStop(1,   'rgba(0,0,0,0)');
    const refW = W * 0.08;
    ctx.fillStyle = refGrad;
    ctx.beginPath();
    ctx.moveTo(moonX - refW * 0.3, horizon);
    ctx.lineTo(moonX + refW * 0.3, horizon);
    ctx.lineTo(moonX + refW * 2.5, H);
    ctx.lineTo(moonX - refW * 2.5, H);
    ctx.closePath();
    ctx.fill();

    /* Ocean base fill */
    const oceanGrad = ctx.createLinearGradient(0, horizon, 0, H);
    oceanGrad.addColorStop(0,   '#002a3a');
    oceanGrad.addColorStop(0.4, '#001e2d');
    oceanGrad.addColorStop(1,   '#000d1a');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, horizon, W, H - horizon);

    /* Draw wave layers */
    WAVE_CONFIGS.forEach((wCfg, idx) => {
      const waveY = horizon + (H - horizon) * (0.08 + idx * 0.18);
      ctx.beginPath();
      ctx.moveTo(0, waveY);
      for (let x = 0; x <= W; x += 2) {
        const y = waveY
          + Math.sin(x * wCfg.frequency + tRef.current * wCfg.speed * 60 + wCfg.phase) * wCfg.amplitude
          + Math.sin(x * wCfg.frequency * 1.7 + tRef.current * wCfg.speed * 40 + wCfg.phase * 0.6) * (wCfg.amplitude * 0.4);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.closePath();

      const wGrad = ctx.createLinearGradient(0, waveY - wCfg.amplitude, 0, waveY + wCfg.amplitude * 2);
      wGrad.addColorStop(0,   `rgba(${wCfg.color},${wCfg.alpha})`);
      wGrad.addColorStop(1,   `rgba(${wCfg.color},0)`);
      ctx.fillStyle   = wGrad;
      ctx.fill();

      // Foam crest
      ctx.beginPath();
      ctx.moveTo(0, waveY);
      for (let x = 0; x <= W; x += 2) {
        const y = waveY
          + Math.sin(x * wCfg.frequency + tRef.current * wCfg.speed * 60 + wCfg.phase) * wCfg.amplitude
          + Math.sin(x * wCfg.frequency * 1.7 + tRef.current * wCfg.speed * 40 + wCfg.phase * 0.6) * (wCfg.amplitude * 0.4);
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(${wCfg.color},${wCfg.alpha * 0.7})`;
      ctx.lineWidth   = 1;
      ctx.stroke();
    });

    /* Horizon mist */
    const mistGrad = ctx.createLinearGradient(0, horizon - 30, 0, horizon + 60);
    mistGrad.addColorStop(0,   'rgba(100,180,220,0)');
    mistGrad.addColorStop(0.4, 'rgba(100,180,220,0.06)');
    mistGrad.addColorStop(1,   'rgba(100,180,220,0)');
    ctx.fillStyle = mistGrad;
    ctx.fillRect(0, horizon - 30, W, 90);

    rafRef.current = requestAnimationFrame(draw);
  }, []);

  /* ── Resize ───────────────────────────────────────────────── */
  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    wRef.current = window.innerWidth;
    hRef.current = window.innerHeight;
    canvas.width  = wRef.current  * dpr;
    canvas.height = hRef.current  * dpr;
    canvas.style.width  = `${wRef.current}px`;
    canvas.style.height = `${hRef.current}px`;
    canvas.getContext('2d')?.scale(dpr, dpr);
  }, []);

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize, { passive: true });
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [resize, draw]);

  return (
    <section
      id="ship-scene"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: '#000d1a',
      }}
    >
      {/* Animated ocean canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'block',
          zIndex: 1,
        }}
      />

      {/* Vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.55) 100%)',
        zIndex: 2,
        pointerEvents: 'none',
      }} />

      {/* Ship placeholder — swap this div for your Three.js canvas */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '52%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
        textAlign: 'center',
      }}>

        {/* SVG ship silhouette placeholder */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ opacity: 0.35 }}
        >
          <svg
            width="220"
            height="90"
            viewBox="0 0 220 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ filter: 'drop-shadow(0 4px 24px rgba(100,255,218,0.15))' }}
          >
            {/* Hull */}
            <path
              d="M10 60 L30 40 L60 35 L80 30 L140 30 L170 35 L200 40 L210 60 Q180 75 110 76 Q40 75 10 60Z"
              fill="rgba(20,40,60,0.9)"
              stroke="rgba(100,200,220,0.4)"
              strokeWidth="1"
            />
            {/* Superstructure */}
            <rect x="90" y="15" width="50" height="20" rx="2" fill="rgba(30,55,80,0.9)" stroke="rgba(100,200,220,0.3)" strokeWidth="1" />
            <rect x="100" y="8" width="30" height="10" rx="1" fill="rgba(25,50,75,0.9)" stroke="rgba(100,200,220,0.25)" strokeWidth="1" />
            {/* Mast */}
            <line x1="115" y1="2" x2="115" y2="15" stroke="rgba(100,200,220,0.35)" strokeWidth="1.5" />
            {/* Windows */}
            <circle cx="105" cy="22" r="2" fill="rgba(100,255,218,0.4)" />
            <circle cx="115" cy="22" r="2" fill="rgba(100,255,218,0.4)" />
            <circle cx="125" cy="22" r="2" fill="rgba(100,255,218,0.4)" />
            {/* Bow light */}
            <circle cx="205" cy="42" r="2.5" fill="rgba(255,200,100,0.7)" />
          </svg>
        </motion.div>

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span style={{
            fontSize: '0.6rem',
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(100,255,218,0.5)',
            border: '1px solid rgba(100,255,218,0.2)',
            borderRadius: '999px',
            padding: '0.25rem 0.9rem',
            background: 'rgba(100,255,218,0.03)',
          }}>
            3D Ship Model — Coming Soon
          </span>
          <p style={{
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.3)',
            maxWidth: '320px',
            lineHeight: 1.6,
            fontWeight: 300,
          }}>
            Place your ship FBX at{' '}
            <code style={{ color: 'rgba(100,255,218,0.55)', fontSize: '0.72rem' }}>
              public/models/ship.fbx
            </code>
          </p>
        </motion.div>
      </div>

      {/* Bottom gradient merge to next section */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '120px',
        background: 'linear-gradient(to bottom, transparent, #0A192F)',
        zIndex: 15,
        pointerEvents: 'none',
      }} />
    </section>
  );
}
