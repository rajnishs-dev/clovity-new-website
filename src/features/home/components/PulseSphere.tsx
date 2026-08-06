'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { appPulseAi } from '@/constants/media';

/**
 * The rotating dot-sphere with an EKG trace, behind the Pulse AI copy.
 *
 * Fibonacci-distributed points rotated around Y and depth-sorted each frame so the
 * near face reads bigger and brighter, with a fixed P/QRS/T waveform whose bright
 * head sweeps across continuously. Every constant (280 points, R = W × 0.42, AMP 46,
 * SWEEP_FRAMES 170, TRAIL 130, angular step 0.006) is the original's.
 *
 * THE LOGO AND ITS TAGLINE ARE STATIC AND ALWAYS VISIBLE. Only the sphere and the
 * sweeping trace move, and they move *behind* the mark.
 *
 * This is a correction of two mistakes in the first port:
 *  • The tagline was missing outright. The original draws "AI copilot for Jira"
 *    under the logo with `ctx.fillText`; that call was simply not carried over, so
 *    the mark appeared with no label.
 *  • The logo was put on a fade-in / hold / fade-out loop that the original never
 *    had. The original's comment is explicit — it "fades in once, then stays on
 *    screen while the pulse trace keeps sweeping behind it". The looping fade made
 *    the product mark blink in and out.
 *
 * The one-time 60-frame fade-in is dropped too, by request: the mark is drawn at
 * full opacity from the first frame, so nothing about it animates. The settled
 * appearance is identical.
 *
 * Three things the original got wrong, still fixed here:
 *  1. `requestAnimationFrame` was never cancelled. On a client-side navigation
 *     the loop kept running against a detached canvas forever. It is cancelled on
 *     unmount now.
 *  2. Reduced motion drew exactly one frame and stopped — leaving a half-drawn
 *     sweep on screen. It now renders the settled state (sphere, dim trace, and
 *     the logo with its tagline) as a deliberate still.
 *  3. The animation ran even when scrolled far out of view, burning a frame
 *     budget for nothing. An IntersectionObserver pauses it off-screen.
 *
 * `aria-hidden` on the wrapper: it is decoration, and its content is already
 * stated in the adjacent copy.
 */

const POINT_COUNT = 280;
const CANVAS_SIZE = 800;
const SWEEP_FRAMES = 170;
const TRAIL = 130;
const AMP = 46;
const ANGULAR_STEP = 0.006;

/** Drawn under the logo, in the original's font, colour and offset. */
const TAGLINE = 'AI copilot for Jira';
const LOGO_HEIGHT = 130;

interface SpherePoint {
  x: number;
  y: number;
  z: number;
  size: number;
  big: boolean;
}

/**
 * Fibonacci sphere. Deterministic: the legacy version used `Math.random()` for
 * dot size and the "big" flag, which meant a different sphere every reload — and
 * would break server/client determinism here. A hash of the index gives the same
 * visual scatter, reproducibly.
 */
