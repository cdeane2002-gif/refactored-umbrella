export default function KpiCard({ label, value, valueClassName = "text-gray-900", subtitle }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className={`mt-2 font-mono text-3xl font-bold ${valueClassName}`}>{value}</p>
      {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
    </div>
  )
}
