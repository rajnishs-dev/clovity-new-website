'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { appPulseAi } from '@/constants/media';

/**
 * Rotating dot-sphere with an EKG trace behind the Pulse AI copy:
 * Fibonacci-distributed points rotated around Y and depth-sorted each frame,
 * with a fixed waveform whose bright head sweeps across continuously.
 *
 * The logo and its tagline are static and always fully visible - only the
 * sphere and sweeping trace move, and only behind the mark.
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
 * Fibonacci sphere, deterministic via a hash of the index rather than
 * `Math.random()`, so server and client render the same scatter.
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

      // Drawn last so the sphere and trace pass behind the mark; always opaque.
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
        // Inter is never actually loaded - the original asked for it too, so this
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
       * Settled still: sphere, dim trace, mark with tagline, no sweep.
       * Redrawn on load too, since there's no animation loop to pick up the
       * image once it decodes.
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

    // Pause while off-screen - no reason to spend frames on an invisible canvas.
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
   * The sphere deliberately bleeds off the section's right edge and sits
   * behind the copy. Below 1024px it drops out of the absolute flow and
   * becomes a centred block after the copy (`order-2`), since a decorative
   * canvas overlapping the headline is just noise there.
   */
  return (
    <div
      aria-hidden
      className={[
        'pointer-events-none absolute right-[-90px] top-1/2 z-0 h-[460px] w-[460px] -translate-y-1/2',
        'md:right-[-120px] md:h-[570px] md:w-[570px]',
        'to-1024:static to-1024:order-2 to-1024:mx-auto to-1024:mt-2 to-1024:translate-y-0 to-1024:h-[460px] to-1024:w-[460px]',
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
