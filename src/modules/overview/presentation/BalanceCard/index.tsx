import Card from "@components/atomic/Card";
import Skeleton from "@components/atomic/Skeleton";
import Statistic from "@components/atomic/Statistic";
import Typography from "@components/atomic/Typography";
import { formatCurrency } from "@utils/formatCurrency";
import { memo } from "react";

interface Props {
  loading: boolean;
  totalBalance: number;
  accountsLength: number;
}

const BalanceCard = (props: Props) => {
  const { loading, totalBalance, accountsLength } = props;

  if (loading) {
    return <CardLoading />;
  }

  return (
    <Card>
      <Statistic
        title="Total Balance"
        value={formatCurrency(totalBalance)}
        classNames={{ title: "text-base", content: "text-3xl" }}
      />
      <Typography.Text type="secondary">
        Across {accountsLength} accounts
      </Typography.Text>
    </Card>
  );
};

const CardLoading = () => {
  return (
    <Card>
      <Skeleton active />
    </Card>
  );
};

export default memo(BalanceCard);
