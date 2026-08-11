const ARCHETYPES = [
  { id:"employment", label:"Sustainable Employment", icon:"🎯", color:"#059669",
    desc:"Build careers that last - retention, salary quality & employer trust over 24 months.",
    pros:["Employer repeat hiring","Outcome-based funding eligibility","Long-term impact credibility"],
    cons:["Needs 24-month tracking infra","Vulnerable to market downturns","Heavy employer dependency"],
    kpiPool:[
      {id:"placement_rate",label:"Placement Rate (%)",base:40,unit:"%"},
      {id:"retention_12",label:"12-Month Retention (%)",base:50,unit:"%"},
      {id:"retention_24",label:"24-Month Retention (%)",base:40,unit:"%"},
      {id:"soqs",label:"Salary Quality Score",base:50,unit:"pts"},
      {id:"employer_repeat",label:"Employer Repeat Hiring (%)",base:30,unit:"%"},
      {id:"employer_sat",label:"Employer Satisfaction",base:55,unit:"pts"},
      {id:"job_dropoff",label:"Job Drop-off <6M (%)",base:30,unit:"%",inverse:true},
      {id:"role_alignment",label:"Role-Training Alignment (%)",base:45,unit:"%"},
      {id:"alumni_tracking",label:"Alumni Tracking Coverage (%)",base:20,unit:"%"},
      {id:"job_satisfaction",label:"Learner Job Satisfaction",base:55,unit:"pts"},
      {id:"income_growth_12",label:"Income Growth @ 12M (%)",base:8,unit:"%"},
      {id:"active_employers",label:"Active Hiring Partners",base:5,unit:""},
      {id:"avg_salary",label:"Avg Starting Salary (LPA)",base:3.5,unit:"L"},
    ],
    endGoals:[
      {id:"mass_placement",label:"Mass Placement at Scale",desc:"80%+ placement with diverse employer base",kpiTargets:{placement_rate:80,retention_12:70,active_employers:50}},
      {id:"salary_excellence",label:"Premium Salary Outcomes",desc:"Avg 10 LPA with strong 24-month retention",kpiTargets:{avg_salary:10,retention_24:70,soqs:80}},
      {id:"employer_trust",label:"Employer Trust Network",desc:"60%+ repeat hiring, 80+ employer satisfaction",kpiTargets:{employer_repeat:60,employer_sat:80,role_alignment:75}},
    ],
    paramWeights:{capex:0.5,trainer_hire:1.0,trainer_dev:0.9,tech:0.4,mobilization:0.7,digital_mkt:0.5,industry_eng:1.2,ops_team:0.6,admin:0.3,subsidy:0.5},
  },
  { id:"inclusion", label:"Access & Inclusion", icon:"🌍", color:"#d97706",
    desc:"Democratize skilling - reach the last mile, rural youth, women & marginalized communities.",
    pros:["CSR & govt funding alignment","High social ROI","Community trust building"],
    cons:["Lower salary outcomes possible","High cost-per-student","Employer hesitancy in rural"],
    kpiPool:[
      {id:"total_learners",label:"Total Learners / Year",base:500,unit:""},
      {id:"women_pct",label:"Women Participation (%)",base:30,unit:"%"},
      {id:"rural_pct",label:"Rural Learners (%)",base:20,unit:"%"},
      {id:"firstgen_pct",label:"First-Gen Learners (%)",base:25,unit:"%"},
      {id:"marginalized_pct",label:"Marginalized Communities (%)",base:20,unit:"%"},
      {id:"scholarship_pct",label:"Students on Scholarship (%)",base:15,unit:"%"},
      {id:"completion_rate",label:"Course Completion (%)",base:55,unit:"%"},
      {id:"dropout_rate",label:"Dropout Rate (%)",base:25,unit:"%",inverse:true},
      {id:"student_sat",label:"Student Satisfaction",base:60,unit:"pts"},
      {id:"placement_rate",label:"Placement Rate (%)",base:35,unit:"%"},
      {id:"marginalized_placement",label:"Marginalized Placement (%)",base:25,unit:"%"},
      {id:"women_income_uplift",label:"Women Income Uplift (%)",base:10,unit:"%"},
      {id:"local_lang_pct",label:"Courses in Local Language (%)",base:20,unit:"%"},
    ],
    endGoals:[
      {id:"rural_reach",label:"Deep Rural Penetration",desc:"50%+ rural learners, 3 states covered",kpiTargets:{rural_pct:50,total_learners:5000,local_lang_pct:60}},
      {id:"gender_equity",label:"Gender Equity Leader",desc:"55%+ women participation with income uplift",kpiTargets:{women_pct:55,women_income_uplift:25,completion_rate:75}},
      {id:"mass_inclusion",label:"Mass Inclusion at Scale",desc:"40%+ marginalized, 80%+ completion rate",kpiTargets:{marginalized_pct:40,completion_rate:80,dropout_rate:10}},
    ],
    paramWeights:{capex:0.3,trainer_hire:0.8,trainer_dev:0.7,tech:0.5,mobilization:1.4,digital_mkt:0.4,industry_eng:0.6,ops_team:0.7,admin:0.5,subsidy:1.3},
  },
  { id:"financial", label:"Financial Sustainability", icon:"📈", color:"#2563eb",
    desc:"Build a revenue-positive, scalable institute - efficiency, unit economics & investor returns.",
    pros:["Attracts private capital","Long-term operational freedom","Drives innovation through revenue"],
    cons:["Inclusion risk if ROI-first","Investor timeline pressure","Brand stress if quality slips"],
    kpiPool:[
      {id:"annual_revenue",label:"Annual Revenue (₹ Cr)",base:2,unit:"Cr"},
      {id:"ebitda_margin",label:"EBITDA Margin (%)",base:-10,unit:"%"},
      {id:"cost_per_student",label:"Cost per Student (₹)",base:25000,unit:"₹",inverse:true},
      {id:"fee_recovery",label:"Fee Recovery Rate (%)",base:40,unit:"%"},
      {id:"rev_per_learner",label:"Revenue per Learner (₹)",base:8000,unit:"₹"},
      {id:"learner_per_trainer",label:"Learners per Trainer",base:15,unit:""},
      {id:"centre_utilisation",label:"Centre Utilisation (%)",base:45,unit:"%"},
      {id:"lac",label:"Learner Acquisition Cost (₹)",base:3000,unit:"₹",inverse:true},
      {id:"blended_ratio",label:"Blended Delivery Ratio (%)",base:20,unit:"%"},
      {id:"new_revenue_streams",label:"New Revenue Streams",base:0,unit:""},
      {id:"breakeven_progress",label:"Break-even Progress (%)",base:10,unit:"%"},
      {id:"roi",label:"Return on Investment (%)",base:-5,unit:"%"},
      {id:"recurring_rev_ratio",label:"Recurring Revenue Ratio (%)",base:10,unit:"%"},
    ],
    endGoals:[
      {id:"breakeven_fast",label:"Break-Even by Year 3",desc:"EBITDA positive by Y3, 15% margin by Y5",kpiTargets:{ebitda_margin:15,breakeven_progress:100,roi:20}},
      {id:"scale_revenue",label:"Revenue Scale Leader",desc:"₹50Cr+ annual revenue, 3+ revenue streams",kpiTargets:{annual_revenue:50,new_revenue_streams:3,recurring_rev_ratio:40}},
      {id:"efficiency_model",label:"Lean Efficiency Model",desc:"Low cost-per-student, high utilisation",kpiTargets:{centre_utilisation:85,cost_per_student:8000,learner_per_trainer:35}},
    ],
    paramWeights:{capex:0.7,trainer_hire:0.9,trainer_dev:0.5,tech:1.1,mobilization:0.6,digital_mkt:1.0,industry_eng:0.8,ops_team:1.2,admin:0.9,subsidy:0.3},
  },
  { id:"innovation", label:"Innovation & Flexibility", icon:"[!]", color:"#7c3aed",
    desc:"Redefine skilling through modular, tech-first & future-ready learning models.",
    pros:["Highly scalable digitally","Fast to pivot to new skills","Resilient to market shifts"],
    cons:["High dropout in self-paced","Employer credibility lag","Tech infrastructure burden"],
    kpiPool:[
      {id:"online_learner_pct",label:"Online Learners (%)",base:30,unit:"%"},
      {id:"digital_completion",label:"Digital Completion (%)",base:40,unit:"%"},
      {id:"microcred_pct",label:"Micro-credentials (%)",base:10,unit:"%"},
      {id:"launch_time",label:"Course Launch Time (days)",base:90,unit:"d",inverse:true},
      {id:"curriculum_refresh",label:"Curriculum Refresh Rate (%)",base:10,unit:"%"},
      {id:"learner_sat",label:"Learner Satisfaction",base:60,unit:"pts"},
      {id:"return_upskill_pct",label:"Return for Upskilling (%)",base:8,unit:"%"},
      {id:"flexibility_rating",label:"Course Flexibility Rating",base:55,unit:"pts"},
      {id:"online_dropoff",label:"Online Drop-off Rate (%)",base:35,unit:"%",inverse:true},
      {id:"codesign_pct",label:"Co-designed with Employers (%)",base:10,unit:"%"},
      {id:"role_versatility",label:"Job Role Versatility Score",base:40,unit:"pts"},
      {id:"new_pilots",label:"New Program Pilots / Yr",base:1,unit:""},
      {id:"placement_rate",label:"Placement Rate (%)",base:38,unit:"%"},
    ],
    endGoals:[
      {id:"digital_scale",label:"Digital Scale Champion",desc:"80%+ online learners, under 15% dropout",kpiTargets:{online_learner_pct:80,online_dropoff:15,digital_completion:75}},
      {id:"modular_leader",label:"Modular Learning Leader",desc:"50%+ micro-credentials, fast launch cycles",kpiTargets:{microcred_pct:50,launch_time:14,new_pilots:8}},
      {id:"codesign_future",label:"Industry Co-Design Pioneer",desc:"60%+ courses co-designed, high versatility",kpiTargets:{codesign_pct:60,role_versatility:80,curriculum_refresh:50}},
    ],
    paramWeights:{capex:0.3,trainer_hire:0.6,trainer_dev:1.0,tech:1.5,mobilization:0.5,digital_mkt:0.9,industry_eng:0.8,ops_team:0.7,admin:0.4,subsidy:0.4},
  },
  { id:"premium", label:"Premium Brand & Reputation", icon:"🏆", color:"#c2410c",
    desc:"Build India's most aspirational skilling brand - prestige, selectivity & alumni success.",
    pros:["Premium pricing power","Tier-1 employer access","Policy influence & recognition"],
    cons:["Slow to build brand equity","Infra & faculty intensive","Risk of elitism perception"],
    kpiPool:[
      {id:"alumni_nps",label:"Alumni NPS Score",base:20,unit:"pts"},
      {id:"employer_nps",label:"Employer NPS Score",base:25,unit:"pts"},
      {id:"tier1_placement",label:"Tier-1 Placements (%)",base:10,unit:"%"},
      {id:"offer_app_ratio",label:"Offer-to-Application Ratio",base:3,unit:"x"},
      {id:"industry_exp_faculty",label:"Industry-Exp Faculty (%)",base:30,unit:"%"},
      {id:"tier1_partners",label:"Tier-1 Industry Partners",base:2,unit:""},
      {id:"curriculum_endorsement",label:"Curriculum Endorsement (%)",base:15,unit:"%"},
      {id:"alumni_recognition",label:"Alumni Recognition Rate (%)",base:10,unit:"%"},
      {id:"media_mentions",label:"Media Mentions & Awards",base:1,unit:""},
      {id:"intl_collab",label:"International Collaborations",base:0,unit:""},
      {id:"campus_exp",label:"Campus Experience Score",base:50,unit:"pts"},
      {id:"employer_recall",label:"Employer Brand Recall (%)",base:5,unit:"%"},
      {id:"repeat_applicants",label:"Repeat Applicants YoY (%)",base:5,unit:"%"},
    ],
    endGoals:[
      {id:"brand_equity",label:"Top National Brand",desc:"80+ employer NPS, 70%+ brand recall",kpiTargets:{employer_nps:80,employer_recall:70,media_mentions:15}},
      {id:"elite_placements",label:"Elite Placement Network",desc:"50%+ Tier-1 placements, high alumni NPS",kpiTargets:{tier1_placement:50,alumni_nps:70,offer_app_ratio:8}},
      {id:"global_recognition",label:"Global Recognition Leader",desc:"5+ intl collaborations, endorsed curriculum",kpiTargets:{intl_collab:5,curriculum_endorsement:70,industry_exp_faculty:80}},
    ],
    paramWeights:{capex:1.1,trainer_hire:0.9,trainer_dev:1.0,tech:0.7,mobilization:0.3,digital_mkt:1.2,industry_eng:1.1,ops_team:0.6,admin:0.7,subsidy:0.2},
  },
];

