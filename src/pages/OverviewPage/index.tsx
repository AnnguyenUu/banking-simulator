import { lazy, Suspense } from "react";
import { useAccounts, useTransactions } from "@queries";
import Flex from "@components/atomic/Flex";
import Card from "@components/atomic/Card";
import Skeleton from "@components/atomic/Skeleton";
import PageLayout from "@components/molecules/PageLayout";
import { GAP } from "@context/design-tokens";
import BalanceCard from "./components/BalanceCard";
import AccountsCard from "./components/AccountsCard";

const RecentTransactions = lazy(
  () => import("./components/RecentTransactions"),
);

export function OverviewPage() {
  const { accounts, isLoading: accountsLoading } = useAccounts();

  const { transactions, isLoading: transactionsLoading } = useTransactions({
    page: 1,
    perPage: 5,
  });

  const totalBalance =
    accounts?.reduce((sum, acc) => sum + acc.balance, 0) ?? 0;

  return (
    <PageLayout title="Overview">
      <Flex vertical gap={GAP.LARGE}>
        <BalanceCard
          loading={accountsLoading}
          totalBalance={totalBalance}
          accountsLength={accounts?.length ?? 0}
        />

        <AccountsCard loading={accountsLoading} accounts={accounts || []} />

        <Suspense
          fallback={
            <Card>
              <Skeleton active />
            </Card>
          }
        >
          <RecentTransactions
            loading={transactionsLoading}
            transactions={transactions || []}
          />
        </Suspense>
      </Flex>
    </PageLayout>
  );
}
