import Card from "@components/atomic/Card";
import Empty from "@components/atomic/Empty";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const SpendingTrend = ({
  dataSources,
}: {
  dataSources: {
    month: string;
    expenses: number;
  }[];
}) => {
  return (
    <Card title="Spending Trend">
      {dataSources.length === 0 ? (
        <Empty />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dataSources}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
            <Line
              type="monotone"
              dataKey="expenses"
              name="Spending"
              stroke="#d4380d"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};

export default SpendingTrend;