const SECTORS=[
  {id:"manufacturing",label:"Manufacturing & Mechatronics",salary:"₹14-16K/mo",
   capexReq:"High",facultyAvail:"Medium",salaryBand:"14-16K",jobStability:"High",placementCycle:"60 days",
   genderInclusion:"Low",curriculumComplexity:"High",techRisk:"Medium",employerEngagement:"High",
   growthForecast:"Growing",feeCapacity:"Medium",upskillingPotential:"High",
   rarity:"Medium",policyPriority:9,regionalClustering:"Industrial Hubs",
   uniqueInsight:"High CapEx creates entry barriers but rewards stability.",
   salaryMult:1.10,placementMult:1.15,rarityBonus:1.05},
  {id:"healthcare",label:"Healthcare & Allied Services",salary:"₹12-15K/mo",
   capexReq:"Medium",facultyAvail:"Low",salaryBand:"12-15K",jobStability:"Very High",placementCycle:"45 days",
   genderInclusion:"High",curriculumComplexity:"Very High",techRisk:"Low",employerEngagement:"Medium",
   growthForecast:"Growing",feeCapacity:"Medium",upskillingPotential:"High",
   rarity:"Medium",policyPriority:8,regionalClustering:"Tier 1 & 2 Cities",
   uniqueInsight:"Certified trainers mandatory; clinical labs needed. Gender-inclusive by nature.",
   salaryMult:1.05,placementMult:1.08,rarityBonus:1.05},
  {id:"bfsi",label:"BFSI",salary:"₹14-18K/mo",
   capexReq:"Low",facultyAvail:"Medium",salaryBand:"14-18K",jobStability:"Medium",placementCycle:"30 days",
   genderInclusion:"Medium",curriculumComplexity:"High",techRisk:"High",employerEngagement:"High",
   growthForecast:"Stable",feeCapacity:"High",upskillingPotential:"Very High",
   rarity:"Low",policyPriority:7,regionalClustering:"Tier 1 Cities",
   uniqueInsight:"Compliance-heavy; constant cert updates needed. High upskilling revenue.",
   salaryMult:1.18,placementMult:1.10,rarityBonus:1.0},
  {id:"it",label:"IT & Digital Services",salary:"₹12-20K/mo",
   capexReq:"Low",facultyAvail:"High",salaryBand:"12-20K",jobStability:"Medium",placementCycle:"21 days",
   genderInclusion:"Medium",curriculumComplexity:"High",techRisk:"Very High",employerEngagement:"High",
   growthForecast:"Volatile",feeCapacity:"High",upskillingPotential:"Very High",
   rarity:"Low",policyPriority:8,regionalClustering:"Tier 1 Cities",
   uniqueInsight:"AI disruption accelerating; constant refresh required. Best salary outcomes.",
   salaryMult:1.20,placementMult:1.08,rarityBonus:1.0},
  {id:"logistics",label:"Logistics & Supply Chain",salary:"₹11-14K/mo",
   capexReq:"Low",facultyAvail:"Medium",salaryBand:"11-14K",jobStability:"Medium",placementCycle:"45 days",
   genderInclusion:"Low",curriculumComplexity:"Medium",techRisk:"Medium",employerEngagement:"Medium",
   growthForecast:"Growing",feeCapacity:"Low",upskillingPotential:"Medium",
   rarity:"Medium",policyPriority:7,regionalClustering:"Industrial Corridors",
   uniqueInsight:"Last-mile hiring volatile; seasonal demand spikes. Good for rural outreach.",
   salaryMult:1.00,placementMult:1.05,rarityBonus:1.03},
  {id:"retail",label:"Retail & Sales",salary:"₹10-13K/mo",
   capexReq:"Very Low",facultyAvail:"High",salaryBand:"10-13K",jobStability:"Low",placementCycle:"15 days",
   genderInclusion:"High",curriculumComplexity:"Low",techRisk:"Low",employerEngagement:"Medium",
   growthForecast:"Stable",feeCapacity:"Low",upskillingPotential:"Low",
   rarity:"Low",policyPriority:5,regionalClustering:"Pan-India",
   uniqueInsight:"High attrition sector; retention KPIs at risk. Fastest placement cycle.",
   salaryMult:0.95,placementMult:1.12,rarityBonus:1.0},
  {id:"construction",label:"Construction & Infrastructure",salary:"₹12-15K/mo",
   capexReq:"High",facultyAvail:"Low",salaryBand:"12-15K",jobStability:"High",placementCycle:"60 days",
   genderInclusion:"Very Low",curriculumComplexity:"High",techRisk:"Low",employerEngagement:"Medium",
   growthForecast:"Booming",feeCapacity:"Low",upskillingPotential:"Medium",
   rarity:"Medium",policyPriority:9,regionalClustering:"Infrastructure Corridors",
   uniqueInsight:"Informal sector dominant; safety certification critical. Policy-priority sector.",
   salaryMult:1.05,placementMult:1.00,rarityBonus:1.05},
  {id:"hospitality",label:"Hospitality & Food Services",salary:"₹10-14K/mo",
   capexReq:"Medium",facultyAvail:"Medium",salaryBand:"10-14K",jobStability:"Medium",placementCycle:"30 days",
   genderInclusion:"High",curriculumComplexity:"Medium",techRisk:"Low",employerEngagement:"High",
   growthForecast:"Recovering",feeCapacity:"Medium",upskillingPotential:"Medium",
   rarity:"Low",policyPriority:6,regionalClustering:"Tourist Hubs & Metros",
   uniqueInsight:"Seasonal demand; international placement pathways possible.",
   salaryMult:1.00,placementMult:1.10,rarityBonus:1.0},
  {id:"green",label:"Green Jobs & Renewable Energy",salary:"₹13-17K/mo",
   capexReq:"Medium",facultyAvail:"Low",salaryBand:"13-17K",jobStability:"High",placementCycle:"90 days",
   genderInclusion:"Medium",curriculumComplexity:"High",techRisk:"High",employerEngagement:"Low",
   growthForecast:"Emerging",feeCapacity:"Medium",upskillingPotential:"Very High",
   rarity:"High",policyPriority:10,regionalClustering:"EV & Solar Zones",
   uniqueInsight:"Job market immature; 2-3 yr absorption lag. First-mover advantage is huge.",
   salaryMult:1.12,placementMult:0.85,rarityBonus:1.10},
  {id:"beauty",label:"Beauty, Wellness & Personal Care",salary:"₹9-12K/mo",
   capexReq:"Low",facultyAvail:"High",salaryBand:"9-12K",jobStability:"Low",placementCycle:"15 days",
   genderInclusion:"Very High",curriculumComplexity:"Low",techRisk:"Low",employerEngagement:"Low",
   growthForecast:"Growing",feeCapacity:"Low",upskillingPotential:"Medium",
   rarity:"Low",policyPriority:4,regionalClustering:"Pan-India",
   uniqueInsight:"Self-employment dominant; placement metrics hard to verify. Women-centric sector.",
   salaryMult:0.90,placementMult:0.95,rarityBonus:1.0},
];

