import type { Account } from "@apptypes/accounts";
import Card from "@components/atomic/Card";
import Col from "@components/atomic/Col";
import Empty from "@components/atomic/Empty";
import Row from "@components/atomic/Row";
import Skeleton from "@components/atomic/Skeleton";
import Space from "@components/atomic/Space";
import Statistic from "@components/atomic/Statistic";
import Status from "@components/atomic/Status";
import Typography from "@components/atomic/Typography";
import { GAP } from "@context/design-tokens";
import { useSelectedAccount } from "@store/useSelectedAccount";
import { formatCurrency } from "@utils/formatCurrency";
import { getAmountIndicator } from "@utils/getAmountIndicator";
import { memo, useMemo } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  loading: boolean;
  accounts: Account[];
}

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
  const [, selectAccount] = useSelectedAccount();

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
          <Status
            aria-label={`Account Type: ${account.type}`}
            status={account.type}
          />
          <Status
            aria-label={`Account Status: ${account.status}`}
            status={account.status}
          />
          x
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
