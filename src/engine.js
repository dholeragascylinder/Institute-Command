import { ARCHETYPES, SECTORS, DELIVERY_MODES, FUNDING_SOURCES, PARAMS, REVENUE_MODELS, YEAR_EVENTS, computeLagPenalty, EXTRA_KPI_DELTAS } from './constants';

function simulateYear({kpis,params,archetype,sectors,fundingSource,deliveryMode,deliveryModes,year,stress,currentBudget,initialKpis,endGoalTargets,prevParams,revenueModels}){
  const arch=ARCHETYPES.find(a=>a.id===archetype);

  // FIX 6: Randomise event from year pool
  const yearPool=YEAR_EVENTS.filter(e=>e.year===year);
  const event=yearPool.length>0
    ? yearPool[Math.floor(Math.random()*yearPool.length)]
    : YEAR_EVENTS[0];

  const delivery=DELIVERY_MODES.find(d=>d.id===deliveryMode);
  const total=Object.values(params).reduce((s,v)=>s+v,0)||100;
  const np={};Object.keys(params).forEach(k=>{np[k]=params[k]/total;});

  // FIX 3: Multi-factor stress calculation
  let newStress=stress;
  if(np.trainer_hire<0.06)  newStress+=2;
  if(np.capex>0.35)         newStress+=1.5;
  if(np.ops_team<0.05)      newStress+=1;
  if(np.trainer_dev>0.12)   newStress=Math.max(0,newStress-1);
  if(np.trainer_hire>0.15)  newStress=Math.max(0,newStress-1.5);
  newStress=Math.max(0,Math.min(10,newStress));
  const stressPenalty=newStress>7?0.78:newStress>4?0.91:1.0;

  // FIX 10: focusMult applies to growth only
  const focusMult=sectors.length===1?1.0:sectors.length===2?0.85:0.70;

  // FIX 4: Average sector multipliers (not stacked)
  const sectorSalary=sectors.reduce((sum,sid)=>{
    const s=SECTORS.find(x=>x.id===sid); return sum+(s?.salaryMult||1);
  },0)/sectors.length;
  const sectorPlacement=sectors.reduce((sum,sid)=>{
    const s=SECTORS.find(x=>x.id===sid); return sum+(s?.placementMult||1);
  },0)/sectors.length;

  const primary=sectors[0];
  const evtSector=event.sectorMod[primary]||1.0;
  const evtGlobal=event.mod;

  // FIX 9: Per-KPI delivery multiplier - KPIs mismatched with delivery mode barely move
  const allModes = deliveryModes || (deliveryMode ? [deliveryMode] : []);
  // Single global delivMult still used for non-tagged KPIs (sector compatibility)
  const compatible=delivery?.bestFor.includes(primary);
  const delivMult=compatible?1.08:0.92;

  // FIX 5: capexROIPenalty floor at 0.6
  const capexOver=Math.max(0,np.capex-0.30);
  const capexROIPenalty=Math.max(0.6,1-capexOver*1.2);

  // Budget factor composites: normalised spend  archetype weight
  const fI=np.industry_eng *arch.paramWeights.industry_eng;
  const fF=(np.trainer_hire*arch.paramWeights.trainer_hire)+(np.trainer_dev*arch.paramWeights.trainer_dev);
  const fT=np.tech         *arch.paramWeights.tech;
  const fO=(np.mobilization*arch.paramWeights.mobilization)+(np.digital_mkt*arch.paramWeights.digital_mkt);
  const fS=np.subsidy      *arch.paramWeights.subsidy;
  const fOP=np.ops_team    *arch.paramWeights.ops_team;
  const fC=np.capex        *arch.paramWeights.capex;
  const fM=np.digital_mkt  *arch.paramWeights.digital_mkt;

  // Raw growth per KPI - budget allocation impact only (sector/event/stress applied below)
  const rawGrowth={
    // Employment
    placement_rate:(fI*14+fF*8+fO*5)*sectorPlacement,
    retention_12:(fF*11+fS*7+fOP*5),
    retention_24:(fF*9+fI*6)*evtGlobal,
    soqs:(fF*11+fI*9+fT*4)*sectorSalary,
    employer_repeat:(fI*15+fF*6),
    employer_sat:(fF*10+fOP*6+fC*4),
    job_dropoff:-(fF*7+fS*6),
    role_alignment:(fF*13+fI*10),
    alumni_tracking:(fT*11+fOP*8),
    job_satisfaction:(fF*9+fS*6+fC*4),
    income_growth_12:(fF*5+fI*5)*sectorSalary,
    active_employers:(fI*12+fO*4),
    avg_salary:(fF*0.4+fI*0.5)*sectorSalary*evtSector,
    // Inclusion
    total_learners:(fO*600+fS*450+fC*250),
    women_pct:(fO*7+fS*6),
    rural_pct:(fO*9+fS*7),
    firstgen_pct:(fO*8+fS*5),
    marginalized_pct:(fO*7+fS*8),
    scholarship_pct:(fS*14),
    completion_rate:(fF*9+fS*7+fT*5),
    dropout_rate:-(fS*7+fF*6),
    student_sat:(fF*9+fS*5+fC*4),
    marginalized_placement:(fI*9+fO*6),
    women_income_uplift:(fF*4+fI*5)*sectorSalary,
    local_lang_pct:(fO*11+fS*5),
    // Financial
    annual_revenue:(fO*3.5+fT*2.5+fI*2.5)*capexROIPenalty,
    ebitda_margin:(fOP*7+fT*5-np.capex*6)*capexROIPenalty,
    cost_per_student:-(fOP*1800+fT*1200),
    fee_recovery:(fO*9+fOP*7),
    rev_per_learner:(fI*600+fT*500)*sectorSalary,
    learner_per_trainer:(fT*3+fOP*2),
    centre_utilisation:(fO*9+fC*4)*capexROIPenalty,
    lac:-(fO*250+fM*200),
    blended_ratio:(fT*12),
    new_revenue_streams:(fI*0.5+fT*0.5),
    breakeven_progress:(fOP*9+fT*6-np.capex*7)*capexROIPenalty,
    roi:(fOP*5+fT*4-np.capex*6)*capexROIPenalty,
    recurring_rev_ratio:(fI*5+fT*3),
    // Innovation
    online_learner_pct:(fT*13+fO*5),
    digital_completion:(fT*11+fF*7),
    microcred_pct:(fT*9+fOP*4),
    launch_time:-(fT*9+fOP*7+fF*4),
    curriculum_refresh:(fF*7+fI*5+fT*5),
    learner_sat:(fF*8+fT*7+fS*4),
    return_upskill_pct:(fI*5+fT*5+fF*4),
    flexibility_rating:(fT*11+fOP*5),
    online_dropoff:-(fT*7+fS*5+fF*6),
    codesign_pct:(fI*13+fF*5),
    role_versatility:(fI*9+fF*7+fT*4),
    new_pilots:(fT*0.7+fI*0.6+fF*0.5),
    // Premium
    alumni_nps:(fF*9+fS*6+fC*4),
    employer_nps:(fI*11+fF*7),
    tier1_placement:(fI*7+fF*6),
    offer_app_ratio:(fI*0.45+fF*0.35),
    industry_exp_faculty:(fF*11+fI*7),
    tier1_partners:(fI*0.9+fO*0.3),
    curriculum_endorsement:(fI*9+fF*7),
    alumni_recognition:(fF*5+fI*4+fS*3),
    media_mentions:(fM*16+fI*8),
    intl_collab:(fI*0.6+fO*0.2),
    campus_exp:(fC*15+fOP*6)*capexROIPenalty,
    employer_recall:(fM*13+fI*9),
    repeat_applicants:(fO*7+fS*4+fOP*5),
  };

  // Extra contextual KPI growth
  Object.keys(kpis).forEach(k=>{
    if(rawGrowth[k]===undefined&&EXTRA_KPI_DELTAS[k])
      rawGrowth[k]=EXTRA_KPI_DELTAS[k](fF,fI,fT,fO,fS,fOP,fC);
  });

  // Funder bonus
  const funder=FUNDING_SOURCES.find(f=>f.id===fundingSource);
  if(funder) Object.entries(funder.kpiBonus).forEach(([k,v])=>{
    if(rawGrowth[k]!==undefined) rawGrowth[k]=(rawGrowth[k]||0)+v*0.3;
  });

  // LAG PENALTY: sudden large reallocation creates implementation friction
  const lag=computeLagPenalty(prevParams,params);
  const lagMult=lag.penalty;

  // FIX 8/9/10: new_kpi = prev_kpi + growth*focusMult*stressPenalty*kpiDelivMult*evtGlobal*lagMult
  // kpiDelivMult is per-KPI: 1.15 if mode matches tag, 0.55 if mismatched, 1.0 if untagged
  const SCALE=0.09;
  const newKpis={...kpis};
  Object.keys(newKpis).forEach(k=>{
    const kpiDelivMult = getKpiDeliveryMult(k, allModes);
    const g=(rawGrowth[k]||0)*focusMult*stressPenalty*kpiDelivMult*delivMult*evtGlobal*lagMult*SCALE;
    newKpis[k]=kpis[k]+g;
    newKpis[k]=Math.round(newKpis[k]*10)/10;
  });

  // FIX 11: KPI decay when key params are starved
  if(np.industry_eng<0.04){
    if(newKpis.placement_rate!=null)  newKpis.placement_rate  =Math.max(0,newKpis.placement_rate-1.5);
    if(newKpis.employer_repeat!=null) newKpis.employer_repeat =Math.max(0,newKpis.employer_repeat-1);
    if(newKpis.employer_nps!=null)    newKpis.employer_nps    =Math.max(0,newKpis.employer_nps-1);
  }
  if(np.trainer_hire<0.05){
    if(newKpis.completion_rate!=null) newKpis.completion_rate =Math.max(0,newKpis.completion_rate-2);
    if(newKpis.retention_12!=null)    newKpis.retention_12    =Math.max(0,newKpis.retention_12-1.5);
    if(newKpis.soqs!=null)            newKpis.soqs            =Math.max(0,newKpis.soqs-1);
  }
  if(np.mobilization<0.03&&np.digital_mkt<0.03){
    if(newKpis.total_learners!=null)  newKpis.total_learners  =Math.max(0,newKpis.total_learners-20);
    if(newKpis.rural_pct!=null)       newKpis.rural_pct       =Math.max(0,newKpis.rural_pct-1);
  }

  // FIX 2: Hard caps per KPI type
  const UNCAPPED=new Set(["cost_per_student","lac","total_learners","annual_revenue","rev_per_learner","active_employers","tier1_partners","new_revenue_streams","new_pilots","intl_collab","media_mentions","impact_reports"]);
  const WIDE=new Set(["ebitda_margin","roi"]);
  Object.keys(newKpis).forEach(k=>{
    if(UNCAPPED.has(k))        newKpis[k]=Math.max(0,newKpis[k]);
    else if(WIDE.has(k))       newKpis[k]=Math.max(-30,Math.min(60,newKpis[k]));
    else                       newKpis[k]=Math.max(0,Math.min(100,newKpis[k]));
    newKpis[k]=Math.round(newKpis[k]*10)/10;
  });

  // PERFORMANCE INDEX: % of 5-year target gap closed per period
  let totalScore=0,count=0;
  Object.keys(kpis).forEach(k=>{
    const def=arch.kpiPool.find(kp=>kp.id===k)||ARCHETYPES.flatMap(x=>x.kpiPool).find(kp=>kp.id===k);
    const inv=def?.inverse;
    const before=kpis[k],after=newKpis[k];
    const start=initialKpis?.[k]??def?.base??before;
    const rawTarget=endGoalTargets?.[k];
    const target=rawTarget!=null?rawTarget:(inv?Math.max(0,start*0.6):start*1.4);
    const improvement=inv?(before-after):(after-before);
    const totalGap=Math.abs(inv?(start-target):(target-start));
    const expectedPerPeriod=Math.max(totalGap/5,Math.abs(def?.base??50)*0.04,0.5);
    const periodScore=Math.max(0,Math.min(100,(improvement/expectedPerPeriod)*100));
    totalScore+=periodScore; count++;
  });
  const yearScore=count>0?Math.round(totalScore/count):0;

  //  FINANCIAL FEEDBACK LOOP (Revenue Model Edition)
  // Revenue = Base placement fee + per-model bonuses
  const mobilPct  = (params.mobilization || 0) / 100;
  const subsidyPct = (params.subsidy || 0) / 100;
  const capexPct  = (params.capex || 0) / 100;
  const baseStudents = 400;
  const studentsThisPeriod = Math.round(
    baseStudents * (1 + mobilPct * 3.0 + subsidyPct * 1.5 + capexPct * 0.8)
  );
  const avgSalaryLPA = Math.max(2, newKpis.avg_salary ?? newKpis.soqs ?? 3.0);
  const placementRate = Math.max(0, Math.min(1, (newKpis.placement_rate ?? 35) / 100));
  const revenuePerPlacedStudent = avgSalaryLPA * 0.08;
  const studentsPlaced = Math.round(studentsThisPeriod * placementRate);

  // Rarity bonus: rare sectors get 1.1x multiplier on brand_recall and employer_nps
  const primarySectorData = SECTORS.find(s => s.id === sectors[0]);
  const rarityBonus = primarySectorData?.rarityBonus || 1.0;
  if (primarySectorData?.rarity === "High") {
    if (newKpis.employer_recall != null) newKpis.employer_recall = Math.round(newKpis.employer_recall * 1.10 * 10) / 10;
    if (newKpis.employer_nps != null) newKpis.employer_nps = Math.round(newKpis.employer_nps * rarityBonus * 10) / 10;
  }

  // Base placement/training revenue
  const baseRevenueCr = Math.round((studentsPlaced * revenuePerPlacedStudent / 100) * 10) / 10;

  // Per-model revenue contributions
  const selectedModels = (revenueModels || ["training_delivery"]).map(id => REVENUE_MODELS.find(r => r.id === id)).filter(Boolean);
  const revenueBreakdown = {};
  let totalModelBonus = 0;
  selectedModels.forEach(model => {
    let modelRev = 0;
    if (model.id === "training_delivery") modelRev = baseRevenueCr;
    else if (model.id === "curriculum_licensing") modelRev = Math.round((fT * 2.5 + fF * 1.5) * 0.8 * 10) / 10;
    else if (model.id === "contract_training") modelRev = Math.round((fI * 3.0 + fF * 1.5) * 0.9 * 10) / 10;
    else if (model.id === "placement_commission") modelRev = Math.round(studentsPlaced * 0.005 * 10) / 10;
    else if (model.id === "contract_manufacturing") modelRev = Math.round((fC * 2.0 + fOP * 1.2) * 0.7 * 10) / 10;
    else if (model.id === "consulting_advisory") modelRev = Math.round((fI * 1.5 + fOP * 1.0) * year * 0.15 * 10) / 10;
    else if (model.id === "certification_services") modelRev = Math.round((fOP * 1.8 + fT * 1.2) * 0.6 * 10) / 10;
    else if (model.id === "grants_sponsored") modelRev = Math.round((fO * 1.0 + fOP * 0.8) * 0.5 * 10) / 10;
    revenueBreakdown[model.label] = modelRev;
    if (model.id !== "training_delivery") totalModelBonus += modelRev;
    // Apply KPI boosts from selected models
    Object.entries(model.kpiBoost || {}).forEach(([k, v]) => {
      if (newKpis[k] != null) newKpis[k] = Math.round((newKpis[k] + v * 0.4) * 10) / 10;
    });
  });
  const grossRevenueCr = Math.round((baseRevenueCr + totalModelBonus) * 10) / 10;
  const opCostCr = currentBudget ?? 100;
  const plCr = Math.round((grossRevenueCr - opCostCr) * 10) / 10;

  const budgetStressPenalty = Math.max(0, (newStress - 50) * 0.25);
  const kpiPerformanceBoost = (yearScore - 50) * 0.4;
  const plBudgetEffect = plCr * 0.35;
  const eventEffect = evtGlobal * 6;
  const rawNext = 100 + plBudgetEffect + kpiPerformanceBoost + eventEffect - budgetStressPenalty;
  const nextBudget = Math.max(60, Math.min(200, Math.round(rawNext)));
  const financials = {
    studentsThisPeriod, studentsPlaced, avgSalaryLPA,
    placementRate, grossRevenueCr, opCostCr, plCr,
    revenuePerPlacedStudent, revenueBreakdown,
  };

  // FIX 12: Win condition at year 5
  let winResult=null;
  if(year===5&&endGoalTargets){
    const hits=Object.entries(endGoalTargets).filter(([k,target])=>{
      const def=ARCHETYPES.flatMap(x=>x.kpiPool).find(kp=>kp.id===k);
      return newKpis[k]!=null&&(def?.inverse?newKpis[k]<=target:newKpis[k]>=target);
    });
    winResult={met:hits.length,total:Object.keys(endGoalTargets).length,success:hits.length===Object.keys(endGoalTargets).length};
  }

  // Narratives
  const narratives={};
  Object.keys(kpis).forEach(k=>{
    const before=kpis[k],after=newKpis[k];
    const inv=arch.kpiPool.find(kp=>kp.id===k)?.inverse||false;
    const good=inv?after<before:after>before;
    const msgs={
      placement_rate:good?"Industry engagement paying off - employers showing up.":"Weak employer ties - placement budget underperforming.",
      retention_12:good?"Post-placement support keeping learners in jobs longer.":"Early exits rising - trainer quality or stipends too low.",
      soqs:good?"Salary distribution healthy across bands.":"Salary quality uneven - too many low-end outliers.",
      employer_repeat:good?"Employers returning for repeat hiring. Trust compounding.":"Repeat rate flat - deepen employer relationships.",
      ebitda_margin:good?"Operational efficiency improving - margin trending right.":"Margins under pressure. Review CapEx and ops overhead.",
      completion_rate:good?"Faculty investment keeping learners engaged.":"Completion slipping - learner support needs review.",
      dropout_rate:good?"Dropout reducing - field support and subsidies are working.":"Dropout rising. Mobilisation alone won't fix this.",
      online_dropoff:good?"Digital engagement holding - strong platform quality.":"High digital dropout - learners disengaging online.",
      annual_revenue:good?"Revenue streams gaining traction.":"Revenue below target - rethink outreach and partnerships.",
    };
    narratives[k]=msgs[k]||(good?"Investment paying off - keep the momentum.":"Underinvested this period - consider rebalancing.");
  });

  return {newKpis,newStress,yearScore,nextBudget,event,narratives,winResult,lagWarning:lag.triggered?lag.msg:null,financials};
}