const FUNDING_SOURCES=[
  {id:"csr",label:"CSR Grant",icon:"🤝",desc:"Corporate Social Responsibility - non-repayable, outcome-linked",budgetMult:1.0,patience:2,kpiBonus:{women_pct:5,marginalized_pct:5},
   pros:["Non-repayable - no financial pressure to return capital","Good for inclusion & gender KPIs - CSR funders love social stories","Flexible reporting cycles"],
   cons:["CSR budgets can dry up (especially post-elections)","Needs strong brand storytelling & impact narrative","Limited scale - usually capped at ₹5-15 Cr per year"]},
  {id:"govt",label:"Government Scheme",icon:"🏛",desc:"Central/State govt schemes - placement-linked milestone payments",budgetMult:1.15,patience:3,kpiBonus:{placement_rate:5,total_learners:200},
   pros:["Largest funding pool - PMKVY, DDU-GKY, NSDC schemes","Boosts placement KPI and learner volume targets","Policy credibility and scheme branding"],
   cons:["Milestone-linked - cash released only after targets","Heavy compliance, MIS, Aadhaar linking required","Vulnerable to election cycles & scheme redesign"]},
  {id:"investor",label:"Impact Investor / PE",icon:"💼",desc:"ROI-focused capital - scale, EBITDA & revenue growth expected",budgetMult:1.25,patience:1,kpiBonus:{annual_revenue:3,ebitda_margin:3},
   pros:["Largest upfront capital - best for rapid scale","Pushes you to build sustainable, profitable model","Access to networks, mentors & co-investors"],
   cons:["Least patient - expects ROI within 2-3 years","Poor EBITDA triggers funding withdrawal","May push you away from inclusion/social mission"]},
  {id:"self",label:"Bootstrapped",icon:"💰",desc:"Own capital or founder reserves - full control, high personal risk",budgetMult:0.85,patience:5,kpiBonus:{},
   pros:["Full strategic freedom - no funder pressure","Builds lean, efficient operations","Long-term thinking without quarterly pressure"],
   cons:["Smallest starting budget - constraints from Year 1","No funder network for partnerships or events","High personal risk if KPIs underperform"]},
  {id:"philanthropy",label:"Philanthropy / Foundation",icon:"🌐",desc:"Mission-driven patient capital - equity and innovation rewarded",budgetMult:1.05,patience:4,kpiBonus:{rural_pct:5,curriculum_refresh:5},
   pros:["High patience - multi-year grants, no quarterly pressure","Rewards innovation and rural/equity focus","Excellent for curriculum agility and last-mile reach"],
   cons:["Smaller ticket sizes than govt or investor","Needs deep mission alignment & strong theory of change","International foundations may have foreign compliance requirements"]},
];

