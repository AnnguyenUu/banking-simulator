import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Card from "@components/atomic/Card";
import Empty from "@components/atomic/Empty";

const IncomeExpense = ({
  dataSources
}: {
  dataSources: {
    income: number;
    expenses: number;
    month: string;
}[]
}) => {
  return <Card title="Income vs Expenses by Month">
  {dataSources.length === 0 ? (
    <Empty />
  ) : (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={dataSources}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip
          formatter={(value) => `$${Number(value).toFixed(2)}`}
        />
        <Legend />
        <Bar dataKey="income" name="Income" fill="#389e0d" />
        <Bar dataKey="expenses" name="Expenses" fill="#d4380d" />
      </BarChart>
    </ResponsiveContainer>
  )}
</Card>
}

export default IncomeExpense