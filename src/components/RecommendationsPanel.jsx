import { useState } from "react"
import { Pencil, Check, X, Trash2 } from "lucide-react"
import { useInterventions } from "../context/InterventionsContext"
import { players, getRiskMeta } from "../data/players"
import Abbr from "./Abbr"
import { linkifyAbbreviations } from "../utils/linkifyAbbreviations"

function EntryRow({ item, showPlayerMeta = true }) {
  const { updateIntervention, removeIntervention } = useInterventions()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(item.text)
  const player = players.find((p) => p.id === item.playerId)

  if (!player) return null
  const meta = getRiskMeta(player.risk)

  const save = () => {
    if (!draft.trim()) return
    updateIntervention(item.id, draft.trim())
    setEditing(false)
  }

  return (
    <div className="py-3 first:pt-0 last:pb-0">
      {showPlayerMeta && (
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-900">{player.name}</span>
          <span className="text-xs text-gray-500">{player.position}</span>
          <span className="font-mono text-xs font-semibold" style={{ color: meta.color }}>
            <Abbr term="ACWR">ACWR</Abbr> {player.acwr.toFixed(2)}
          </span>
        </div>
      )}

      {editing ? (
        <div className="space-y-2">
          <textarea
            autoFocus
            rows={2}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2 text-sm text-gray-700 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
          />
          <div className="flex gap-2">
            <button
              onClick={save}
              className="flex items-center gap-1 rounded-md bg-green-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-green-700"
            >
              <Check className="h-3 w-3" /> Save
            </button>
            <button
              onClick={() => {
                setDraft(item.text)
                setEditing(false)
              }}
              className="flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              <X className="h-3 w-3" /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm leading-relaxed text-gray-700">{linkifyAbbreviations(item.text)}</p>
          <div className="flex shrink-0 gap-1">
            <button
              onClick={() => setEditing(true)}
              aria-label="Edit recommendation"
              className="rounded p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => removeIntervention(item.id)}
              aria-label="Remove recommendation"
              className="rounded p-1 text-gray-400 hover:bg-gray-50 hover:text-red-600"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function AddForm({ role, buttonLabel, fixedPlayerId }) {
  const { addIntervention } = useInterventions()
  const [playerId, setPlayerId] = useState(fixedPlayerId ?? players[0].id)
  const [text, setText] = useState("")

  const submit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    addIntervention(Number(fixedPlayerId ?? playerId), role, text.trim())
    setText("")
  }

  return (
    <form onSubmit={submit} className={fixedPlayerId ? "mt-3 space-y-2" : "mt-4 space-y-2 border-t border-gray-100 pt-4"}>
      {!fixedPlayerId && (
        <select
          value={playerId}
          onChange={(e) => setPlayerId(e.target.value)}
          className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm text-gray-700 focus:border-green-600 focus:outline-none"
        >
          {players.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — {p.position}
            </option>
          ))}
        </select>
      )}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
        placeholder="Write a recommendation for this player..."
        className="w-full rounded-lg border border-gray-300 p-2 text-sm text-gray-700 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
      />
      <button
        type="submit"
        className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
      >
        {buttonLabel}
      </button>
    </form>
  )
}

// Squad-wide panel used on the Coach / Medical / Sports Science views —
// lists every recommendation logged for a given role, across all players.
export default function RecommendationsPanel({ role, title, emptyText, addLabel, borderClass = "border-l-gray-300" }) {
  const { interventions } = useInterventions()
  const items = interventions.filter((i) => i.role === role)

  return (
    <div className={`rounded-xl border border-gray-200 border-l-4 ${borderClass} bg-white p-5 shadow-sm`}>
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-2 text-sm italic text-gray-400">{emptyText}</p>
      ) : (
        <div className="mt-2 divide-y divide-gray-100">
          {items.map((item) => (
            <EntryRow key={item.id} item={item} />
          ))}
        </div>
      )}
      <AddForm role={role} buttonLabel={addLabel} />
    </div>
  )
}

// Per-player card used on the Player Profile — scoped to one player and one
// role, so a coach/medical/sports-science note can be added or edited inline.
export function PlayerRoleRecommendations({ playerId, role, title, icon: Icon, colorClass, emptyText, addLabel }) {
  const { interventions } = useInterventions()
  const items = interventions.filter((i) => i.playerId === playerId && i.role === role)

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        {Icon && <Icon className={`h-4 w-4 ${colorClass}`} />}
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      {items.length === 0 && <p className="mt-2 text-sm italic text-gray-400">{emptyText}</p>}
      {items.length > 0 && (
        <div className="mt-2 divide-y divide-gray-100">
          {items.map((item) => (
            <EntryRow key={item.id} item={item} showPlayerMeta={false} />
          ))}
        </div>
      )}
      <AddForm role={role} buttonLabel={addLabel} fixedPlayerId={playerId} />
    </div>
  )
}
