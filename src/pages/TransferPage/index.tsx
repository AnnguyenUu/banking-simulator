import { lazy } from "react";
import { useTransferFunds } from "@mutations";
import type { TransferFormValues, TransferResult } from "@apptypes/transfers";
import PageLayout from "@components/molecules/PageLayout";
import Card from "@components/atomic/Card";
import Row from "@components/atomic/Row";
import Col from "@components/atomic/Col";
import { GAP } from "@context/design-tokens";
import { useTransferForm } from "./hooks/useTransferForm";
import TransferSummary from "./components/TransferSummary";

const ResultTransfer = lazy(() => import("./components/ResultTransfer"));
const TransferForm = lazy(() => import("./components/TransferForm"));

export function TransferPage() {
  const { view, action } = useTransferForm();

  const { form, activeAccounts, fromAccount, toAccount, amount, note, result } =
    view;

  const { onReset, onSuccess } = action;

  const { transfer, isPending, isError } = useTransferFunds();

  const handleSubmit = (values: TransferFormValues) => {
    transfer(values, {
      onSuccess: onSuccess,
      onSettled: onReset,
    });
  };

  if (result) {
    return <AlertTransferSuccess result={result} onClick={onReset} />;
  }

  return (
    <PageLayout title="Transfer Funds">
      <Row gutter={[GAP.LARGE, GAP.LARGE]}>
        <Col xs={24} md={14}>
          <Card className="h-full">
            <TransferForm
              activeAccounts={activeAccounts || []}
              fromAccount={fromAccount}
              isPending={isPending}
              isError={isError}
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
            />
          </Card>
        </Col>
        <Col xs={24} md={10}>
          <TransferSummary
            fromAccount={fromAccount}
            toAccount={toAccount}
            amount={amount}
            note={note}
          />
        </Col>
      </Row>
    </PageLayout>
  );
}

const AlertTransferSuccess = ({
  result,
  onClick,
}: {
  result: TransferResult;
  onClick: () => void;
}) => {
  return (
    <PageLayout title="Transfer Funds">
      <ResultTransfer result={result} onClick={onClick} />
    </PageLayout>
  );
};
