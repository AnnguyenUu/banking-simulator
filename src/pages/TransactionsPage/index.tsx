import { lazy, startTransition, useMemo, useState } from "react";
import { useAccounts, useTransactions } from "@queries";
import { useSessionStore } from "@store/useSessionStore";
import type { Transaction } from "@apptypes/banking";
import { withRunningBalance } from "@utils/runningBalance";
import { getTransactionColumns } from "./components/getTransactionColumns";
import PageLayout from "@components/molecules/PageLayout";
import Space from "@components/atomic/Space";
import Input from "@components/atomic/Input";
import Select from "@components/atomic/Select";
import Table from "@components/atomic/Table";
import { debounce } from "@utils/debounce";

const TransactionDetails = lazy(
  () => import("./components/TransactionDetails"),
);

export function TransactionsPage() {
  const { data: accounts } = useAccounts();

  const selectedAccountId = useSessionStore((state) => state.selectedAccountId);
  const selectAccount = useSessionStore((state) => state.selectAccount);
  const { data: transactions, isLoading } = useTransactions();

  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const accountLookup = useMemo(
    () => new Map(accounts?.map((a) => [a.id, a])),
    [accounts],
  );

  const balanceByTxId = useMemo(() => {
    const account = selectedAccountId
      ? accountLookup.get(selectedAccountId)
      : undefined;
    if (!account) return new Map<string, number>();
    const accountTxs = (transactions ?? []).filter(
      (t) => t.accountId === account.id,
    );
    return new Map(
      withRunningBalance(account, accountTxs).map((tx) => [
        tx.id,
        tx.balanceAfter,
      ]),
    );
  }, [transactions, selectedAccountId, accountLookup]);

  const filteredTransactions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return (transactions ?? []).filter((tx) => {
      if (selectedAccountId && tx.accountId !== selectedAccountId) return false;
      if (!query) return true;
      return (
        tx.description.toLowerCase().includes(query) ||
        tx.category.toLowerCase().includes(query)
      );
    });
  }, [transactions, selectedAccountId, searchQuery]);

  const selectedTxDetail = useMemo(() => {
    if (!selectedTx) return null;
    const account = accountLookup.get(selectedTx.accountId);
    if (!account)
      return {
        transaction: selectedTx,
        account: undefined,
        balanceAfter: undefined,
      };
    const accountTxs = (transactions ?? []).filter(
      (t) => t.accountId === account.id,
    );
    const balanceAfter = withRunningBalance(account, accountTxs).find(
      (t) => t.id === selectedTx.id,
    )?.balanceAfter;
    return { transaction: selectedTx, account, balanceAfter };
  }, [selectedTx, transactions, accountLookup]);

  const columns = useMemo(
    () =>
      getTransactionColumns({
        selectedAccountId,
        accountLookup,
        balanceByTxId,
      }),
    [selectedAccountId, accountLookup, balanceByTxId],
  );
  
  const onSearch = (value: string) => {
    setSearch(value)

    startTransition(debounce(() => {
      setSearchQuery(value)
    }, 400))
  }

  return (
    <PageLayout
      title="Transactions"
      actions={
        <Space>
          <Input.Search
            allowClear
            placeholder="Search description or category"
            className="w-[260px]"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
          <Select
            allowClear
            placeholder="Filter by account"
            className="min-w-[220px]"
            value={selectedAccountId ?? undefined}
            onChange={(value) => selectAccount(value ?? null)}
            options={accounts?.map((account) => ({
              label: account.name,
              value: account.id,
            }))}
          />
        </Space>
      }
    >
      <Table
        rowKey="id"
        loading={isLoading}
        columns={columns}
        dataSource={filteredTransactions}
        pagination={{ pageSize: 10 }}
        onRow={(tx) => ({
          onClick: () => setSelectedTx(tx),
          className: "cursor-pointer",
        })}
      />

      {selectedTxDetail !== null && (
        <TransactionDetails
          transaction={selectedTxDetail}
          onClose={() => setSelectedTx(null)}
          title="Transaction Details"
        />
      )}
    </PageLayout>
  );
}
