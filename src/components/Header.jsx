import { NavLink } from "react-router-dom"
import { Clock } from "lucide-react"

const tabs = [
  { to: "/", label: "Coach View" },
  { to: "/medical", label: "Medical View" },
  { to: "/sports-science", label: "Sports Science" },
  { to: "/player-view", label: "Player View" },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
      <nav className="flex gap-1 rounded-full bg-gray-100 p-1">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === "/"}
            className={({ isActive }) =>
              `rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                isActive ? "bg-green-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
      <div className="flex items-center gap-1.5 text-sm text-gray-500">
        <Clock className="h-4 w-4" />
        <span>
          Last updated: <span className="font-mono">Today, 09:14</span>
        </span>
      </div>
    </header>
  )
}
