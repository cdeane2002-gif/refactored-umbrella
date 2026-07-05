import express from "express"
import cors from "cors"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_FILE = path.join(__dirname, "data.json")

const defaultData = {
  interventions: [
    { id: "seed-1", playerId: 1, role: "coach", text: "Reduce Tuesday session by 15%. Mandatory rest day before Saturday match." },
    { id: "seed-2", playerId: 5, role: "coach", text: "Reduce Tuesday session by 20%. Reassess Thursday before confirming match selection." },
  ],
  messages: [],
}

function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2))
    return JSON.parse(JSON.stringify(defaultData))
  }
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"))
  } catch {
    return JSON.parse(JSON.stringify(defaultData))
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const app = express()
app.use(cors())
app.use(express.json())

app.get("/api/interventions", (req, res) => {
  res.json(readData().interventions)
})

app.post("/api/interventions", (req, res) => {
  const { playerId, role, text } = req.body
  if (!playerId || !role || !text) {
    return res.status(400).json({ error: "playerId, role, and text are required" })
  }
  const data = readData()
  const entry = { id: genId(), playerId: Number(playerId), role, text }
  data.interventions.push(entry)
  writeData(data)
  res.status(201).json(entry)
})

app.patch("/api/interventions/:id", (req, res) => {
  const data = readData()
  const item = data.interventions.find((i) => i.id === req.params.id)
  if (!item) return res.status(404).json({ error: "not found" })
  item.text = req.body.text
  writeData(data)
  res.json(item)
})

app.delete("/api/interventions/:id", (req, res) => {
  const data = readData()
  data.interventions = data.interventions.filter((i) => i.id !== req.params.id)
  writeData(data)
  res.status(204).end()
})

app.get("/api/messages", (req, res) => {
  res.json(readData().messages)
})

app.post("/api/messages", (req, res) => {
  const { playerId, from, text } = req.body
  if (!playerId || !from || !text) {
    return res.status(400).json({ error: "playerId, from, and text are required" })
  }
  const data = readData()
  const entry = { id: genId(), playerId: Number(playerId), from, text, createdAt: new Date().toISOString() }
  data.messages.push(entry)
  writeData(data)
  res.status(201).json(entry)
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`PlaySafe API listening on http://localhost:${PORT}`)
})
