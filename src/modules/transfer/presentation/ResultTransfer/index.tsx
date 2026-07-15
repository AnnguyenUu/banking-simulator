import type { TransferResult } from "@apptypes/transfers";
import Button from "@components/atomic/Button";
import Card from "@components/atomic/Card";
import Result from "@components/atomic/Result";
import Typography from "@components/atomic/Typography";
import { formatCurrency } from "@utils/formatCurrency";
import { memo } from "react";

const ResultTransfer = ({
  result,
  onClick,
}: {
  result: TransferResult;
  onClick: () => void;
}) => {
  return (
    <Card className="max-w-[480px]">
      <Result
        status="success"
        title="Transfer complete"
        subTitle={`${formatCurrency(Math.abs(result.transactions[0].amount))} moved from ${result.fromAccount.name} to ${result.toAccount.name}.`}
      />
      <Typography.Paragraph>
        <strong>{result.fromAccount.name}</strong> new balance:&nbsp;
        {formatCurrency(result.fromAccount.balance)}
      </Typography.Paragraph>
      <Typography.Paragraph>
        <strong>{result.toAccount.name}</strong> new balance:&nbsp;
        {formatCurrency(result.toAccount.balance)}
      </Typography.Paragraph>
      <Button type="primary" block onClick={onClick}>
        Make another transfer
      </Button>
    </Card>
  );
};

export default memo(ResultTransfer);