const DELIVERY_MODES=[
  {id:"classroom",label:"Classroom Only",icon:"🏫",capexMult:1.2,bestFor:["manufacturing","construction","hospitality"],
   pros:["Strong for hands-on, structured learning","Familiar format - easy trainer adoption","Best for employer trust in practical sectors"],
   cons:["High CapEx - requires physical space & equipment","Limited reach - students must travel to centre","Not scalable without opening new locations"]},
  {id:"handson",label:"Hands-On / Workshop",icon:"🔧",capexMult:1.5,bestFor:["manufacturing","healthcare","construction"],
   pros:["Highest employer satisfaction - job-ready output","Best for manufacturing, healthcare, green jobs","Directly boosts placement and salary KPIs"],
   cons:["Highest CapEx requirement of all modes","Trainer quality is critical - expensive to hire","Equipment maintenance adds Year 2+ hidden costs"]},
  {id:"online_async",label:"Online Self-Paced",icon:"💻",capexMult:0.4,bestFor:["it","bfsi","beauty"],
   pros:["Lowest infrastructure cost - high margin model","Massive reach - can train across states","Strong tech penetration KPI performance"],
   cons:["High dropout risk - no peer support or accountability","Poor for rural learners with low connectivity","Employer confidence lower for practical skills"]},
  {id:"online_live",label:"Online Instructor-Led",icon:"📡",capexMult:0.6,bestFor:["it","bfsi","retail"],
   pros:["Real-time interaction improves retention vs async","Scalable without physical expansion","Good for IT, BFSI upskilling of working professionals"],
   cons:["Trainer bandwidth limits batch sizes","Requires learners to have stable internet","Less effective for hands-on or practical sectors"]},
  {id:"hybrid",label:"Hybrid / Blended",icon:"🔀",capexMult:0.9,bestFor:["healthcare","logistics","green"],
   pros:["Best balance of reach and quality","Flexible for working professionals","Strong completion and satisfaction KPIs"],
   cons:["Complex to coordinate - needs strong ops team","Higher trainer workload - burnout risk","Learner experience can feel inconsistent"]},
  {id:"mobile",label:"Mobile / Community",icon:"🚐",capexMult:0.5,bestFor:["construction","beauty","retail"],
   pros:["Maximum last-mile reach - goes to learner","Best for rural, women, school dropout audiences","Low CapEx - no permanent infrastructure needed"],
   cons:["Hardest to quality-control - decentralised delivery","Trainer management across geographies is complex","Funder confidence lower - hard to verify outcomes"]},
];

// =======================================================
//  REVENUE MODELS - Layer 6 selection (choose 1 to 3)
// =======================================================
const REVENUE_MODELS = [
  {id:"training_delivery",label:"Training Delivery",icon:"🎓",
   desc:"Core courses funded via learner fees, grants and government schemes.",
   spendDrivers:["mobilization","subsidy","ops_team"],
   kpiBoost:{completion_rate:3,total_learners:200},
   revenueFormula:"Students x Fees + Grant disbursal",
   pros:["Largest volume revenue source","Scheme-eligible for govt funders","Predictable cash flow"],
   cons:["Low margin per student","Fee recovery hard in inclusion cohorts","Scheme-linked delays"]},
  {id:"curriculum_licensing",label:"Curriculum Licensing",icon:"📋",
   desc:"Selling course content and IP to partner institutes, NGOs and corporations.",
   spendDrivers:["trainer_dev","tech","industry_eng"],
   kpiBoost:{curriculum_refresh:5,new_revenue_streams:1},
   revenueFormula:"Licenses x Content Fee per Module",
   pros:["High-margin recurring revenue","Scales without adding learners","Builds sector IP reputation"],
   cons:["Takes 2-3 years to develop licensable content","Requires strong tech infrastructure","Competitors can replicate"]},
  {id:"contract_training",label:"Contract Training (B2B)",icon:"🏢",
   desc:"Customised upskilling for corporate clients on contract basis.",
   spendDrivers:["industry_eng","trainer_hire","trainer_dev"],
   kpiBoost:{employer_sat:5,employer_repeat:5},
   revenueFormula:"Corporate Contracts x Batch Fee",
   pros:["Premium pricing from corporates","Boosts employer KPIs directly","Stable forward contracts"],
   cons:["Needs strong employer network first","Can distract from social mission","Vulnerable to corporate budget cuts"]},
  {id:"placement_commission",label:"Placement Commission",icon:"🤝",
   desc:"Charging employers a fee per successful hire from institute batches.",
   spendDrivers:["industry_eng","mobilization","ops_team"],
   kpiBoost:{placement_rate:4,active_employers:5},
   revenueFormula:"Students Placed x Employer Commission %",
   pros:["Aligns incentives with outcomes","Scales with placement performance","Strong employer relationship builder"],
   cons:["Revenue delayed until placements happen","Employers resist high commission rates","Low-salary sectors yield low commission"]},
  {id:"contract_manufacturing",label:"Contract Manufacturing",icon:"🔧",
   desc:"Using institute labs and workshops for light industrial production on behalf of industry.",
   spendDrivers:["capex","ops_team","trainer_hire"],
   kpiBoost:{centre_utilisation:8,lab_utilisation:10},
   revenueFormula:"Production Orders x Unit Margin",
   pros:["Utilises idle lab capacity for revenue","Students gain live production experience","Deepens industry partnerships"],
   cons:["Only viable in Manufacturing & Construction sectors","High ops complexity and quality risk","Requires capex investment upfront"]},
  {id:"consulting_advisory",label:"Consulting & Advisory",icon:"💡",
   desc:"Providing skilling strategy, curriculum design and impact advisory to governments and NGOs.",
   spendDrivers:["ops_team","industry_eng","trainer_dev"],
   kpiBoost:{employer_nps:4,media_mentions:2},
   revenueFormula:"Advisory Contracts x Day Rate",
   pros:["High margin - mostly human capital","Builds brand and policy influence","Grows naturally with track record"],
   cons:["Capacity-intensive - diverts senior team","Difficult to scale without reputation","Long sales cycles with govt clients"]},
  {id:"certification_services",label:"Certification Services",icon:"🏅",
   desc:"Acting as a recognised assessment and certification body for sector skill councils.",
   spendDrivers:["ops_team","tech","trainer_dev"],
   kpiBoost:{mpr_compliance:5,industry_cert_pct:8},
   revenueFormula:"Assessments x Certification Fee",
   pros:["Recurring fee income per assessment","Strengthens regulatory positioning","Attracts other institutes to your standards"],
   cons:["Requires NSQF/SSC recognition - takes time","Heavy compliance and documentation burden","Conflicts of interest if you also train"]},
  {id:"grants_sponsored",label:"Grants & Sponsored Projects",icon:"🌐",
   desc:"Innovation-led R&D grants, impact fellowships and sponsored projects from foundations.",
   spendDrivers:["ops_team","tech","mobilization"],
   kpiBoost:{impact_reports:2,mission_alignment:5},
   revenueFormula:"Grants Awarded x Utilisation Rate",
   pros:["Non-dilutive capital for innovation","Enables risky experiments and pilots","Philanthropic funders love grant-match stories"],
   cons:["Competitive - requires strong proposals","Reporting burden is high","Uncertain renewal - project-based only"]},
];

