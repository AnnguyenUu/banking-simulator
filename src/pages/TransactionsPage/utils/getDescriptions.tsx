import type { Transaction } from "@apptypes/transactions";
import Status from "@components/atomic/Status";
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

  console.log({
    className
  })

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
        children: <Status status={transaction.category} />
      },
      {
        key: "status",
        label: "Status",
        children: (
          <Status status={transaction?.status} />
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