import React, { useState } from 'react';
import { C, pill, card, btn } from './theme';
import { ARCHETYPES, PARAMS, FUNDER_PERSONAS, PARAM_IMPACT_CARDS } from './constants';
import { KPITrendChart, YearScoreChart } from './charts';

function StepIndicator({ current }) {
  const steps = ["Archetype", "KPIs", "Sectors", "Audience", "Revenue", "Funding", "Blueprint"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 32, padding: "0 4px" }}>
      {steps.map((s, i) => {
        const done = i < current - 1;
        const active = i === current - 1;
        return (
          <React.Fragment key={s}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: done ? C.green : active ? C.accent : C.panel,
                border: `2px solid ${done ? C.green : active ? C.accent : C.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 800, color: done || active ? "#fff" : C.muted,
                fontFamily: C.mono,
                boxShadow: active ? `0 0 12px ${C.accent}66` : "none",
              }}>
                {done ? "✓" : i + 1}
              </div>
              <div style={{ fontSize: 9, color: active ? C.text : C.muted, fontWeight: active ? 700 : 400, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{s}</div>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 2, background: i < current - 1 ? C.green : C.border, marginBottom: 18, transition: "background 0.3s" }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// =======================================================
//  STRATEGY CANVAS - slide-in overlay
// =======================================================
function StrategyCanvas({ gameState, yearHistory, kpiHistory, onClose }) {
  const a = ARCHETYPES.find(x => x.id === gameState.archetype);
  const endGoalDef = a?.endGoals.find(g => g.id === gameState.endGoal);
  const funderPersona = FUNDER_PERSONAS[gameState.fundingSource];
  const currentKpis = gameState.kpis || {};
  const reaction = funderPersona?.getReaction(currentKpis, gameState.stress || 0, yearHistory.length ? yearHistory[yearHistory.length - 1]?.yearScore || 50 : 50);
  const moodColor = { satisfied: C.green, neutral: C.amber, concerned: "#f97316", warning: C.red }[reaction?.mood || "neutral"];

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 800, display: "flex" }}>
      <div onClick={onClose} style={{ flex: 1, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }} />
      <div style={{ width: 420, background: C.panel, borderLeft: `1px solid ${C.borderHi}`, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        <div style={{ background: a?.color || C.accent, padding: "22px 24px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.7, marginBottom: 6 }}>Strategy Canvas</div>
              <div style={{ fontWeight: 800, fontSize: 20, color: "#fff", marginBottom: 2 }}>{a?.icon} {a?.label}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{endGoalDef?.label}</div>
            </div>
            <button onClick={onClose} style={{ background: "rgba(0,0,0,0.2)", border: "none", color: "#fff", width: 30, height: 30, borderRadius: 6, cursor: "pointer", fontSize: 16 }}>✕</button>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 14, flexWrap: "wrap" }}>
            {[`Year ${gameState.year}/5`, `₹${(gameState.budget || 100).toFixed(0)}Cr`, `Stress ${(gameState.stress || 0).toFixed(1)}/10`].map(t => (
              <span key={t} style={{ background: "rgba(0,0,0,0.25)", color: "#fff", borderRadius: 4, padding: "3px 8px", fontSize: 10, fontWeight: 700, fontFamily: C.mono }}>{t}</span>
            ))}
          </div>
        </div>

        <div style={{ padding: "20px 22px", flex: 1 }}>
          {kpiHistory && kpiHistory.length >= 2 && (
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>KPI Trajectory (Top 4)</div>
              <KPITrendChart kpiHistory={kpiHistory} selectedKPIs={gameState.selectedKPIs || []} kpiPool={gameState.kpiPool || []} archColor={a?.color || C.accent} />
            </div>
          )}
          {yearHistory.length > 0 && (
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Year Performance</div>
              <YearScoreChart yearHistory={yearHistory} />
            </div>
          )}
          {funderPersona && reaction && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Funder Sentiment</div>
              <div style={{ background: C.surface, border: `1px solid ${moodColor}44`, borderLeft: `3px solid ${moodColor}`, borderRadius: 8, padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 20 }}>{funderPersona.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{funderPersona.label}</div>
                    <div style={{ fontSize: 10, color: C.muted }}>{funderPersona.trait}</div>
                  </div>
                  <span style={{ marginLeft: "auto", fontSize: 18 }}>
                    {{ satisfied: "😊", neutral: "😐", concerned: "😟", warning: "😠" }[reaction.mood]}
                  </span>
                </div>
                <p style={{ fontSize: 11, color: C.muted, lineHeight: 1.55, margin: 0 }}>{reaction.msg}</p>
              </div>
            </div>
          )}
          <div style={{ background: "linear-gradient(135deg,#0f172a,#1e293b)", borderRadius: 10, padding: "16px 20px", textAlign: "center", border: `1px solid ${C.borderHi}` }}>
            <div style={{ fontSize: 9, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Running Budget</div>
            <div style={{ fontFamily: C.mono, fontSize: 30, fontWeight: 800, color: C.text }}>₹{(gameState.budget || 100).toFixed(1)} Cr</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =======================================================
//  PARAM INLINE TOOLTIP — now shows BELOW the heading
//  (was absolute-right, clipped by overflowY:auto parent)
// =======================================================
function ParamInlineTooltip({ param }) {
  const cardData = PARAM_IMPACT_CARDS[param.id];
  if (!cardData) return null;
  return (
    <div style={{
      marginTop: 6, marginBottom: 8,
      background: "#0d1420",
      borderRadius: 10, padding: "14px 16px",
      boxShadow: `0 4px 20px rgba(0,0,0,0.4), 0 0 0 1px ${param.color}33`,
      border: `1px solid ${C.borderHi}`,
    }}>
      <div style={{ fontWeight: 800, fontSize: 12, color: param.color, marginBottom: 10 }}>
        {param.icon} {cardData.headline}
      </div>
      <div style={{ display: "flex", gap: 14 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: C.green, textTransform: "uppercase", marginBottom: 5, letterSpacing: "0.06em" }}>Gains</div>
          {cardData.gains.slice(0, 3).map((g, i) => (
            <div key={i} style={{ fontSize: 11, color: C.muted, marginBottom: 3, paddingLeft: 8, borderLeft: `2px solid ${C.green}55`, lineHeight: 1.45 }}>
              {g}
            </div>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: C.red, textTransform: "uppercase", marginBottom: 5, letterSpacing: "0.06em" }}>Risks</div>
          {cardData.risks.slice(0, 2).map((r, i) => (
            <div key={i} style={{ fontSize: 11, color: C.muted, marginBottom: 3, paddingLeft: 8, borderLeft: `2px solid ${C.red}55`, lineHeight: 1.45 }}>
              {r}
            </div>
          ))}
        </div>
      </div>
      <div style={{
        marginTop: 10, padding: "8px 10px",
        background: `${C.amber}12`, border: `1px solid ${C.amber}33`,
        borderRadius: 6, fontSize: 11, color: C.amber, lineHeight: 1.45, fontWeight: 600,
      }}>
        💡 {cardData.tradeoff}
      </div>
    </div>
  );
}

// =======================================================
//  ENHANCED COLOR SLIDER — tooltip is now INLINE below
//  heading, triggered on click (toggle), bolder labels
// =======================================================
function ColorSlider({ param, value, onChange }) {
  const [showTip, setShowTip] = useState(false);
  const pct = (value / 40) * 100;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <button
          onClick={() => setShowTip(!showTip)}
          onMouseEnter={() => setShowTip(true)}
          onMouseLeave={() => setShowTip(false)}
          style={{
            fontWeight: 700, fontSize: 13, color: C.text,
            background: showTip ? `${param.color}15` : "none",
            border: showTip ? `1px solid ${param.color}44` : "1px solid transparent",
            borderRadius: 6, cursor: "pointer",
            padding: "3px 8px", display: "flex", alignItems: "center", gap: 6,
            textAlign: "left", fontFamily: C.font,
            transition: "all 0.12s",
          }}>
          <span style={{ fontSize: 16 }}>{param.icon}</span>
          <span>{param.label}</span>
          <span style={{ fontSize: 10, color: param.color, fontWeight: 800, opacity: 0.7 }}>ⓘ</span>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{
            background: value === 0 ? C.faint : `${param.color}22`,
            border: `1px solid ${value === 0 ? C.border : param.color + "55"}`,
            borderRadius: 4, padding: "1px 7px",
            fontFamily: C.mono, fontSize: 14, fontWeight: 800,
            color: value === 0 ? C.muted : param.color,
          }}>{value}%</div>
        </div>
      </div>

      {/* Inline tooltip - shows below heading, not clipped */}
      {showTip && <ParamInlineTooltip param={param} />}

      <div style={{ position: "relative", height: 22, display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", left: 0, right: 0, height: 7, borderRadius: 4, background: C.faint, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg,${param.color}88,${param.color})`, borderRadius: 4, transition: "width 0.06s" }} />
        </div>
        <input type="range" min={0} max={40} value={value} onChange={e => onChange(Number(e.target.value))}
          style={{ position: "absolute", left: 0, right: 0, opacity: 0, cursor: "pointer", height: 22, width: "100%", zIndex: 2 }} />
        <div style={{
          position: "absolute", left: `calc(${pct}% - 10px)`,
          width: 20, height: 20, borderRadius: "50%",
          background: C.surface, border: `2.5px solid ${param.color}`,
          boxShadow: `0 0 10px ${param.color}66`,
          pointerEvents: "none", transition: "left 0.06s",
        }} />
      </div>
    </div>
  );
}

