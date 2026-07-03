import Card from "@components/atomic/Card"
import Empty from "@components/atomic/Empty"
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';


const CATEGORY_COLORS = ['#1d39c4', '#08979c', '#d4380d', '#d48806', '#389e0d', '#9254de', '#c41d7f'];

const SpendingByCategory = ({
  dataSources
}: {
  dataSources: {
    category: string;
    total: number;
}[]
}) => {
  return  <Card title="Spending by Category">
  {dataSources.length === 0 ? (
    <Empty />
  ) : (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={dataSources}
          dataKey="total"
          nameKey="category"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={(entry) => entry.name}
        >
          {dataSources.map((entry, index) => (
            <Cell key={entry.category} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )}
</Card>
}

export default SpendingByCategory