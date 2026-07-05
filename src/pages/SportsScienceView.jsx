import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, ResponsiveContainer } from "recharts"
import { featureImportance, positionGroups, modelComparison } from "../data/players"
import RecommendationsPanel from "../components/RecommendationsPanel"
import Abbr from "../components/Abbr"

const metricRows = [
  { key: "accuracy", label: "Accuracy" },
  { key: "recall", label: "Recall" },
  { key: "precision", label: "Precision" },
  { key: "auc", label: <Abbr term="AUC-ROC">AUC-ROC</Abbr> },
]

export default function SportsScienceView() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900">Top Injury Risk Factors — This Week</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={featureImportance} layout="vertical" margin={{ top: 8, right: 40, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={[0, 50]} tick={{ fontSize: 12 }} unit="%" />
              <YAxis type="category" dataKey="feature" width={140} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => [`${value}%`, "Importance"]} />
              <Bar dataKey="value" fill="#16a34a" radius={[0, 4, 4, 0]} barSize={22}>
                <LabelList dataKey="value" position="right" formatter={(v) => `${v}%`} style={{ fontSize: 12, fill: "#374151" }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900">Position Group Comparison</h3>
          <table className="mt-4 w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-400">
                <th className="py-2 pr-4 font-medium">Position Group</th>
                <th className="py-2 pr-4 font-medium">Avg <Abbr term="ACWR">ACWR</Abbr></th>
                <th className="py-2 pr-4 font-medium">Avg 7-Day Load</th>
                <th className="py-2 pr-4 font-medium">High Risk Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {positionGroups.map((row) => (
                <tr key={row.group}>
                  <td className="py-3 pr-4 font-medium text-gray-900">{row.group}</td>
                  <td className="py-3 pr-4 font-mono text-gray-600">{row.avgAcwr.toFixed(2)}</td>
                  <td className="py-3 pr-4 font-mono text-gray-600">
                    {row.avgLoad.toLocaleString()} <Abbr term="AU">AU</Abbr>
                  </td>
                  <td className={`py-3 pr-4 font-mono font-semibold ${row.highRisk > 0 ? "text-red-600" : "text-green-600"}`}>
                    {row.highRisk}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900">
          <Abbr term="ML">ML</Abbr> Model Comparison — 5-Fold Cross Validation
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {modelComparison.map((model) => (
            <div
              key={model.model}
              className={`rounded-lg border ${
                model.selected ? "border-green-600 ring-1 ring-green-600" : "border-gray-200"
              } overflow-hidden`}
            >
              <div className={`px-4 py-2.5 text-sm font-semibold ${model.selected ? "bg-green-600 text-white" : "bg-gray-50 text-gray-900"}`}>
                {model.model === "XGBoost" ? <Abbr term="XGBoost">XGBoost</Abbr> : model.model}
                {model.selected && <span className="ml-1 font-normal">(selected)</span>}
              </div>
              <dl className="divide-y divide-gray-100 px-4">
                {metricRows.map((m) => (
                  <div key={m.key} className="flex items-center justify-between py-2.5">
                    <dt className="text-sm text-gray-500">{m.label}</dt>
                    <dd className="font-mono text-sm font-semibold text-gray-900">{model[m.key].toFixed(2)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-gray-400">
          <Abbr term="XGBoost">XGBoost</Abbr> selected as primary model due to highest recall — minimising missed injury predictions is prioritised over precision in a clinical context.
        </p>
      </div>

      <RecommendationsPanel
        role="sportsScience"
        title="Sports Science Recommendations"
        emptyText="No sports science recommendations logged yet — add one below."
        addLabel="Add sports science note"
        borderClass="border-l-blue-600"
      />
    </div>
  )
}
