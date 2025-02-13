import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const BarChartComponent = ({ totalIncomeTurnover, totalExpenseTurnover }) => {
  const data = [
    { name: "Income", amount: totalIncomeTurnover },
    { name: "Expense", amount: totalExpenseTurnover },
  ];

  return (
    <div className="card mt-3">
      <div className="card-header">Income vs Expense (Bar Chart)</div>
      <div className="card-body">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartComponent;