// =======================================================
//  LIVE IMPACT ENGINE
// =======================================================
function computeImpact({params,archetype,selectedKPIs,kpiPool,kpis}){
  const arch=ARCHETYPES.find(a=>a.id===archetype);
  if(!arch) return {};
  const total=Object.values(params).reduce((s,v)=>s+v,0)||100;
  const np={};Object.keys(params).forEach(k=>{np[k]=params[k]/total;});
  const fI=np.industry_eng*arch.paramWeights.industry_eng;
  const fF=(np.trainer_hire*arch.paramWeights.trainer_hire)+(np.trainer_dev*arch.paramWeights.trainer_dev);
  const fT=np.tech*arch.paramWeights.tech;
  const fO=(np.mobilization*arch.paramWeights.mobilization)+(np.digital_mkt*arch.paramWeights.digital_mkt);
  const fS=np.subsidy*arch.paramWeights.subsidy;
  const fOP=np.ops_team*arch.paramWeights.ops_team;
  const fC=np.capex*arch.paramWeights.capex;
  const fM=np.digital_mkt*arch.paramWeights.digital_mkt;
  const raw={
    placement_rate:fI*14+fF*8+fO*5, retention_12:fF*11+fS*7+fOP*5,
    retention_24:fF*9+fI*6, soqs:fF*11+fI*9+fT*4,
    employer_repeat:fI*15+fF*6, employer_sat:fF*10+fOP*6+fC*4,
    job_dropoff:fF*7+fS*6, role_alignment:fF*13+fI*10,
    alumni_tracking:fT*11+fOP*8, job_satisfaction:fF*9+fS*6+fC*4,
    income_growth_12:fF*5+fI*5, active_employers:fI*12+fO*4,
    avg_salary:(fF*0.35+fI*0.45)*20,
    total_learners:(fO*600+fS*450+fC*250)/50,
    women_pct:fO*7+fS*6, rural_pct:fO*9+fS*7, firstgen_pct:fO*8+fS*5,
    marginalized_pct:fO*7+fS*8, scholarship_pct:fS*14,
    completion_rate:fF*9+fS*7+fT*5, dropout_rate:fS*7+fF*6,
    student_sat:fF*9+fS*5+fC*4, marginalized_placement:fI*9+fO*6,
    women_income_uplift:fF*4+fI*5, local_lang_pct:fO*11+fS*5,
    annual_revenue:(fO*3.5+fT*2.5+fI*2.5)*5, ebitda_margin:fOP*7+fT*5,
    fee_recovery:fO*9+fOP*7, rev_per_learner:(fI*600+fT*500)/100,
    centre_utilisation:fO*9+fC*4, breakeven_progress:fOP*9+fT*6,
    roi:fOP*5+fT*4, online_learner_pct:fT*13+fO*5,
    digital_completion:fT*11+fF*7, microcred_pct:fT*9+fOP*4,
    launch_time:fT*9+fOP*7+fF*4, curriculum_refresh:fF*7+fI*5+fT*5,
    learner_sat:fF*8+fT*7+fS*4, return_upskill_pct:fI*5+fT*5+fF*4,
    flexibility_rating:fT*11+fOP*5, online_dropoff:fT*7+fS*5+fF*6,
    codesign_pct:fI*13+fF*5, role_versatility:fI*9+fF*7+fT*4,
    new_pilots:(fT*0.7+fI*0.6+fF*0.5)*5,
    alumni_nps:fF*9+fS*6+fC*4, employer_nps:fI*11+fF*7,
    tier1_placement:fI*7+fF*6, industry_exp_faculty:fF*11+fI*7,
    curriculum_endorsement:fI*9+fF*7, alumni_recognition:fF*5+fI*4+fS*3,
    media_mentions:(fM*16+fI*8)*2, campus_exp:fC*15+fOP*6,
    employer_recall:fM*13+fI*9, repeat_applicants:fO*7+fS*4+fOP*5,
  };
  // extra contextual KPIs
  selectedKPIs.forEach(id=>{
    if(raw[id]===undefined && EXTRA_KPI_DELTAS[id]) raw[id]=EXTRA_KPI_DELTAS[id](fF,fI,fT,fO,fS,fOP,fC);
  });
  const maxRaw=Math.max(...selectedKPIs.map(id=>raw[id]||0),0.01);
  const result={};
  selectedKPIs.forEach(id=>{
    const def=kpiPool.find(k=>k.id===id);
    const r=raw[id]||0;
    const delta=r*0.08;
    result[id]={ pct:Math.min(100,(r/maxRaw)*100), delta:def?.inverse?-delta:delta };
  });
  return result;
}

