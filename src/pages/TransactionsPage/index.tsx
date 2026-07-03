import { lazy, useMemo } from "react";
import { useAccounts, useTransactions } from "@queries";
import { useSessionStore } from "@store/useSessionStore";
import { getTransactionColumns } from "./components/getTransactionColumns";
import PageLayout from "@components/molecules/PageLayout";
import Space from "@components/atomic/Space";
import Input from "@components/atomic/Input";
import Select from "@components/atomic/Select";
import Table from "@components/atomic/Table";
import { useChangePage } from "../../hooks/useChangePage";
import { useGetTransactionQuery } from "./hooks/useGetTransactionQuery";

const TransactionDetails = lazy(
  () => import("./components/TransactionDetails"),
);

export function TransactionsPage() {
  const selectedAccountId = useSessionStore((state) => state.selectedAccountId);

  const selectAccount = useSessionStore((state) => state.selectAccount);

  const { perPage, onChangeTable, page } = useChangePage();

  const {
    onSearch,
    search,
    query,
    selectedTransaction,
    onSelectTransaction
  } = useGetTransactionQuery()

  const { accounts } = useAccounts();
  
  const { transactions, isLoading, total } = useTransactions({
    page,
    perPage,
    accountId: selectedAccountId || "",
    search: query,
  });

  const columns = useMemo(() => getTransactionColumns(), []);

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
        dataSource={transactions || []}
        pagination={{ pageSize: perPage, total: total }}
        onChange={onChangeTable}
        onRow={(tx) => ({
          onClick: () => onSelectTransaction(tx),
          className: "cursor-pointer",
        })}
      />

      {selectedTransaction !== null && (
        <TransactionDetails
          transaction={selectedTransaction}
          onClose={() => onSelectTransaction(null)}
          title="Transaction Details"
        />
      )}
    </PageLayout>
  );
}
