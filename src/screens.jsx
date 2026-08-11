import React, { useState, useEffect } from 'react';
import { C, pill, card, btn } from './theme';
import {
  ARCHETYPES, SECTORS, FUNDING_SOURCES, DELIVERY_MODES, REVENUE_MODELS,
  PARAMS, FUNDER_PERSONAS, getCadence,
  ARCHETYPE_KPI_RECS          // sid-6: import recommendation map
} from './constants';
import { getContextualExtras } from './constants';
import { KPI_DELIVERY_TAGS, KPI_AUDIENCE_TAGS } from './engine';
import { StepIndicator } from './widgets';

/* ====================================================
   WELCOME SCREEN
   ==================================================== */
function Welcome({ onStart }) {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 2000); return () => clearInterval(t); }, []);
  const stats = [["5", "Archetypes"], ["10", "Sectors"], ["60+", "KPIs"], ["25+", "Events"]];
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`, backgroundSize: "40px 40px", opacity: 0.4 }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 50% at 50% 50%, transparent 40%, #080c14 100%)" }} />
      <div style={{ position: "relative", maxWidth: 620, textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: C.surface, border: `1px solid ${C.borderHi}`, borderRadius: 20, padding: "6px 16px", marginBottom: 28 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.green, boxShadow: `0 0 8px ${C.green}` }} />
          <span style={{ fontSize: 11, color: C.muted, fontFamily: C.mono, fontWeight: 600, letterSpacing: "0.06em" }}>INDIA  SKILLING SECTOR  2024-2029</span>
        </div>
        <h1 style={{ fontFamily: "Space Grotesk,system-ui,sans-serif", fontWeight: 700, fontSize: "clamp(38px,7vw,64px)", color: C.text, letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: 16 }}>
          Institute<br />
          <span style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.cyan})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Command</span>
        </h1>
        <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7, marginBottom: 36, maxWidth: 480, margin: "0 auto 36px" }}>
          A 5-year strategic simulation for skilling institutes in India. Navigate policy shocks, market volatility, and budget trade-offs across real sectors.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 40, flexWrap: "wrap" }}>
          {stats.map(([n, l]) => (
            <div key={l} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 20px", minWidth: 80, textAlign: "center" }}>
              <div style={{ fontFamily: C.mono, fontSize: 24, fontWeight: 800, color: C.accent, lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 4, fontWeight: 600, letterSpacing: "0.04em" }}>{l}</div>
            </div>
          ))}
        </div>
        <button onClick={onStart}
          style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.cyan})`, color: "#fff", border: "none", borderRadius: 10, padding: "15px 50px", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: C.font, letterSpacing: "0.01em", boxShadow: `0 4px 24px ${C.accent}55` }}>
          Start Simulation
        </button>
        <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
          {["🎭 5 Archetypes", "💰 Budget Sliders", "📊 Live Charts", "⚡ Market Events", "🗺 Strategy Canvas"].map(t => (
            <span key={t} style={{ fontSize: 11, color: C.muted, display: "flex", alignItems: "center", gap: 4 }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ====================================================
   TARGET AUDIENCE DATA & STEP
   ==================================================== */
const TARGET_AUDIENCES = [
  {
    id:"youth", icon:"🧑‍🎓", label:"School Dropouts & Youth (14-25)", color:"#059669",
    desc:"First-generation learners, school dropouts seeking first employment. High mobilisation need, subsidy-sensitive.",
    impact:"Boosts inclusion KPIs. Mobilisation + subsidy critical. Low digital readiness - field outreach essential.",
    kpiBoost:["completion_rate","women_pct","rural_pct","scholarship_pct"],
    paramHint:"Invest in Mobilisation, Subsidies, and Trainer Hiring for best outcomes.",
  },
  {
    id:"working_pros", icon:"💼", label:"Working Professionals (Upskilling)", color:"#2563eb",
    desc:"Employed adults seeking career advancement, certification or reskilling. Higher willingness to pay, digital-native.",
    impact:"Boosts salary outcomes and digital KPIs. Industry engagement and curriculum agility matter most.",
    kpiBoost:["avg_salary","retention_12","digital_completion","return_upskill_pct"],
    paramHint:"Invest in Tech, Industry Engagement, and Trainer Development.",
  },
  {
    id:"women", icon:"👩", label:"Women & Marginalized Groups", color:"#d97706",
    desc:"Women, SC/ST, differently-abled and other underserved communities needing targeted skilling support.",
    impact:"Strong CSR and govt funder alignment. Inclusion and safety KPIs are critical. Subsidy spend unlocks outcomes.",
    kpiBoost:["women_pct","marginalized_pct","scholarship_pct","local_lang_pct"],
    paramHint:"Invest in Subsidies, Mobilisation, and Admin for compliance tracking.",
  },
  {
    id:"rural", icon:"🌾", label:"Rural & Last-Mile Learners", color:"#0891b2",
    desc:"Learners from Tier 3/4 towns and villages with limited connectivity, infrastructure and exposure.",
    impact:"Field outreach and CapEx are critical. Digital delivery underperforms. Govt scheme alignment unlocks funding.",
    kpiBoost:["rural_pct","last_mile_placement","community_reach_pct","local_lang_pct"],
    paramHint:"Invest in Mobilisation, CapEx, and Student Subsidies.",
  },
  {
    id:"graduates", icon:"🎓", label:"College Graduates (Entry-Level Jobs)", color:"#7c3aed",
    desc:"Graduates with degrees but lacking job-ready skills. Employer-linked training, apprenticeships, and certifications.",
    impact:"Placement rate and employer satisfaction are primary KPIs. Industry engagement is the highest lever.",
    kpiBoost:["placement_rate","employer_sat","role_alignment","tier1_placement"],
    paramHint:"Invest in Industry Engagement, Trainer Development, and Tech.",
  },
  {
    id:"exservicemen", icon:"🪖", label:"Ex-Servicemen & Veterans", color:"#be185d",
    desc:"Retired armed forces personnel transitioning to civilian careers. Disciplined, structured, needs sector bridging.",
    impact:"High discipline reduces dropout. Sector-specific certification and employer linkages are key.",
    kpiBoost:["retention_12","employer_repeat","cert_pass_rate","role_alignment"],
    paramHint:"Invest in Industry Engagement, CapEx, and Trainer Hiring.",
  },
];

function AudienceStep({ onNext, onBack }) {
  const [selected, setSelected] = useState([]);
  const toggle = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const canContinue = selected.length >= 1;
  return (
    <div style={{ maxWidth: 960, margin:"0 auto", padding:"40px 20px" }}>
      <div style={{ textAlign:"center", marginBottom:28 }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:C.surface, border:`1px solid ${C.borderHi}`, borderRadius:20, padding:"5px 14px", marginBottom:16 }}>
          <span style={{ width:6, height:6, borderRadius:"50%", background:C.accent, boxShadow:`0 0 8px ${C.accent}` }} />
          <span style={{ fontSize:10, color:C.muted, fontFamily:C.mono, fontWeight:600, letterSpacing:"0.08em" }}>STEP 2 OF 8 · TARGET AUDIENCE</span>
        </div>
        <h2 style={{ fontWeight:700, fontSize:28, color:C.text, marginBottom:8, letterSpacing:"-0.02em" }}
            title="Select the learner groups your institute primarily serves. This affects KPI priorities, funder alignment, and budget weights.">
          Who does your institute train?
        </h2>
        <p style={{ color:C.muted, fontSize:13, maxWidth:540, margin:"0 auto", lineHeight:1.65 }}>
          Select <strong style={{color:C.text}}>one or more</strong> learner groups. Your selection shapes KPI priorities, funder alignment, and budget parameter weights.
        </p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:10, marginBottom:24 }}>
        {TARGET_AUDIENCES.map(a => {
          const sel = selected.includes(a.id);
          return (
            <div key={a.id} onClick={() => toggle(a.id)}
              style={{
                background: sel ? `${a.color}15` : C.surface,
                border: sel ? `2px solid ${a.color}` : `1px solid ${C.border}`,
                borderRadius:12, padding:"16px 18px", cursor:"pointer",
                boxShadow: sel ? `0 0 0 3px ${a.color}22` : "none",
                transition:"all 0.15s", display:"flex", flexDirection:"column", gap:6,
              }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <span style={{ fontSize:24 }}>{a.icon}</span>
                <div style={{ width:18, height:18, borderRadius:4, border:`2px solid ${sel ? a.color : C.border}`, background: sel ? a.color : "transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  {sel && <span style={{ color:"#fff", fontSize:12, fontWeight:800 }}>✓</span>}
                </div>
              </div>
              <div style={{ fontWeight:700, fontSize:13, color:sel ? C.text : C.muted }}>{a.label}</div>
              <p style={{ fontSize:11, color:C.muted, lineHeight:1.5, margin:0 }}>{a.desc}</p>
              {sel && (
                <div style={{ marginTop:4, background:`${a.color}18`, border:`1px solid ${a.color}33`, borderRadius:6, padding:"7px 10px", fontSize:11, color:a.color, lineHeight:1.5 }}>
                  💡 {a.paramHint}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {selected.length > 0 && (
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"12px 16px", marginBottom:20, display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
          <span style={{ fontSize:11, color:C.muted, fontWeight:600 }}>Selected:</span>
          {selected.map(id => {
            const a = TARGET_AUDIENCES.find(x => x.id === id);
            return <span key={id} style={{ ...pill(a.color), fontSize:10 }}>{a.icon} {a.label}</span>;
          })}
        </div>
      )}
      <div style={{ display:"flex", justifyContent:"space-between" }}>
        <button onClick={onBack} style={{ ...btn(C.muted, true) }}>Back</button>
        <button onClick={() => onNext({ targetAudience: selected })} disabled={!canContinue}
          style={{
            background: canContinue ? `linear-gradient(135deg, ${C.accent}, #2563eb)` : C.panel,
            color:"#fff", border:"none", borderRadius:10, padding:"13px 56px",
            fontSize:14, fontWeight:700, cursor: canContinue ? "pointer" : "not-allowed",
            fontFamily:C.font, opacity: canContinue ? 1 : 0.4,
            boxShadow: canContinue ? `0 4px 20px ${C.accent}44` : "none",
          }}>
          {canContinue ? `Continue with ${selected.length} group${selected.length>1?"s":""}` : "Select at least one group"}
        </button>
      </div>
    </div>
  );
}

/* ====================================================
   ARCHETYPE STEP — now with expandable Pros & Cons
   ==================================================== */
function ArchetypeStep({ onNext, onBack }) {
  const [arch, setArch] = useState(null);
  const [goal, setGoal] = useState(null);
  const [expandedArch, setExpandedArch] = useState(null);
  const a = ARCHETYPES.find(x => x.id === arch);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 20px" }}>
      <StepIndicator current={1} />
      <div style={{ background:"#0a1628", border:`1px solid ${C.accent}33`, borderLeft:`3px solid ${C.accent}`, borderRadius:8, padding:"10px 16px", marginBottom:24, display:"flex", gap:10, alignItems:"flex-start" }}>
        <span style={{ fontSize:16, flexShrink:0 }}>🧭</span>
        <div style={{ fontSize:12, color:C.muted, lineHeight:1.6 }}>
          <span style={{ color:C.accent, fontWeight:700 }}>Strategic Tip: </span>
          Your archetype is your institute's core identity for all 5 years. It shapes which KPIs matter, how your budget choices score, and what your funders expect. Choose what genuinely reflects your mission — you can't change it later.
        </div>
      </div>
      <div style={{ marginBottom: 28, textAlign: "center" }}>
        <h2 style={{ fontWeight: 800, fontSize: 28, color: C.text, marginBottom: 8, letterSpacing: "-0.02em" }}
            title="Your archetype is your institute's DNA. It determines KPI weights, budget scoring, and funder expectations for all 5 years.">
          Choose Your Archetype
        </h2>
        <p style={{ color: C.muted, fontSize: 13 }}>Your institutional DNA — this shapes every KPI, budget weight, and scoring rule. Click any card to see strengths & watch-outs.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 12, marginBottom: 28 }}>
        {ARCHETYPES.map(x => {
          const isSelected = arch === x.id;
          const isExpanded = expandedArch === x.id;
          return (
            <div key={x.id}
              onClick={() => { setArch(x.id); setGoal(null); setExpandedArch(isExpanded ? null : x.id); }}
              style={{
                background: isSelected ? `${x.color}15` : C.surface,
                border: isSelected ? `2px solid ${x.color}` : `1px solid ${C.border}`,
                borderRadius: 12, padding: "20px", cursor: "pointer",
                boxShadow: isSelected ? `0 0 0 4px ${x.color}22, 0 4px 24px ${x.color}22` : "none",
                transition: "all 0.15s",
              }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <span style={{ fontSize: 26 }}>{x.icon}</span>
                {isSelected && <span style={{ ...pill(x.color), fontSize: 9 }}>✓ Selected</span>}
              </div>
              <div style={{ fontWeight: 800, fontSize: 15, color: C.text, marginBottom: 6 }}>{x.label}</div>
              <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.55, marginBottom: 12 }}>{x.desc}</p>

              {/* Collapsed: show 2 pros as pills */}
              {!isExpanded && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {x.pros.slice(0, 2).map(p => <span key={p} style={{ ...pill(x.color), fontSize: 9 }}>{p}</span>)}
                  <span style={{ fontSize: 9, color: C.muted, alignSelf: "center", marginLeft: 4 }}>Click to see all ▾</span>
                </div>
              )}

              {/* Expanded: full pros & cons */}
              {isExpanded && (
                <div style={{ marginTop: 6, paddingTop: 10, borderTop: `1px solid ${x.color}33` }}>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: C.green, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Strengths</div>
                    {x.pros.map((p, i) => (
                      <div key={i} style={{ fontSize: 11, color: C.muted, marginBottom: 4, lineHeight: 1.45, display: "flex", gap: 6 }}>
                        <span style={{ color: C.green, flexShrink: 0 }}>+</span>{p}
                      </div>
                    ))}
                  </div>
                  {x.cons && x.cons.length > 0 && (
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: C.amber, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Watch Outs</div>
                      {x.cons.map((p, i) => (
                        <div key={i} style={{ fontSize: 11, color: C.muted, marginBottom: 4, lineHeight: 1.45, display: "flex", gap: 6 }}>
                          <span style={{ color: C.amber, flexShrink: 0 }}>⚠</span>{p}
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ fontSize: 9, color: C.faint, marginTop: 6 }}>Click again to collapse ▴</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* End Goal selection */}
      {a && (
        <div style={{ ...card(a.color), marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>Choose Your 5-Year End Goal</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 10 }}>
            {a.endGoals.map(g => (
              <div key={g.id} onClick={(e) => { e.stopPropagation(); setGoal(g.id); }}
                style={{
                  background: goal === g.id ? `${a.color}18` : C.panel,
                  border: goal === g.id ? `2px solid ${a.color}` : `1px solid ${C.border}`,
                  borderRadius: 10, padding: "14px 16px", cursor: "pointer",
                  boxShadow: goal === g.id ? `0 0 0 3px ${a.color}22` : "none",
                }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.text, marginBottom: 4 }}>{g.label}</div>
                <p style={{ fontSize: 11, color: C.muted, margin: 0, lineHeight: 1.5 }}>{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={onBack} style={{ ...btn(C.muted, true) }}>Back</button>
        <button onClick={() => onNext({ archetype: arch, endGoal: goal, kpiPool: a.kpiPool })}
          disabled={!arch || !goal}
          style={{ ...btn(a?.color || C.accent), opacity: (!arch || !goal) ? 0.4 : 1 }}>
          Continue to KPIs
        </button>
      </div>
    </div>
  );
}

/* ====================================================
   sid-6: KPI STEP — archetype recs + tick-only + N/10 chosen
   ==================================================== */
function KPIStep({ archetype, deliveryModes, targetAudience, onNext, onBack }) {
  const a = ARCHETYPES.find(x => x.id === archetype);
  const [selected, setSelected] = useState([]);
  const [filter, setFilter] = useState("all");
  const toggle = id => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : s.length < 10 ? [...s, id] : s);

  const modes = deliveryModes || [];
  const audiences = targetAudience || [];

  // sid-6: archetype-based recommendations
  const recIds = (ARCHETYPE_KPI_RECS && ARCHETYPE_KPI_RECS[archetype]) || [];
  const isRec = (kpiId) => recIds.includes(kpiId);

  const kpiRelevance = (kpiId) => {
    const delivTags = KPI_DELIVERY_TAGS ? KPI_DELIVERY_TAGS[kpiId] : undefined;
    const audTags = KPI_AUDIENCE_TAGS ? KPI_AUDIENCE_TAGS[kpiId] : undefined;
    let score = 0;
    if (delivTags) {
      const match = delivTags.some(t => modes.includes(t));
      const mismatch = delivTags.length > 0 && !match && modes.length > 0;
      if (match) score += 2;
      else if (mismatch) score -= 1;
    }
    if (audTags) {
      const match = audTags.some(t => audiences.includes(t));
      if (match) score += 2;
    }
    // sid-6: boost score for archetype-recommended KPIs
    if (isRec(kpiId)) score += 3;
    return score;
  };

  const AUD_LABELS = { youth:"School Dropouts & Youth", working_pros:"Working Professionals", women:"Women & Marginalized", rural:"Rural Learners", graduates:"College Graduates", exservicemen:"Ex-Servicemen" };
  const DELIV_LABELS = { classroom:"Classroom", handson:"Hands-On", online_async:"Online Self-Paced", online_live:"Online Live", hybrid:"Hybrid", mobile:"Mobile/Community" };

  const tagLabel = (kpiId) => {
    const rel = kpiRelevance(kpiId);
    const delivTags = (KPI_DELIVERY_TAGS && KPI_DELIVERY_TAGS[kpiId]) || [];
    const audTags = (KPI_AUDIENCE_TAGS && KPI_AUDIENCE_TAGS[kpiId]) || [];
    const matchedModes = delivTags.filter(t => modes.includes(t)).map(t => DELIV_LABELS[t]).join(", ");
    const matchedAuds = audTags.filter(t => audiences.includes(t)).map(t => AUD_LABELS[t]).join(", ");
    if (rel >= 3) return { label: "Best fit", color: C.green, detail: [matchedModes, matchedAuds].filter(Boolean).join(" + ") };
    if (rel === 2) return { label: "Good fit", color: C.cyan, detail: matchedModes || matchedAuds };
    if (rel === 1) return { label: "Partial fit", color: C.amber, detail: "" };
    if (rel < 0) return { label: "Low fit", color: C.red, detail: "Not aligned with your delivery mode" };
    return null;
  };

  const sortedPool = [...a.kpiPool].sort((x, y) => kpiRelevance(y.id) - kpiRelevance(x.id));
  const filteredPool = filter === "recommended"
    ? sortedPool.filter(k => kpiRelevance(k.id) >= 2 || isRec(k.id))  // sid-6: include archetype recs in filter
    : filter === "irrelevant"
    ? sortedPool.filter(k => kpiRelevance(k.id) < 0)
    : sortedPool;

  const recCount = sortedPool.filter(k => kpiRelevance(k.id) >= 2 || isRec(k.id)).length;
  const mismatchCount = sortedPool.filter(k => kpiRelevance(k.id) < 0).length;

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 20px" }}>
      <StepIndicator current={5} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontWeight: 800, fontSize: 26, color: C.text, marginBottom: 4 }}
              title="Pick exactly 10 KPIs that will be tracked across all 5 years. ★ KPIs are recommended for your archetype. Green-tagged KPIs align with your delivery mode and audience.">
            Select Your 10 KPIs
          </h2>
          <p style={{ color: C.muted, fontSize: 13 }}>
            ★ = recommended for your archetype. Green = delivery/audience fit. Red = misaligned (55% growth speed).
          </p>
        </div>
        {/* sid-6: counter shows "N/10 chosen" */}
        <div style={{ ...pill(selected.length === 10 ? C.green : C.cyan), fontSize: 13, padding: "6px 16px", flexShrink: 0 }}>
          {selected.length}/10 chosen
        </div>
      </div>
      {modes.length === 0 && (
        <div style={{ background: "#1a1200", border: `1px solid ${C.amber}55`, borderLeft: `3px solid ${C.amber}`, borderRadius: 8, padding: "9px 14px", marginBottom: 12, fontSize: 11, color: C.amber }}>
          ⚠ You have not selected a delivery mode yet. KPI relevance tags will update once you choose delivery mode. You can revisit KPIs using the Back button.
        </div>
      )}

      {/* sid-6: show archetype rec count */}
      <div style={{ background: "#0a1628", border: `1px solid ${C.accent}33`, borderLeft: `3px solid ${C.accent}`, borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 11, color: C.muted, lineHeight: 1.7 }}>
        <span style={{ color: C.accent, fontWeight: 700 }}>Your context: </span>
        {a && <span>Archetype: <b style={{ color: C.text }}>{a.label}</b> </span>}
        {recIds.length > 0 && <span>| <span style={{ color: "#f5b942", fontWeight: 700 }}>★ {recIds.length} archetype-recommended KPIs</span> </span>}
        {modes.length > 0 && <span>| Delivery: <b style={{ color: C.text }}>{modes.map(m => DELIV_LABELS[m] || m).join(", ")}</b> </span>}
        {audiences.length > 0 && <span>| Audience: <b style={{ color: C.text }}>{audiences.map(a => AUD_LABELS[a] || a).join(", ")}</b></span>}
        <span style={{ marginLeft: 10, color: C.green }}>({recCount} recommended KPIs highlighted)</span>
        {mismatchCount > 0 && <span style={{ marginLeft: 6, color: C.red }}>({mismatchCount} low-fit KPIs flagged)</span>}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {[["all","All KPIs"],["recommended","★ Recommended"],["irrelevant","⚠ Low Fit"]].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)} style={{
            background: filter === val ? C.accent : C.surface,
            color: filter === val ? "#fff" : C.muted,
            border: `1px solid ${filter === val ? C.accent : C.border}`,
            borderRadius: 6, padding: "5px 14px", fontSize: 11, fontWeight: 600,
            cursor: "pointer", fontFamily: C.font,
          }}>{label}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 8, marginBottom: 28 }}>
        {filteredPool.map(kpi => {
          const sel = selected.includes(kpi.id);
          const rec = isRec(kpi.id);              // sid-6
          const tag = tagLabel(kpi.id);
          const rel = kpiRelevance(kpi.id);
          // sid-6: gold border for recommended, archetype color for selected
          const borderColor = sel
            ? a.color
            : rec
            ? "#f5b942"
            : rel >= 2 ? C.green + "88" : rel < 0 ? C.red + "55" : C.border;
          return (
            <div key={kpi.id} onClick={() => toggle(kpi.id)}
              style={{
                background: sel ? `${a.color}15` : rec ? "#f5b94210" : rel >= 2 ? `${C.green}08` : rel < 0 ? `${C.red}08` : C.surface,
                border: `1.5px solid ${borderColor}`,
                borderRadius: 8, padding: "11px 13px", cursor: "pointer",
                transition: "all 0.12s",
                boxShadow: sel ? `0 0 0 2px ${a.color}22` : rec ? `0 0 0 1px #f5b94233` : "none",
              }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                <div style={{ fontWeight: 700, fontSize: 12, color: C.text, lineHeight: 1.3, display: "flex", alignItems: "center", gap: 5 }}>
                  {/* sid-6: ★ Rec badge */}
                  {rec && (
                    <span style={{
                      fontSize: 8, fontWeight: 800, color: "#f5b942",
                      background: "#f5b94222", border: "1px solid #f5b94255",
                      borderRadius: 4, padding: "1px 5px", flexShrink: 0,
                      letterSpacing: "0.04em",
                    }}>★ Rec</span>
                  )}
                  {kpi.label}
                </div>
                {/* sid-6: tick-only, no "Selected" word */}
                {sel && <span style={{ color: a.color, fontSize: 16, flexShrink: 0, marginLeft: 4, fontWeight: 800, lineHeight: 1 }}>✓</span>}
              </div>
              <div style={{ fontSize: 10, color: C.faint, marginBottom: tag ? 5 : 0 }}>Base: {kpi.base}{kpi.unit}</div>
              {tag && (
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: tag.color, background: tag.color + "18", borderRadius: 4, padding: "2px 6px" }}>{tag.label}</span>
                  {tag.detail && <span style={{ fontSize: 9, color: C.muted }}>{tag.detail}</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={onBack} style={{ ...btn(C.muted, true) }}>Back</button>
        <button onClick={() => onNext({ selectedKPIs: selected, kpiPool: a.kpiPool })}
          disabled={selected.length !== 10}
          style={{ ...btn(a.color), opacity: selected.length !== 10 ? 0.4 : 1 }}>
          Confirm {selected.length}/10 KPIs
        </button>
      </div>
    </div>
  );
}

/* ====================================================
   SECTOR STEP
   ==================================================== */
function SectorStep({ archetype, onNext, onBack }) {
  const a = ARCHETYPES.find(x => x.id === archetype);
  const [selected, setSelected] = useState([]);
  const toggle = id => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : s.length < 3 ? [...s, id] : s);
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
      <StepIndicator current={3} />
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 800, fontSize: 26, color: C.text, marginBottom: 4 }}
            title="Choose the industry sectors your institute will train for. Single-sector focus gives 1.0x growth; multi-sector dilutes it.">
          Choose Sector(s)
        </h2>
        <p style={{ color: C.muted, fontSize: 13 }}>Up to 3. Focus on 1 for max KPI impact — multi-sector requires stronger management.</p>
        <div style={{ background:"#0a1628", border:`1px solid ${C.amber}33`, borderLeft:`3px solid ${C.amber}`, borderRadius:8, padding:"10px 14px", marginTop:12, fontSize:11, color:C.muted, lineHeight:1.6 }}>
          <span style={{ color:C.amber, fontWeight:700 }}>⚠ Sector Warning: </span>
          Each additional sector you choose reduces your KPI growth multiplier — 2 sectors = 0.85×, 3 sectors = 0.70×. Single-sector institutes consistently outperform on placement and employer outcomes. Only go multi-sector if your archetype and funding specifically supports it.
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))", gap: 10, marginBottom: 28 }}>
        {SECTORS.map(s => {
          const sel = selected.includes(s.id);
          return (
            <div key={s.id} onClick={() => toggle(s.id)}
              title={s.desc || s.label}
              style={{
                background: sel ? `${a.color}15` : C.surface,
                border: sel ? `2px solid ${a.color}` : `1px solid ${C.border}`,
                borderRadius: 10, padding: "16px", cursor: "pointer", textAlign: "center",
                boxShadow: sel ? `0 0 0 3px ${a.color}22` : "none",
                transition: "all 0.12s",
              }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 12, color: sel ? C.text : C.muted }}>{s.label}</div>
              {sel && <div style={{ marginTop: 6, fontSize: 11, color: a.color, fontWeight: 700 }}>✓ Selected</div>}
            </div>
          );
        })}
      </div>
      {selected.length > 1 && (
        <div style={{ background: "#1a1200", border: `1px solid ${C.amber}44`, borderRadius: 8, padding: "10px 14px", marginBottom: 16 }}>
          <span style={{ fontSize: 12, color: C.amber }}>⚠ Multi-sector focus penalty active: {selected.length === 2 ? "0.85×" : "0.70×"} KPI growth</span>
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={onBack} style={{ ...btn(C.muted, true) }}>Back</button>
        <button onClick={() => onNext({ sectors: selected })} disabled={!selected.length}
          style={{ ...btn(a.color), opacity: !selected.length ? 0.4 : 1 }}>
          Continue
        </button>
      </div>
    </div>
  );
}

/* ====================================================
   REVENUE STEP — formula removed, narrative only
   ==================================================== */
function RevenueStep({ onNext, onBack }) {
  const [selected, setSelected] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const toggle = (id) => {
    setSelected(prev => prev.includes(id)
      ? prev.filter(x => x !== id)
      : prev.length < 3 ? [...prev, id] : prev
    );
  };
  const canContinue = selected.length >= 1;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ marginBottom: 28 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: C.purple, textTransform: "uppercase", letterSpacing: "0.08em" }}>Step 5 of 8 · Revenue Strategy</span>
        <h2 style={{ fontWeight: 800, fontSize: 26, color: C.text, marginTop: 8, letterSpacing: "-0.02em" }}
            title="Choose how your institute earns revenue. Each model has different KPI implications and margin profiles across 5 years.">
          How will your institute generate revenue?
        </h2>
        <p style={{ color: C.muted, fontSize: 13, marginTop: 6, lineHeight: 1.6 }}>
          Choose 1 to 3 revenue models. Each model unlocks different KPI bonuses and income streams tracked across all 5 years.
          {selected.length === 3 && <span style={{ color: C.amber, fontWeight: 700, marginLeft: 8 }}>Maximum 3 selected.</span>}
        </p>
        <div style={{ background: `${C.purple}18`, border: `1px solid ${C.purple}44`, borderLeft: `3px solid ${C.purple}`, borderRadius: 8, padding: "10px 14px", marginTop: 12, fontSize: 12, color: C.muted }}>
          <span style={{ color: C.purple, fontWeight: 700 }}>💰 Revenue Tip:</span> Training Delivery is the safest base. Adding Consulting or Licensing in Year 3+ unlocks higher margins without more students.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, marginBottom: 24 }}>
        {REVENUE_MODELS.map(model => {
          const active = selected.includes(model.id);
          const isOpen = expanded === model.id;
          return (
            <div key={model.id} style={{
              background: active ? `${C.purple}18` : C.surface,
              border: `2px solid ${active ? C.purple : C.border}`,
              borderRadius: 12, padding: "14px 16px", cursor: "pointer",
              transition: "all 0.15s",
              opacity: !active && selected.length >= 3 ? 0.5 : 1,
            }} onClick={() => toggle(model.id)}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ fontSize: 24, flexShrink: 0 }}>{model.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: active ? C.purple : C.text, marginBottom: 3 }}>
                    {active ? "✓ " : ""}{model.label}
                  </div>
                  <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>{model.desc}</div>
                </div>
              </div>
              {active && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.purple}33` }}>
                  <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>KPI Boosts</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {Object.entries(model.kpiBoost).map(([k, v]) => (
                      <span key={k} style={{ ...pill(C.green), fontSize: 9 }}>+{v} {k.replace(/_/g, " ")}</span>
                    ))}
                  </div>
                  <button onClick={e => { e.stopPropagation(); setExpanded(isOpen ? null : model.id); }}
                    style={{ marginTop: 8, fontSize: 10, color: C.purple, background: "none", border: `1px solid ${C.purple}44`, borderRadius: 6, padding: "3px 8px", cursor: "pointer" }}>
                    {isOpen ? "Hide details ▴" : "Pros & Watch Outs ▾"}
                  </button>
                  {isOpen && (
                    <div style={{ marginTop: 8, display: "flex", gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        {model.pros.map((p, i) => <div key={i} style={{ fontSize: 10, color: C.muted, marginBottom: 3, display: "flex", gap: 5 }}><span style={{ color: C.green }}>+</span>{p}</div>)}
                      </div>
                      <div style={{ width: 1, background: C.border, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        {model.cons.map((p, i) => <div key={i} style={{ fontSize: 10, color: C.muted, marginBottom: 3, display: "flex", gap: 5 }}><span style={{ color: C.amber }}>⚠</span>{p}</div>)}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selected.length > 0 && (
        <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", marginBottom: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Selected Revenue Strategy</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {selected.map(id => {
              const m = REVENUE_MODELS.find(r => r.id === id);
              return <span key={id} style={{ ...pill(C.purple), fontSize: 11 }}>{m?.icon} {m?.label}</span>;
            })}
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={onBack} style={{ ...btn(C.muted, true) }}>Back</button>
        <button onClick={() => onNext({ revenueModels: selected })} disabled={!canContinue}
          style={{ ...btn(C.purple), opacity: canContinue ? 1 : 0.4, cursor: canContinue ? "pointer" : "not-allowed" }}>
          {canContinue ? `Continue with ${selected.length} model${selected.length > 1 ? "s" : ""}` : "Select at least 1 model"}
        </button>
      </div>
    </div>
  );
}

/* ====================================================
   PROS & CONS TOOLTIP (shared)
   ==================================================== */
function ProsConsTooltip({ item, color }) {
  return (
    <div style={{ background:C.panel, border:`1px solid ${color}33`, borderRadius:8, padding:"12px 14px", marginTop:6, display:"flex", gap:16 }}>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:10, fontWeight:700, color:C.green, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 }}>Pros</div>
        {item.pros.map((p,i) => <div key={i} style={{ fontSize:11, color:C.muted, marginBottom:4, lineHeight:1.45, display:"flex", gap:6 }}><span style={{color:C.green,flexShrink:0}}>+</span>{p}</div>)}
      </div>
      <div style={{ width:1, background:C.border, flexShrink:0 }} />
      <div style={{ flex:1 }}>
        <div style={{ fontSize:10, fontWeight:700, color:C.amber, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 }}>Watch Out</div>
        {(item.cons || []).map((p,i) => <div key={i} style={{ fontSize:11, color:C.muted, marginBottom:4, lineHeight:1.45, display:"flex", gap:6 }}><span style={{color:C.amber,flexShrink:0}}>⚠</span>{p}</div>)}
      </div>
    </div>
  );
}

/* ====================================================
   FUNDING STEP — funding source ONLY (delivery is separate)
   ==================================================== */
function FundingStep({ archetype, onNext, onBack }) {
  const a = ARCHETYPES.find(x => x.id === archetype);
  const [funding, setFunding] = useState(null);
  const [expandedFund, setExpandedFund] = useState(null);

  const getNarrative = () => {
    if (!funding) return null;
    const f = FUNDING_SOURCES.find(x => x.id === funding);
    const msgs = [];
    const fNarr = {
      govt: "Govt funding locks you into scheme compliance KPIs (MPR, utilisation). Budget is stable but disbursed in tranches — keep ops team strong.",
      csr: "CSR funders reward inclusion stories. Women % and placement rate are watched closely. Budget can dry up if optics suffer.",
      worldbank: "World Bank/ADB funding means long project cycles and heavy documentation. Your ops bandwidth will be under pressure.",
      self: "Fee-based self-financing means revenue is directly tied to placement quality. Prioritise industry engagement early.",
      ppp: "PPP blends govt stability with private flexibility. Governance overhead is real — budget extra ops capacity.",
    };
    msgs.push(fNarr[f?.id] || `${f?.label} selected. Budget starts at ₹100 Cr and adjusts each year based on your performance.`);
    return msgs;
  };

  const narrative = getNarrative();

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 20px" }}>
      <StepIndicator current={6} />
      <h2 style={{ fontWeight: 800, fontSize: 26, color: C.text, marginBottom: 4 }}
          title="Choose who funds your institute. Your funding source determines compliance burden, budget stability, and funder expectations.">
        Select Funding Source
      </h2>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 12 }}>Click any card to expand pros and cons. Your funding source shapes budget stability, compliance burden, and stakeholder pressure.</p>

      <div style={{ background:"#0a1628", border:`1px solid ${C.purple}33`, borderLeft:`3px solid ${C.purple}`, borderRadius:8, padding:"10px 14px", marginBottom: narrative ? 12 : 24, fontSize:11, color:C.muted, lineHeight:1.6 }}>
        <span style={{ color:C.purple, fontWeight:700 }}>💰 Budget: </span>
        All players start with ₹100 Cr in Year 1. After each year, your budget adjusts based on: revenue surplus/deficit + KPI performance bonus + event effects — stress tax.
      </div>

      {narrative && narrative.length > 0 && (
        <div style={{ background:"#0c1a0c", border:`1px solid ${C.green}44`, borderLeft:`3px solid ${C.green}`, borderRadius:8, padding:"12px 14px", marginBottom:24, fontSize:11, color:C.muted, lineHeight:1.8 }}>
          <div style={{ color:C.green, fontWeight:700, marginBottom:6, fontSize:12 }}>Strategic Implications</div>
          {narrative.map((msg, i) => (
            <div key={i} style={{ marginBottom: i < narrative.length-1 ? 6 : 0, color: msg.startsWith("⚠") ? C.amber : msg.startsWith("✓") ? C.green : C.muted }}>
              {msg}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", flexDirection:"column", gap:8, marginBottom: 28 }}>
        {FUNDING_SOURCES.map(f => {
          const persona = FUNDER_PERSONAS[f.id];
          const sel = funding === f.id;
          const exp = expandedFund === f.id;
          return (
            <div key={f.id} style={{ background: sel ? `${a.color}12` : C.surface, border: sel ? `2px solid ${a.color}` : `1px solid ${C.border}`, borderRadius:10, overflow:"hidden", transition:"all 0.12s" }}>
              <div style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 16px", cursor:"pointer" }}
                onClick={() => { setFunding(f.id); setExpandedFund(exp ? null : f.id); }}>
                <span style={{ fontSize:22, flexShrink:0 }}>{persona?.icon || f.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:13, color: sel ? C.text : C.muted }}>{f.label}</div>
                  <div style={{ fontSize:11, color:C.faint, marginTop:2 }}>{f.desc}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                  {sel && <span style={{ ...pill(a.color), fontSize:9 }}>✓ Selected</span>}
                  <span style={{ color:C.muted, fontSize:12 }}>{exp ? "▴" : "▾"}</span>
                </div>
              </div>
              {exp && <div style={{ padding:"0 16px 14px" }}><ProsConsTooltip item={f} color={a.color} /></div>}
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={onBack} style={{ ...btn(C.muted, true) }}>Back</button>
        <button onClick={() => onNext({ fundingSource: funding })}
          disabled={!funding}
          style={{ ...btn(a.color), opacity: !funding ? 0.4 : 1 }}>
          Continue to Delivery Model
        </button>
      </div>
    </div>
  );
}

/* ====================================================
   DELIVERY STEP — NEW, separated from Funding
   ==================================================== */
function DeliveryStep({ archetype, sectors, fundingSource, onNext, onBack }) {
  const a = ARCHETYPES.find(x => x.id === archetype);
  const [deliveries, setDeliveries] = useState([]);
  const [expandedDel, setExpandedDel] = useState(null);
  const primary = sectors?.[0];
  const toggleDelivery = (id) => setDeliveries(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);
  const canContinue = deliveries.length >= 1;

  const getNarrative = () => {
    if (deliveries.length === 0) return null;
    const dModes = deliveries.map(id => DELIVERY_MODES.find(d => d.id === id)).filter(Boolean);
    const msgs = [];

    dModes.forEach(d => {
      const dNarr = {
        classroom: "Classroom mode: CapEx-heavy upfront. Suits manufacturing and healthcare. Trainer quality is your biggest lever.",
        handson: "Hands-On: highest capex and trainer cost. Employers trust it most. Budget 30%+ to capex or lab utilisation suffers.",
        online_async: "Online Self-Paced: lowest infra cost but dropout risk is high. Invest in tech and digital marketing to retain learners.",
        online_live: "Online Live: trainer bandwidth is the constraint. Don't over-batch or session quality collapses.",
        hybrid: "Hybrid: strong completion rates but complex to run. Your ops team will carry the coordination burden.",
        mobile: "Mobile/Community: best for last-mile reach. Mobilisation budget is critical — underfund it and reach collapses.",
      };
      if (dNarr[d.id]) msgs.push(dNarr[d.id]);
    });

    if (fundingSource === "self" && deliveries.includes("classroom")) {
      msgs.push("⚠ Self-financed + Classroom is high-risk: CapEx eats into revenue before placements begin. Keep CapEx under 25%.");
    }
    if (fundingSource === "govt" && (deliveries.includes("online_async") || deliveries.includes("online_live"))) {
      msgs.push("⚠ Govt funders often require physical centre proof. Online-only may complicate scheme utilisation compliance.");
    }
    if (deliveries.includes("mobile") && deliveries.includes("handson")) {
      msgs.push("⚠ Mobile + Hands-On is operationally demanding. Your Ops team budget needs to be at least 10% each period.");
    }
    if (primary && dModes.some(d => d.bestFor && d.bestFor.includes(primary))) {
      msgs.push("✓ Your delivery mode is compatible with your primary sector. Expect a 1.08× growth boost on sector KPIs.");
    } else if (dModes.length > 0 && primary) {
      msgs.push("⚠ Your delivery mode is not the best fit for your primary sector. KPI growth will be at 0.92× sector rate.");
    }

    return msgs;
  };

  const narrative = getNarrative();

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 20px" }}>
      <StepIndicator current={7} />
      <h2 style={{ fontWeight: 800, fontSize: 26, color: C.text, marginBottom: 4 }}
          title="Select how you deliver training. Multiple modes increase complexity but broaden reach. Check sector compatibility.">
        Choose Delivery Model
      </h2>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 12 }}>Select one or more delivery modes. Click any card to see pros and cons. Sector-compatible modes get a growth boost.</p>

      {narrative && narrative.length > 0 && (
        <div style={{ background:"#0c1a0c", border:`1px solid ${C.green}44`, borderLeft:`3px solid ${C.green}`, borderRadius:8, padding:"12px 14px", marginBottom:20, fontSize:11, color:C.muted, lineHeight:1.8 }}>
          <div style={{ color:C.green, fontWeight:700, marginBottom:6, fontSize:12 }}>Strategic Implications</div>
          {narrative.map((msg, i) => (
            <div key={i} style={{ marginBottom: i < narrative.length-1 ? 6 : 0, color: msg.startsWith("⚠") ? C.amber : msg.startsWith("✓") ? C.green : C.muted }}>
              {msg}
            </div>
          ))}
        </div>
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom: 28 }}>
        {DELIVERY_MODES.map(d => {
          const compatible = d.bestFor && d.bestFor.includes(primary);
          const sel = deliveries.includes(d.id);
          const exp = expandedDel === d.id;
          return (
            <div key={d.id} style={{ background: sel ? `${a.color}12` : C.surface, border: sel ? `2px solid ${a.color}` : `1px solid ${C.border}`, borderRadius:10, overflow:"hidden", transition:"all 0.12s" }}>
              <div style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 16px", cursor:"pointer" }}
                onClick={() => { toggleDelivery(d.id); setExpandedDel(exp ? null : d.id); }}>
                <span style={{ fontSize:20, flexShrink:0 }}>{d.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:13, color: sel ? C.text : C.muted }}>{d.label}</div>
                  <div style={{ fontSize:11, color:C.faint, marginTop:2 }}>CapEx multiplier: {d.capexMult}×</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                  <span style={{ ...pill(compatible ? C.green : C.amber), fontSize:9 }}>{compatible ? "✓ Sector Match" : "⚠ Partial"}</span>
                  <div style={{ width:18, height:18, borderRadius:4, border:`2px solid ${sel ? a.color : C.border}`, background: sel ? a.color : "transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    {sel && <span style={{ color:"#fff", fontSize:12, fontWeight:800 }}>✓</span>}
                  </div>
                  <span style={{ color:C.muted, fontSize:12 }}>{exp ? "▴" : "▾"}</span>
                </div>
              </div>
              {exp && <div style={{ padding:"0 16px 14px" }}><ProsConsTooltip item={d} color={a.color} /></div>}
            </div>
          );
        })}
      </div>

      {deliveries.length > 1 && (
        <div style={{ background:"#0a1628", border:`1px solid ${C.amber}33`, borderLeft:`3px solid ${C.amber}`, borderRadius:8, padding:"8px 12px", fontSize:11, color:C.muted, marginBottom:20 }}>
          <span style={{ color:C.amber, fontWeight:700 }}>⚠ Multi-mode: </span>
          Operating {deliveries.length} delivery modes increases complexity. Ensure your Ops Team budget is sufficient to manage coordination.
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={onBack} style={{ ...btn(C.muted, true) }}>Back</button>
        <button onClick={() => onNext({ deliveryMode: deliveries[0], deliveryModes: deliveries })}
          disabled={!canContinue}
          style={{ ...btn(a.color), opacity: !canContinue ? 0.4 : 1 }}>
          {canContinue ? `Continue with ${deliveries.length} mode${deliveries.length > 1 ? "s" : ""}` : "Select at least 1 mode"}
        </button>
      </div>
    </div>
  );
}

/* ====================================================
   BLUEPRINT STEP — shows ALL delivery modes
   ==================================================== */
function BlueprintStep({ gameState, onConfirm, onBack }) {
  const a = ARCHETYPES.find(x => x.id === gameState.archetype);
  const endGoal = a.endGoals.find(g => g.id === gameState.endGoal);
  const funder = FUNDING_SOURCES.find(f => f.id === gameState.fundingSource);
  const allDeliveryModes = gameState.deliveryModes || (gameState.deliveryMode ? [gameState.deliveryMode] : []);
  const deliveryLabels = allDeliveryModes.map(id => DELIVERY_MODES.find(d => d.id === id)?.label).filter(Boolean).join(", ");
  const sectorLabels = (gameState.sectors || []).map(s => SECTORS.find(x => x.id === s)?.label).join(", ");
  const funderPersona = FUNDER_PERSONAS[gameState.fundingSource];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
      <StepIndicator current={8} />
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h2 style={{ fontWeight: 800, fontSize: 28, color: C.text, marginBottom: 8 }}>Your Institute Blueprint</h2>
        <p style={{ color: C.muted, fontSize: 13 }}>Review your strategic configuration before the simulation begins.</p>
      </div>

      {/* Vision banner */}
      <div style={{
        background: `linear-gradient(135deg, ${a.color}22, ${a.color}08)`,
        border: `1px solid ${a.color}44`,
        borderRadius: 14, padding: "24px 28px", marginBottom: 24,
        display: "flex", alignItems: "center", gap: 20,
      }}>
        <span style={{ fontSize: 48, lineHeight: 1 }}>{a.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: a.color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Your Archetype</div>
          <div style={{ fontWeight: 800, fontSize: 20, color: C.text, marginBottom: 4 }}>{a.label}</div>
          <div style={{ fontSize: 13, color: C.muted }}>{endGoal?.label}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: C.mono, fontSize: 26, fontWeight: 800, color: C.text }}>₹{gameState.budget || 100} Cr</div>
          <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>Starting Budget</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Sectors", value: sectorLabels, icon: "🏭" },
          { label: "Delivery Model", value: deliveryLabels || "—", icon: "📡", subtitle: allDeliveryModes.length > 1 ? `${allDeliveryModes.length} modes selected` : null },
          { label: "Funder", value: funder?.label, icon: funderPersona?.icon || "💰" },
          { label: "Focus Multiplier", value: gameState.sectors?.length === 1 ? "1.0× (full focus)" : gameState.sectors?.length === 2 ? "0.85×" : "0.70×", icon: "🎯" },
        ].map(({ label, value, icon, subtitle }) => (
          <div key={label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 18px" }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
            <div style={{ fontSize: 9, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{label}</div>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{value}</div>
            {subtitle && <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{subtitle}</div>}
          </div>
        ))}
      </div>

      {/* Revenue models */}
      {gameState.revenueModels && gameState.revenueModels.length > 0 && (
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 20px", marginBottom: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Revenue Strategy ({gameState.revenueModels.length} Models)</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {gameState.revenueModels.map(id => {
              const m = REVENUE_MODELS.find(r => r.id === id);
              return m ? (
                <div key={id} style={{ background: `${C.purple}18`, border: `1px solid ${C.purple}33`, borderRadius: 8, padding: "8px 12px" }}>
                  <div style={{ fontSize: 16, marginBottom: 3 }}>{m.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 11, color: C.text }}>{m.label}</div>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* KPI grid */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 22px", marginBottom: 28 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>
          {gameState.selectedKPIs?.length} KPIs Tracked
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {gameState.selectedKPIs?.map(id => {
            const def = gameState.kpiPool?.find(k => k.id === id);
            return def ? (
              <span key={id} style={{ ...pill(a.color), fontSize: 10, padding: "4px 10px" }}>{def.label}</span>
            ) : null;
          })}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={onBack} style={{ ...btn(C.muted, true) }}>Back</button>
        <button onClick={onConfirm} style={{
          background: `linear-gradient(135deg, ${a.color}, ${a.color}cc)`,
          color: "#fff", border: "none", borderRadius: 10, padding: "15px 60px",
          fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: C.font,
          boxShadow: `0 4px 20px ${a.color}55`,
        }}>
          Launch Simulation
        </button>
      </div>
    </div>
  );
}

/* ====================================================
   EXPORTS — includes DeliveryStep
   ==================================================== */
export { Welcome, AudienceStep, ArchetypeStep, KPIStep, SectorStep, RevenueStep, FundingStep, DeliveryStep, BlueprintStep, ProsConsTooltip };