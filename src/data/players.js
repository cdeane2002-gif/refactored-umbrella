export const players = [
  { id: 1, name: "James Mitchell",  position: "Prop",       acwr: 1.33, risk: "high",   available: false, sevenDayLoad: 3180, chronicLoad: 2391, injuryDays: 0, rtpReady: false, heightCm: 183, weightKg: 118 },
  { id: 2, name: "Connor O'Brien",  position: "Hooker",     acwr: 0.94, risk: "low",    available: true,  sevenDayLoad: 2250, chronicLoad: 2394, injuryDays: 0, rtpReady: true,  heightCm: 180, weightKg: 108 },
  { id: 3, name: "Marcus Williams", position: "Lock",       acwr: 1.28, risk: "medium", available: true,  sevenDayLoad: 3070, chronicLoad: 2398, injuryDays: 0, rtpReady: true,  heightCm: 201, weightKg: 128 },
  { id: 4, name: "Ryan Thompson",   position: "Flanker",    acwr: 1.05, risk: "low",    available: true,  sevenDayLoad: 2520, chronicLoad: 2400, injuryDays: 0, rtpReady: true,  heightCm: 190, weightKg: 104 },
  { id: 5, name: "Ciarán Murphy",   position: "Number 8",   acwr: 1.36, risk: "high",   available: false, sevenDayLoad: 3260, chronicLoad: 2397, injuryDays: 0, rtpReady: false, heightCm: 193, weightKg: 113 },
  { id: 6, name: "Jake Patterson",  position: "Scrum-half", acwr: 0.88, risk: "low",    available: true,  sevenDayLoad: 2110, chronicLoad: 2398, injuryDays: 0, rtpReady: true,  heightCm: 173, weightKg: 75  },
  { id: 7, name: "Seán O'Sullivan", position: "Fly-half",   acwr: 1.11, risk: "low",    available: true,  sevenDayLoad: 2660, chronicLoad: 2396, injuryDays: 0, rtpReady: true,  heightCm: 181, weightKg: 91  },
  { id: 8, name: "Ethan Roberts",   position: "Centre",     acwr: 0.97, risk: "low",    available: true,  sevenDayLoad: 2320, chronicLoad: 2392, injuryDays: 4, rtpReady: false, heightCm: 186, weightKg: 99  },
  { id: 9, name: "Padraig Kelly",   position: "Wing",       acwr: 1.19, risk: "medium", available: true,  sevenDayLoad: 2850, chronicLoad: 2395, injuryDays: 0, rtpReady: true,  heightCm: 187, weightKg: 93  },
  { id: 10, name: "Samuel Taylor",  position: "Fullback",   acwr: 1.22, risk: "medium", available: true,  sevenDayLoad: 2930, chronicLoad: 2401, injuryDays: 0, rtpReady: true,  heightCm: 184, weightKg: 95  },
]

export const getPlayer = (id) => players.find((p) => p.id === Number(id))

// Typical elite senior men's rugby union target weight range by position (kg) —
// used only as an illustrative reference band, not a clinical prescription.
const idealWeightRangeByPosition = {
  "Prop": [115, 125],
  "Hooker": [105, 115],
  "Lock": [115, 125],
  "Flanker": [100, 110],
  "Number 8": [108, 118],
  "Scrum-half": [78, 88],
  "Fly-half": [86, 95],
  "Centre": [95, 105],
  "Wing": [88, 98],
  "Fullback": [90, 100],
}

export const getIdealWeightRange = (position) => idealWeightRangeByPosition[position] ?? [90, 105]

export const getWeightStatus = (player) => {
  const [min, max] = getIdealWeightRange(player.position)
  if (player.weightKg < min) {
    return { label: "Below target range", badgeBg: "bg-amber-100", badgeText: "text-amber-800" }
  }
  if (player.weightKg > max) {
    return { label: "Above target range", badgeBg: "bg-amber-100", badgeText: "text-amber-800" }
  }
  return { label: "Within target range", badgeBg: "bg-green-100", badgeText: "text-green-800" }
}

// Risk styling, single source of truth so sidebar badges, KPI cards, and
// charts can never disagree with each other.
export const riskMeta = {
  low:    { label: "Low Risk",    short: "Low",    color: "#16a34a", bg: "bg-green-50",  border: "border-green-600",  text: "text-green-700",  badgeBg: "bg-green-100",  badgeText: "text-green-800",  warn: false },
  medium: { label: "Medium Risk", short: "Medium", color: "#d97706", bg: "bg-amber-50",  border: "border-amber-600",  text: "text-amber-700",  badgeBg: "bg-amber-100",  badgeText: "text-amber-800",  warn: true },
  high:   { label: "High Risk",   short: "High",   color: "#dc2626", bg: "bg-red-50",    border: "border-red-600",   text: "text-red-700",    badgeBg: "bg-red-100",    badgeText: "text-red-800",    warn: true },
}

