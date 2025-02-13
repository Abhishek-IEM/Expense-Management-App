import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const PieChartComponent = ({ totalIncomeTurnover, totalExpenseTurnover }) => {
  const data = [
    { name: "Income", value: totalIncomeTurnover },
    { name: "Expense", value: totalExpenseTurnover },
  ];

  const COLORS = ["#0088FE", "#FF8042"]; // Blue for Income, Orange for Expense

  return (
    <div className="card mt-3">
      <div className="card-header">Income vs Expense (Pie Chart)</div>
      <div className="card-body">
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={120}
              paddingAngle={5}
              dataKey="value"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PieChartComponent;
