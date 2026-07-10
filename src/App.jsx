import { Routes, Route, Navigate } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import Header from "./components/Header"
import CoachView from "./pages/CoachView"
import MedicalView from "./pages/MedicalView"
import SportsScienceView from "./pages/SportsScienceView"
import PlayerView from "./pages/PlayerView"
import PlayerProfile from "./pages/PlayerProfile"
import DataGovernance from "./pages/DataGovernance"
import { InterventionsProvider } from "./context/InterventionsContext"
import { MessagesProvider } from "./context/MessagesContext"
import { ConsentProvider } from "./context/ConsentContext"

export default function App() {
  return (
    <InterventionsProvider>
      <MessagesProvider>
        <ConsentProvider>
          <div className="min-h-screen bg-white">
            <Sidebar />
            <div className="ml-[220px] flex min-h-screen flex-col">
              <Header />
              <main className="flex-1 bg-[#f9fafb] p-6">
                <Routes>
                  <Route path="/" element={<CoachView />} />
                  <Route path="/medical" element={<MedicalView />} />
                  <Route path="/sports-science" element={<SportsScienceView />} />
                  <Route path="/player-view" element={<Navigate to="/player-view/5" replace />} />
                  <Route path="/player-view/:id" element={<PlayerView />} />
                  <Route path="/player/:id" element={<PlayerProfile />} />
                  <Route path="/governance" element={<DataGovernance />} />
                </Routes>
              </main>
            </div>
          </div>
        </ConsentProvider>
      </MessagesProvider>
    </InterventionsProvider>
  )
}
