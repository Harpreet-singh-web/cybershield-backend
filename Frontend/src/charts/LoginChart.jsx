import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts"

export default function LoginChart({ logs }) {

  const success = logs.filter(l => l.status === "success").length
  const failed = logs.filter(l => l.status === "failed").length

  const data = [
    { name: "Success", value: success },
    { name: "Failed", value: failed }
  ]

  const COLORS = ["#4ade80", "#f87171"]

  return (
    <PieChart width={300} height={300}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={100}
        dataKey="value"
        label
      >
        {data.map((entry, index) => (
          <Cell key={index} fill={COLORS[index]} />
        ))}
      </Pie>

      <Tooltip />
      <Legend />
    </PieChart>
  )
}