import type { Transaction } from "@apptypes/transactions";
import Descriptions from "@components/atomic/Descriptions";
import Drawer from "@components/atomic/Drawer";
import { getAmountIndicator, type AmountIndicator } from "@utils/getAmountIndicator";
import { memo, useMemo } from "react";
import getDescriptions from "../../utils/getDescriptions";
import type { DescriptionsItemType } from "antd/es/descriptions";

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
  const configIndicator: AmountIndicator | null = getIndicator(transaction)

  const items: DescriptionsItemType[] = useMemo(() => {
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
