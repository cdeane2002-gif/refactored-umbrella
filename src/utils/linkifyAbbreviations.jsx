import Abbr from "../components/Abbr"
import { glossary } from "../data/glossary"

const terms = Object.keys(glossary).sort((a, b) => b.length - a.length)
const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
const pattern = new RegExp(`\\b(${escaped.join("|")})\\b`, "g")

// Splits free-text (data-driven bullet points, user-typed recommendations)
// and wraps any recognised abbreviation in an Abbr so its full term shows on hover.
export function linkifyAbbreviations(text) {
  if (!text) return text
  return text
    .split(pattern)
    .map((part, i) => (glossary[part] ? <Abbr key={i} term={part}>{part}</Abbr> : part))
}
