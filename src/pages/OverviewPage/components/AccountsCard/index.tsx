import type { Account, AccountStatus } from "@apptypes/accounts";
import Card from "@components/atomic/Card";
import Col from "@components/atomic/Col";
import Empty from "@components/atomic/Empty";
import Row from "@components/atomic/Row";
import Skeleton from "@components/atomic/Skeleton";
import Space from "@components/atomic/Space";
import Statistic from "@components/atomic/Statistic";
import Tag from "@components/atomic/Tag";
import Typography from "@components/atomic/Typography";
import { GAP } from "@context/design-tokens";
import { useSessionStore } from "@store/useSessionStore";
import { formatCurrency } from "@utils/formatCurrency";
import { getAmountIndicator } from "@utils/getAmountIndicator";
import { memo, useMemo } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  loading: boolean;
  accounts: Account[];
}

const typeColors: Record<string, string> = {
  checking: "blue",
  savings: "green",
  credit: "purple",
};

const statusColors: Record<AccountStatus, string> = {
  active: "success",
  frozen: "warning",
  closed: "default",
};

const AccountsCard = ({ loading, accounts }: Props) => {
  if (loading) {
    return <CardLoading />;
  }

  if ((accounts || []).length === 0) {
    return <Empty />;
  }

  return (
    <Row gutter={[GAP.LARGE, GAP.LARGE]}>
      {accounts?.map((account) => (
        <Col xs={24} sm={12} lg={8} key={account.id}>
          <AccountCard account={account} />
        </Col>
      ))}
    </Row>
  );
};

const CardLoading = () => {
  return (
    <Row gutter={[GAP.LARGE, GAP.LARGE]}>
      <Col span={24}>
        <Skeleton active />
      </Col>
    </Row>
  );
};

const AccountCard = memo(({ account }: { account: Account }) => {
  const selectAccount = useSessionStore((state) => state.selectAccount);

  const navigate = useNavigate();

  const content = useMemo(() => {
    const config = getAmountIndicator(account.balance ?? 0);
    return config.className;
  }, [account]);

  return (
    <Card
      hoverable
      title={account.name}
      extra={
        <Space size={4}>
          <Tag
            aria-label={`Account Type: ${account.type}`}
            color={typeColors[account.type]}
          >
            {account.type}
          </Tag>
          <Tag
            aria-label={`Account Status: ${account.status}`}
            color={statusColors[account.status]}
          >
            {account.status}
          </Tag>
        </Space>
      }
      onClick={() => {
        selectAccount(account.id);
        navigate("/transactions");
      }}
    >
      <Statistic
        aria-label={`Available Balance: ${formatCurrency(account.balance)}`}
        value={formatCurrency(account.balance)}
        classNames={{
          content: content,
        }}
      />
      <Typography.Text
        aria-label={`Account Number: ${account.accountNumber}`}
        type="secondary"
      >
        {account.accountNumber}
      </Typography.Text>
    </Card>
  );
});

export default memo(AccountsCard);
