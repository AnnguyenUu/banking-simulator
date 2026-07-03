import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Card from "@components/atomic/Card";
import Empty from "@components/atomic/Empty";

const TopMerchants = ({
  dataSources
}:
  {
    dataSources: {
      merchant: string;
      total: number;
  }[]
  }
) => {
  return <Card title="Top Merchants">
  {dataSources.length === 0 ? (
    <Empty />
  ) : (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={dataSources}
        layout="vertical"
        margin={{ left: 24 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis type="category" dataKey="merchant" width={110} />
        <Tooltip
          formatter={(value) => `$${Number(value).toFixed(2)}`}
        />
        <Bar dataKey="total" fill="#1d39c4" />
      </BarChart>
    </ResponsiveContainer>
  )}
</Card>
}

export default TopMerchants