export const getRiskMeta = (risk) => riskMeta[risk] ?? riskMeta.low

export const borderClassForRisk = (risk) =>
  risk === "high" ? "border-l-red-600" : risk === "medium" ? "border-l-amber-600" : "border-l-green-600"

export const daysSinceRestFor = (player) => {
  if (player.id === 5) return 6
  if (player.risk === "high") return 6
  if (player.risk === "medium") return 3
  return 1
}

// Plain-language welfare message for the Player View, tiered by risk level —
// deliberately free of clinical jargon per the Player persona's design brief.
export const getPlayerMessage = (player) => {
  if (player.risk === "high") {
    return "Your training load this week is higher than your body's usual baseline. Your coach and medical team have been notified. We'd suggest a lighter session on Tuesday and a full rest day on Wednesday before reassessing for Saturday's match. You're doing great work — rest is part of the plan."
  }
  if (player.risk === "medium") {
    return "Your training load this week is a little higher than usual, but nothing to be concerned about. Keep an eye on how your body is recovering, get good sleep, and flag anything unusual to your medical team. You're on track for the weekend."
  }
  return "Your training load this week is right where it should be. Keep up your current routine, stay on top of the basics like sleep and hydration, and you're in good shape for the weekend. Well done."
}

const modifiedMatchWeekPlan = [
  { day: "Monday", session: "Skills — moderate", note: "Standard technical session" },
  { day: "Tuesday", session: "Reduced contact (-20%)", note: "Lighter load per current ACWR" },
  { day: "Wednesday", session: "Rest day", note: "Full recovery, no training" },
  { day: "Thursday", session: "Reassessment", note: "ACWR reviewed before selection" },
  { day: "Friday", session: "Light captain's run", note: "Low-intensity, match preparation" },
  { day: "Saturday", session: "Match day", note: "Subject to Thursday reassessment" },
  { day: "Sunday", session: "Recovery", note: "Pool session / mobility work" },
]

const standardMatchWeekPlan = [
  { day: "Monday", session: "Skills", note: "Standard technical session" },
  { day: "Tuesday", session: "Full training", note: "Normal contact and conditioning" },
  { day: "Wednesday", session: "Recovery", note: "Light mobility / pool session" },
  { day: "Thursday", session: "Captain's run", note: "Match preparation" },
  { day: "Friday", session: "Light session", note: "Low-intensity, match preparation" },
  { day: "Saturday", session: "Match day", note: "Ready to go" },
  { day: "Sunday", session: "Recovery", note: "Pool session / mobility work" },
]

export const getMatchWeekPlan = (player) => (player.risk === "high" ? modifiedMatchWeekPlan : standardMatchWeekPlan)

export const initialsOf = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .filter((c) => /[A-Za-z]/.test(c))
    .slice(0, 2)
    .join("")
    .toUpperCase()

const avatarPalette = ["#16a34a", "#0891b2", "#7c3aed", "#d97706", "#dc2626", "#2563eb", "#0d9488", "#c026d3", "#65a30d", "#4338ca"]
export const avatarColorFor = (id) => avatarPalette[(id - 1) % avatarPalette.length]

export const squadSummary = {
  total: players.length,
  available: players.filter((p) => p.available).length,
  highRiskUnavailable: players.filter((p) => p.risk === "high" && !p.available).length,
  averageAcwr: Number((players.reduce((sum, p) => sum + p.acwr, 0) / players.length).toFixed(2)),
}

export const riskDistribution = [
  { name: "Low Risk", key: "low", count: players.filter((p) => p.risk === "low").length, color: riskMeta.low.color },
  { name: "Medium Risk", key: "medium", count: players.filter((p) => p.risk === "medium").length, color: riskMeta.medium.color },
  { name: "High Risk", key: "high", count: players.filter((p) => p.risk === "high").length, color: riskMeta.high.color },
]

// 7-day acute vs 28-day chronic workload trend for the Coach View.
export const workloadTrend = [
  { date: "Mar 6",  acute: 2600, chronic: 2400, threshold: 3200 },
  { date: "Mar 7",  acute: 2750, chronic: 2420, threshold: 3200 },
  { date: "Mar 8",  acute: 2880, chronic: 2430, threshold: 3200 },
  { date: "Mar 9",  acute: 2950, chronic: 2440, threshold: 3200 },
  { date: "Mar 10", acute: 3020, chronic: 2450, threshold: 3200 },
  { date: "Mar 11", acute: 3080, chronic: 2460, threshold: 3200 },
  { date: "Mar 12", acute: 3140, chronic: 2470, threshold: 3200 },
]

