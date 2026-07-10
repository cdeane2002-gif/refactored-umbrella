import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react"

const API_BASE = import.meta.env.VITE_API_URL || ""
const POLL_INTERVAL_MS = 5000

const ConsentContext = createContext(null)

export function ConsentProvider({ children }) {
  const [consent, setConsentState] = useState({})
  const pollRef = useRef(null)

  const fetchConsent = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/consent`)
      if (!res.ok) throw new Error("Failed to load consent")
      setConsentState(await res.json())
    } catch (err) {
      console.error(err)
    }
  }, [])

  useEffect(() => {
    fetchConsent()
    pollRef.current = setInterval(fetchConsent, POLL_INTERVAL_MS)
    return () => clearInterval(pollRef.current)
  }, [fetchConsent])

  const setConsent = async (playerId, value) => {
    setConsentState((prev) => ({ ...prev, [playerId]: value }))
    await fetch(`${API_BASE}/api/consent/${playerId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ consent: value }),
    })
  }

  // Missing entry defaults to opted-in, matching the backend's default.
  const isConsented = (playerId) => consent[playerId] !== false

  return (
    <ConsentContext.Provider value={{ isConsented, setConsent }}>
      {children}
    </ConsentContext.Provider>
  )
}

export function useConsent() {
  const ctx = useContext(ConsentContext)
  if (!ctx) throw new Error("useConsent must be used within ConsentProvider")
  return ctx
}
