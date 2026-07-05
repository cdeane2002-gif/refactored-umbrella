import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea, ReferenceLine, ResponsiveContainer } from "recharts"

export default function AcwrTrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="day"
          type="number"
          domain={[1, 28]}
          ticks={[1, 8, 15, 22]}
          tickFormatter={(d) => `Week ${Math.floor((d - 1) / 7) + 1}`}
          tick={{ fontSize: 12 }}
        />
        <YAxis domain={[0.6, 1.6]} ticks={[0.6, 0.8, 1.0, 1.3, 1.6]} tick={{ fontSize: 12 }} />
        <Tooltip
          labelFormatter={(d) => `Day ${d}`}
          formatter={(value) => [value.toFixed(2), "ACWR"]}
        />
        <ReferenceArea y1={0.8} y2={1.3} fill="#16a34a" fillOpacity={0.1} label={{ value: "Safe zone", position: "insideTopLeft", fontSize: 11, fill: "#16a34a" }} />
        <ReferenceLine y={1.3} stroke="#dc2626" strokeDasharray="6 4" />
        <ReferenceLine y={0.8} stroke="#16a34a" strokeDasharray="6 4" />
        <Line type="monotone" dataKey="acwr" name="ACWR" stroke="#2563eb" strokeWidth={2.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
