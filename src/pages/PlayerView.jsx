import { useState } from "react"
import { useParams, Link, Navigate } from "react-router-dom"
import { MessageCircle, History, CalendarDays, Send } from "lucide-react"
import KpiCard from "../components/KpiCard"
import AcwrTrendChart from "../components/AcwrTrendChart"
import Abbr from "../components/Abbr"
import Modal from "../components/Modal"
import { useMessages } from "../context/MessagesContext"
import {
  getPlayer, getRiskMeta, generateAcwrSeries,
  daysSinceRestFor, getPlayerMessage, getMatchWeekPlan, borderClassForRisk,
} from "../data/players"

const acwrSubtitleForRisk = {
  high: "Above safe zone (0.8–1.3)",
  medium: "Approaching upper limit (0.8–1.3)",
  low: "Within safe zone (0.8–1.3)",
}

export default function PlayerView() {
  const { id } = useParams()
  const player = getPlayer(id)
  const { sendMessage } = useMessages()
  const [modal, setModal] = useState(null) // null | "message" | "plan"
  const [messageText, setMessageText] = useState("")
  const [sent, setSent] = useState(false)

  if (!player) return <Navigate to="/player-view/5" replace />

  const series = generateAcwrSeries(player)
  const meta = getRiskMeta(player.risk)
  const daysSinceRest = daysSinceRestFor(player)
  const firstName = player.name.split(" ")[0]

  const closeModal = () => {
    setModal(null)
    setSent(false)
    setMessageText("")
  }

  const submitMessage = async (e) => {
    e.preventDefault()
    if (!messageText.trim()) return
    await sendMessage(player.id, player.name, messageText.trim())
    setSent(true)
    setTimeout(closeModal, 1200)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Your load summary, {firstName}</h1>
        <p className="text-sm text-gray-500">Thursday, 12 March</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiCard
          label={<>Your <Abbr term="ACWR">ACWR</Abbr></>}
          value={player.acwr.toFixed(2)}
          valueClassName={meta.text}
          subtitle={acwrSubtitleForRisk[player.risk]}
        />
        <KpiCard label="This Week's Load" value={<>{player.sevenDayLoad.toLocaleString()} <Abbr term="AU">AU</Abbr></>} subtitle="7-day acute load" />
        <KpiCard
          label="Days Since Rest"
          value={daysSinceRest}
          subtitle={daysSinceRest >= 5 ? "Rest day recommended today" : "On track with recovery"}
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900">Your 28-Day <Abbr term="ACWR">ACWR</Abbr> Trend</h3>
        <AcwrTrendChart data={series} />
      </div>

      <div className={`rounded-xl border border-gray-200 border-l-4 ${borderClassForRisk(player.risk)} bg-white p-5 shadow-sm`}>
        <p className="text-sm leading-relaxed text-gray-700">{getPlayerMessage(player)}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to={`/player/${player.id}`}
            className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <History className="h-3.5 w-3.5" />
            View my full history
          </Link>
          <button
            onClick={() => setModal("message")}
            className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Message Dr. Sinéad
          </button>
          <button
            onClick={() => setModal("plan")}
            className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <CalendarDays className="h-3.5 w-3.5" />
            See match-week plan
          </button>
        </div>
      </div>

      {modal === "message" && (
        <Modal title={`Message Dr. Sinéad`} onClose={closeModal}>
          {sent ? (
            <p className="py-4 text-sm text-green-700">Message sent to Dr. Sinéad.</p>
          ) : (
            <form onSubmit={submitMessage} className="space-y-3">
              <textarea
                autoFocus
                rows={4}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Write a message to the medical team..."
                className="w-full rounded-lg border border-gray-300 p-2 text-sm text-gray-700 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
              >
                <Send className="h-3.5 w-3.5" />
                Send
              </button>
            </form>
          )}
        </Modal>
      )}

      {modal === "plan" && (
        <Modal title="Match-Week Plan" onClose={closeModal}>
          <ul className="divide-y divide-gray-100">
            {getMatchWeekPlan(player).map((d) => (
              <li key={d.day} className="py-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{d.day}</span>
                  <span className="text-sm text-gray-600">{d.session}</span>
                </div>
                <p className="text-xs text-gray-400">{d.note}</p>
              </li>
            ))}
          </ul>
        </Modal>
      )}
    </div>
  )
}
