/**
 * Shared SVG gradient defs, referenced elsewhere via `url(#pulseGrad)` /
 * `url(#ringGrad)` - the defs must exist in the document for those to paint.
 * Zero-size and absolutely positioned so it contributes no layout box.
 */
export function SvgGradientDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
      <defs>
        <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
        <linearGradient id="pulseGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="60%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#f2642a" />
        </linearGradient>
      </defs>
    </svg>
  );
}
