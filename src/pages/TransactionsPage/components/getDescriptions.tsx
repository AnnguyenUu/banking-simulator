import type { Transaction } from "@apptypes/transactions";
import Tag from "@components/atomic/Tag";
import Typography from "@components/atomic/Typography";
import { formatCurrency } from "@utils/formatCurrency";

const getDescriptions = ({
  transaction,
  className,
  prefix
}: {
  transaction: Transaction | null,
  className: string | undefined
  prefix: string | undefined
}) => {
  if (!transaction) return [];

    return [
      {
        key: "description",
        label: "Description",
        children: transaction.description,
      },
      {
        key: "account",
        label: "Account",
        children: transaction.accountName,
      },
      {
        key: "date",
        label: "Date",
        children: transaction.date,
      },
      {
        key: "category",
        label: "Category",
        children: <Tag>{transaction.category}</Tag>,
      },
      {
        key: "status",
        label: "Status",
        children: (
          <Tag color={transaction.status === "completed" ? "green" : "gold"}>
            {transaction.status}
          </Tag>
        ),
      },
      {
        key: "amount",
        label: "Amount",
        children: (
          <Typography.Text className={className}>
            {prefix}
            {formatCurrency(transaction.amount)}
          </Typography.Text>
        ),
      },
      {
        key: "balanceAfter",
        label: "Balance After",
        children: formatCurrency(transaction.balanceAfter),
      },
    ];
}

export default getDescriptions