const YEAR_EVENTS=[
  // Year 1
  {year:1,name:"Year 1 - Foundation Sprint",desc:"Your credibility clock starts now. Early employer relationships and quality of first batch set the tone for the next 4 years.",mod:1.0,sectorMod:{},lagSensitive:false,type:"normal"},
  {year:1,name:"NSDC Scheme Window Opens",desc:"NSDC opens a fresh grant cycle. Institutes with strong MIS and compliance receive priority disbursals.",mod:1.04,sectorMod:{manufacturing:1.08,construction:1.06},lagSensitive:false,type:"opportunity"},
  // Year 2
  {year:2,name:"China+1 Manufacturing Surge",desc:"Global firms accelerating India entry. PLI 2.0 live. Manufacturing, electronics and logistics demand jumps sharply.",mod:1.06,sectorMod:{manufacturing:1.22,logistics:1.12,construction:1.15},lagSensitive:false,type:"boom"},
  {year:2,name:"Central Election - New Coalition in Power",desc:"A surprise coalition reshapes Union Budget priorities. CSR tax incentives cut, digital skilling de-emphasised. MSMEs, green construction and health-tech get major boosts. Agri-tech handed to states.",mod:0.97,sectorMod:{it:0.88,bfsi:0.92,green:1.18,healthcare:1.14,manufacturing:0.95},lagSensitive:true,type:"political",
    funders:{govt:"New administration scrutinising utilisation metrics closely.",csr:"CSR budgets shrinking - expect 15-20% funding pressure.",impact:"Foundation funders excited by MSME and green push."}},
  // Year 3
  {year:3,name:"Union Budget - Green Skilling Push",desc:"Government doubles down on green infra and health-tech. EV PLI components announced. Institutes aligned with these themes get preferential scheme access.",mod:1.02,sectorMod:{green:1.25,healthcare:1.15,it:1.05,manufacturing:0.95},lagSensitive:true,type:"policy"},
  {year:3,name:"Rural Scheme Funds Cut 18%",desc:"PMKVY disbursals delayed by 2 quarters due to audit lockdown. Rural mobilisation pipelines dry up. Urban and semi-urban centres least affected.",mod:0.93,sectorMod:{construction:0.88,retail:0.90,green:1.08},lagSensitive:true,type:"shock",
    funders:{govt:"Govt funder frustrated by scheme underutilisation - renewal at risk.",csr:"CSR funders sensing an opportunity to fill the gap."}},
  // Year 4
  {year:4,name:"Global Recession Signal",desc:"IT hiring at a 5-year low. BFSI mid-level layoffs announced. Healthcare, green jobs and advanced manufacturing continue growing.",mod:0.87,sectorMod:{it:0.72,bfsi:0.80,healthcare:1.08,green:1.12,manufacturing:1.04},lagSensitive:true,type:"shock",
    funders:{roi:"ROI investor alarmed - demanding cost-per-student and breakeven data.",csr:"CSR funders in wait-and-watch mode. Social impact metrics critical.",govt:"Scheme-linked institutes insulated from recession pressure."}},
  {year:4,name:"EV & Green Jobs Surge",desc:"PM EV Mission accelerates. Tier-2 cities see new manufacturing plants. Institutes with EV, solar, and advanced manufacturing curricula land long-term employer partnerships.",mod:1.05,sectorMod:{green:1.28,manufacturing:1.18,construction:1.10,it:0.92},lagSensitive:false,type:"boom"},
  // Year 5
  {year:5,name:"AI & Automation Disruption Wave",desc:"Generative AI reshapes roles across all sectors. Employers urgently reskilling workers. Micro-credentials and blended delivery thriving. Early-adaptor institutes in strong demand.",mod:1.09,sectorMod:{it:1.18,manufacturing:1.07,retail:0.88,bfsi:1.05},lagSensitive:false,type:"disruption"},
  {year:5,name:"National Skilling Mission 3.0",desc:"Government launches Rs.25,000 Cr national skilling overhaul. NSQF-linked institutes get priority funding. Strong KPI track record from Y1-Y4 determines access.",mod:1.12,sectorMod:{manufacturing:1.15,healthcare:1.12,green:1.20,it:1.05},lagSensitive:false,type:"opportunity"},
];

// Y1-Y2: annual (1 period), Y3-Y4: half-yearly (2 periods), Y5: quarterly (4 periods)
const getCadence=(year)=>{
  if(year<=2) return {periods:1,label:"Annual",pLabel:(i)=>`Year ${year} - Full Year`};
  if(year===3) return {periods:2,label:"Half-Yearly",pLabel:(i)=>`Y3 H${i+1} (${i===0?"Jan-Jun":"Jul-Dec"})`};
  return {periods:4,label:"Quarterly",pLabel:(i)=>`Y${year} Q${i+1} (${["Jan-Mar","Apr-Jun","Jul-Sep","Oct-Dec"][i]})`};
};

const PARAMS=[
  {id:"capex",label:"CapEx",sub:"Infrastructure",icon:"🏗",desc:"Labs, centres, machines & tools",color:"#0ea5e9"},
  {id:"trainer_hire",label:"Trainer Hiring",sub:"Faculty & SMEs",icon:"👩🏫",desc:"Full-time/contract trainers and SMEs",color:"#8b5cf6"},
  {id:"trainer_dev",label:"Trainer Development",sub:"Capability Building",icon:"📚",desc:"Training-of-Trainers, faculty upskilling",color:"#6366f1"},
  {id:"tech",label:"Technology",sub:"LMS & Digital Infra",icon:"💻",desc:"LMS, virtual classrooms, learner tracking",color:"#0284c7"},
  {id:"mobilization",label:"Mobilization",sub:"Field Outreach",icon:"🚌",desc:"On-ground outreach, school visits, rural camps",color:"#d97706"},
  {id:"digital_mkt",label:"Digital Marketing",sub:"Campaigns & SEO",icon:"📣",desc:"Social media, paid campaigns, SEO",color:"#db2777"},
  {id:"industry_eng",label:"Industry Engagement",sub:"Employer Relations",icon:"🏭",desc:"Employer tie-ups, job fairs, partnerships",color:"#059669"},
  {id:"ops_team",label:"Operations Team",sub:"Program Management",icon:"[*]",desc:"Program managers, MIS, data & compliance",color:"#475569"},
  {id:"admin",label:"Admin & Support",sub:"Back Office",icon:"🗂",desc:"Logistics, centre admin, procurement",color:"#94a3b8"},
  {id:"subsidy",label:"Student Subsidies",sub:"Incentives",icon:"🎓",desc:"Travel, meals, stipends, scholarships",color:"#f59e0b"},
];


