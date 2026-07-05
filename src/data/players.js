export const players = [
  { id: 1, name: "James Mitchell",  position: "Prop",       acwr: 1.33, risk: "high",   available: false, sevenDayLoad: 3180, chronicLoad: 2391, injuryDays: 0, rtpReady: false },
  { id: 2, name: "Connor O'Brien",  position: "Hooker",     acwr: 0.94, risk: "low",    available: true,  sevenDayLoad: 2250, chronicLoad: 2394, injuryDays: 0, rtpReady: true  },
  { id: 3, name: "Marcus Williams", position: "Lock",       acwr: 1.28, risk: "medium", available: true,  sevenDayLoad: 3070, chronicLoad: 2398, injuryDays: 0, rtpReady: true  },
  { id: 4, name: "Ryan Thompson",   position: "Flanker",    acwr: 1.05, risk: "low",    available: true,  sevenDayLoad: 2520, chronicLoad: 2400, injuryDays: 0, rtpReady: true  },
  { id: 5, name: "Ciarán Murphy",   position: "Number 8",   acwr: 1.36, risk: "high",   available: false, sevenDayLoad: 3260, chronicLoad: 2397, injuryDays: 0, rtpReady: false },
  { id: 6, name: "Jake Patterson",  position: "Scrum-half", acwr: 0.88, risk: "low",    available: true,  sevenDayLoad: 2110, chronicLoad: 2398, injuryDays: 0, rtpReady: true  },
  { id: 7, name: "Seán O'Sullivan", position: "Fly-half",   acwr: 1.11, risk: "low",    available: true,  sevenDayLoad: 2660, chronicLoad: 2396, injuryDays: 0, rtpReady: true  },
  { id: 8, name: "Ethan Roberts",   position: "Centre",     acwr: 0.97, risk: "low",    available: true,  sevenDayLoad: 2320, chronicLoad: 2392, injuryDays: 4, rtpReady: false },
  { id: 9, name: "Padraig Kelly",   position: "Wing",       acwr: 1.19, risk: "medium", available: true,  sevenDayLoad: 2850, chronicLoad: 2395, injuryDays: 0, rtpReady: true  },
  { id: 10, name: "Samuel Taylor",  position: "Fullback",   acwr: 1.22, risk: "medium", available: true,  sevenDayLoad: 2930, chronicLoad: 2401, injuryDays: 0, rtpReady: true  },
]

export const getPlayer = (id) => players.find((p) => p.id === Number(id))

// Risk styling, single source of truth so sidebar badges, KPI cards, and
// charts can never disagree with each other.
export const riskMeta = {
  low:    { label: "Low Risk",    short: "Low",    color: "#16a34a", bg: "bg-green-50",  border: "border-green-600",  text: "text-green-700",  badgeBg: "bg-green-100",  badgeText: "text-green-800",  warn: false },
  medium: { label: "Medium Risk", short: "Medium", color: "#d97706", bg: "bg-amber-50",  border: "border-amber-600",  text: "text-amber-700",  badgeBg: "bg-amber-100",  badgeText: "text-amber-800",  warn: true },
  high:   { label: "High Risk",   short: "High",   color: "#dc2626", bg: "bg-red-50",    border: "border-red-600",   text: "text-red-700",    badgeBg: "bg-red-100",    badgeText: "text-red-800",    warn: true },
}

export const getRiskMeta = (risk) => riskMeta[risk] ?? riskMeta.low

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
  { model: "Logistic Regression", accuracy: 0.71, recall: 0.58, precision: 0.63, auc: 0.74, selected: false },
  { model: "Random Forest", accuracy: 0.79, recall: 0.71, precision: 0.68, auc: 0.81, selected: false },
  { model: "XGBoost", accuracy: 0.82, recall: 0.78, precision: 0.71, auc: 0.85, selected: true },
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
