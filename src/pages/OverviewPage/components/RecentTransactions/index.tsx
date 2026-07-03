import type { Transaction } from "@apptypes/transactions";
import Card from "@components/atomic/Card";
import Empty from "@components/atomic/Empty";
import Flex from "@components/atomic/Flex";
import List from "@components/atomic/List";
import Skeleton from "@components/atomic/Skeleton";
import Tag from "@components/atomic/Tag";
import Typography from "@components/atomic/Typography";
import { GAP } from "@context/design-tokens";
import { formatCurrency } from "@utils/formatCurrency";
import { getAmountIndicator } from "@utils/getAmountIndicator";
import { memo } from "react";

interface Props {
  loading: boolean;
  transactions: Transaction[];
}

const RecentTransactions = ({ loading, transactions }: Props) => {
  if (loading) {
    return (
      <Card>
        <Skeleton active />
      </Card>
    );
  }

  if ((transactions || []).length === 0) {
    return <Empty />;
  }

  return (
    <Flex vertical gap={GAP.LARGE}>
      <Typography.Title level={4}>Recent Transactions</Typography.Title>
      <Card>
        <List
          dataSource={transactions || []}
          itemLayout="vertical"
          size="small"
          renderItem={(transaction) => (
            <RecentTransaction key={transaction.id} transaction={transaction} />
          )}
        />
      </Card>
    </Flex>
  );
};

const RecentTransaction = memo(
  ({ transaction }: { transaction: Transaction }) => {
    return (
      <List.Item>
        <Flex justify="space-between" align="center">
          <div>
            <Typography.Text strong>{transaction.description}</Typography.Text>
            <div>
              <Typography.Text type="secondary">
                {transaction.date}
              </Typography.Text>
              &nbsp;
              <Tag>{transaction.category}</Tag>
            </div>
          </div>
          <Typography.Text
            className={getAmountIndicator(transaction.amount)?.className}
          >
            {getAmountIndicator(transaction?.amount)?.prefix || ""}
            {formatCurrency(transaction.amount)}
          </Typography.Text>
        </Flex>
      </List.Item>
    );
  },
);

export default memo(RecentTransactions);
