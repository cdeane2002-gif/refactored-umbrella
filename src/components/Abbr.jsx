import { glossary } from "../data/glossary"

export default function Abbr({ term, children }) {
  const title = glossary[term]
  return (
    <abbr
      title={title}
      className="cursor-help underline decoration-dotted decoration-gray-400 underline-offset-2"
    >
      {children ?? term}
    </abbr>
  )
}
