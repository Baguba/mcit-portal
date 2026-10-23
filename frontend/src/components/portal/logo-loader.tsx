"use client";

/**
 * LogoLoader — minimal, official loading Mark: the agency logo inside a
 * single spinning assessment ring. No ornaments.
 *
 * Usage:
 *   <LogoLoader />                    — full-screen overlay
 *   <LogoLoader size="sm" />          — inline small
 *   <LogoLoader size="md" inline />   — inline medium
 *   <LogoLoader message="Loading…" /> — with text
 */

interface LogoLoaderProps {
  /** sm = 48px, md = 80px, lg = 120px (default) */
  size?: "sm" | "md" | "lg";
  /** Render inline instead of a full-screen overlay */
  inline?: boolean;
  /** Optional status message below the spinner */
  message?: string;
}

const sizes = {
  sm: { logo: 36, ring: 56 },
  md: { logo: 56, ring: 84 },
  lg: { logo: 80, ring: 120 },
} as const;

export function LogoLoader({ size = "lg", inline = false, message }: LogoLoaderProps) {
  const s = sizes[size];
  const r = s.ring / 2;

  const content = (
    <div className="logo-loader__container" style={{ width: s.ring + 24, height: s.ring + 24 }}>
      {/* Single dashed progress ring */}
      <svg
        className="logo-loader__ring"
        width={s.ring + 20}
        height={s.ring + 20}
        viewBox={`0 0 ${s.ring + 20} ${s.ring + 20}`}
      >
        <circle
          cx={(s.ring + 20) / 2}
          cy={(s.ring + 20) / 2}
          r={r + 2}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="2"
          strokeDasharray="6 5"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>

      {/* Center logo */}
      <div
        className="logo-loader__logo-wrap"
        style={{ width: s.logo + 12, height: s.logo + 12 }}
      >
        <img
          src="/logo.png"
          alt=""
          className="logo-loader__logo"
          style={{ width: s.logo, height: s.logo }}
        />
      </div>
    </div>
  );

  if (inline) {
    return (
      <div className="logo-loader logo-loader--inline">
        {content}
        {message && <p className="logo-loader__message">{message}</p>}
      </div>
    );
  }

  return (
    <div className="logo-loader logo-loader--fullscreen">
      {content}
      {message && <p className="logo-loader__message">{message}</p>}
    </div>
  );
}
