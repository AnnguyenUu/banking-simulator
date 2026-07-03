import { lazy, Suspense } from "react";
import { useTransactions } from "@queries";
import Skeleton from "@components/atomic/Skeleton";
import Row from "@components/atomic/Row";
import Col from "@components/atomic/Col";
import { useInsightsTransform } from "./hooks/useInsightsTransform";
import PageLayout from "@components/molecules/PageLayout";

const SpendingByCategory = lazy(() => import("./components/SpendingByCategory"));
const SpendingTrend = lazy(() => import("./components/SpendingTrend"));
const IncomeExpense = lazy(() => import("./components/IncomeExpense"));
const TopMerchants = lazy(() => import("./components/TopMerchants"));

const chartFallback = <Skeleton active paragraph={{ rows: 6 }} />;

export function InsightsPage() {
  const { transactions, isLoading } = useTransactions();

  const {
    spendingByCategory,
    spendingTrend,
    topMerchants,
    monthlyIncomeVsExpense,
  } = useInsightsTransform(transactions);

  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  return (
    <PageLayout title="Spending Insights">
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Suspense fallback={chartFallback}>
            <SpendingByCategory dataSources={spendingByCategory} />
          </Suspense>
        </Col>

        <Col xs={24} lg={8}>
          <Suspense fallback={chartFallback}>
            <SpendingTrend dataSources={spendingTrend} />
          </Suspense>
        </Col>

        <Col xs={24} lg={8}>
          <Suspense fallback={chartFallback}>
            <TopMerchants dataSources={topMerchants} />
          </Suspense>
        </Col>

        <Col span={24}>
          <Suspense fallback={chartFallback}>
            <IncomeExpense dataSources={monthlyIncomeVsExpense} />
          </Suspense>
        </Col>
      </Row>
    </PageLayout>
  );
}