// =======================================================
//  FUNDER PERSONAS - personality-driven stakeholder reactions
// =======================================================
const FUNDER_PERSONAS={
  govt:{label:"Government Funder",icon:"🏛",color:"#1d4ed8",
    trait:"Conservative & process-driven",
    likes:"Completion rates, inclusion, scheme compliance",
    hates:"CapEx waste, erratic shifts, poor MIS",
    getReaction:(kpis,stress,yearScore)=>{
      if(kpis.completion_rate>70&&stress<5) return {mood:"satisfied",msg:"Scheme utilisation is healthy. Completion rates suggest strong delivery discipline. Renewal likely."};
      if(stress>7) return {mood:"concerned",msg:"Operational stress flags flagged by QA audit. Course corrections expected before next tranche."};
      if(yearScore<35) return {mood:"warning",msg:"KPI trajectory doesn't meet scheme benchmarks. Improvement required to unlock next tranche."};
      return {mood:"neutral",msg:"Progress noted. Mid-year review scheduled. Maintain documentation and MIS updates."};
    }
  },
  csr:{label:"CSR Funder",icon:"💼",color:"#059669",
    trait:"Social impact + optics focused",
    likes:"Gender inclusion, placement stories, storytelling",
    hates:"Low placement rates, poor branding, CapEx without outcomes",
    getReaction:(kpis,stress,yearScore)=>{
      if(kpis.women_pct>45&&kpis.placement_rate>55) return {mood:"satisfied",msg:"Excellent inclusion numbers and placement outcomes. Board presentation already drafted using your data."};
      if(kpis.placement_rate<30) return {mood:"concerned",msg:"Placement rate is a concern for our impact reporting. We need stronger job outcome stories."};
      if(kpis.women_pct<25) return {mood:"warning",msg:"Gender diversity numbers are below our CSR policy threshold. Escalating to funding committee."};
      return {mood:"neutral",msg:"Impact metrics are moderate. Requesting a field visit and learner testimonials for our annual report."};
    }
  },
  roi:{label:"ROI-Driven Investor",icon:"💸",color:"#7c3aed",
    trait:"Metric-focused and impatient",
    likes:"Salary outcomes, cost efficiency, scale",
    hates:"Poor EBITDA, low scale, slow payback",
    getReaction:(kpis,stress,yearScore)=>{
      if(kpis.ebitda_margin>15&&kpis.avg_salary>18000) return {mood:"satisfied",msg:"EBITDA holding, salary outcomes above benchmark. Prepared to discuss Series A extension."};
      if(kpis.ebitda_margin<0) return {mood:"concerned",msg:"Negative margins for two consecutive periods. Cost structure must be rationalised."};
      if(kpis.roi<5) return {mood:"warning",msg:"ROI below agreed threshold. CapEx-heavy strategy is creating drag. Recommend asset-light pivot."};
      return {mood:"neutral",msg:"Watching trajectory. Need 2 more quarters of consistent data before recommitting capital."};
    }
  },
  impact:{label:"Foundation / Philanthropic",icon:"🌍",color:"#0891b2",
    trait:"Mission-focused and flexible",
    likes:"Equity, innovation, long-term reach",
    hates:"Lack of clarity on audience, mission drift",
    getReaction:(kpis,stress,yearScore)=>{
      if(kpis.rural_pct>40&&kpis.firstgen_pct>30) return {mood:"satisfied",msg:"Deep equity reach. First-gen and rural numbers are exactly what our mandate calls for. Grant renewal confirmed."};
      if(kpis.marginalized_pct<15) return {mood:"concerned",msg:"We fund transformational access - current marginalised inclusion rate doesn't meet our theory of change."};
      if(yearScore>65) return {mood:"satisfied",msg:"Strong overall trajectory. Innovation approach aligns with our portfolio thesis."};
      return {mood:"neutral",msg:"Monitoring closely. Quarterly check-in requested to review equity metrics."};
    }
  },
  b2b:{label:"Corporate Buyer (B2B)",icon:"🏢",color:"#d97706",
    trait:"Value-seeking and quality focused",
    likes:"Trainer quality, just-in-time delivery, agility",
    hates:"Poor trainer quality, low curriculum agility, slow response",
    getReaction:(kpis,stress,yearScore)=>{
      if(kpis.employer_sat>70&&kpis.curriculum_refresh>60) return {mood:"satisfied",msg:"Your trainers have been excellent. We are expanding the upskilling contract for Q3-Q4."};
      if(kpis.employer_sat<45) return {mood:"concerned",msg:"Feedback from line managers is mixed. Trainer preparedness for new-age roles is lacking."};
      if(kpis.codesign_pct<30) return {mood:"warning",msg:"We need co-designed curriculum - off-the-shelf content doesn't meet our job role requirements."};
      return {mood:"neutral",msg:"Satisfactory delivery. Awaiting pilot batch outcomes before confirming the annual contract renewal."};
    }
  }
};

// =======================================================
//  PARAMETER IMPACT CARDS - strategic context for each slider
// =======================================================
const PARAM_IMPACT_CARDS={
  capex:{
    headline:"Infrastructure & Equipment",
    gains:["Quality of practical training and learner confidence","Employer trust and hiring in equipment-heavy sectors","Long-term delivery infrastructure durability","Ability to offer new-age job roles (EV, advanced manufacturing)"],
    risks:["Low employer participation if underfunded","High wear-and-tear cost in Year 2+","Inability to support hands-on learning in Manufacturing & Healthcare","Over-investment without trainers = underutilised labs (ROI drops)"],
    tradeoff:"After 30% of budget, every extra ₹ in CapEx reduces ROI. Balance with trainer hiring."
  },
  trainer_hire:{
    headline:"Faculty & Trainer Hiring",
    gains:["Core delivery quality and learner outcomes","Placement rates and salary outcomes (SOQS)","Batch throughput and centre utilisation","Foundation for all other KPIs"],
    risks:["Under-hiring below 6% budget = completion rate collapses","Stress spikes sharply when trainer-to-learner ratio is poor","No trainers means no use for labs or tech"],
    tradeoff:"This is your most foundational investment. Underspend here and everything else underperforms."
  },
  trainer_dev:{
    headline:"Trainer Capability Building",
    gains:["Consistency and quality across batches and centres","Student retention and completion rates","Curriculum alignment with fast-changing job markets","Ability to run scalable multi-location delivery"],
    risks:["Without trainer hiring first, development spend is wasted","High learner dropout if trainer skills stagnate","New-age employers will reject under-skilled faculty"],
    tradeoff:"Only invest heavily here once you have enough trainers hired. 12%+ in trainer dev reduces stress."
  },
  tech:{
    headline:"Technology & LMS Investment",
    gains:["Digital delivery scale and online learner reach","Data-driven student tracking and early dropout alerts","Blended and hybrid delivery capability","Curriculum refresh speed"],
    risks:["Tech-heavy without field delivery = high online dropout","Irrelevant in sectors with low digital readiness (Construction, Rural)","LMS without content = expensive shelf-ware"],
    tradeoff:"High ROI in IT and Blended delivery. Low ROI in Hands-on Manufacturing without CapEx pairing."
  },
  mobilization:{
    headline:"Field Outreach & Mobilisation",
    gains:["Total learner intake and batch fill rates","Rural, first-gen and marginalised learner reach","Inclusion KPIs (women%, rural%) unlocked","Brand penetration in low-connectivity geographies"],
    risks:["Without mobilisation, subsidies are wasted - no one to reach","Low intake means CapEx is underutilised","Digital marketing alone can't replace ground presence for rural cohorts"],
    tradeoff:"Field outreach multiplies subsidy efficiency. But without delivery quality, high intake creates dropout pressure."
  },
  digital_mkt:{
    headline:"Digital Marketing & Campaigns",
    gains:["Fast early traction in urban and semi-urban geographies","Brand visibility for employer and B2B partnerships","Learner applications via social and search channels","Media mentions and public recognition"],
    risks:["No conversion value without ground operations","Wasted spend in geographies with low smartphone penetration","Creates awareness but not learner quality"],
    tradeoff:"Works best when paired with mobilisation. Digital-only reach skews urban and ignores inclusion KPIs."
  },
  industry_eng:{
    headline:"Industry & Employer Engagement",
    gains:["Placement rates and job offer quality","Apprenticeship and internship linkages","Curriculum co-design with employers","Employer NPS and repeat hiring relationships"],
    risks:["Under-investment directly drops placement_rate by 1.5% per period","No job leads = salary outcomes fall even with strong training","Employers stop engaging = pipeline dries up permanently"],
    tradeoff:"Critical for Employment archetype. Even Innovation and Premium institutes need this at 10%+ to sustain outcomes."
  },
  ops_team:{
    headline:"Core Operations Team",
    gains:["Programme management consistency and quality control","MIS, data and compliance accuracy (scheme renewal)","Cost efficiency and centre utilisation","Breakeven and EBITDA improvement"],
    risks:["Under-staffed ops = stress spikes (triggers +1 stress)","Poor MIS = govt funder drops confidence","No ops capacity = inability to manage multi-period pivots"],
    tradeoff:"Small teams are fine in Y1. By Y3+, under-investment here makes quarterly pivots chaotic."
  },
  admin:{
    headline:"Admin & Back Office",
    gains:["Logistics smoothness and procurement reliability","Centre-level support for trainers and learners","Regulatory compliance and reporting readiness"],
    risks:["Bottlenecks in procurement slow down CapEx deployment","Under-staffed admin creates friction at centre level"],
    tradeoff:"Baseline investment (5-8%) keeps operations smooth. Over-investing here doesn't improve KPIs."
  },
  subsidy:{
    headline:"Student Incentives & Subsidies",
    gains:["Inclusion KPIs: scholarship%, women%, rural% directly unlocked","Learner retention and completion in low-income cohorts","Dropout rate reduction in long-duration programmes","Mobilisation multiplier - subsidies attract hard-to-reach learners"],
    risks:["No intake = subsidy is wasted spend","Without quality delivery, subsidised learners drop out anyway","Funder-heavy programmes can become subsidy-dependent (low fee recovery)"],
    tradeoff:"Pairs powerfully with Mobilisation. For Inclusion archetype, 12%+ subsidy unlocks multiple KPIs simultaneously."
  }
};