// =======================================================
//  EVENT TOAST - inline, dismissable
// =======================================================
function EventToast({ event, stress, archColor, onDismiss }) {
  const isStress = stress > 7;
  const typeColors = { political: "#8b5cf6", boom: "#10b981", shock: "#ef4444", policy: "#3b82f6", disruption: "#f59e0b", opportunity: "#06b6d4", normal: archColor };
  const borderColor = isStress ? C.red : (typeColors[event?.type] || archColor);
  const icons = { political: "🗳", boom: "📈", shock: "⚠", policy: "📜", disruption: "🤖", opportunity: "⭐", normal: "📡" };
  return (
    <div style={{
      background: isStress ? "#1a0505" : C.surface,
      borderRadius: 8, padding: "12px 16px", marginBottom: 12,
      display: "flex", gap: 12, alignItems: "flex-start",
      border: `1px solid ${borderColor}44`,
      borderLeft: `3px solid ${borderColor}`,
    }}>
      <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{isStress ? "🚨" : (icons[event?.type] || "📡")}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 11, color: borderColor, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>
          {isStress ? "⚠ Operational Stress Alert" : event?.name}
        </div>
        <p style={{ fontSize: 11, color: C.muted, lineHeight: 1.5, margin: 0 }}>
          {isStress ? `Stress at ${stress.toFixed(1)}/10. Under-investment in trainers/ops is penalising all KPI delivery.` : event?.desc}
        </p>
      </div>
      <button onClick={onDismiss} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 14, padding: "0 2px" }}>✕</button>
    </div>
  );
}

export { StepIndicator, StrategyCanvas, ParamInlineTooltip, ColorSlider, EventToast };