export const rtpTable = [
  { playerId: 1, name: "James Mitchell", injury: "Overuse — knee", days: 0, daysNote: "(load risk)", criteriaMet: "Partial", status: "Monitoring" },
  { playerId: 5, name: "Ciarán Murphy", injury: "Overuse — hamstring", days: 0, daysNote: "(load risk)", criteriaMet: "No", status: "Not cleared" },
  { playerId: 8, name: "Ethan Roberts", injury: "Ankle sprain", days: 4, daysNote: "", criteriaMet: "Yes", status: "Medical clearance pending" },
]

export const statusMeta = {
  "Cleared": { bg: "bg-green-100", text: "text-green-800" },
  "Monitoring": { bg: "bg-amber-100", text: "text-amber-800" },
  "Not cleared": { bg: "bg-red-100", text: "text-red-800" },
  "Medical clearance pending": { bg: "bg-amber-100", text: "text-amber-800" },
}

export const clinicalRiskFlags = [
  { playerId: 5, name: "Ciarán Murphy", probability: 74, level: "high" },
  { playerId: 1, name: "James Mitchell", probability: 68, level: "high" },
  { playerId: 3, name: "Marcus Williams", probability: 41, level: "medium" },
]

export const rtpCriteria = [
  "ACWR returned to 0.8–1.3 range for ≥ 5 consecutive days",
  "Full contact training completed without adverse reaction",
  "Team doctor sign-off required before match selection",
  "GPS load metrics within 10% of pre-injury baseline",
]

export const featureImportance = [
  { feature: "ACWR", value: 42 },
  { feature: "Cumulative Season Load", value: 23 },
  { feature: "Days Since Rest", value: 16 },
  { feature: "Session RPE", value: 11 },
  { feature: "Sleep Hours", value: 8 },
]

export const positionGroups = [
  { group: "Forwards (5 players)", avgAcwr: 1.19, avgLoad: 2882, highRisk: 2 },
  { group: "Backs (5 players)", avgAcwr: 1.07, avgLoad: 2574, highRisk: 0 },
]

export const modelComparison = [
  { model: "Logistic Regression", accuracy: 0.736, recall: 0.574, precision: 0.146, f1: 0.233, auc: 0.686, selected: true },
  { model: "Random Forest", accuracy: 0.865, recall: 0.178, precision: 0.139, f1: 0.156, auc: 0.668, selected: false },
  { model: "XGBoost", accuracy: 0.90, recall: 0.107, precision: 0.168, f1: 0.131, auc: 0.665, selected: false },
]

// Deterministic 28-day ACWR trend ending exactly at the player's current
// ACWR, so the chart and the KPI card can never contradict each other.
export const generateAcwrSeries = (player) => {
  const days = 28
  const rampStart = days - 5
  const base = Math.max(0.85, Math.min(1.1, player.acwr - 0.25))
  const series = []
  let anchor = base

  for (let i = 0; i < days; i++) {
    if (i < rampStart) {
      const wave = Math.sin((i + player.id * 3) / 3.2) * 0.05
      const value = base + wave
      series.push(value)
      anchor = value
    } else if (i === days - 1) {
      series.push(player.acwr)
    } else {
      const t = (i - rampStart + 1) / (days - rampStart)
      series.push(anchor + t * (player.acwr - anchor))
    }
  }

  return series.map((v, i) => ({
    day: i + 1,
    label: i % 7 === 0 ? `Week ${Math.floor(i / 7) + 1}` : "",
    acwr: Number(v.toFixed(2)),
  }))
}

const sessionTemplate = [
  { date: "Mar 12", type: "Match", load: 680, duration: 80, rpe: 8 },
  { date: "Mar 11", type: "Recovery", load: 210, duration: 30, rpe: 3 },
  { date: "Mar 10", type: "Skills", load: 490, duration: 60, rpe: 6 },
  { date: "Mar 9", type: "Strength", load: 520, duration: 65, rpe: 7 },
  { date: "Mar 8", type: "Rest", load: 0, duration: 0, rpe: 0 },
  { date: "Mar 7", type: "Contact", load: 610, duration: 75, rpe: 8 },
  { date: "Mar 6", type: "Conditioning", load: 550, duration: 70, rpe: 7 },
]

const referenceLoad = 3260 // Ciarán Murphy's 7-day acute load, used as the scaling baseline

export const generateSessionHistory = (player) => {
  const scale = player.sevenDayLoad / referenceLoad
  return sessionTemplate.map((s) => ({
    ...s,
    load: s.load === 0 ? 0 : Math.round((s.load * scale) / 10) * 10,
    duration: s.duration === 0 ? 0 : Math.round(s.duration * Math.min(1.15, Math.max(0.85, scale))),
  }))
}
