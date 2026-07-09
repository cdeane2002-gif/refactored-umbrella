import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, LabelList,
  LineChart, Line, Legend, ResponsiveContainer,
} from "recharts"
import KpiCard from "../components/KpiCard"
import RecommendationsPanel from "../components/RecommendationsPanel"
import Abbr from "../components/Abbr"
import { players, squadSummary, riskDistribution, workloadTrend } from "../data/players"

function RiskDistributionTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { key, name, color } = payload[0].payload
  const matchingPlayers = players.filter((p) => p.risk === key)

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-md">
      <p className="text-xs font-semibold" style={{ color }}>
        {name} ({matchingPlayers.length})
      </p>
      <ul className="mt-1.5 space-y-0.5">
        {matchingPlayers.map((p) => (
          <li key={p.id} className="text-xs text-gray-600">
            {p.name} <span className="text-gray-400">({p.position})</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function CoachView() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiCard
          label="Total Squad"
          value={squadSummary.total}
          subtitle={`${squadSummary.available} available · ${squadSummary.highRiskUnavailable} injury risk`}
        />
        <KpiCard label="High Risk Players" value={2} valueClassName="text-red-600" subtitle="Require intervention" />
        <KpiCard
          label={<>Squad Average <Abbr term="ACWR">ACWR</Abbr></>}
          value={squadSummary.averageAcwr.toFixed(2)}
          valueClassName="text-green-600"
          subtitle="Optimal: 0.8–1.3 (Gabbett 2016)"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900">Risk Level Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={riskDistribution} layout="vertical" margin={{ top: 8, right: 40, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={[0, 6]} ticks={[0, 2, 4, 6]} tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 12 }} />
              <Tooltip content={<RiskDistributionTooltip />} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={28}>
                {riskDistribution.map((entry) => (
                  <Cell key={entry.key} fill={entry.color} />
                ))}
                <LabelList dataKey="count" position="right" formatter={(v) => `${v} players`} style={{ fontSize: 12, fill: "#374151" }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900">Acute vs Chronic Workload Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={workloadTrend} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 3500]} tick={{ fontSize: 12 }} label={{ value: "Load (AU)", angle: -90, position: "insideLeft", fontSize: 12 }} />
              <Tooltip />
              <Legend verticalAlign="bottom" height={48} wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="acute" name="7-Day Acute Load" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="chronic" name="28-Day Chronic Avg" stroke="#7c3aed" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="threshold" name="Safe zone upper limit (ACWR 1.3)" stroke="#dc2626" strokeWidth={2} strokeDasharray="6 4" dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <p className="mt-1 text-xs text-gray-400">
            Acute load remains above chronic load across the week, consistent with a squad average <Abbr term="ACWR">ACWR</Abbr> of {squadSummary.averageAcwr.toFixed(2)}.
          </p>
        </div>
      </div>

      <RecommendationsPanel
        role="coach"
        title="Coaching Interventions Required"
        emptyText="No coaching interventions logged yet — add one below."
        addLabel="Add coaching note"
        borderClass="border-l-red-600"
      />
    </div>
  )
}
