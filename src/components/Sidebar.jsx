import { Link, useLocation, useNavigate, matchPath } from "react-router-dom"
import { Activity, Shield, TriangleAlert } from "lucide-react"
import { players, getRiskMeta, initialsOf, avatarColorFor } from "../data/players"

const personaByPath = {
  "/": "Coach Dashboard · Tomás",
  "/medical": "Medical Dashboard · Dr. Sinéad",
  "/sports-science": "Sports Science Dashboard · Aoife",
}

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const playerViewMatch = matchPath("/player-view/:id", location.pathname)
  const persona = personaByPath[location.pathname] ?? "Player Dashboard"

  return (
    <aside className="fixed left-0 top-0 h-screen w-[220px] shrink-0 border-r border-gray-200 bg-white flex flex-col">
      <div className="px-4 pt-5 pb-4 border-b border-gray-200">
        <Link to="/" className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-green-600" strokeWidth={2.5} />
          <span className="font-bold text-gray-900 leading-tight">PlaySafe Analytics</span>
        </Link>
        {playerViewMatch ? (
          <div className="mt-2 flex flex-wrap items-center gap-1 text-xs text-gray-500 leading-snug">
            <span>Player Dashboard ·</span>
            <select
              value={playerViewMatch.params.id}
              onChange={(e) => navigate(`/player-view/${e.target.value}`)}
              className="cursor-pointer rounded border-none bg-transparent p-0 text-xs font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-green-600"
            >
              {players.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p className="mt-2 text-xs text-gray-500 leading-snug">{persona}</p>
        )}
      </div>

      <div className="px-4 pt-4 pb-2">
        <h2 className="text-xs font-semibold tracking-wider text-gray-400">SQUAD</h2>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 space-y-1 pb-2">
        {players.map((player) => {
          const meta = getRiskMeta(player.risk)
          const active = location.pathname === `/player/${player.id}`
          return (
            <Link
              key={player.id}
              to={`/player/${player.id}`}
              className={`flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-gray-50 transition-colors ${
                active ? "bg-gray-50 ring-1 ring-gray-200" : ""
              }`}
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: avatarColorFor(player.id) }}
              >
                {initialsOf(player.name)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-gray-900">{player.name}</span>
                <span className="block truncate text-xs text-gray-500">{player.position}</span>
              </span>
              <span
                className={`flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-mono font-semibold ${meta.badgeBg} ${meta.badgeText}`}
                title={`${meta.label} — Acute:Chronic Workload Ratio ${player.acwr.toFixed(2)}`}
              >
                {meta.warn && <TriangleAlert className="h-2.5 w-2.5" />}
                {player.acwr.toFixed(2)}
              </span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-gray-200 p-3">
        <Link
          to="/governance"
          className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <Shield className="h-4 w-4" />
          Data Governance
        </Link>
      </div>
    </aside>
  )
}