// =======================================================
//  SCREENS
// =======================================================


// =======================================================
//  DESIGN TOKENS - Dark command-center aesthetic
// =======================================================

const KPI_DELIVERY_TAGS = {
  // Online-specific
  online_learner_pct:   ["online_async","online_live","hybrid"],
  digital_completion:   ["online_async","online_live","hybrid"],
  online_dropoff:       ["online_async","online_live"],
  blended_ratio:        ["hybrid","online_live","online_async"],
  flexibility_rating:   ["online_async","online_live","hybrid"],
  return_upskill_pct:   ["online_async","online_live","hybrid"],
  // Classroom/hands-on specific
  centre_utilisation:   ["classroom","handson"],
  learner_per_trainer:  ["classroom","handson","hybrid"],
  campus_exp:           ["classroom","handson"],
  industry_exp_faculty: ["classroom","handson"],
  // Mobile/community specific
  rural_pct:            ["mobile","hybrid"],
  local_lang_pct:       ["mobile","hybrid"],
  // Hands-on specific
  role_alignment:       ["handson","classroom"],
  employer_sat:         ["handson","classroom","hybrid"],
  employer_repeat:      ["handson","classroom"],
};

// Per-KPI delivery penalty: if KPI is tagged for specific modes and your mode doesn't match -> penalty
// If KPI has no delivery tag -> neutral (1.0)
// If KPI matches your delivery mode -> bonus (1.15)
// If KPI is tagged for OTHER modes but NOT yours -> penalty (0.55) - barely moves
const getKpiDeliveryMult = (kpiId, deliveryModes) => {
  const tags = KPI_DELIVERY_TAGS[kpiId];
  if (!tags || tags.length === 0) return 1.0; // untagged = neutral
  const modes = deliveryModes || [];
  if (modes.length === 0) return 1.0;
  const isMatch = tags.some(t => modes.includes(t));
  return isMatch ? 1.15 : 0.55; // strong boost if aligned, heavy penalty if mismatched
};

const KPI_AUDIENCE_TAGS = {
  // Women & Marginalized
  women_pct:            ["women"],
  women_income_uplift:  ["women"],
  marginalized_pct:     ["women","rural"],
  marginalized_placement:["women","rural"],
  scholarship_pct:      ["women","rural","dropout"],
  // Rural & Last-Mile
  rural_pct:            ["rural","dropout"],
  local_lang_pct:       ["rural","dropout"],
  firstgen_pct:         ["rural","dropout"],
  // School Dropouts & Youth
  dropout_rate:         ["dropout"],
  completion_rate:      ["dropout","rural"],
  // Working Professionals
  return_upskill_pct:   ["professional"],
  flexibility_rating:   ["professional"],
  online_learner_pct:   ["professional"],
  blended_ratio:        ["professional"],
  // College Graduates
  tier1_placement:      ["graduate"],
  avg_salary:           ["graduate","professional"],
  offer_app_ratio:      ["graduate"],
  // Ex-Servicemen
  role_alignment:       ["exservicemen"],
  employer_repeat:      ["exservicemen"],
};

export { simulateYear, computeImpact, KPI_DELIVERY_TAGS, getKpiDeliveryMult, KPI_AUDIENCE_TAGS };
