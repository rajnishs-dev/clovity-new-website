/**
 * Shared SVG gradient definitions.
 *
 * `#pulseGrad` is referenced by `.mf-line-glow { stroke: url(#pulseGrad) }` in
 * home.css, so the definition has to exist in the document for the migration
 * flow's animated path to render its gradient at all. `#ringGrad` is kept
 * because the legacy page defined both and interior sections reference it.
 *
 * A zero-size absolutely-positioned SVG is the standard way to host defs: it
 * contributes no layout box and no paint.
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