function buildPoints(): SpherePoint[] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const points: SpherePoint[] = [];

  for (let i = 0; i < POINT_COUNT; i += 1) {
    const y = 1 - (i / (POINT_COUNT - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = golden * i;

    // Cheap deterministic pseudo-random in [0, 1) from the index.
    const noise = (Math.sin(i * 12.9898) * 43758.5453) % 1;
    const jitter = noise < 0 ? noise + 1 : noise;

    points.push({
      x: Math.cos(theta) * radius,
      y,
      z: Math.sin(theta) * radius,
      size: 1.6 + jitter * 2.4,
      big: ((jitter * 10) | 0) === 0,
    });
  }
  return points;
}

/** Sum of gaussian bumps approximating one cardiac cycle. */
function ecgOffset(px: number, period: number): number {
  const phase = (((px % period) + period) % period) / period;
  let v = 0;
  v += 0.1 * Math.exp(-Math.pow((phase - 0.12) / 0.02, 2)); // P wave
  v -= 0.14 * Math.exp(-Math.pow((phase - 0.24) / 0.008, 2)); // Q dip
  v += 1.0 * Math.exp(-Math.pow((phase - 0.27) / 0.01, 2)); // R spike
  v -= 0.38 * Math.exp(-Math.pow((phase - 0.3) / 0.012, 2)); // S dip
  v += 0.22 * Math.exp(-Math.pow((phase - 0.5) / 0.045, 2)); // T wave
  return v;
}

export function PulseSphere() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const R = W * 0.42;
    const ecgLeft = cx - R;
    const ecgWidth = R * 2;
    const ecgPeriod = ecgWidth / 2.6;
    const points = buildPoints();

    const logo = new Image();
    let logoReady = false;
    logo.onload = () => {
      logoReady = true;
    };
    logo.src = appPulseAi.src;

    let angle = 0;
    let frameNumber = 0;
    let rafId = 0;
    let visible = true;

    const drawScene = (headX: number | null) => {
      ctx.clearRect(0, 0, W, H);
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      // Sphere dots, back to front.
      const projected = points
        .map((p) => ({
          x: p.x * cosA - p.z * sinA,
          y: p.y,
          z: p.x * sinA + p.z * cosA,
          size: p.size,
          big: p.big,
        }))
        .sort((a, b) => a.z - b.z);

      for (const p of projected) {
        const depth = (p.z + 1) / 2; // 0 = back, 1 = front
        const scale = 0.55 + depth * 0.6;
        const radius = (p.big ? p.size * 1.8 : p.size) * scale;
        const opacity = (0.25 + depth * 0.65).toFixed(2);

        ctx.beginPath();
        ctx.arc(cx + p.x * R, cy + p.y * R, radius, 0, Math.PI * 2);
        ctx.fillStyle = p.big
          ? `rgba(29,78,216,${opacity})`
          : `rgba(59,130,246,${opacity})`;
        ctx.fill();
      }

      // Dim static trace across the full width.
      ctx.beginPath();
      for (let x = 0; x <= ecgWidth; x += 2) {
        const px = ecgLeft + x;
        const py = cy - ecgOffset(x, ecgPeriod) * AMP;
        if (x === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = 'rgba(37,99,235,.16)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Bright sweeping segment + glowing head.
      if (headX !== null) {
        ctx.beginPath();
        let started = false;
        for (
          let x = Math.max(0, headX - TRAIL);
          x <= Math.min(ecgWidth, headX);
          x += 2
        ) {
          const px = ecgLeft + x;
          const py = cy - ecgOffset(x, ecgPeriod) * AMP;
          if (!started) {
            ctx.moveTo(px, py);
            started = true;
          } else {
            ctx.lineTo(px, py);
          }
        }
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2.2;
        ctx.shadowColor = '#60a5fa';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;

        if (headX >= 0 && headX <= ecgWidth) {
          ctx.beginPath();
          ctx.arc(
            ecgLeft + headX,
            cy - ecgOffset(headX, ecgPeriod) * AMP,
            4,
            0,
            Math.PI * 2,
          );
          ctx.fillStyle = '#fff';
          ctx.shadowColor = '#60a5fa';
          ctx.shadowBlur = 14;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      /**
       * The Pulse AI mark and its tagline, drawn last so the sphere and trace pass
       * behind them. Fully opaque on every frame — this is the one part of the
       * canvas that does not animate.
       */
      if (logoReady && logo.naturalHeight > 0) {
        const logoW = LOGO_HEIGHT * (logo.naturalWidth / logo.naturalHeight);
        ctx.save();
        ctx.shadowColor = 'rgba(96,165,250,0.7)';
        ctx.shadowBlur = 20;
        ctx.drawImage(
          logo,
          cx - logoW / 2,
          cy - LOGO_HEIGHT / 2,
          logoW,
          LOGO_HEIGHT,
        );
        ctx.restore();

        ctx.save();
        // Inter is never actually loaded — the original asked for it too, so this
        // resolves to system-ui exactly as it did there.
        ctx.font = '600 15px Inter, system-ui, sans-serif';
        ctx.fillStyle = '#1d4ed8';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(TAGLINE, cx, cy + LOGO_HEIGHT / 2 + 10);
        ctx.restore();
      }
    };

    if (reducedMotion) {
      /**
       * Settled still: sphere, dim trace, and the mark with its tagline. No sweep.
       *
       * Redrawn on load as well, because there is no animation loop here to pick the
       * image up once it decodes — a single early draw would leave the logo out of
       * the still permanently.
       */
      drawScene(null);
      logo.onload = () => {
        logoReady = true;
        drawScene(null);
      };
      if (logo.complete) {
        logoReady = true;
        drawScene(null);
      }
      return () => {
        logo.onload = null;
      };
    }

    const frame = () => {
      // One continuous sweep, looping. The logo does not participate.
      drawScene(((frameNumber % SWEEP_FRAMES) / SWEEP_FRAMES) * ecgWidth);

      angle += ANGULAR_STEP;
      frameNumber += 1;
      if (visible) rafId = window.requestAnimationFrame(frame);
    };

    // Pause while off-screen — no reason to spend frames on an invisible canvas.
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        const wasVisible = visible;
        visible = entry.isIntersecting;
        if (visible && !wasVisible) {
          rafId = window.requestAnimationFrame(frame);
        } else if (!visible && rafId !== 0) {
          window.cancelAnimationFrame(rafId);
          rafId = 0;
        }
      },
      { threshold: 0 },
    );
    observer.observe(canvas);

    rafId = window.requestAnimationFrame(frame);

    return () => {
      observer.disconnect();
      visible = false;
      if (rafId !== 0) window.cancelAnimationFrame(rafId);
      logo.onload = null;
    };
  }, [reducedMotion]);

  /**
   * Positioning, as Tailwind utilities (legacy `.sphere-wrap`).
   *
   * The sphere deliberately bleeds off the section's right edge and sits behind
   * the copy: 460px at mobile widths, 600px from 768px up, and pulled further
   * right as it grows. Below 768px it drops out of the absolute flow entirely and
   * becomes a centred block *after* the copy (`order-2`), because on a narrow
   * screen a decorative canvas overlapping the headline is just noise.
   */
  return (
    <div
      aria-hidden
      className={[
        'pointer-events-none absolute right-[-90px] top-1/2 z-0 h-[460px] w-[460px] -translate-y-1/2',
        'md:right-[-150px] md:h-[600px] md:w-[600px]',
        'to-767:static to-767:order-2 to-767:mx-auto to-767:mt-2 to-767:translate-y-0',
        'to-640:right-[-90px] to-640:h-[360px] to-640:w-[360px]',
      ].join(' ')}
    >
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="absolute left-0 top-0 h-full w-full opacity-80"
      />
    </div>
  );
}
