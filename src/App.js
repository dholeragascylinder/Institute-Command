// ===================================================================
//  App.js — InstituteCommand (fixed: 2-col YearPlay, revenue step, 
//  imports, placeholders, back-buttons)
// ===================================================================

import React, { useState, useMemo, useCallback, useEffect } from 'react';

// sid-1: SINGLE consolidated charts import
import {
  KPITargetVsProgressChart,
  KPITrendChart,
  BudgetBarChart,
  YearScoreChart,
  KPIGaugeRow,
  SparkLine,
  RadarBudget
} from './charts';

import {
  ARCHETYPES, SECTORS, FUNDING_SOURCES, DELIVERY_MODES, REVENUE_MODELS,
  YEAR_EVENTS, getCadence, PARAMS, FUNDER_PERSONAS, PARAM_IMPACT_CARDS,
  computeLagPenalty, getContextualExtras
} from './constants';

import {
  simulateYear, computeImpact, KPI_DELIVERY_TAGS, getKpiDeliveryMult, KPI_AUDIENCE_TAGS
} from './engine';

import { C, pill, card, btn, T } from './theme';
import { StepIndicator, StrategyCanvas, ParamTooltip, ColorSlider, EventToast } from './widgets';
import { Welcome, AudienceStep, ArchetypeStep, KPIStep, SectorStep, RevenueStep, FundingStep, BlueprintStep, ProsConsTooltip } from './screens';


// ===================================================================
//  sid-2: YEAR PLAY — 2-COLUMN LAYOUT
// ===================================================================

