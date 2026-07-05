import type { Account } from "@apptypes/accounts";
import Card from "@components/atomic/Card";
import Divider from "@components/atomic/Divider";
import Flex from "@components/atomic/Flex";
import Typography from "@components/atomic/Typography";
import { GAP } from "@context/design-tokens";
import { formatCurrency } from "@utils/formatCurrency";
import { ArrowDownOutlined } from "@ant-design/icons";
import { memo } from "react";
import Status from "@components/atomic/Status";

interface Props {
  fromAccount: Account | undefined;
  toAccount: Account | undefined;
  amount: number | undefined;
  note: string | undefined;
}

const AccountRow = ({ label, account }: { label: string; account: Account }) => (
  <Flex justify="space-between" align="center">
    <div>
      <Typography.Text type="secondary" className="text-xs uppercase tracking-wide">
        {label}
      </Typography.Text>
      <Flex align="center" gap={GAP.SMALL}>
        <Typography.Text strong>{account.name}</Typography.Text>
        <Status status={account?.type} />
      </Flex>
      <Typography.Text type="secondary">{account.accountNumber}</Typography.Text>
    </div>
    <Typography.Text type="secondary">{formatCurrency(account.balance)}</Typography.Text>
  </Flex>
);

const TransferSummary = ({ fromAccount, toAccount, amount, note }: Props) => {
  if (!fromAccount && !toAccount) {
    return (
      <Card className="h-full">
        <Flex vertical align="center" justify="center" className="h-full min-h-[240px] text-center">
          <Typography.Text type="secondary">
            Select accounts and an amount to preview your transfer.
          </Typography.Text>
        </Flex>
      </Card>
    );
  }

  const hasAmount = typeof amount === "number" && amount > 0;

  return (
    <Card className="h-full">
      <Typography.Text type="secondary" className="text-xs uppercase tracking-wide">
        Review
      </Typography.Text>

      <Flex vertical gap={GAP.MEDIUM} className="mt-2">
        {fromAccount && <AccountRow label="From" account={fromAccount} />}

        <Flex justify="center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1d39c4]/10 text-[#1d39c4]">
            <ArrowDownOutlined />
          </div>
        </Flex>

        {toAccount && <AccountRow label="To" account={toAccount} />}
      </Flex>

      <Divider className="my-4" />

      <Flex vertical align="center" gap={GAP.SMALL}>
        <Typography.Text type="secondary">Amount</Typography.Text>
        <Typography.Title level={3} className="text-[#1d39c4]">
          {hasAmount ? formatCurrency(amount!) : "—"}
        </Typography.Title>
        {note && <Typography.Text type="secondary">"{note}"</Typography.Text>}
      </Flex>

      {fromAccount && toAccount && hasAmount && (
        <>
          <Divider className="my-4" />
          <Flex vertical gap={GAP.SMALL}>
            <Flex justify="space-between">
              <Typography.Text type="secondary">{fromAccount.name} after</Typography.Text>
              <Typography.Text>{formatCurrency(fromAccount.balance - amount!)}</Typography.Text>
            </Flex>
            <Flex justify="space-between">
              <Typography.Text type="secondary">{toAccount.name} after</Typography.Text>
              <Typography.Text>{formatCurrency(toAccount.balance + amount!)}</Typography.Text>
            </Flex>
          </Flex>
        </>
      )}
    </Card>
  );
};

export default memo(TransferSummary);
