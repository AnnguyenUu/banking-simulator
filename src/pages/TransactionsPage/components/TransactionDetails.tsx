import type { Account, Transaction } from "@apptypes/banking";
import Descriptions from "@components/atomic/Descriptions";
import Drawer from "@components/atomic/Drawer";
import Tag from "@components/atomic/Tag";
import Typography from "@components/atomic/Typography";
import { formatCurrency } from "@utils/formatCurrency";
import { getAmountIndicator } from "@utils/getAmountIndicator";
import { memo, useMemo } from "react";

interface Props {
  transaction:
    | {
        transaction: Transaction;
        account: undefined;
        balanceAfter: undefined;
      }
    | {
        transaction: Transaction;
        account: Account;
        balanceAfter: number | undefined;
      }
    | null;
  onClose: () => void;
  title: string;
}

const TransactionDetails = ({ transaction, onClose, title }: Props) => {
  const selectedTxAmount = transaction
    ? getAmountIndicator(transaction.transaction.amount)
    : null;

  const items = useMemo(() => {
    if (!transaction) return [];

    return [
      {
        key: "description",
        label: "Description",
        children: transaction.transaction.description,
      },
      {
        key: "account",
        label: "Account",
        children: transaction.account?.name ?? "—",
      },
      {
        key: "date",
        label: "Date",
        children: transaction.transaction.date,
      },
      {
        key: "category",
        label: "Category",
        children: <Tag>{transaction.transaction.category}</Tag>,
      },
      {
        key: "status",
        label: "Status",
        children: (
          <Tag
            color={
              transaction.transaction.status === "completed"
                ? "green"
                : "gold"
            }
          >
            {transaction.transaction.status}
          </Tag>
        ),
      },
      {
        key: "amount",
        label: "Amount",
        children: (
          <Typography.Text className={selectedTxAmount?.className}>
            {selectedTxAmount?.prefix}
            {formatCurrency(transaction.transaction.amount)}
          </Typography.Text>
        ),
      },
      {
        key: "balanceAfter",
        label: "Balance After",
        children:
          transaction.balanceAfter === undefined
            ? "—"
            : formatCurrency(transaction.balanceAfter),
      },
    ];
  }, [transaction, selectedTxAmount]);

  return (
    <Drawer title={title} open onClose={onClose}>
      {transaction && <Descriptions column={1} items={items} />}
    </Drawer>
  );
};

export default memo(TransactionDetails);
