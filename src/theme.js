const C = {
  bg:       "#080c14",
  surface:  "#0d1420",
  panel:    "#111827",
  border:   "#1e2d40",
  borderHi: "#2d4263",
  text:     "#e8edf4",
  muted:    "#6b7fa3",
  faint:    "#374151",
  accent:   "#3b82f6",
  green:    "#10b981",
  amber:    "#f59e0b",
  red:      "#ef4444",
  purple:   "#8b5cf6",
  cyan:     "#06b6d4",
  font:     "Space Grotesk,system-ui,sans-serif",
  mono:     "Space Mono,monospace",
};

const pill = (color, bg) => ({
  background: bg || color+"22",
  color,
  borderRadius: 4,
  padding: "3px 9px",
  fontSize: 10,
  fontWeight: 700,
  fontFamily: C.mono,
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  border: `1px solid ${color}44`,
});

const card = (glowColor) => ({
  background: C.surface,
  border: `1px solid ${glowColor ? glowColor+"44" : C.border}`,
  borderRadius: 12,
  padding: "20px 22px",
  boxShadow: glowColor ? `0 0 0 1px ${glowColor}22, 0 4px 24px ${glowColor}11` : "none",
});

const btn = (color, outline) => ({
  background: outline ? "transparent" : color,
  color: outline ? color : "#fff",
  border: `1px solid ${color}`,
  borderRadius: 8,
  padding: "11px 22px",
  fontWeight: 700,
  fontFamily: C.font,
  cursor: "pointer",
  fontSize: 13,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  letterSpacing: "0.01em",
  transition: "all 0.15s",
});

// Override T to use C everywhere existing code refs T
const T = {
  bg: C.bg, surface: C.surface, surfaceAlt: C.panel, border: C.border,
  text: C.text, textMuted: C.muted, textFaint: C.faint,
  track: C.border, primary: C.accent,
  font: C.font, mono: C.mono,
};
const mkPill = pill;
const mkCard = (bColor, sel) => ({
  background: C.surface,
  border: sel ? `2px solid ${bColor}` : `1px solid ${C.border}`,
  borderRadius: 12,
  padding: "18px 20px",
  boxShadow: sel ? `0 0 0 3px ${bColor}18, 0 0 20px ${bColor}22` : "none",
  display: "flex",
  flexDirection: "column",
});
const mkBtn = btn;

// =======================================================
//  MINI CHART COMPONENTS
// =======================================================

export { C, pill, card, btn, T, mkPill, mkCard, mkBtn };
