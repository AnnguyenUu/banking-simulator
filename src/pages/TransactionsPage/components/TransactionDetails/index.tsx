import type { Transaction } from "@apptypes/transactions";
import Descriptions from "@components/atomic/Descriptions";
import Drawer from "@components/atomic/Drawer";
import { getAmountIndicator } from "@utils/getAmountIndicator";
import { memo, useMemo } from "react";
import getDescriptions from "../getDescriptions";

interface Props {
  transaction: Transaction | null;
  onClose: () => void;
  title: string;
}

const getIndicator = (transaction: Transaction | null) => {
   return transaction
  ? getAmountIndicator(transaction.amount)
  : null;
}

const TransactionDetails = ({ transaction, onClose, title }: Props) => {
  const configIndicator = getIndicator(transaction)

  const items = useMemo(() => {
    return getDescriptions({
      transaction,
      prefix: configIndicator?.prefix,
      className: configIndicator?.prefix
    })
  }, [transaction, configIndicator]);

  return (
    <Drawer title={title} open onClose={onClose}>
      {transaction && <Descriptions column={1} items={items} />}
    </Drawer>
  );
};

export default memo(TransactionDetails);