// =======================================================
//  LAG PENALTY - tracks allocation shift between periods
//  If >40% of budget composition changes, apply a disruption penalty
// =======================================================
function computeLagPenalty(prevParams,currentParams){
  if(!prevParams) return {penalty:0,triggered:false,msg:""};
  const total=Object.values(currentParams).reduce((s,v)=>s+v,0)||100;
  const prevTotal=Object.values(prevParams).reduce((s,v)=>s+v,0)||100;
  let totalShift=0;
  PARAMS.forEach(p=>{
    const curr=(currentParams[p.id]||0)/total;
    const prev=(prevParams[p.id]||0)/prevTotal;
    totalShift+=Math.abs(curr-prev);
  });
  // totalShift is sum of absolute changes across all params (0 to 2 range)
  const shiftPct=totalShift/2; // normalise to 0-1
  if(shiftPct>0.40){
    return {penalty:0.82,triggered:true,severity:"major",
      msg:`Major budget reallocation detected (${Math.round(shiftPct*100)}% shift). Procurement delays, contract changes and team restructuring will dampen outcomes this period.`};
  }
  if(shiftPct>0.25){
    return {penalty:0.92,triggered:true,severity:"moderate",
      msg:`Moderate reallocation (${Math.round(shiftPct*100)}% shift). Some implementation friction expected. One cycle of adjustment before full impact is felt.`};
  }
  return {penalty:1.0,triggered:false,msg:""};
}

// =======================================================
//  CONTEXTUAL EXTRA KPIs  (sector / delivery / funding)
//  Each entry: id, label, base, unit, inverse?, tag, delta formula hint
//  Max 2 extras added to any game (1 per source bucket, deduped)
// =======================================================
const SECTOR_BONUS_KPIS = {
  manufacturing:[
    {id:"safety_cert_pct",label:"Safety Certification Rate (%)",base:20,unit:"%",tag:"sector"},
    {id:"industry_cert_pct",label:"Industry Cert Attainment (%)",base:25,unit:"%",tag:"sector"},
  ],
  healthcare:[
    {id:"clinical_hours",label:"Clinical Hours per Learner",base:40,unit:"h",tag:"sector"},
    {id:"cert_pass_rate",label:"Certification Pass Rate (%)",base:45,unit:"%",tag:"sector"},
  ],
  bfsi:[
    {id:"compliance_score",label:"Regulatory Compliance Score",base:50,unit:"pts",tag:"sector"},
    {id:"licencing_pct",label:"BFSI Licencing Pass Rate (%)",base:30,unit:"%",tag:"sector"},
  ],
  it:[
    {id:"tech_cert_pct",label:"Tech Certification Rate (%)",base:20,unit:"%",tag:"sector"},
    {id:"github_project_pct",label:"Portfolio / Project Completion (%)",base:15,unit:"%",tag:"sector"},
  ],
  logistics:[
    {id:"last_mile_placement",label:"Last-Mile Placement Rate (%)",base:30,unit:"%",tag:"sector"},
    {id:"vehicle_ops_cert",label:"Vehicle / Ops Certification (%)",base:20,unit:"%",tag:"sector"},
  ],
  retail:[
    {id:"sales_target_hit",label:"Sales Target Achievement (%)",base:35,unit:"%",tag:"sector"},
    {id:"customer_handling",label:"Customer Handling Score",base:50,unit:"pts",tag:"sector"},
  ],
  construction:[
    {id:"safety_cert_pct",label:"Safety Certification Rate (%)",base:20,unit:"%",tag:"sector"},
    {id:"site_readiness_pct",label:"Site-Ready Graduates (%)",base:25,unit:"%",tag:"sector"},
  ],
  hospitality:[
    {id:"soft_skills_score",label:"Soft Skills Assessment Score",base:55,unit:"pts",tag:"sector"},
    {id:"intl_placement_pct",label:"International Placement (%)",base:5,unit:"%",tag:"sector"},
  ],
  green:[
    {id:"green_cert_pct",label:"Green Skills Certification (%)",base:15,unit:"%",tag:"sector"},
    {id:"solar_project_pct",label:"Renewable Project Completion (%)",base:10,unit:"%",tag:"sector"},
  ],
  beauty:[
    {id:"self_employ_pct",label:"Self-Employment Rate (%)",base:30,unit:"%",tag:"sector"},
    {id:"client_sat_score",label:"Client Satisfaction Score",base:55,unit:"pts",tag:"sector"},
  ],
};
const DELIVERY_BONUS_KPIS = {
  classroom:[
    {id:"classroom_utilisation",label:"Classroom Utilisation (%)",base:50,unit:"%",tag:"delivery"},
    {id:"attendance_rate",label:"Learner Attendance Rate (%)",base:70,unit:"%",tag:"delivery"},
  ],
  handson:[
    {id:"lab_utilisation",label:"Lab / Workshop Utilisation (%)",base:40,unit:"%",tag:"delivery"},
    {id:"practical_pass_rate",label:"Practical Assessment Pass Rate (%)",base:45,unit:"%",tag:"delivery"},
  ],
  online_async:[
    {id:"module_completion_pct",label:"Module Completion Rate (%)",base:35,unit:"%",tag:"delivery"},
    {id:"avg_session_time",label:"Avg Session Time (mins)",base:22,unit:"m",tag:"delivery"},
  ],
  online_live:[
    {id:"live_attendance_pct",label:"Live Session Attendance (%)",base:55,unit:"%",tag:"delivery"},
    {id:"chat_engagement",label:"Chat / Interaction Score",base:40,unit:"pts",tag:"delivery"},
  ],
  hybrid:[
    {id:"blended_completion",label:"Blended Completion Rate (%)",base:48,unit:"%",tag:"delivery"},
    {id:"offline_online_balance",label:"Offline-Online Balance Score",base:45,unit:"pts",tag:"delivery"},
  ],
  mobile:[
    {id:"community_reach_pct",label:"Community Reach Rate (%)",base:20,unit:"%",tag:"delivery"},
    {id:"mobile_completion_pct",label:"Mobile Learner Completion (%)",base:35,unit:"%",tag:"delivery"},
  ],
};
const FUNDING_BONUS_KPIS = {
  csr:[
    {id:"csr_outcome_score",label:"CSR Outcome Index Score",base:40,unit:"pts",tag:"funding"},
    {id:"social_roi",label:"Social ROI Score",base:30,unit:"pts",tag:"funding"},
  ],
  govt:[
    {id:"mpr_compliance",label:"MPR / Compliance Score (%)",base:50,unit:"%",tag:"funding"},
    {id:"scheme_utilisation",label:"Scheme Fund Utilisation (%)",base:45,unit:"%",tag:"funding"},
  ],
  investor:[
    {id:"unit_economics_score",label:"Unit Economics Score",base:35,unit:"pts",tag:"funding"},
    {id:"growth_velocity",label:"Revenue Growth Velocity (%)",base:10,unit:"%",tag:"funding"},
  ],
  self:[
    {id:"cash_flow_health",label:"Cash Flow Health Score",base:40,unit:"pts",tag:"funding"},
    {id:"cost_efficiency",label:"Cost Efficiency Index",base:45,unit:"pts",tag:"funding"},
  ],
  philanthropy:[
    {id:"mission_alignment",label:"Mission Alignment Score",base:50,unit:"pts",tag:"funding"},
    {id:"impact_reports",label:"Impact Reports Published",base:1,unit:"",tag:"funding"},
  ],
};

