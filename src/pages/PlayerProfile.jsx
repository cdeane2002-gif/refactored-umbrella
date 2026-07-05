import { useParams, Link, Navigate } from "react-router-dom"
import { ArrowLeft, TriangleAlert, Users, Stethoscope, FlaskConical } from "lucide-react"
import KpiCard from "../components/KpiCard"
import AcwrTrendChart from "../components/AcwrTrendChart"
import Abbr from "../components/Abbr"
import { PlayerRoleRecommendations } from "../components/RecommendationsPanel"
import { getPlayer, getRiskMeta, initialsOf, avatarColorFor, generateAcwrSeries, generateSessionHistory } from "../data/players"

const daysSinceRestFor = (player) => {
  if (player.id === 5) return 6
  if (player.risk === "high") return 6
  if (player.risk === "medium") return 3
  return 1
}

export default function PlayerProfile() {
  const { id } = useParams()
  const player = getPlayer(id)

  if (!player) return <Navigate to="/" replace />

  const meta = getRiskMeta(player.risk)
  const series = generateAcwrSeries(player)
  const sessions = generateSessionHistory(player)

  return (
    <div className="space-y-6">
      <div>
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
      </div>

      <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-semibold text-white"
          style={{ backgroundColor: avatarColorFor(player.id) }}
        >
          {initialsOf(player.name)}
        </span>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-gray-900">{player.name}</h1>
          <p className="text-sm text-gray-500">{player.position}</p>
        </div>
        <span className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-mono font-semibold ${meta.badgeBg} ${meta.badgeText}`}>
          {meta.warn && <TriangleAlert className="h-4 w-4" />}
          <Abbr term="ACWR">ACWR</Abbr> {player.acwr.toFixed(2)} · {meta.label}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiCard label={<>Current <Abbr term="ACWR">ACWR</Abbr></>} value={player.acwr.toFixed(2)} valueClassName={meta.text} />
        <KpiCard label="7-Day Acute Load" value={<>{player.sevenDayLoad.toLocaleString()} <Abbr term="AU">AU</Abbr></>} />
        <KpiCard label="Days Since Last Rest" value={daysSinceRestFor(player)} />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900">28-Day <Abbr term="ACWR">ACWR</Abbr> Trend</h3>
        <AcwrTrendChart data={series} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <PlayerRoleRecommendations
          playerId={player.id}
          role="coach"
          title="Coach Recommendations"
          icon={Users}
          colorClass="text-green-600"
          emptyText="No coaching note logged yet — add one below."
          addLabel="Add coaching note"
        />
        <PlayerRoleRecommendations
          playerId={player.id}
          role="medical"
          title="Medical Recommendations"
          icon={Stethoscope}
          colorClass="text-red-600"
          emptyText="No medical note logged yet — add one below."
          addLabel="Add medical note"
        />
        <PlayerRoleRecommendations
          playerId={player.id}
          role="sportsScience"
          title="Sports Science Recommendations"
          icon={FlaskConical}
          colorClass="text-blue-600"
          emptyText="No sports science note logged yet — add one below."
          addLabel="Add sports science note"
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900">Session History — Last 7 Days</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-400">
                <th className="py-2 pr-4 font-medium">Date</th>
                <th className="py-2 pr-4 font-medium">Session Type</th>
                <th className="py-2 pr-4 font-medium">Load (<Abbr term="AU">AU</Abbr>)</th>
                <th className="py-2 pr-4 font-medium">Duration</th>
                <th className="py-2 pr-4 font-medium"><Abbr term="RPE">RPE</Abbr></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sessions.map((s) => (
                <tr key={s.date}>
                  <td className="py-3 pr-4 text-gray-600">{s.date}</td>
                  <td className="py-3 pr-4 font-medium text-gray-900">{s.type}</td>
                  <td className="py-3 pr-4 font-mono text-gray-600">{s.type === "Rest" ? "—" : s.load}</td>
                  <td className="py-3 pr-4 font-mono text-gray-600">{s.type === "Rest" ? "—" : `${s.duration} min`}</td>
                  <td className="py-3 pr-4 font-mono text-gray-600">{s.type === "Rest" ? "—" : `${s.rpe}/10`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
