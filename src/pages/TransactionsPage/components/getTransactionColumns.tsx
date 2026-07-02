import type { Account, Transaction } from "@apptypes/banking";
import Tag from "@components/atomic/Tag";
import Typography from "@components/atomic/Typography";
import { formatCurrency } from "@utils/formatCurrency";
import { getAmountIndicator } from "@utils/getAmountIndicator";
import type { ColumnsType } from "antd/es/table";

export const getTransactionColumns = ({
  accountLookup,
  balanceByTxId,
}: {
  accountLookup: Map<string, Account>;
  balanceByTxId: Map<string, number>;
}): ColumnsType<Transaction> => [
  { title: "Date", dataIndex: "date", key: "date" },
  { title: "Description", dataIndex: "description", key: "description" },
  {
    title: "Account",
    key: "account",
    render: (_: unknown, tx: Transaction) =>
      accountLookup.get(tx.accountId)?.name ?? "—",
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
    render: (category: string) => <Tag>{category}</Tag>,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: Transaction["status"]) => (
      <Tag color={status === "completed" ? "green" : "gold"}>{status}</Tag>
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
      const balance = balanceByTxId.get(tx.id);
      return balance === undefined ? "—" : formatCurrency(balance);
    },
  },
];
