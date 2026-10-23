/**
 * Harari geometric motifs — understated SVG drawings taken from the
 * gates of Jugol (Shewa Ber) and the arches of Harar. Brand palette,
 * gentle CSS-driven motion that respects prefers-reduced-motion.
 */

/** Line-drawn gate modelled on Shewa Ber: monolithic whitewashed block,
 *  triangular saw-tooth crenellations, round archway, Harari tile bands. */
export function HarariGate({ className = "" }: { className?: string }) {
  const G = 158; // ground line
  const TB = 54; // block top (base of the saw teeth)

  /** triangular saw teeth from (x0,y): h = half width, dy = rise */
  const teeth = (x0: number, count: number, h: number, dy: number, y: number) =>
    Array.from({ length: count }, () => `l${h} ${-dy} l${h} ${dy}`).join(" ");
  const wtx = (x0: number, count: number, h: number, dy: number) =>
    Array.from({ length: count }, () => `l${-h} ${-dy} l${-h} ${dy}`).join(" ");

  /** main gate block, closed, with saw-tooth top */
  const dBlock = `M154 ${G} V${TB} ${teeth(154, 9, 9, 13, TB)} L318 ${TB} V${G} Z`;

  /** lower crenellated wall wings on both sides */
  const dWingL = `M86 ${G} V106 ${teeth(86, 5, 6.6, 9, 106)} L154 106 V${G} Z`;
  const dWingR = `M386 ${G} V106 ${wtx(386, 5, 6.6, 9)} L318 106 V${G} Z`;

  /** round archway + inner door frame (opening drawn empty, like the photo) */
  const B = 236; // arch centre
  const dArchOuter =
    `M203 ${G} V118 A33 33 0 0 1 269 118 V${G}`;
  const dArchInner =
    `M209 ${G} V118 A27 27 0 0 1 263 118 V${G}`;

  /** Harari tile bands: two rules + zigzag strip between them */
  const band = (x1: number, x2: number, yTop: number, yBot: number, n: number) =>
    `M${x1} ${yTop} H${x2} M${x1} ${yBot} H${x2} M${x1} ${(yTop + yBot) / 2} ` +
    Array.from({ length: n }, () => `l6 -4 l6 4`).join(" ");
  const dBandA = band(158, 314, 62, 72, 13);
  const dBandBL = band(158, 200, 122, 132, 3);
  const dBandBR = band(272, 314, 122, 132, 3);

  /** plaque above the arch */
  const dPlaque = "M226 96 h20 a2 2 0 0 1 2 2 v6 a2 2 0 0 1 -2 2 h-20 a2 2 0 0 1 -2 -2 v-6 a2 2 0 0 1 2 -2 Z M230 100.5 h16";

  return (
    <svg
      className={`harari-gate ${className}`}
      viewBox="0 28 480 148"
      width="480"
      height="148"
      role="img"
      aria-label="Line drawing of the Shewa Ber gate of Harar"
    >
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* stone fills — fade in after the strokes draw */}
        <g className="hg-f">
          <path d={dBlock} fill="var(--accent)" fillOpacity="0.08" stroke="none" />
          <path d={dWingL} fill="var(--accent)" fillOpacity="0.05" stroke="none" />
          <path d={dWingR} fill="var(--accent)" fillOpacity="0.05" stroke="none" />
          {/* weathered shading patches, like the patched plaster in the photo */}
          <path d="M162 92 h22 v14 h-22 Z" fill="var(--accent)" fillOpacity="0.06" stroke="none" />
          <path d="M290 92 h22 v14 h-22 Z" fill="var(--accent)" fillOpacity="0.06" stroke="none" />
        </g>

        {/* structure — strokes draw in sequence */}
        <path className="hg hg-stone" style={{ animationDelay: "0s" }} pathLength={1} d={dBlock} />
        <path className="hg hg-stone" style={{ animationDelay: "0.35s", strokeOpacity: 0.8 }} pathLength={1} d={dWingL} />
        <path className="hg hg-stone" style={{ animationDelay: "0.35s", strokeOpacity: 0.8 }} pathLength={1} d={dWingR} />
        <path className="hg hg-gate" style={{ animationDelay: "0.65s", strokeWidth: 3 }} pathLength={1} d={dArchOuter} />
        <path className="hg hg-door" style={{ animationDelay: "0.85s", strokeWidth: 2 }} pathLength={1} d={dArchInner} />
        {/* tile ornament */}
        <g stroke="var(--accent)">
          <path className="hg" style={{ animationDelay: "1.05s", strokeWidth: 1.25, strokeOpacity: 0.75 }} pathLength={1} d={dBandA} />
          <path className="hg" style={{ animationDelay: "1.15s", strokeWidth: 1.25, strokeOpacity: 0.75 }} pathLength={1} d={dBandBL} />
          <path className="hg" style={{ animationDelay: "1.15s", strokeWidth: 1.25, strokeOpacity: 0.75 }} pathLength={1} d={dBandBR} />
        </g>
        <path
          className="hg hg-stone"
          style={{ animationDelay: "1.3s", strokeWidth: 1.5, strokeOpacity: 0.9 }}
          pathLength={1}
          d={dPlaque}
        />
        <path className="hg hg-ground" style={{ animationDelay: "1.45s" }} pathLength={1} d="M20 158 H460" />
      </g>
    </svg>
  );
}

/** Repeating arch row — drifts slowly sideways, very low emphasis.
 *  Position it as an absolutely-placed band over a solid dark banner. */
export function HarariArchStrip({ className = "" }: { className?: string }) {
  const ARCH_COUNT = 50;
  const ARCH_STEP = 48;
  const archD = Array.from({ length: ARCH_COUNT }, (_, i) => {
    const x = i * ARCH_STEP;
    return `M${x + 12} 56 v-12 a12 12 0 0 1 24 0 v12`;
  }).join(" ");
  return (
    <div className={`harari-arch-strip ${className}`} aria-hidden>
      <svg
        width="2400"
        height="56"
        viewBox="0 0 2400 56"
        fill="none"
        style={{ display: "block" }}
      >
        <g className="ha-group">
          <path d={archD} stroke="currentColor" strokeWidth="1.75" />
        </g>
      </svg>
    </div>
  );
}
