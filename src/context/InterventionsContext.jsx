import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react"

const API_BASE = import.meta.env.VITE_API_URL || ""
const POLL_INTERVAL_MS = 5000

const InterventionsContext = createContext(null)

export function InterventionsProvider({ children }) {
  const [interventions, setInterventions] = useState([])
  const pollRef = useRef(null)

  const fetchInterventions = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/interventions`)
      if (!res.ok) throw new Error("Failed to load interventions")
      setInterventions(await res.json())
    } catch (err) {
      console.error(err)
    }
  }, [])

  useEffect(() => {
    fetchInterventions()
    pollRef.current = setInterval(fetchInterventions, POLL_INTERVAL_MS)
    return () => clearInterval(pollRef.current)
  }, [fetchInterventions])

  const addIntervention = async (playerId, role, text) => {
    const res = await fetch(`${API_BASE}/api/interventions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId, role, text }),
    })
    const created = await res.json()
    setInterventions((prev) => [...prev, created])
  }

  const updateIntervention = async (id, text) => {
    setInterventions((prev) => prev.map((item) => (item.id === id ? { ...item, text } : item)))
    await fetch(`${API_BASE}/api/interventions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })
  }

  const removeIntervention = async (id) => {
    setInterventions((prev) => prev.filter((item) => item.id !== id))
    await fetch(`${API_BASE}/api/interventions/${id}`, { method: "DELETE" })
  }

  return (
    <InterventionsContext.Provider value={{ interventions, addIntervention, updateIntervention, removeIntervention }}>
      {children}
    </InterventionsContext.Provider>
  )
}

export function useInterventions() {
  const ctx = useContext(InterventionsContext)
  if (!ctx) throw new Error("useInterventions must be used within InterventionsProvider")
  return ctx
}
