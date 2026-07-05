import type { Transaction } from "@apptypes/transactions";
import Status from "@components/atomic/Status";
import Typography from "@components/atomic/Typography";
import { formatCurrency } from "@utils/formatCurrency";
import { getAmountIndicator } from "@utils/getAmountIndicator";
import type { ColumnsType } from "antd/es/table";

export const getTransactionColumns = (): ColumnsType<Transaction> => [
  { title: "Date", dataIndex: "date", key: "date" },
  { title: "Description", dataIndex: "description", key: "description" },
  {
    title: "Account",
    key: "account",
    render: (_: unknown, tx: Transaction) =>
      tx?.accountName ?? "—",
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
    render: (category: string) => <Status status={category} />,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: Transaction["status"]) => (
      <Status status={status} />
    ),
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    align: "right",
    render: (amount: number) => {
      const { className, prefix } = getAmountIndicator(amount);
      return (
        <Typography.Text className={className}>
          {prefix}
          {formatCurrency(amount)}
        </Typography.Text>
      );
    },
  },
  {
    title: "Balance After",
    key: "balanceAfter",
    align: "right" as const,
    render: (_: unknown, tx: Transaction) => {
      return formatCurrency(tx.balanceAfter)
    },
  },
];
