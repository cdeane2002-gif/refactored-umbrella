import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react"

const API_BASE = import.meta.env.VITE_API_URL || ""
const POLL_INTERVAL_MS = 5000

const MessagesContext = createContext(null)

export function MessagesProvider({ children }) {
  const [messages, setMessages] = useState([])
  const pollRef = useRef(null)

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/messages`)
      if (!res.ok) throw new Error("Failed to load messages")
      setMessages(await res.json())
    } catch (err) {
      console.error(err)
    }
  }, [])

  useEffect(() => {
    fetchMessages()
    pollRef.current = setInterval(fetchMessages, POLL_INTERVAL_MS)
    return () => clearInterval(pollRef.current)
  }, [fetchMessages])

  const sendMessage = async (playerId, from, text) => {
    const res = await fetch(`${API_BASE}/api/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId, from, text }),
    })
    const created = await res.json()
    setMessages((prev) => [...prev, created])
  }

  return (
    <MessagesContext.Provider value={{ messages, sendMessage }}>
      {children}
    </MessagesContext.Provider>
  )
}

export function useMessages() {
  const ctx = useContext(MessagesContext)
  if (!ctx) throw new Error("useMessages must be used within MessagesProvider")
  return ctx
}