function YearPlay({ gameState, yearHistory, kpiHistory, onYearComplete, onBack }) {
  const { year, archetype, sectors, budget, kpis, kpiPool, selectedKPIs, endGoal, stress, fundingSource, deliveryMode } = gameState;
  const a = ARCHETYPES.find(x => x.id === archetype);
  const yearEvents = YEAR_EVENTS.filter(e => e.year === year);
  const [event] = useState(() => yearEvents.length > 0 ? yearEvents[Math.floor(Math.random() * yearEvents.length)] : YEAR_EVENTS[0]);
  const cadence = getCadence(year);
  const endGoalDef = a.endGoals.find(g => g.id === endGoal);

  const [period, setPeriod] = useState(0);
  const [periodKpis, setPeriodKpis] = useState(kpis);
  const [periodStress, setPeriodStress] = useState(stress);
  const [periodBudget, setPeriodBudget] = useState(budget);
  const [periodHistory, setPeriodHistory] = useState([]);
  const [params, setParams] = useState(() => { const i = {}; PARAMS.forEach(p => { i[p.id] = 0; }); return i; });
  const [prevParams, setPrevParams] = useState(null);
  const [showToast, setShowToast] = useState(true);
  const [showCanvas, setShowCanvas] = useState(false);
  const [lagWarning, setLagWarning] = useState(null);
  const [budgetAlert, setBudgetAlert] = useState(null);

  const totalAlloc = Object.values(params).reduce((s, v) => s + v, 0);
  const setParam = useCallback((id, val) => {
    setParams(prev => {
      const others = Object.entries(prev).filter(([k]) => k !== id).reduce((s, [, v]) => s + v, 0);
      if (others + val > 100) {
        setBudgetAlert({ over: others + val - 100, param: id });
        return { ...prev, [id]: 100 - others };
      }
      setBudgetAlert(null);
      return { ...prev, [id]: val };
    });
  }, []);
  const liveImpacts = useMemo(() => computeImpact({ params, archetype, selectedKPIs, kpiPool, kpis: periodKpis }), [params, archetype, selectedKPIs, kpiPool, periodKpis]);

  const commitPeriod = () => {
    const result = simulateYear({ kpis: periodKpis, params, archetype, sectors, fundingSource, deliveryMode, deliveryModes: gameState.deliveryModes || (deliveryMode ? [deliveryMode] : []), year, stress: periodStress, currentBudget: periodBudget, initialKpis: gameState.initialKpis || kpis, endGoalTargets: endGoalDef?.kpiTargets, prevParams, revenueModels: gameState.revenueModels || ["training_delivery"] });
    const newHist = [...periodHistory, { period, kpisBefore: periodKpis, result }];
    setPeriodHistory(newHist);
    setPeriodKpis(result.newKpis);
    setPeriodStress(result.newStress);
    setPeriodBudget(result.nextBudget);
    setPrevParams({ ...params });
    if (result.lagWarning) setLagWarning(result.lagWarning);
    if (period + 1 >= cadence.periods) {
      const avgScore = Math.round(newHist.reduce((s, h) => s + h.result.yearScore, 0) / newHist.length);
      const lastWin = newHist[newHist.length - 1]?.result?.winResult || null;
      onYearComplete({ finalKpis: result.newKpis, finalStress: result.newStress, nextBudget: result.nextBudget, yearScore: avgScore, periodHistory: newHist, event, winResult: lastWin, financials: result.financials });
    } else {
      setPeriod(period + 1);
      setShowToast(true);
      setParams(() => { const i = {}; PARAMS.forEach(p => { i[p.id] = 0; }); return i; });
    }
  };

  const allocPct = Math.round((totalAlloc / 100) * periodBudget * 10) / 10;
  const balanced = Math.abs(totalAlloc - 100) <= 2;

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 16px" }}>
      {showCanvas && (
        <StrategyCanvas
          gameState={{ ...gameState, kpis: periodKpis, stress: periodStress, budget: periodBudget }}
          yearHistory={yearHistory}
          kpiHistory={[...(kpiHistory || []), periodKpis]}
          onClose={() => setShowCanvas(false)}
        />
      )}

      {/* -- COMPACT COMMAND HEADER (archetype NOT repeated — already in top nav) -- */}
      <div style={{ background: C.surface, border: `1px solid ${C.borderHi}`, borderRadius: 14, padding: "14px 20px", marginBottom: 14, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 auto" }}>
          <div style={{ fontSize: 9, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Budget</div>
          <div style={{ fontFamily: C.mono, fontWeight: 800, fontSize: 26, color: C.text, lineHeight: 1 }}>₹{periodBudget.toFixed(1)}<span style={{ fontSize: 13, color: C.muted }}> Cr</span></div>
        </div>
        <div style={{ width: 1, height: 36, background: C.border, flexShrink: 0 }} />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", flex: 1 }}>
          <span style={{ ...pill(C.muted) }}>Year {year} / 5</span>
          <span style={{ ...pill(C.purple) }}>{cadence.label}</span>
          <span style={{ ...pill(periodStress > 7 ? C.red : periodStress > 4 ? C.amber : C.green) }}>
            {periodStress > 7 ? "🔴" : periodStress > 4 ? "🟡" : "🟢"} Stress {periodStress.toFixed(1)}
          </span>
          <span style={{ ...pill(balanced ? C.green : C.amber) }}>
            {totalAlloc}/100 units {balanced ? "✓" : "⚠"}
          </span>
          {sectors.length > 1 && <span style={{ ...pill(C.cyan) }}>Focus {sectors.length === 2 ? "0.85" : "0.70"}</span>}
        </div>
        <button onClick={() => setShowCanvas(true)} style={{ ...btn(C.purple, true), fontSize: 11, padding: "7px 14px" }}>🗺 Canvas</button>
      </div>

      {/* Event / Lag toasts */}
      {showToast && (
        <EventToast event={event} stress={periodStress} archColor={a.color} onDismiss={() => setShowToast(false)} />
      )}
      {!showToast && event && (
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.amber}`, borderRadius: 8, padding: "9px 14px", marginBottom: 12, display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 12 }}>📡</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.amber }}>{event.name}</span>
          <span style={{ fontSize: 11, color: C.muted, flex: 1 }}> — {event.desc}</span>
        </div>
      )}
      {lagWarning && (
        <div style={{ background: "#1a1200", border: `1px solid ${C.amber}44`, borderLeft: `3px solid ${C.amber}`, borderRadius: 8, padding: "10px 14px", marginBottom: 12, display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ fontSize: 14 }}>⏳</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 11, color: C.amber, marginBottom: 2, textTransform: "uppercase" }}>Implementation Lag</div>
            <p style={{ fontSize: 11, color: C.muted, margin: 0, lineHeight: 1.5 }}>{lagWarning}</p>
          </div>
          <button onClick={() => setLagWarning(null)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer" }}>✕</button>
        </div>
      )}

      {/* Temporal Context Banner */}
      {(() => {
        const totalPeriods = cadence.periods;
        const freqLabel = totalPeriods === 1 ? "Annual Decision" : totalPeriods === 2 ? "Half-Yearly Decision" : "Quarterly Decision";
        const isMulti = totalPeriods > 1;
        const prevResult = period > 0 ? periodHistory[period - 1]?.result : null;
        const periodName = totalPeriods === 2 ? (period === 0 ? "H1" : "H2") : totalPeriods === 4 ? `Q${period + 1}` : `Year ${year}`;
        return (
          <div style={{ background: C.surface, border: `2px solid ${a.color}66`, borderRadius: 12, padding: "14px 18px", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: isMulti && prevResult ? 10 : 0 }}>
              <div style={{ background: `${a.color}22`, borderRadius: 8, padding: "6px 14px", flexShrink: 0 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: a.color, textTransform: "uppercase", letterSpacing: "0.08em" }}>{freqLabel}</div>
                <div style={{ fontFamily: C.mono, fontWeight: 800, fontSize: 15, color: C.text, marginTop: 2 }}>
                  {isMulti ? `Decision ${period + 1} of ${totalPeriods}` : `Year ${year} Decision`}
                  <span style={{ color: C.muted, fontWeight: 400, fontSize: 11 }}>  {periodName}  Year {year}/5</span>
                </div>
              </div>
              <div style={{ flex: 1, fontSize: 11, color: C.muted, lineHeight: 1.5 }}>
                {!isMulti && "One allocation for the full year. Sliders start at 0 — distribute all 100 units before committing."}
                {isMulti && period === 0 && `This is the FIRST of ${totalPeriods} decisions within Year ${year}. Each decision covers one ${totalPeriods === 2 ? "half" : "quarter"} of the year. Sliders reset to 0 after each commit — your KPI scores carry forward.`}
                {isMulti && period > 0 && `Decision ${period + 1} of ${totalPeriods} for Year ${year}. KPIs from the previous period are your new baseline. Large shifts (>40%) from last allocation trigger a lag penalty.`}
              </div>
              {totalPeriods > 1 && (
                <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                  {Array.from({ length: totalPeriods }).map((_, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                      <div style={{
                        width: i === period ? 30 : 22, height: i === period ? 30 : 22,
                        borderRadius: "50%",
                        background: i < period ? C.green : i === period ? a.color : C.panel,
                        border: `2px solid ${i < period ? C.green : i === period ? a.color : C.border}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: i === period ? 11 : 9, fontWeight: 800, color: "#fff",
                        transition: "all 0.2s",
                      }}>
                        {i < period ? "✓" : i + 1}
                      </div>
                      <div style={{ fontSize: 8, color: i === period ? a.color : C.muted, fontFamily: C.mono, fontWeight: i === period ? 700 : 400 }}>
                        {totalPeriods === 2 ? (i === 0 ? "H1" : "H2") : `Q${i + 1}`}
                      </div>
                      {i < period && periodHistory[i]?.result?.yearScore != null && (
                        <div style={{ fontSize: 8, color: C.green, fontFamily: C.mono }}>{periodHistory[i].result.yearScore}%</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {isMulti && prevResult && (
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.border}`, display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Previous {totalPeriods === 2 ? "Half" : "Quarter"} Result:
                </span>
                <span style={{ ...pill(prevResult.yearScore >= 55 ? C.green : prevResult.yearScore >= 30 ? C.amber : C.red), fontFamily: C.mono, fontSize: 10 }}>
                  Score {prevResult.yearScore}%
                </span>
                {prevResult.financials && <>
                  <span style={{ fontSize: 10, color: C.muted }}>👥 {(prevResult.financials.studentsThisPeriod || 0).toLocaleString()} trained</span>
                  <span style={{ fontSize: 10, color: C.muted }}>✓ {(prevResult.financials.studentsPlaced || 0).toLocaleString()} placed</span>
                  <span style={{ fontSize: 10, color: prevResult.financials.plCr >= 0 ? C.green : C.red, fontFamily: C.mono }}>
                    P&L: {prevResult.financials.plCr >= 0 ? "+" : ""}₹{(prevResult.financials.plCr || 0).toFixed(1)} Cr
                  </span>
                </>}
              </div>
            )}
          </div>
        );
      })()}

      {/* ====== 2-COLUMN LAYOUT: KPIs (left) | Sliders (right) ====== */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="play-grid-2">

        {/* LEFT — All 10 KPIs: Target Bar + Progress Bar */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 18px", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: C.text, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              📊 KPI Target vs Progress
            </div>
            <div style={{ fontSize: 10, color: C.muted, fontFamily: C.mono }}>
              {selectedKPIs.length} KPIs tracked
            </div>
          </div>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 12, lineHeight: 1.5, fontWeight: 600, background: `${a.color}10`, border: `1px solid ${a.color}33`, borderRadius: 8, padding: "8px 12px" }}>
            <span style={{ color: a.color, fontWeight: 800 }}>⚡ Live updates:</span> Bars move in real-time as you adjust sliders. The <span style={{ color: C.amber, fontWeight: 700 }}>amber line</span> marks your end-goal target.
          </div>
          <div style={{ overflowY: "auto", flex: 1, maxHeight: 580, paddingRight: 4 }}>
            <KPITargetVsProgressChart
              kpis={periodKpis}
              impacts={liveImpacts}
              selectedKPIs={selectedKPIs}
              kpiPool={kpiPool}
              archColor={a.color}
              endGoalTargets={endGoalDef?.kpiTargets}
              initialKpis={gameState.initialKpis || periodKpis}
              period={period}
              totalPeriods={cadence.periods}
              year={year}
            />
          </div>

          {/* Period history chips */}
          {periodHistory.length > 0 && (
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${C.border}`, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {periodHistory.map(h => (
                <div key={h.period} style={{
                  background: h.result.yearScore >= 35 ? `${a.color}18` : C.panel,
                  border: `1px solid ${h.result.yearScore >= 35 ? a.color : C.border}`,
                  borderRadius: 6, padding: "4px 10px", textAlign: "center",
                }}>
                  <div style={{ fontSize: 9, color: C.muted, fontFamily: C.mono }}>{cadence.pLabel(h.period)}</div>
                  <div style={{ fontFamily: C.mono, fontWeight: 800, fontSize: 14, color: h.result.yearScore >= 55 ? C.green : h.result.yearScore >= 30 ? C.amber : C.red }}>{h.result.yearScore}%</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — Budget Sliders + Trade-offs */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 18px", display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: C.text, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
            🎛️ {cadence.pLabel(period)} — Budget Allocation
          </div>

          {/* Bold guidance banner */}
          <div style={{
            background: `linear-gradient(135deg, ${a.color}15, ${a.color}08)`,
            border: `2px solid ${a.color}55`,
            borderLeft: `4px solid ${a.color}`,
            borderRadius: 8, padding: "12px 14px", marginBottom: 14,
            fontSize: 12, color: C.muted, lineHeight: 1.6,
          }}>
            <span style={{ color: a.color, fontWeight: 800, fontSize: 13 }}>🎯 Allocate exactly 100 units.</span>
            <br />
            Sliders auto-cap at your remaining budget. <b style={{ color: C.text }}>Hover or click any slider label</b> to see strategic trade-off guidance for that parameter.
          </div>

          <div style={{ flex: 1, overflowY: "auto", paddingRight: 4 }}>
            {PARAMS.map(p => (
              <ColorSlider key={p.id} param={p} value={params[p.id]} onChange={v => setParam(p.id, v)} />
            ))}
            <div style={{ height: 4 }} />
          </div>

          <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>₹{allocPct} Cr deployed</span>
              <span style={{ fontSize: 12, fontFamily: C.mono, fontWeight: 800, color: balanced ? C.green : totalAlloc > 100 ? C.red : C.amber }}>{totalAlloc}/100</span>
            </div>

            {/* Budget alert toast */}
            {budgetAlert && (
              <div style={{ background: "#1a0d00", border: `1px solid ${C.amber}55`, borderLeft: `3px solid ${C.amber}`, borderRadius: 8, padding: "10px 14px", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: C.amber, marginBottom: 3 }}>⚠ Budget Cap Reached</div>
                  <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>You're {budgetAlert.over} units over 100. The slider was limited automatically.</div>
                </div>
                <button onClick={() => setBudgetAlert(null)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 13, flexShrink: 0 }}>✕</button>
              </div>
            )}

            {/* Remaining budget nudge */}
            {!balanced && totalAlloc < 100 && (
              <div style={{ background: C.panel, border: `1px solid ${C.accent}44`, borderLeft: `4px solid ${C.accent}`, borderRadius: 8, padding: "10px 14px", marginBottom: 10, fontSize: 12, color: C.muted, lineHeight: 1.5, fontWeight: 600 }}>
                <span style={{ color: C.accent, fontWeight: 800 }}>{100 - totalAlloc} units unallocated.</span> Distribute your full budget for maximum impact. Unspent units don't carry forward.
              </div>
            )}

            {/* Trade-off signals */}
            <div style={{ background: C.panel, borderRadius: 8, padding: "10px 12px", marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Trade-off Signals</div>
              {params.capex > 30 && <div style={{ fontSize: 11, color: C.amber, marginBottom: 4, fontWeight: 600 }}>⚠ CapEx {">"}30% — ROI penalty active, watch EBITDA</div>}
              {params.trainer_hire < 6 && totalAlloc > 50 && <div style={{ fontSize: 11, color: C.red, marginBottom: 4, fontWeight: 600 }}>⚠ Trainer {"<"}6% — stress building, completion risk</div>}
              {params.industry_eng < 4 && totalAlloc > 50 && <div style={{ fontSize: 11, color: C.red, marginBottom: 4, fontWeight: 600 }}>⚠ Low employer engagement — placement decay incoming</div>}
              {params.ops_team < 5 && totalAlloc > 50 && <div style={{ fontSize: 11, color: C.amber, marginBottom: 4, fontWeight: 600 }}>⚠ Ops {"<"}5% — stress +1 this period</div>}
              {balanced && <div style={{ fontSize: 11, color: C.green, marginBottom: 4, fontWeight: 700 }}>✓ Budget balanced — full deployment active</div>}

            </div>

            <button onClick={commitPeriod} disabled={!balanced} style={{
              background: balanced ? `linear-gradient(135deg, ${a.color}, ${a.color}cc)` : C.faint,
              color: "#fff", border: "none", borderRadius: 8, padding: "14px", fontSize: 14,
              fontWeight: 800, cursor: balanced ? "pointer" : "not-allowed", width: "100%", fontFamily: C.font,
              boxShadow: balanced ? `0 2px 12px ${a.color}55` : "none", letterSpacing: "0.01em",
              opacity: balanced ? 1 : 0.5, transition: "all 0.2s",
            }}>
              {balanced ? `Commit ${cadence.pLabel(period)}` : `Allocate ${100 - totalAlloc > 0 ? 100 - totalAlloc + " more units" : "exactly 100 units"} to continue`}
            </button>
            {onBack && (
              <button onClick={onBack} style={{ ...btn(C.muted, true), width: "100%", marginTop: 8, fontSize: 12 }}>Back to Blueprint</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


// ===================================================================
//  sid-3: YEAR RESULT
// ===================================================================

function YearResult({ yearData, gameState, yearHistory, kpiHistory, onNext, onBack }) {
  const { yearScore, finalKpis, finalStress, nextBudget, periodHistory, winResult } = yearData;
  const a = ARCHETYPES.find(x => x.id === gameState.archetype);
  const sc = yearScore >= 55 ? C.green : yearScore >= 30 ? C.amber : C.red;

  return (
    <div style={{ maxWidth: 1060, margin: "0 auto", padding: "28px 20px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <span style={{ ...pill(a.color), marginBottom: 8, display: "inline-flex" }}>Year {gameState.year}  Performance Review</span>
          <h2 style={{ fontWeight: 800, fontSize: 28, color: C.text, marginTop: 8, letterSpacing: "-0.02em" }}>
            {yearScore >= 55 ? "Above Target 🎯" : yearScore >= 30 ? "On Target 📊" : "Below Target ⚠"}
          </h2>
        </div>
        <div style={{ background: C.surface, border: `2px solid ${sc}`, borderRadius: 12, padding: "16px 24px", textAlign: "center", boxShadow: `0 0 20px ${sc}22` }}>
          <div style={{ fontFamily: C.mono, fontWeight: 800, fontSize: 48, color: sc, lineHeight: 1 }}>{yearScore}%</div>
          <div style={{ fontSize: 10, color: C.muted, marginTop: 4, textTransform: "uppercase", fontWeight: 700 }}>Performance Index</div>
        </div>
      </div>

      {/* P&L Summary card */}
      {yearData.financials && (() => {
        const f = yearData.financials;
        const plColor = f.plCr >= 0 ? C.green : C.red;
        return (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 20px", marginBottom: 18, display: "flex", gap: 0 }}>
            <div style={{ flex: 1, textAlign: "center", borderRight: `1px solid ${C.border}`, padding: "0 16px" }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Students Trained</div>
              <div style={{ fontFamily: C.mono, fontWeight: 800, fontSize: 22, color: C.text }}>{f.studentsThisPeriod?.toLocaleString()}</div>
            </div>
            <div style={{ flex: 1, textAlign: "center", borderRight: `1px solid ${C.border}`, padding: "0 16px" }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Students Placed</div>
              <div style={{ fontFamily: C.mono, fontWeight: 800, fontSize: 22, color: C.green }}>{Math.round((f.studentsThisPeriod || 0) * (f.placementPct || 0)).toLocaleString()}</div>
            </div>
            <div style={{ flex: 1, textAlign: "center", borderRight: `1px solid ${C.border}`, padding: "0 16px" }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Avg Salary</div>
              <div style={{ fontFamily: C.mono, fontWeight: 800, fontSize: 22, color: C.cyan }}>{f.avgSalaryLPA?.toFixed(1)} LPA</div>
            </div>
            <div style={{ flex: 1, textAlign: "center", borderRight: `1px solid ${C.border}`, padding: "0 16px" }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Revenue</div>
              <div style={{ fontFamily: C.mono, fontWeight: 800, fontSize: 22, color: C.accent }}>₹{f.grossRevenueCr?.toFixed(1)} Cr</div>
            </div>
            <div style={{ flex: 1, textAlign: "center", padding: "0 16px" }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>P&L</div>
              <div style={{ fontFamily: C.mono, fontWeight: 800, fontSize: 22, color: plColor }}>{f.plCr >= 0 ? "+" : ""}₹{f.plCr?.toFixed(1)} Cr</div>
              <div style={{ fontSize: 9, color: C.muted, marginTop: 2 }}>Next budget: ₹{yearData.nextBudget} Cr</div>
            </div>
          </div>
        );
      })()}

      {/* Year Scorecard Banner */}
      <div style={{ background: C.surface, border: `2px solid ${a.color}44`, borderRadius: 14, padding: "18px 22px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: a.color, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Year {gameState.year} Scorecard</div>
            <div style={{ fontSize: 12, color: C.muted }}>Budget allotted this year vs KPI targets hit — your annual performance snapshot.</div>
          </div>
          <div style={{ display: "flex", gap: 20, flexShrink: 0 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: C.mono, fontWeight: 800, fontSize: 22, color: C.accent }}>₹{(gameState.budget || 100).toFixed(0)} Cr</div>
              <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", marginTop: 2 }}>Budget Allotted</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: C.mono, fontWeight: 800, fontSize: 22, color: yearData.nextBudget > (gameState.budget || 100) ? C.green : C.red }}>₹{(yearData.nextBudget || 100).toFixed(0)} Cr</div>
              <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", marginTop: 2 }}>Next Year Budget</div>
            </div>
            <div style={{ textAlign: "center" }}>
              {(() => {
                const kpiHit = gameState.selectedKPIs.filter(kpiId => {
                  const def = gameState.kpiPool.find(k => k.id === kpiId);
                  const after = finalKpis[kpiId] ?? def?.base ?? 0;
                  const base = def?.base ?? 0;
                  const maxTarget = def?.inverse ? Math.max(0, base - 20) : Math.min(100, base + 40);
                  const yearFraction = gameState.year / 5;
                  const target = def?.inverse ? base - (base - maxTarget) * yearFraction : base + (maxTarget - base) * yearFraction;
                  return def?.inverse ? after <= target : after >= target;
                }).length;
                const total = gameState.selectedKPIs.length;
                const pct = Math.round((kpiHit / total) * 100);
                return <>
                  <div style={{ fontFamily: C.mono, fontWeight: 800, fontSize: 22, color: pct >= 70 ? C.green : pct >= 40 ? C.amber : C.red }}>{kpiHit}/{total}</div>
                  <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", marginTop: 2 }}>KPI Targets Hit</div>
                </>;
              })()}
            </div>
          </div>
        </div>
        <div style={{ background: C.panel, borderRadius: 8, padding: "8px 12px", fontSize: 11, color: C.muted, lineHeight: 1.6 }}>
          <span style={{ color: C.text, fontWeight: 700 }}>Budget formula: </span>
          Base ₹100 + P&L effect ({yearData.financials ? `${yearData.financials.plCr >= 0 ? "+" : ""}₹${(yearData.financials.plCr || 0).toFixed(1)} Cr` : "N/A"}) + KPI performance ({yearScore >= 50 ? "+" : ""}{Math.round((yearScore - 50) * 0.4)} units) + event effect.
          {" "}Result: ₹{yearData.nextBudget} Cr next year
          {yearData.nextBudget > (gameState.budget || 100)
            ? <span style={{ color: C.green }}> (Up ₹{(yearData.nextBudget - (gameState.budget || 100)).toFixed(0)} Cr)</span>
            : yearData.nextBudget < (gameState.budget || 100)
              ? <span style={{ color: C.red }}> (Down ₹{((gameState.budget || 100) - yearData.nextBudget).toFixed(0)} Cr)</span>
              : <span style={{ color: C.muted }}> (unchanged)</span>}
        </div>
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 24 }} className="result-grid">

        {/* KPI Target vs Actual table */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>KPI Targets vs Actual — Year {gameState.year}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 60px 60px", gap: 6, padding: "4px 8px", marginBottom: 6 }}>
            <div style={{ fontSize: 9, color: C.muted, fontWeight: 700, textTransform: "uppercase" }}>KPI</div>
            <div style={{ fontSize: 9, color: C.muted, fontWeight: 700, textTransform: "uppercase", textAlign: "center" }}>Target</div>
            <div style={{ fontSize: 9, color: C.muted, fontWeight: 700, textTransform: "uppercase", textAlign: "center" }}>Actual</div>
            <div style={{ fontSize: 9, color: C.muted, fontWeight: 700, textTransform: "uppercase", textAlign: "center" }}>Status</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {gameState.selectedKPIs.map(kpiId => {
              const def = gameState.kpiPool.find(k => k.id === kpiId);
              const after = finalKpis[kpiId] ?? def?.base ?? 0;
              const before = gameState.kpis[kpiId] ?? def?.base ?? 0;
              const diff = after - before;
              const good = def?.inverse ? diff < 0 : diff > 0;
              const note = yearData.periodHistory?.at(-1)?.result?.narratives?.[kpiId] || (good ? "Improving." : "Needs investment.");
              const base = def?.base ?? 0;
              const maxTarget = def?.inverse ? Math.max(0, base - 20) : Math.min(100, base + 40);
              const yearFraction = gameState.year / 5;
              const target = Math.round(def?.inverse ? base - (base - maxTarget) * yearFraction : base + (maxTarget - base) * yearFraction);
              const onTrack = def?.inverse ? after <= target : after >= target;
              return (
                <div key={kpiId} style={{ display: "grid", gridTemplateColumns: "1fr 60px 60px 60px", gap: 6, padding: "7px 8px", background: C.panel, borderRadius: 7, border: `1px solid ${onTrack ? C.green + "44" : C.red + "22"}`, alignItems: "center" }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{def?.label}</div>
                    <div style={{ fontSize: 9, color: C.muted, lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{note}</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: C.mono, fontSize: 12, color: C.muted, fontWeight: 700 }}>{target}<span style={{ fontSize: 9 }}>{def?.unit || "%"}</span></div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: C.mono, fontWeight: 800, fontSize: 13, color: onTrack ? C.green : good ? C.amber : C.red }}>{after.toFixed(1)}</div>
                    <div style={{ fontSize: 9, color: good ? C.green : C.red, fontFamily: C.mono }}>{diff >= 0 ? "+" : ""}{diff.toFixed(1)}</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <span style={{ ...pill(onTrack ? C.green : C.red), fontSize: 8, padding: "2px 6px" }}>{onTrack ? "Hit" : "Miss"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: trend + stakeholders */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>KPI Trajectory</div>
            <KPITrendChart
              kpiHistory={[...(kpiHistory || []), finalKpis]}
              selectedKPIs={gameState.selectedKPIs}
              kpiPool={gameState.kpiPool}
              archColor={a.color}
            />
          </div>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Stakeholder Pulse</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {Object.entries(FUNDER_PERSONAS).slice(0, 3).map(([key, persona]) => {
                const reaction = persona.getReaction(finalKpis, finalStress, yearScore);
                const mc = { satisfied: C.green, neutral: C.amber, concerned: "#f97316", warning: C.red }[reaction.mood];
                const me = { satisfied: "😊", neutral: "😐", concerned: "😟", warning: "😠" }[reaction.mood];
                return (
                  <div key={key} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 10px", background: C.panel, borderLeft: `3px solid ${mc}`, borderRadius: 6 }}>
                    <span style={{ fontSize: 16 }}>{me}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.text }}>{persona.label}</div>
                      <div style={{ fontSize: 10, color: C.muted, lineHeight: 1.4 }}>{reaction.msg}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Financial Summary Panel */}
      {yearData.financials && (
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 20px", marginBottom: 18 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>📊 Financial Feedback — This Year</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 12 }}>
            {[
              { label: "Students Trained", value: (yearData.financials.studentsThisPeriod || 0).toLocaleString(), icon: "🧑‍🎓", color: C.accent },
              { label: "Students Placed", value: (yearData.financials.studentsPlaced || 0).toLocaleString(), icon: "✓", color: C.green },
              { label: "Avg Salary", value: `₹${(yearData.financials.avgSalaryLPA || 0).toFixed(1)} LPA`, icon: "💰", color: C.amber },
              { label: "Revenue Generated", value: `₹${(yearData.financials.grossRevenueCr || 0).toFixed(1)} Cr`, icon: "📈", color: C.cyan },
              { label: "Operating Cost", value: `₹${(yearData.financials.opCostCr || 0).toFixed(1)} Cr`, icon: "🏗", color: C.muted },
              { label: "P&L This Year", value: `${yearData.financials.plCr >= 0 ? "+" : ""}₹${(yearData.financials.plCr || 0).toFixed(1)} Cr`, icon: yearData.financials.plCr >= 0 ? "🟢" : "🔴", color: yearData.financials.plCr >= 0 ? C.green : C.red },
            ].map(m => (
              <div key={m.label} style={{ background: C.panel, borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>{m.icon} {m.label}</div>
                <div style={{ fontFamily: C.mono, fontWeight: 800, fontSize: 16, color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, fontSize: 11, color: C.muted, lineHeight: 1.6, background: C.panel, borderRadius: 8, padding: "8px 12px" }}>
            <span style={{ color: C.text, fontWeight: 600 }}>Formula: </span>
            Revenue = {(yearData.financials.studentsThisPeriod || 0).toLocaleString()} students × ₹{(yearData.financials.avgSalaryLPA || 0).toFixed(1)} LPA × {Math.round((yearData.financials.placementRate || 0) * 100)}% placement × 8% fee
            {" = "}₹{(yearData.financials.grossRevenueCr || 0).toFixed(1)} Cr
          </div>
          {yearData.financials.revenueBreakdown && Object.keys(yearData.financials.revenueBreakdown).length > 1 && (
            <div style={{ marginTop: 10, background: C.panel, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Revenue by Model</div>
              {Object.entries(yearData.financials.revenueBreakdown).map(([model, rev]) => (
                <div key={model} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: C.muted }}>{model}</span>
                  <span style={{ fontFamily: C.mono, fontWeight: 700, fontSize: 12, color: C.cyan }}>₹{(rev || 0).toFixed(1)} Cr</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Event context */}
      {yearData.event && (
        <div style={{ background: C.surface, border: `1px solid ${C.amber}44`, borderLeft: `3px solid ${C.amber}`, borderRadius: 8, padding: "12px 16px", marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 11, color: C.amber, marginBottom: 4 }}>📡 {yearData.event.name}</div>
          <p style={{ fontSize: 11, color: C.muted, margin: 0, lineHeight: 1.5 }}>{yearData.event.desc}</p>
          {yearData.event.funders && gameState.fundingSource && yearData.event.funders[gameState.fundingSource] && (
            <div style={{ marginTop: 6, padding: "4px 8px", background: "#1a1200", borderRadius: 4, fontSize: 10, color: C.amber }}>
              <strong>Your funder signal:</strong> {yearData.event.funders[gameState.fundingSource]}
            </div>
          )}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={onBack} style={{ ...btn(C.muted, true) }}>Review Year {gameState.year}</button>
        <button onClick={onNext} style={{
          background: `linear-gradient(135deg, ${a.color}, ${a.color}cc)`,
          color: "#fff", border: "none", borderRadius: 10, padding: "13px 40px",
          fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: C.font,
          boxShadow: `0 4px 20px ${a.color}44`,
        }}>
          {gameState.year < 5 ? `Year ${gameState.year + 1}` : "View Final Report"}
        </button>
      </div>
    </div>
  );
}


// ===================================================================
//  sid-4: FINAL RESULTS
// ===================================================================

function FinalResults({ gameState, yearHistory, kpiHistory, onBack }) {
  const a = ARCHETYPES.find(x => x.id === gameState.archetype);
  const endGoal = a?.endGoals?.find(g => g.id === gameState.endGoal) || null;
  const finalKPIs = gameState.kpis;

  const END_GOAL_TARGETS = {
    mass_placement:    { students:30000, placed:24000, salary:7,  revenue:250 },
    salary_excellence: { students:15000, placed:11000, salary:10, revenue:300 },
    employer_trust:    { students:20000, placed:14000, salary:8,  revenue:200 },
    rural_reach:       { students:80000, placed:28000, salary:3,  revenue:100 },
    gender_equity:     { students:60000, placed:25000, salary:4,  revenue:120 },
    mass_inclusion:    { students:100000,placed:35000, salary:3,  revenue:150 },
    breakeven_fast:    { students:18000, placed:10000, salary:6,  revenue:400 },
    scale_revenue:     { students:25000, placed:14000, salary:7,  revenue:600 },
    efficiency_model:  { students:30000, placed:16000, salary:6,  revenue:350 },
    digital_scale:     { students:50000, placed:22000, salary:9,  revenue:300 },
    modular_leader:    { students:40000, placed:18000, salary:9,  revenue:280 },
    codesign_future:   { students:20000, placed:14000, salary:11, revenue:320 },
    brand_equity:      { students:12000, placed:9000,  salary:12, revenue:400 },
    elite_placements:  { students:10000, placed:8500,  salary:14, revenue:450 },
    global_recognition:{ students:8000,  placed:6500,  salary:13, revenue:380 },
  };
  const tgt = END_GOAL_TARGETS[gameState.endGoal] || { students:20000, placed:12000, salary:7, revenue:250 };

  let goalMet = 0, goalTotal = 0;
  const goalDetails = [];
  Object.entries(endGoal?.kpiTargets || {}).forEach(([kpiId, target]) => {
    goalTotal++;
    const val = finalKPIs[kpiId];
    const def = gameState.kpiPool.find(kp => kp.id === kpiId)
             || ARCHETYPES.flatMap(x => x.kpiPool).find(kp => kp.id === kpiId);
    const met = val !== undefined && (def?.inverse ? val <= target : val >= target);
    if (met) goalMet++;
    if (def) goalDetails.push({ def, val: val ?? def.base, target, met });
  });
  const goalPct = goalTotal > 0 ? Math.round((goalMet / goalTotal) * 100) : 0;
  const endGoalAchieved = goalTotal > 0 && goalMet === goalTotal;

  let totalGood = 0;
  const kpiAnalysis = [];
  (gameState.selectedKPIs || []).forEach(kpiId => {
    const def = gameState.kpiPool.find(k => k.id === kpiId);
    if (!def) return;
    const start = def.base;
    const end = finalKPIs[kpiId] ?? start;
    const diff = end - start;
    const pctChange = start !== 0 ? Math.round((diff / Math.abs(start)) * 100) : 0;
    const good = def.inverse ? diff < 0 : diff > 0;
    if (good) totalGood++;
    const target = endGoal?.kpiTargets?.[kpiId];
    const targetMet = target != null ? (def.inverse ? end <= target : end >= target) : null;
    kpiAnalysis.push({ def, start, end, diff, pctChange, good, targetMet });
  });
  const kpiScore = kpiAnalysis.length > 0 ? Math.round((totalGood / kpiAnalysis.length) * 100) : 0;
  const avgStress = yearHistory.length ? yearHistory.reduce((s,y) => s+(y.stress||0),0)/yearHistory.length : 3;
  const stability = Math.round(Math.max(0, 100 - avgStress * 9));
  const overall = Math.round(goalPct * 0.4 + kpiScore * 0.35 + stability * 0.25);
  const grade = overall>=85?"S":overall>=70?"A":overall>=55?"B":overall>=40?"C":"D";
  const gc = {S:C.green,A:C.accent,B:C.amber,C:"#f97316",D:C.red}[grade];

  const actualStudents = gameState.cumulativeStudents || 0;
  const actualPlaced   = gameState.cumulativePlaced   || 0;
  const actualRevenue  = gameState.cumulativeRevenue  || 0;
  const actualSalary   = gameState.lastFinancials?.avgSalaryLPA || 0;

  const leaderStyle = overall>=80 ? {
    title:"Transformational Leader", icon:"\u{1F31F}", color:C.green,
    desc:"You inspired change at scale. Bold vision paired with operational discipline.",
    traits:["Long-term thinker","High stakeholder trust","Mission-outcome aligned"],
    shadow:"May have over-invested in systems at the cost of speed in early years.",
  } : overall>=65 ? {
    title:"Strategic Builder", icon:"\u{1F3D7}", color:C.accent,
    desc:"You built methodically. Consistent decisions showed strategic maturity.",
    traits:["Process-oriented","Risk-balanced","Steady growth mindset"],
    shadow:"Occasional risk aversion limited upside. A bolder Year 3 pivot could have changed the trajectory.",
  } : overall>=50 ? {
    title:"Pragmatic Operator", icon:"\u2699\uFE0F", color:C.amber,
    desc:"You kept the institute running. Operational focus dominated over mission outcomes.",
    traits:["Execution-focused","Short-horizon planning","Stress-reactive"],
    shadow:"The gap between intent and outcome widened each year. Strategy needed to lead, not follow.",
  } : {
    title:"Crisis Manager", icon:"\u{1F692}", color:C.red,
    desc:"Survival mode for much of the 5 years. Every year was a fire to fight.",
    traits:["Reactive decision-making","Resource-constrained","Low institutional confidence"],
    shadow:"Start with clearer KPI focus and lower ambition in Year 1 to unlock a very different path.",
  };

  const bestYear  = [...yearHistory].sort((a,b)=>b.yearScore-a.yearScore)[0]||{year:1,yearScore:0};
  const worstYear = [...yearHistory].sort((a,b)=>a.yearScore-b.yearScore)[0]||{year:1,yearScore:0};
  const budgetEnd = yearHistory[yearHistory.length-1]?.nextBudget||100;
  const stressYears = yearHistory.filter(y=>(y.stress||0)>6).length;
  const topKPI    = [...kpiAnalysis].filter(k=>k.good).sort((a,b)=>Math.abs(b.pctChange)-Math.abs(a.pctChange))[0];
  const bottomKPI = kpiAnalysis.find(k=>!k.good);

  const story = [
    endGoalAchieved
      ? `You set out to build a ${a?.label} institute aiming for "${endGoal?.label}" and you delivered. ${goalMet} of ${goalTotal} KPI targets met.`
      : `You set out to build a ${a?.label} institute chasing "${endGoal?.label}". You hit ${goalMet} of ${goalTotal} targets — ${goalPct<50?"the goal stayed out of reach":"so close, but just short"}.`,
    bestYear.yearScore>=60
      ? `Year ${bestYear.year} was your standout — a ${bestYear.yearScore}% performance score that showed what focused investment can achieve.`
      : `No single breakout year emerged. Performance stayed below 60% throughout, signalling a need for bolder resource allocation.`,
    stressYears>=3
      ? `Operational stress ran high for ${stressYears} of 5 years. Under-investment in trainers and ops left scars on delivery quality.`
      : avgStress<3
      ? `You ran a remarkably stable operation. Low stress throughout meant consistent delivery.`
      : `Stress was managed reasonably well. Brief spikes did not derail overall momentum.`,
    budgetEnd>120
      ? `Financial discipline paid off. Budget grew from Rs.100 Cr to Rs.${budgetEnd.toFixed(0)} Cr, giving later years real firepower.`
      : budgetEnd<80
      ? `Budget erosion was a challenge. Declining P&L in later years constrained what was possible.`
      : `Budget stayed roughly steady across 5 years — sustainable, but growth was limited.`,
    topKPI
      ? `Biggest win: ${topKPI.def.label} improved by ${Math.abs(topKPI.pctChange)}% — a clear strength to build on.`
      : `No KPI showed a standout breakout. A broader strategy may be needed next time.`,
    bottomKPI
      ? `Persistent gap: ${bottomKPI.def.label} never recovered — a strategic blind spot worth addressing.`
      : `All KPIs moved in the right direction — a well-rounded outcome.`,
    grade==="S"||grade==="A"
      ? `A ${grade}-grade result. This is the kind of institute that earns national recognition.`
      : grade==="B"
      ? `A solid B-grade foundation. The bones are good. The next run could be transformational.`
      : `A ${grade}-grade result. Tough, but every hard run teaches more than an easy win.`,
  ];

  const funderPersona = FUNDER_PERSONAS[gameState.fundingSource];
  const finalReaction = funderPersona?.getReaction(finalKPIs, avgStress, overall);
  const funderColor = {satisfied:C.green,neutral:C.amber,concerned:"#f97316",warning:C.red}[finalReaction?.mood||"neutral"];

  return (
    <div style={{ maxWidth:1060, margin:"0 auto", padding:"36px 20px", fontFamily:C.font }}>

      {/* TOP VERDICT */}
      <div style={{
        background:endGoalAchieved?"linear-gradient(135deg,#064e3b,#065f46)":"linear-gradient(135deg,#1a0505,#7f1d1d)",
        borderRadius:16, padding:"32px 36px", marginBottom:24,
        display:"flex", alignItems:"center", gap:28, flexWrap:"wrap",
        border:`1px solid ${endGoalAchieved?C.green:C.red}44`,
        boxShadow:`0 8px 40px ${endGoalAchieved?C.green:C.red}22`,
      }}>
        <div style={{ fontSize:56 }}>{endGoalAchieved?"\u{1F3C6}":"\u{1F4CB}"}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:10, fontWeight:700, color:endGoalAchieved?"#6ee7b7":"#fca5a5", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>
            {a?.icon} {a?.label}
          </div>
          <h2 style={{ fontWeight:800, fontSize:24, color:"#fff", margin:"0 0 6px" }}>{endGoal?.label||"End Goal"}</h2>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.55)", marginBottom:12 }}>{endGoal?.desc}</div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
            <span style={{ background:endGoalAchieved?C.green:C.red, color:"#fff", fontWeight:800, fontSize:12, padding:"5px 16px", borderRadius:20 }}>
              {endGoalAchieved?"GOAL ACHIEVED":"GOAL NOT ACHIEVED"}
            </span>
            <span style={{ color:endGoalAchieved?"#a7f3d0":"#fecaca", fontSize:12 }}>{goalMet}/{goalTotal} KPI targets met</span>
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontFamily:C.mono, fontSize:72, fontWeight:700, color:gc, lineHeight:1, textShadow:`0 0 30px ${gc}66` }}>{grade}</div>
          <div style={{ fontFamily:C.mono, fontSize:18, color:"rgba(255,255,255,0.5)" }}>{overall}/100</div>
        </div>
      </div>

      {/* NARRATIVE STORY */}
      <div style={{ background:`linear-gradient(135deg,${C.surface},${C.panel})`, border:`1px solid ${a?.color||C.accent}33`, borderLeft:`4px solid ${a?.color||C.accent}`, borderRadius:12, padding:"24px 28px", marginBottom:24 }}>
        <div style={{ fontSize:10, fontWeight:700, color:a?.color||C.accent, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:14 }}>Your 5-Year Story</div>
        {story.map((line,i) => (
          <p key={i} style={{ fontSize:13, color:i===0?C.text:"#94a3b8", lineHeight:1.8, margin:"0 0 8px", fontWeight:i===0?600:400 }}>{line}</p>
        ))}
      </div>

      {/* END GOAL KPI SCORECARD */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"22px", marginBottom:24 }}>
        <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:4 }}>End Goal KPI Scorecard — {endGoal?.label}</div>
        <div style={{ fontSize:11, color:C.muted, marginBottom:16 }}>{endGoal?.desc} — Here is how you performed against each target:</div>
        {goalDetails.length===0 && <div style={{ fontSize:13, color:C.muted }}>No specific KPI targets for this goal.</div>}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:12 }}>
          {goalDetails.map(({ def, val, target, met }) => {
            const pct = Math.min(100, Math.round((def.inverse?Math.min(target/Math.max(val,0.1),1):Math.min(val/target,1))*100));
            return (
              <div key={def.id} style={{ background:met?`${C.green}0d`:`${C.red}0a`, border:`1px solid ${met?C.green:C.red}44`, borderRadius:10, padding:"14px 16px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:C.text, lineHeight:1.4, flex:1 }}>{def.label}</div>
                  <span style={{ ...pill(met?C.green:C.red), fontSize:8, marginLeft:6 }}>{met?"HIT":"MISS"}</span>
                </div>
                <div style={{ display:"flex", gap:20, marginBottom:10 }}>
                  <div>
                    <div style={{ fontSize:9, color:C.muted, marginBottom:2 }}>TARGET</div>
                    <div style={{ fontFamily:C.mono, fontWeight:800, fontSize:20, color:C.accent }}>{target}<span style={{ fontSize:10 }}>{def.unit||"%"}</span></div>
                  </div>
                  <div>
                    <div style={{ fontSize:9, color:C.muted, marginBottom:2 }}>ACHIEVED</div>
                    <div style={{ fontFamily:C.mono, fontWeight:800, fontSize:20, color:met?C.green:C.red }}>{val.toFixed(1)}<span style={{ fontSize:10 }}>{def.unit||"%"}</span></div>
                  </div>
                </div>
                <div style={{ height:4, background:C.panel, borderRadius:2, overflow:"hidden" }}>
                  <div style={{ width:`${pct}%`, height:"100%", background:met?C.green:C.amber, borderRadius:2 }} />
                </div>
                <div style={{ fontSize:9, color:met?C.green:C.muted, marginTop:4 }}>{pct}% of target reached</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5-YEAR CUMULATIVE OUTCOME */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"22px", marginBottom:24 }}>
        <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:16 }}>5-Year Cumulative Outcome vs Goal Benchmarks</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:12 }}>
          {[
            { label:"Students Trained", actual:actualStudents, target:tgt.students, fmt:v=>v.toLocaleString(), icon:"\u{1F9D1}\u200D\u{1F393}", color:C.accent },
            { label:"Students Placed",  actual:actualPlaced,   target:tgt.placed,   fmt:v=>v.toLocaleString(), icon:"\u2705", color:C.green },
            { label:"Avg Salary (Y5)",  actual:actualSalary,   target:tgt.salary,   fmt:v=>`Rs.${v.toFixed(1)} LPA`, icon:"\u{1F4B0}", color:C.amber },
            { label:"5-Year Revenue",   actual:actualRevenue,  target:tgt.revenue,  fmt:v=>`Rs.${v.toFixed(0)} Cr`, icon:"\u{1F4C8}", color:C.cyan },
          ].map(m => {
            const pct = Math.min(100, m.target>0?Math.round((m.actual/m.target)*100):0);
            const hit = m.actual >= m.target;
            return (
              <div key={m.label} style={{ background:hit?`${m.color}0d`:C.panel, border:`1px solid ${hit?m.color:C.border}44`, borderRadius:10, padding:"14px 16px", position:"relative" }}>
                {hit && <div style={{ position:"absolute", top:8, right:8, fontSize:12, color:m.color }}>\u2705</div>}
                <div style={{ fontSize:22, marginBottom:8 }}>{m.icon}</div>
                <div style={{ fontFamily:C.mono, fontWeight:800, fontSize:20, color:hit?m.color:C.text, marginBottom:2 }}>{m.fmt(m.actual)}</div>
                <div style={{ fontSize:10, color:C.muted, marginBottom:2 }}>{m.label}</div>
                <div style={{ fontSize:11, color:C.muted, marginBottom:8 }}>
                  Goal: <span style={{ color:m.color, fontWeight:700, fontFamily:C.mono }}>{m.fmt(m.target)}</span>
                </div>
                <div style={{ height:4, background:"#1e293b", borderRadius:2, overflow:"hidden" }}>
                  <div style={{ width:`${pct}%`, height:"100%", background:hit?m.color:C.amber, borderRadius:2 }} />
                </div>
                <div style={{ fontSize:9, color:hit?m.color:C.muted, marginTop:4 }}>{pct}% of benchmark</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* YEAR BY YEAR TABLE */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"22px", marginBottom:24 }}>
        <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:14 }}>Year-by-Year Performance</div>
        <div style={{ display:"grid", gridTemplateColumns:"50px 1fr 1fr 80px 1fr 80px", gap:8, padding:"6px 10px", background:C.panel, borderRadius:8, marginBottom:6 }}>
          {["Yr","Budget","Next","Score","KPIs","P&L"].map(h=>(
            <div key={h} style={{ fontSize:9, fontWeight:700, color:C.muted, textTransform:"uppercase" }}>{h}</div>
          ))}
        </div>
        {yearHistory.map((y,idx)=>{
          const sc=y.yearScore>=55?C.green:y.yearScore>=30?C.amber:C.red;
          const pl=y.financials?.plCr??0;
          const budUp=y.nextBudget>y.budgetUsed;
          const snap=kpiHistory?.[idx];
          const kpiHit=snap?gameState.selectedKPIs.filter(kpiId=>{
            const def=gameState.kpiPool.find(k=>k.id===kpiId);
            const after=snap[kpiId]??def?.base??0;
            const base=def?.base??0;
            const mt=def?.inverse?Math.max(0,base-20):Math.min(100,base+40);
            const t=def?.inverse?base-(base-mt)*(y.year/5):base+(mt-base)*(y.year/5);
            return def?.inverse?after<=t:after>=t;
          }).length:0;
          return (
            <div key={y.year} style={{ display:"grid", gridTemplateColumns:"50px 1fr 1fr 80px 1fr 80px", gap:8, padding:"9px 10px", background:y.year===5?`${a.color}0a`:"transparent", borderRadius:8, border:y.year===5?`1px solid ${a.color}33`:"1px solid transparent", marginBottom:3, alignItems:"center" }}>
              <div style={{ fontFamily:C.mono, fontWeight:800, fontSize:13, color:a.color }}>Y{y.year}</div>
              <div style={{ fontFamily:C.mono, fontSize:12, color:C.text }}>Rs.{(y.budgetUsed||100).toFixed(0)} Cr</div>
              <div style={{ fontFamily:C.mono, fontSize:12, color:budUp?C.green:C.red }}>Rs.{(y.nextBudget||100).toFixed(0)} Cr</div>
              <div>
                <div style={{ fontFamily:C.mono, fontWeight:800, fontSize:14, color:sc }}>{y.yearScore}%</div>
                <div style={{ width:48, height:3, background:C.panel, borderRadius:2, marginTop:3 }}>
                  <div style={{ width:`${Math.min(100,y.yearScore)}%`, height:"100%", background:sc, borderRadius:2 }} />
                </div>
              </div>
              <div>
                {snap?<><div style={{ fontFamily:C.mono, fontWeight:700, fontSize:12, color:kpiHit/gameState.selectedKPIs.length>=0.6?C.green:C.amber }}>{kpiHit}/{gameState.selectedKPIs.length}</div><div style={{ fontSize:9, color:C.muted }}>targets met</div></>:<span style={{ color:C.muted }}>—</span>}
              </div>
              <div style={{ fontFamily:C.mono, fontSize:12, color:pl>=0?C.green:C.red }}>{pl>=0?"+":""}Rs.{pl.toFixed(1)}</div>
            </div>
          );
        })}
      </div>

      {/* KPI JOURNEY TABLE */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"22px", marginBottom:24 }}>
        <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:4 }}>KPI 5-Year Journey</div>
        <div style={{ fontSize:11, color:C.muted, marginBottom:14 }}>All selected KPIs — start vs achieved. Goal KPI targets highlighted.</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 60px 70px 80px 70px 70px", gap:6, padding:"5px 10px", background:C.panel, borderRadius:7, marginBottom:6 }}>
          {["KPI","Start","Target","Achieved","Change","Status"].map(h=>(
            <div key={h} style={{ fontSize:9, fontWeight:700, color:C.muted, textTransform:"uppercase" }}>{h}</div>
          ))}
        </div>
        {kpiAnalysis.map(({ def, start, end, diff, pctChange, good, targetMet })=>{
          const goalTarget=endGoal?.kpiTargets?.[def.id];
          const dispTarget=goalTarget!=null?goalTarget:(def.inverse?Math.max(0,start-(start*0.35)):Math.min(200,start+(start*0.4)+15));
          const hit=goalTarget!=null?targetMet:good;
          const sign=diff>=0?"+":"";
          const isGoalKPI=goalTarget!=null;
          return (
            <div key={def.id} style={{ display:"grid", gridTemplateColumns:"1fr 60px 70px 80px 70px 70px", gap:6, padding:"9px 10px", background:hit?`${C.green}08`:`${C.red}05`, borderRadius:7, border:`1px solid ${hit?C.green+"33":C.red+"22"}`, marginBottom:4, alignItems:"center" }}>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:5, flexWrap:"wrap" }}>
                  <div style={{ fontSize:11, fontWeight:700, color:C.text }}>{def.label}</div>
                  {isGoalKPI&&<span style={{ ...pill(a?.color||C.accent), fontSize:7, padding:"1px 5px" }}>GOAL KPI</span>}
                </div>
                <div style={{ fontSize:9, color:C.muted }}>{def.unit||"%"}</div>
              </div>
              <div style={{ fontFamily:C.mono, fontSize:11, color:C.muted }}>{start.toFixed(0)}</div>
              <div style={{ fontFamily:C.mono, fontSize:11, color:isGoalKPI?C.accent:C.muted, fontWeight:isGoalKPI?700:400 }}>{dispTarget.toFixed(0)}</div>
              <div style={{ fontFamily:C.mono, fontWeight:800, fontSize:14, color:hit?C.green:C.red }}>{end.toFixed(1)}</div>
              <div style={{ fontFamily:C.mono, fontSize:10, color:diff>=0?C.green:C.red }}>{sign}{diff.toFixed(1)}</div>
              <div><span style={{ ...pill(hit?C.green:C.red), fontSize:8 }}>{hit?"Achieved":"Missed"}</span></div>
            </div>
          );
        })}
      </div>

      {/* LEADERSHIP INSIGHTS */}
      <div style={{ background:"linear-gradient(135deg,#0f172a,#1e293b)", border:`1px solid ${leaderStyle.color}44`, borderRadius:14, padding:"26px 30px", marginBottom:24 }}>
        <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:18 }}>Leadership Profile</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }} className="leader-grid">
          <div style={{ background:`${leaderStyle.color}14`, border:`1px solid ${leaderStyle.color}44`, borderRadius:12, padding:"20px 22px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
              <div style={{ fontSize:38 }}>{leaderStyle.icon}</div>
              <div>
                <div style={{ fontWeight:800, fontSize:18, color:leaderStyle.color }}>{leaderStyle.title}</div>
                <div style={{ fontSize:11, color:C.muted }}>Based on 5-year decision pattern</div>
              </div>
            </div>
            <p style={{ fontSize:13, color:"#cbd5e1", lineHeight:1.7, margin:"0 0 14px" }}>{leaderStyle.desc}</p>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>
              {leaderStyle.traits.map(t=><span key={t} style={{ ...pill(leaderStyle.color), fontSize:10 }}>{t}</span>)}
            </div>
            <div style={{ background:`${C.amber}12`, border:`1px solid ${C.amber}33`, borderRadius:8, padding:"10px 14px" }}>
              <div style={{ fontSize:10, fontWeight:700, color:C.amber, marginBottom:4 }}>Blind Spot</div>
              <div style={{ fontSize:12, color:"#fcd34d", lineHeight:1.6 }}>{leaderStyle.shadow}</div>
            </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {[
              { label:"Risk Appetite", value:avgStress<3?"Stability-Focused":avgStress<6?"Balanced":"High-Risk Operator", icon:avgStress<3?"\u2696\uFE0F":avgStress<6?"\u{1F4CA}":"\u{1F525}", color:avgStress<3?C.green:avgStress<6?C.accent:C.red, sub:avgStress<3?"Kept stress low — may have left growth on table":avgStress<6?"Managed tension between growth and stability":"Pushed hard — high stress created vulnerability" },
              { label:"Stakeholder Fit", value:kpiScore>=70?"People-Centric":goalPct>=70?"Mission-Driven":"System-Focused", icon:kpiScore>=70?"\u{1F91D}":goalPct>=70?"\u{1F3AF}":"\u2699\uFE0F", color:kpiScore>=70?C.green:goalPct>=70?C.accent:C.amber, sub:kpiScore>=70?"Learner and employer outcomes drove decisions":goalPct>=70?"End-goal clarity shaped the 5-year arc":"Operational efficiency took priority" },
              { label:"Adaptability", value:yearHistory.filter(y=>y.yearScore>=50).length>=3?"Highly Adaptive":yearHistory.filter(y=>y.yearScore>=40).length>=2?"Moderately Adaptive":"Struggled to Pivot", icon:"\u{1F30A}", color:yearHistory.filter(y=>y.yearScore>=50).length>=3?C.green:C.amber, sub:`Maintained benchmark performance in ${yearHistory.filter(y=>y.yearScore>=50).length}/5 years` },
            ].map(c=>(
              <div key={c.label} style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:10, padding:"14px 16px", flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                  <span style={{ fontSize:18 }}>{c.icon}</span>
                  <div>
                    <div style={{ fontSize:9, color:C.muted, fontWeight:700, textTransform:"uppercase" }}>{c.label}</div>
                    <div style={{ fontWeight:800, fontSize:13, color:c.color }}>{c.value}</div>
                  </div>
                </div>
                <div style={{ fontSize:11, color:C.muted, lineHeight:1.5 }}>{c.sub}</div>
              </div>
            ))}
          </div>
        </div>
        {funderPersona && finalReaction && (
          <div style={{ background:C.surface, border:`1px solid ${funderColor}44`, borderLeft:`3px solid ${funderColor}`, borderRadius:8, padding:"14px 16px" }}>
            <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", marginBottom:8 }}>Funder Final Verdict — {funderPersona.label}</div>
            <div style={{ display:"flex", gap:12, alignItems:"center" }}>
              <span style={{ fontSize:26 }}>{funderPersona.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:13, color:funderColor, marginBottom:4 }}>
                  {{satisfied:"Satisfied",neutral:"Neutral",concerned:"Concerned",warning:"Disappointed"}[finalReaction.mood]}
                </div>
                <div style={{ fontSize:12, color:C.muted, lineHeight:1.6 }}>{finalReaction.msg}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ textAlign:"center", paddingBottom:24 }}>
        <button onClick={onBack} style={{ ...btn(a?.color||C.accent), padding:"14px 40px", fontSize:14 }}>
          Restart Simulation
        </button>
      </div>
    </div>
  );
}

// ===================================================================
//  sid-5: MAIN CONTROLLER
//  Flow: Archetype → Sectors → Audience → Revenue → Funding → KPIs → Blueprint → Year
// ===================================================================

export default function InstituteCommand() {
  const [screen, setScreen] = useState("welcome");
  const [gs, setGs] = useState({});
  const [history, setHistory] = useState([]);
  const [kpiHistory, setKpiHistory] = useState([]);
  const [lastYearData, setLastYearData] = useState(null);

  const buildKPIs = (ids, pool) => { const k = {}; ids.forEach(id => { const d = pool.find(x => x.id === id); if (d) k[id] = d.base; }); return k; };

  // sid-5a: handleSetup — revenue step wired in
  const handleSetup = (step, data) => {
    if (step === "archetype") {
      setGs(g => ({ ...g, ...data, selectedKPIs: [] }));
      setScreen("sectors");
    }
    else if (step === "sectors") {
      setGs(g => ({ ...g, ...data }));
      setScreen("audience");
    }
    else if (step === "audience") {
      setGs(g => ({ ...g, ...data }));
      setScreen("revenue");  // sid-5b: audience → revenue (was skipping to funding)
    }
    else if (step === "revenue") {
      setGs(g => ({ ...g, ...data }));
      setScreen("funding");
    }
    else if (step === "funding") {
      setGs(g => ({ ...g, ...data }));
      setScreen("kpis");
    }
    else if (step === "kpis") {
      const budgetStart = 100;
      const extras = getContextualExtras({ sectors: gs.sectors || [], fundingSource: gs.fundingSource, deliveryMode: gs.deliveryMode, archetype: gs.archetype });
      const mergedPool = [...data.kpiPool || []];
      extras.forEach(e => { if (!mergedPool.find(k => k.id === e.id)) mergedPool.push(e); });
      const mergedSelected = [...data.selectedKPIs || []];
      extras.forEach(e => { if (!mergedSelected.includes(e.id)) mergedSelected.push(e.id); });
      const kpis = buildKPIs(mergedSelected, mergedPool);
      setGs(g => ({ ...g, ...data, selectedKPIs: mergedSelected, kpiPool: mergedPool, year: 1, budget: budgetStart, stress: 0, kpis, initialKpis: { ...kpis } }));
      setScreen("blueprint");
    }
  };

  const handleYearComplete = (yearData) => {
    const periodHistory = yearData.periodHistory || [];
    const allFins = periodHistory.map(p => p.result?.financials || {});
    const totalStudents = allFins.reduce((s, f) => s + (f.studentsThisPeriod || 0), 0) || (yearData.financials?.studentsThisPeriod || 0);
    const totalPlaced   = allFins.reduce((s, f) => s + (f.studentsPlaced || 0), 0)   || (yearData.financials?.studentsPlaced || 0);
    const totalRevenue  = allFins.reduce((s, f) => s + (f.grossRevenueCr || 0), 0)   || (yearData.financials?.grossRevenueCr || 0);
    const lastFin = allFins.length > 0 ? allFins[allFins.length - 1] : (yearData.financials || {});
    setLastYearData({ ...yearData, year: gs.year, studentsPlaced: totalPlaced });
    setKpiHistory(h => [...h, yearData.finalKpis]);
    setGs(g => ({
      ...g,
      kpis: yearData.finalKpis,
      stress: yearData.finalStress,
      budget: yearData.nextBudget,
      cumulativePlaced:   (g.cumulativePlaced   || 0) + totalPlaced,
      cumulativeRevenue:  (g.cumulativeRevenue  || 0) + totalRevenue,
      cumulativeStudents: (g.cumulativeStudents || 0) + totalStudents,
      lastFinancials: lastFin,
    }));
    setHistory(h => [...h, { year: gs.year, yearScore: yearData.yearScore, stress: yearData.finalStress, financials: lastFin, budgetUsed: gs.budget, nextBudget: yearData.nextBudget }]);
    setScreen("yearResult");
  };

  const handleNext = () => {
    if (gs.year >= 5) setScreen("final");
    else { setGs(g => ({ ...g, year: g.year + 1 })); setScreen("year"); }
  };

  return (
    <>
      {/* sid-5c: CSS — play-grid-2, responsive */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:Space Grotesk,system-ui,sans-serif;-webkit-font-smoothing:antialiased;background:#080c14;color:#e8edf4;}
        button:hover{opacity:0.88;transform:translateY(-1px);}
        button{transition:all 0.12s;}
        ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:#1e2d40;border-radius:2px;}
        .play-grid-2{grid-template-columns:1fr 1fr;}
        .result-grid,.final-grid{grid-template-columns:1fr 1fr;}
        @media(max-width:900px){
          .play-grid-2{grid-template-columns:1fr!important;}
          .result-grid,.final-grid{grid-template-columns:1fr!important;}
        }
      `}</style>
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: C.font }}>
        {/* Top Nav */}
        {screen !== "welcome" && (
          <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(10px)" }}>
            <div style={{ fontFamily: C.font, fontWeight: 800, fontSize: 15, color: C.text }}>🏛 Institute<span style={{ color: C.accent }}>Command</span></div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              {gs.archetype && (() => { const a = ARCHETYPES.find(x => x.id === gs.archetype); return a ? <span style={pill(a.color)}>{a.icon} {a.label}</span> : null; })()}
              {gs.year && <span style={pill(C.muted)}>Year {gs.year}/5</span>}
              {gs.budget && <span style={pill(C.accent, C.accent + "18")}>₹{(gs.budget || 0).toFixed(0)}Cr</span>}
            </div>
          </div>
        )}

        {/* sid-5d: Screen routing — back buttons match forward flow */}
        {screen === "welcome" && <Welcome onStart={() => setScreen("archetype")} />}
        {screen === "archetype" && <ArchetypeStep onNext={d => handleSetup("archetype", d)} onBack={() => setScreen("welcome")} />}
        {screen === "sectors" && <SectorStep archetype={gs.archetype} onNext={d => handleSetup("sectors", d)} onBack={() => setScreen("archetype")} />}
        {screen === "audience" && <AudienceStep onNext={d => handleSetup("audience", d)} onBack={() => setScreen("sectors")} />}
        {screen === "revenue" && <RevenueStep onNext={d => handleSetup("revenue", d)} onBack={() => setScreen("audience")} />}
        {screen === "funding" && <FundingStep archetype={gs.archetype} sectors={gs.sectors || []} onNext={d => handleSetup("funding", d)} onBack={() => setScreen("revenue")} />}
        {screen === "kpis" && <KPIStep archetype={gs.archetype} deliveryModes={gs.deliveryModes || []} targetAudience={gs.targetAudience || []} extraKpiIds={[]} onNext={d => handleSetup("kpis", d)} onBack={() => setScreen("funding")} />}
        {screen === "blueprint" && <BlueprintStep gameState={gs} onConfirm={() => setScreen("year")} onBack={() => setScreen("kpis")} />}
        {screen === "year" && <YearPlay gameState={gs} yearHistory={history} kpiHistory={kpiHistory} onYearComplete={handleYearComplete} onBack={() => setScreen(gs.year === 1 ? "blueprint" : "yearResult")} />}
        {screen === "yearResult" && lastYearData && <YearResult yearData={lastYearData} gameState={gs} yearHistory={history} kpiHistory={kpiHistory} onNext={handleNext} onBack={() => setScreen("year")} />}
        {screen === "final" && <FinalResults gameState={gs} yearHistory={history} kpiHistory={kpiHistory} onBack={() => setScreen("yearResult")} />}
      </div>
    </>
  );
}