//  delta hints for extra KPIs in simulation 
const EXTRA_KPI_DELTAS = {
  safety_cert_pct:(fF,fI,fT,fO,fS,fOP,fC)=>fF*9+fOP*5,
  industry_cert_pct:(fF,fI,fT,fO,fS,fOP,fC)=>fF*10+fI*7,
  clinical_hours:(fF,fI,fT,fO,fS,fOP,fC)=>fF*8+fC*5,
  cert_pass_rate:(fF,fI,fT,fO,fS,fOP,fC)=>fF*11+fT*5,
  compliance_score:(fF,fI,fT,fO,fS,fOP,fC)=>fOP*10+fF*6,
  licencing_pct:(fF,fI,fT,fO,fS,fOP,fC)=>fF*9+fT*6,
  tech_cert_pct:(fF,fI,fT,fO,fS,fOP,fC)=>fT*10+fF*7,
  github_project_pct:(fF,fI,fT,fO,fS,fOP,fC)=>fT*9+fF*6,
  last_mile_placement:(fF,fI,fT,fO,fS,fOP,fC)=>fI*10+fO*6,
  vehicle_ops_cert:(fF,fI,fT,fO,fS,fOP,fC)=>fF*8+fC*5,
  sales_target_hit:(fF,fI,fT,fO,fS,fOP,fC)=>fI*11+fF*6,
  customer_handling:(fF,fI,fT,fO,fS,fOP,fC)=>fF*10+fS*5,
  site_readiness_pct:(fF,fI,fT,fO,fS,fOP,fC)=>fF*9+fC*6,
  soft_skills_score:(fF,fI,fT,fO,fS,fOP,fC)=>fF*10+fS*6,
  intl_placement_pct:(fF,fI,fT,fO,fS,fOP,fC)=>fI*9+fO*4,
  green_cert_pct:(fF,fI,fT,fO,fS,fOP,fC)=>fF*9+fT*5,
  solar_project_pct:(fF,fI,fT,fO,fS,fOP,fC)=>fT*8+fC*5,
  self_employ_pct:(fF,fI,fT,fO,fS,fOP,fC)=>fO*10+fS*7,
  client_sat_score:(fF,fI,fT,fO,fS,fOP,fC)=>fF*9+fS*6,
  classroom_utilisation:(fF,fI,fT,fO,fS,fOP,fC)=>fO*9+fC*5,
  attendance_rate:(fF,fI,fT,fO,fS,fOP,fC)=>fF*8+fS*7,
  lab_utilisation:(fF,fI,fT,fO,fS,fOP,fC)=>fC*10+fOP*6,
  practical_pass_rate:(fF,fI,fT,fO,fS,fOP,fC)=>fF*10+fC*5,
  module_completion_pct:(fF,fI,fT,fO,fS,fOP,fC)=>fT*9+fF*6,
  avg_session_time:(fF,fI,fT,fO,fS,fOP,fC)=>fT*7+fF*5,
  live_attendance_pct:(fF,fI,fT,fO,fS,fOP,fC)=>fF*9+fS*5,
  chat_engagement:(fF,fI,fT,fO,fS,fOP,fC)=>fT*8+fO*4,
  blended_completion:(fF,fI,fT,fO,fS,fOP,fC)=>fF*9+fT*7,
  offline_online_balance:(fF,fI,fT,fO,fS,fOP,fC)=>fOP*8+fT*6,
  community_reach_pct:(fF,fI,fT,fO,fS,fOP,fC)=>fO*11+fS*6,
  mobile_completion_pct:(fF,fI,fT,fO,fS,fOP,fC)=>fT*8+fF*6,
  csr_outcome_score:(fF,fI,fT,fO,fS,fOP,fC)=>fOP*9+fI*5,
  social_roi:(fF,fI,fT,fO,fS,fOP,fC)=>fI*8+fOP*6,
  mpr_compliance:(fF,fI,fT,fO,fS,fOP,fC)=>fOP*10+fF*5,
  scheme_utilisation:(fF,fI,fT,fO,fS,fOP,fC)=>fOP*9+fO*5,
  unit_economics_score:(fF,fI,fT,fO,fS,fOP,fC)=>fOP*10+fT*6,
  growth_velocity:(fF,fI,fT,fO,fS,fOP,fC)=>fO*9+fI*6,
  cash_flow_health:(fF,fI,fT,fO,fS,fOP,fC)=>fOP*10+fT*5,
  cost_efficiency:(fF,fI,fT,fO,fS,fOP,fC)=>fOP*9+fT*6,
  mission_alignment:(fF,fI,fT,fO,fS,fOP,fC)=>fI*8+fF*6,
  impact_reports:(fF,fI,fT,fO,fS,fOP,fC)=>fOP*0.6+fI*0.4,
};

// helper used by controller and blueprint
function getContextualExtras({sectors, fundingSource, deliveryMode, archetype}){
  const arch = ARCHETYPES.find(a=>a.id===archetype);
  const archKpiIds = new Set(arch.kpiPool.map(k=>k.id));
  const extras = [];
  const add = (kpi) => {
    if(!archKpiIds.has(kpi.id) && !extras.find(e=>e.id===kpi.id)) extras.push(kpi);
  };
  // 1. sector bonus (primary sector only, first available not in arch pool)
  const primarySector = sectors[0];
  const sectorBonuses = SECTOR_BONUS_KPIS[primarySector]||[];
  for(const k of sectorBonuses){ if(!archKpiIds.has(k.id)){ add(k); break; } }
  // 2. delivery bonus
  const deliveryBonuses = DELIVERY_BONUS_KPIS[deliveryMode]||[];
  for(const k of deliveryBonuses){ if(!archKpiIds.has(k.id) && !extras.find(e=>e.id===k.id)){ add(k); break; } }
  // 3. funding bonus (only if still < 2)
  if(extras.length < 2){
    const fundingBonuses = FUNDING_BONUS_KPIS[fundingSource]||[];
    for(const k of fundingBonuses){ if(!archKpiIds.has(k.id) && !extras.find(e=>e.id===k.id)){ add(k); break; } }
  }
  return extras.slice(0,2); // hard cap at 2
}

// =======================================================
//  sid-6a: ARCHETYPE KPI RECOMMENDATIONS
//  ~7 recommended KPIs per archetype (shown with ★ badge)
// =======================================================
const ARCHETYPE_KPI_RECS = {
  employment: [
    "placement_rate","retention_12","retention_24","soqs",
    "employer_repeat","employer_sat","avg_salary",
  ],
  inclusion: [
    "women_pct","rural_pct","marginalized_pct","completion_rate",
    "scholarship_pct","total_learners","placement_rate",
  ],
  financial: [
    "annual_revenue","ebitda_margin","cost_per_student","fee_recovery",
    "centre_utilisation","roi","breakeven_progress",
  ],
  innovation: [
    "online_learner_pct","digital_completion","microcred_pct","launch_time",
    "curriculum_refresh","return_upskill_pct","codesign_pct",
  ],
  premium: [
    "alumni_nps","employer_nps","tier1_placement","industry_exp_faculty",
    "tier1_partners","curriculum_endorsement","media_mentions",
  ],
};
export { ARCHETYPES, SECTORS, FUNDING_SOURCES, DELIVERY_MODES, REVENUE_MODELS, YEAR_EVENTS, getCadence, PARAMS, FUNDER_PERSONAS, PARAM_IMPACT_CARDS, computeLagPenalty, SECTOR_BONUS_KPIS, DELIVERY_BONUS_KPIS, FUNDING_BONUS_KPIS, EXTRA_KPI_DELTAS, getContextualExtras, ARCHETYPE_KPI_RECS };