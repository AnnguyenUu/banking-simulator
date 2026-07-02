import { useMemo } from 'react';
import { Card, Col, Row, Typography, Skeleton, Empty } from 'antd';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useTransactions } from '@queries';

const CATEGORY_COLORS = ['#1d39c4', '#08979c', '#d4380d', '#d48806', '#389e0d', '#9254de', '#c41d7f'];

export function InsightsPage() {
  const { data: transactions, isLoading } = useTransactions();

  const spendingTransactions = useMemo(
    () => (transactions ?? []).filter((tx) => tx.category !== 'Transfer'),
    [transactions],
  );

  const spendingByCategory = useMemo(() => {
    const totals = new Map<string, number>();
    for (const tx of spendingTransactions) {
      if (tx.amount >= 0) continue;
      totals.set(tx.category, (totals.get(tx.category) ?? 0) + Math.abs(tx.amount));
    }
    return [...totals.entries()]
      .map(([category, total]) => ({ category, total: Math.round(total * 100) / 100 }))
      .sort((a, b) => b.total - a.total);
  }, [spendingTransactions]);

  const monthlyIncomeVsExpense = useMemo(() => {
    const months = new Map<string, { month: string; income: number; expenses: number }>();
    for (const tx of spendingTransactions) {
      const month = tx.date.slice(0, 7);
      const entry = months.get(month) ?? { month, income: 0, expenses: 0 };
      if (tx.amount >= 0) entry.income += tx.amount;
      else entry.expenses += Math.abs(tx.amount);
      months.set(month, entry);
    }
    return [...months.values()]
      .sort((a, b) => a.month.localeCompare(b.month))
      .map((entry) => ({
        ...entry,
        income: Math.round(entry.income * 100) / 100,
        expenses: Math.round(entry.expenses * 100) / 100,
      }));
  }, [spendingTransactions]);

  const spendingTrend = useMemo(
    () => monthlyIncomeVsExpense.map(({ month, expenses }) => ({ month, expenses })),
    [monthlyIncomeVsExpense],
  );

  const topMerchants = useMemo(() => {
    const totals = new Map<string, number>();
    for (const tx of spendingTransactions) {
      if (tx.amount >= 0) continue;
      totals.set(tx.description, (totals.get(tx.description) ?? 0) + Math.abs(tx.amount));
    }
    return [...totals.entries()]
      .map(([merchant, total]) => ({ merchant, total: Math.round(total * 100) / 100 }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [spendingTransactions]);

  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  return (
    <>
      <Typography.Title level={3} className="mb-4">
        Spending Insights
      </Typography.Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title="Spending by Category">
            {spendingByCategory.length === 0 ? (
              <Empty />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={spendingByCategory}
                    dataKey="total"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => entry.name}
                  >
                    {spendingByCategory.map((entry, index) => (
                      <Cell key={entry.category} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Spending Trend">
            {spendingTrend.length === 0 ? (
              <Empty />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={spendingTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                  <Line type="monotone" dataKey="expenses" name="Spending" stroke="#d4380d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Top Merchants">
            {topMerchants.length === 0 ? (
              <Empty />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topMerchants} layout="vertical" margin={{ left: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="merchant" width={110} />
                  <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                  <Bar dataKey="total" fill="#1d39c4" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Income vs Expenses by Month">
            {monthlyIncomeVsExpense.length === 0 ? (
              <Empty />
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={monthlyIncomeVsExpense}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                  <Legend />
                  <Bar dataKey="income" name="Income" fill="#389e0d" />
                  <Bar dataKey="expenses" name="Expenses" fill="#d4380d" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
}
