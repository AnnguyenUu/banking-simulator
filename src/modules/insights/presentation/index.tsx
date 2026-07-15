import { lazy, Suspense, useMemo } from "react";
import { useInsights } from "../core/handlers/useInsights";
import Skeleton from "@components/atomic/Skeleton";
import Row from "@components/atomic/Row";
import Col from "@components/atomic/Col";
import PageLayout from "@components/molecules/PageLayout";

const SpendingByCategory = lazy(() => import("./SpendingByCategory"));
const SpendingTrend = lazy(() => import("./SpendingTrend"));
const IncomeExpense = lazy(() => import("./IncomeExpense"));
const TopMerchants = lazy(() => import("./TopMerchants"));

const chartFallback = <Skeleton active paragraph={{ rows: 6 }} />;

export function InsightsPage() {
  const {
    spendingByCategory,
    topMerchants,
    monthlyIncomeVsExpense,
    isLoading,
  } = useInsights();

  const spendingTrend = useMemo(
    () => monthlyIncomeVsExpense.map(({ month, expenses }) => ({ month, expenses })),
    [monthlyIncomeVsExpense],
  );

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
