import { lazy, useMemo } from "react";
import { useAccounts, useTransactions } from "@queries";
import { useSessionStore } from "@store/useSessionStore";
import { getTransactionColumns } from "./components/getTransactionColumns";
import PageLayout from "@components/molecules/PageLayout";
import Space from "@components/atomic/Space";
import Input from "@components/atomic/Input";
import Select from "@components/atomic/Select";
import Table from "@components/atomic/Table";
import DatePicker from "@components/atomic/DatePicker";
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
    onSelectTransaction,
    fromDate,
    toDate,
    onChangeDateRange,
  } = useGetTransactionQuery()

  const { accounts } = useAccounts();

  const { transactions, isLoading, total } = useTransactions({
    page,
    perPage,
    accountId: selectedAccountId || "",
    search: query,
    fromDate,
    toDate,
  });

  console.log({
    fromDate,
    toDate,
  })

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
          <DatePicker.RangePicker
            allowClear
            format="YYYY-MM-DD"
            onChange={onChangeDateRange}
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
