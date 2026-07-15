import { lazy, Suspense } from "react";
import { useAccounts } from "@modules/accounts/core/handlers/useAccounts";
import { useTransactions } from "@modules/transactions/core/handlers/useTransactions";
import Flex from "@components/atomic/Flex";
import Card from "@components/atomic/Card";
import Skeleton from "@components/atomic/Skeleton";
import PageLayout from "@components/molecules/PageLayout";
import { GAP } from "@context/design-tokens";
import BalanceCard from "./BalanceCard";
import AccountsCard from "./AccountsCard";
import type { Account } from "@apptypes/accounts";

const RecentTransactions = lazy(() => import("./RecentTransactions"));

const getTotalBalance = (accounts: Account[]) => {
  return accounts?.reduce((sum, acc) => sum + acc.balance, 0) ?? 0;
};

export function OverviewPage() {
  const { accounts, isLoading: accountsLoading } = useAccounts();

  const { transactions, isLoading: transactionsLoading } = useTransactions({
    page: 1,
    perPage: 5,
  });

  const totalBalance: number = getTotalBalance(accounts);

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
