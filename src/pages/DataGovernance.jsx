import { Shield, Lock, Eye, Target } from "lucide-react"
import Abbr from "../components/Abbr"
import { linkifyAbbreviations } from "../utils/linkifyAbbreviations"

const commitments = [
  { icon: Lock, title: "GDPR-Compliant Data Handling", body: "All biometric and workload data is processed under GDPR principles of lawfulness, purpose limitation, and storage minimisation." },
  { icon: Shield, title: "Player Consent", body: "Players provide informed consent for the collection and use of GPS, wellness, and injury-history data feeding the risk models." },
  { icon: Eye, title: "Model Transparency", body: "Risk predictions are explainable via feature-importance reporting rather than treated as an opaque black box." },
]

export default function DataGovernance() {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-green-600" />
        <h1 className="text-lg font-bold text-gray-900">Data Governance</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {commitments.map((c) => (
          <div key={c.title} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <c.icon className="h-5 w-5 text-green-600" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">{linkifyAbbreviations(c.title)}</h3>
            <p className="mt-1 text-xs text-gray-500">{linkifyAbbreviations(c.body)}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-900">UN Sustainable Development Goal Alignment</h3>
        </div>
        <ul className="mt-3 space-y-2 text-sm text-gray-600">
          <li><span className="font-semibold text-gray-900"><Abbr term="SDG">SDG</Abbr> 3</span> — Good Health and Wellbeing: proactive injury prevention reduces player harm.</li>
          <li><span className="font-semibold text-gray-900"><Abbr term="SDG">SDG</Abbr> 9</span> — Industry, Innovation and Infrastructure: applied <Abbr term="ML">ML</Abbr> infrastructure for sports science decision-making.</li>
        </ul>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm text-sm text-gray-500">
        <p>
          PlaySafe Analytics is an academic prototype developed for IS6611, University College Cork — Cork University
          Business School. Injury-risk predictions (Gabbett, 2016; <Abbr term="ACWR">ACWR</Abbr> framework) are
          decision-support tools and do not replace clinical judgement.
        </p>
      </div>
    </div>
  )
}
