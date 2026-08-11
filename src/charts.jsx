import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, PolarRadiusAxis, ReferenceLine, Area, AreaChart, Cell, LabelList } from "recharts";
import { C, pill } from './theme';
import { ARCHETYPES, PARAMS } from './constants';

/* ====================================================
   NEW: KPI Target vs Progress Chart — all 10 KPIs
   Shows target bar (reference) + progress bar (live)
   Updates as sliders move
   ==================================================== */
function KPITargetVsProgressChart({ kpis, impacts, selectedKPIs, kpiPool, archColor, endGoalTargets }) {
  if (!selectedKPIs || selectedKPIs.length === 0) {
    return (
      <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
        <div style={{ fontSize: 28 }}>🎚️</div>
        <div style={{ fontSize: 12, color: C.muted, textAlign: "center" }}>Move the sliders to see live<br />KPI progress update here</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {/* Legend */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 4, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 14, height: 8, borderRadius: 2, background: `${archColor}25`, border: `1px dashed ${archColor}66` }} />
          <span style={{ fontSize: 10, color: C.muted, fontWeight: 600 }}>Target</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 14, height: 8, borderRadius: 2, background: archColor }} />
          <span style={{ fontSize: 10, color: C.muted, fontWeight: 600 }}>Projected (live)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 14, height: 2, background: C.amber }} />
          <span style={{ fontSize: 10, color: C.muted, fontWeight: 600 }}>Target Line</span>
        </div>
      </div>

      {selectedKPIs.map(id => {
        const def = kpiPool.find(k => k.id === id);
        if (!def) return null;
        const current = kpis[id] ?? def.base;
        const delta = impacts[id]?.delta ?? 0;
        const projected = Math.max(0, current + delta);
        const target = endGoalTargets?.[id] ?? (def.inverse ? Math.max(0, def.base * 0.6) : Math.min(100, def.base + (def.base * 0.4) + 20));
        // For display, normalize to a common scale
        const maxVal = Math.max(target, projected, current, def.inverse ? def.base : 100) || 100;
        const targetPct = Math.min(100, (target / maxVal) * 100);
        const projectedPct = Math.min(100, (projected / maxVal) * 100);
        const isOnTrack = def.inverse ? projected <= target : projected >= target;
        const progressToTarget = target > 0 ? Math.min(100, ((def.inverse ? (def.base - projected) / (def.base - target) : projected / target)) * 100) : 0;
        const clampedProgress = Math.max(0, Math.min(100, progressToTarget));
        const barColor = isOnTrack ? C.green : clampedProgress > 60 ? C.amber : clampedProgress > 30 ? "#f97316" : C.red;
        const isGood = def.inverse ? delta < 0 : delta > 0;

        return (
          <div key={id} style={{
            padding: "10px 14px", background: C.panel, borderRadius: 8,
            border: `1px solid ${isOnTrack ? C.green + "33" : C.border}`,
            transition: "border-color 0.2s",
          }}>
            {/* KPI header row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0 }}>
                <span style={{
                  width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
                  background: isOnTrack ? C.green : barColor,
                  boxShadow: `0 0 6px ${isOnTrack ? C.green : barColor}88`,
                }} />
                <span style={{
                  fontSize: 11, fontWeight: 700, color: C.text,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>{def.label}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <span style={{ fontFamily: C.mono, fontSize: 12, fontWeight: 800, color: C.text }}>
                  {projected.toFixed(1)}
                </span>
                <span style={{
                  fontFamily: C.mono, fontSize: 10, fontWeight: 700,
                  color: isGood ? C.green : delta === 0 ? C.muted : C.red,
                }}>
                  {delta >= 0 ? "+" : ""}{delta.toFixed(1)}
                </span>
                <span style={{
                  fontSize: 9, color: C.amber, fontFamily: C.mono,
                  background: `${C.amber}15`, padding: "2px 6px", borderRadius: 3,
                }}>🎯{target}{def.unit}</span>
              </div>
            </div>

            {/* Bar area */}
            <div style={{ position: "relative", height: 20, borderRadius: 5, overflow: "visible" }}>
              {/* Background track */}
              <div style={{
                position: "absolute", left: 0, top: 0, width: "100%", height: "100%",
                background: C.faint, borderRadius: 5,
              }} />
              {/* Target reference bar (dashed outline) */}
              <div style={{
                position: "absolute", left: 0, top: 0, height: "100%",
                width: `${targetPct}%`,
                background: `${archColor}10`,
                border: `1.5px dashed ${archColor}44`,
                borderRadius: 5,
                boxSizing: "border-box",
              }} />
              {/* Progress bar (solid, live-updating) */}
              <div style={{
                position: "absolute", left: 0, top: 3, height: 14,
                width: `${projectedPct}%`,
                background: `linear-gradient(90deg, ${barColor}cc, ${barColor})`,
                borderRadius: 4,
                transition: "width 0.18s ease-out",
                boxShadow: `0 0 8px ${barColor}33`,
                minWidth: projectedPct > 0 ? 4 : 0,
              }} />
              {/* Target marker line */}
              <div style={{
                position: "absolute", top: -3, bottom: -3,
                left: `${targetPct}%`,
                width: 2.5, background: C.amber,
                borderRadius: 2,
                boxShadow: `0 0 6px ${C.amber}88`,
              }} />
            </div>

            {/* Bottom info row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 5 }}>
              <span style={{
                fontSize: 10, fontWeight: 700, color: barColor,
                display: "flex", alignItems: "center", gap: 4,
              }}>
                {isOnTrack ? "✓" : "○"} {clampedProgress.toFixed(0)}% of target
              </span>
              <span style={{
                fontSize: 9, color: C.muted, fontFamily: C.mono,
              }}>
                base: {def.base}{def.unit}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LiveKPIPreviewChart({ kpis, impacts, selectedKPIs, kpiPool, archColor, endGoalTargets }) {
  const data = selectedKPIs.slice(0, 8).map(id => {
    const def = kpiPool.find(k => k.id === id);
    if (!def) return null;
    const current = kpis[id] ?? def.base;
    const delta = impacts[id]?.delta ?? 0;
    const projected = Math.max(0, current + delta);
    const target = endGoalTargets?.[id];
    const cappedCurrent = Math.min(100, current);
    const cappedProjected = Math.min(100, projected);
    return {
      name: def.label.split(" ").slice(0, 2).join(" "),
      current: parseFloat(cappedCurrent.toFixed(1)),
      projected: parseFloat(cappedProjected.toFixed(1)),
      target: target ? Math.min(100, target) : null,
      delta: parseFloat(delta.toFixed(1)),
      good: def.inverse ? delta < 0 : delta > 0,
      unit: def.unit,
    };
  }).filter(Boolean);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const d = data.find(x => x.name === label);
    return (
      <div style={{ background: "#111827", border: "1px solid #2d4263", borderRadius: 8, padding: "10px 14px", fontSize: 11, fontFamily: "Space Mono,monospace" }}>
        <div style={{ color: "#e8edf4", fontWeight: 700, marginBottom: 6 }}>{label}</div>
        <div style={{ color: "#6b7fa3" }}>Now: <span style={{ color: "#e8edf4", fontWeight: 700 }}>{payload[0]?.value}{d?.unit}</span></div>
        <div style={{ color: "#6b7fa3" }}>Projected: <span style={{ color: d?.good ? "#10b981" : "#f59e0b", fontWeight: 700 }}>{payload[1]?.value}{d?.unit}</span></div>
        {d?.target && <div style={{ color: "#f59e0b" }}>Target: {d.target}{d?.unit}</div>}
        <div style={{ marginTop: 4, color: d?.good ? "#10b981" : "#f59e0b", fontWeight: 700 }}>
          {d?.delta >= 0 ? "↑" : "↓"} {Math.abs(d?.delta ?? 0).toFixed(1)} this period
        </div>
      </div>
    );
  };

  if (data.length === 0) return (
    <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
      <div style={{ fontSize: 28 }}>🎚️</div>
      <div style={{ fontSize: 11, color: "#6b7fa3", textAlign: "center" }}>Move the sliders to see live<br/>KPI projections update here</div>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: "#374151" }} />
          <span style={{ fontSize: 10, color: "#6b7fa3" }}>Current</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: archColor }} />
          <span style={{ fontSize: 10, color: "#6b7fa3" }}>Projected (live)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 10, height: 2, background: "#f59e0b" }} />
          <span style={{ fontSize: 10, color: "#6b7fa3" }}>Target</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 10, bottom: 50, left: -15 }} barGap={2} barSize={10}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2d40" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: "#6b7fa3", fontSize: 9, fontFamily: "Space Mono,monospace" }} angle={-40} textAnchor="end" interval={0} axisLine={{ stroke: "#1e2d40" }} />
          <YAxis domain={[0, 100]} tick={{ fill: "#6b7fa3", fontSize: 9 }} axisLine={false} tickLine={false} />
          <RTooltip content={<CustomTooltip />} />
          <Bar dataKey="current" name="Current" fill="#374151" radius={[3, 3, 0, 0]} isAnimationActive={false} />
          <Bar dataKey="projected" name="Projected" radius={[3, 3, 0, 0]} isAnimationActive={false}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.good ? archColor : "#f59e0b"} opacity={0.9} />
            ))}
          </Bar>
          {data.map((entry, i) =>
            entry.target ? (
              <ReferenceLine key={i} x={entry.name} stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity={0.6} />
            ) : null
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function SparkLine({ data, color, height = 40 }) {
  if (!data || data.length < 2) return null;
  const pts = data.map((v, i) => ({ x: i, v }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={pts} margin={{ top: 2, bottom: 2, left: 0, right: 0 }}>
        <defs>
          <linearGradient id={`sg${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#sg${color.replace("#","")})`} dot={false} isAnimationActive={false}/>
      </AreaChart>
    </ResponsiveContainer>
  );
}

function RadarBudget({ params, archColor }) {
  const data = PARAMS.map(p => ({
    subject: p.label.split(" ")[0],
    value: params[p.id] || 0,
    fullMark: 40,
  }));
  return (
    <ResponsiveContainer width="100%" height={220}>
      <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
        <PolarGrid stroke={C.border} />
        <PolarAngleAxis dataKey="subject" tick={{ fill: C.muted, fontSize: 9, fontFamily: C.mono }} />
        <PolarRadiusAxis domain={[0, 40]} tick={false} axisLine={false} />
        <Radar dataKey="value" stroke={archColor} fill={archColor} fillOpacity={0.25} strokeWidth={2} dot={{ fill: archColor, r: 3 }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

function KPITrendChart({ kpiHistory, selectedKPIs, kpiPool, archColor }) {
  if (!kpiHistory || kpiHistory.length < 1) return (
    <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 24, marginBottom: 8 }}>📊</div>
        <div style={{ fontSize: 11, color: "#6b7fa3" }}>Commit your first period to see KPI trends</div>
      </div>
    </div>
  );
  const topKPIs = selectedKPIs.slice(0, 4);
  const baselineRow = { year: "Start" };
  topKPIs.forEach(id => {
    const def = kpiPool.find(k => k.id === id);
    baselineRow[id] = def ? def.base : 0;
  });
  const chartData = [
    baselineRow,
    ...kpiHistory.map((snapshot, i) => {
      const row = { year: `Y${i + 1}` };
      topKPIs.forEach(id => { row[id] = snapshot[id] ?? 0; });
      return row;
    })
  ];
  const colors = [archColor, C.cyan, C.amber, C.purple];
  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
        <XAxis dataKey="year" tick={{ fill: C.muted, fontSize: 10, fontFamily: C.mono }} axisLine={{ stroke: C.border }} />
        <YAxis tick={{ fill: C.muted, fontSize: 9, fontFamily: C.mono }} axisLine={false} tickLine={false} domain={[0, 100]} />
        <RTooltip
          wrapperStyle={{ outline: "none" }}
          contentStyle={{ background: "#111827", border: "1px solid #2d4263", borderRadius: 8, fontSize: 11, fontFamily: "Space Mono,monospace", color: "#e8edf4" }}
          labelStyle={{ color: "#e8edf4", fontWeight: 700, marginBottom: 4 }}
          itemStyle={{ color: "#6b7fa3" }}
          cursor={{ stroke: "#2d4263", strokeWidth: 1 }}
        />
        {topKPIs.map((id, i) => {
          const def = kpiPool.find(k => k.id === id);
          return <Line key={id} type="monotone" dataKey={id} name={def?.label || id} stroke={colors[i]} strokeWidth={2} dot={{ r: 3, fill: colors[i] }} isAnimationActive={false} />;
        })}
      </LineChart>
    </ResponsiveContainer>
  );
}

function BudgetBarChart({ params, archColor }) {
  const data = PARAMS.map(p => ({
    name: p.label.split(" ")[0],
    value: params[p.id] || 0,
    color: p.color,
    full: p.label,
  })).sort((a, b) => b.value - a.value);
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 5, right: 5, bottom: 30, left: -10 }} barSize={14}>
        <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
        <XAxis dataKey="name" tick={{ fill: C.muted, fontSize: 9, fontFamily: C.mono }} angle={-35} textAnchor="end" axisLine={{ stroke: C.border }} interval={0} />
        <YAxis domain={[0, 40]} tick={{ fill: C.muted, fontSize: 9, fontFamily: C.mono }} axisLine={false} tickLine={false} />
        <RTooltip
          wrapperStyle={{ outline: "none" }}
          contentStyle={{ background: "#111827", border: "1px solid #2d4263", borderRadius: 8, fontSize: 11, fontFamily: "Space Mono,monospace", color: "#e8edf4" }}
          itemStyle={{ color: "#6b7fa3" }}
          formatter={(val, name, props) => [`${val}%`, props.payload.full]}
          labelFormatter={() => ""}
          cursor={{ fill: "rgba(59,130,246,0.08)" }}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => <Cell key={i} fill={entry.color} opacity={entry.value > 0 ? 0.9 : 0.3} />)}
        </Bar>
        <ReferenceLine y={10} stroke={archColor} strokeDasharray="4 4" strokeOpacity={0.5} label={{ value: "10%", fill: archColor, fontSize: 9, fontFamily: C.mono, position: "right" }} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function YearScoreChart({ yearHistory }) {
  if (!yearHistory || yearHistory.length === 0) return null;
  const data = yearHistory.map(y => ({
    year: `Y${y.year}`,
    score: y.yearScore,
    stress: (y.stress || 0) * 10,
  }));
  return (
    <ResponsiveContainer width="100%" height={120}>
      <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
        <XAxis dataKey="year" tick={{ fill: C.muted, fontSize: 10, fontFamily: C.mono }} axisLine={{ stroke: C.border }} />
        <YAxis domain={[0, 100]} tick={{ fill: C.muted, fontSize: 9, fontFamily: C.mono }} axisLine={false} tickLine={false} />
        <RTooltip
          wrapperStyle={{ outline: "none" }}
          contentStyle={{ background: "#111827", border: "1px solid #2d4263", borderRadius: 8, fontSize: 11, fontFamily: "Space Mono,monospace", color: "#e8edf4" }}
          labelStyle={{ color: "#e8edf4", fontWeight: 700 }}
          itemStyle={{ color: "#6b7fa3" }}
          cursor={{ fill: "rgba(59,130,246,0.08)" }}
        />
        <Bar dataKey="score" name="Performance" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.score >= 55 ? C.green : entry.score >= 35 ? C.amber : C.red} />
          ))}
        </Bar>
        <ReferenceLine y={55} stroke={C.green} strokeDasharray="4 4" strokeOpacity={0.6} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function KPIGaugeRow({ kpis, selectedKPIs, kpiPool, endGoalTargets, archColor }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 8 }}>
      {selectedKPIs.map(id => {
        const def = kpiPool.find(k => k.id === id);
        if (!def) return null;
        const val = kpis[id] ?? def.base;
        const target = endGoalTargets?.[id];
        const progress = def.inverse
          ? Math.max(0, Math.min(100, 100 - val))
          : Math.max(0, Math.min(100, val));
        const onTrack = target != null ? (def.inverse ? val <= target : val >= target) : val >= def.base;
        const barColor = onTrack ? C.green : val >= (def.base * 0.8) ? C.amber : C.red;
        return (
          <div key={id} style={{
            background: C.panel, border: `1px solid ${barColor}33`,
            borderRadius: 8, padding: "10px 12px",
          }}>
            <div style={{ fontSize: 9, color: C.muted, fontWeight: 700, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em", lineHeight: 1.3 }}>
              {def.label}
            </div>
            <div style={{ fontFamily: C.mono, fontSize: 16, fontWeight: 800, color: barColor, marginBottom: 6 }}>
              {val.toFixed(1)}{def.unit}
            </div>
            {target != null && (
              <div style={{ fontSize: 9, color: C.muted, marginBottom: 4 }}>🎯 {target}{def.unit}</div>
            )}
            <div style={{ height: 3, background: C.faint, borderRadius: 2 }}>
              <div style={{ width: `${progress}%`, height: "100%", background: barColor, borderRadius: 2, transition: "width 0.3s" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export { KPITargetVsProgressChart, LiveKPIPreviewChart, SparkLine, RadarBudget, KPITrendChart, BudgetBarChart, YearScoreChart, KPIGaugeRow };