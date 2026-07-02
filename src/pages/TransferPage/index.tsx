import { lazy, useState } from "react";
import { useTransferFunds } from "@mutations";
import type {
  TransferFormValues,
  TransferRequest,
  TransferResult,
} from "@apptypes/banking";
import PageLayout from "@components/molecules/PageLayout";
import Card from "@components/atomic/Card";
import { useTransferForm } from "./hooks/useTransferForm";

const ResultTransfer = lazy(() => import("./components/ResultTransfer"));
const TransferForm = lazy(() => import("./components/TransferForm"));

export function TransferPage() {
  const { form, activeAccounts, fromAccount } = useTransferForm();

  const [result, setResult] = useState<TransferResult | null>(null);

  const onReset = () => setResult(null);

  const handleSubmit = (values: TransferFormValues) => {
    onReset();

    const request: TransferRequest = {
      ...values,
    };

    mutation.mutate(request, {
      onSuccess: (data) => {
        setResult(data);
        form.resetFields();
      },
    });
  };

  const mutation = useTransferFunds();

  if (result) {
    return (
      <PageLayout title="Transfer Funds">
        <ResultTransfer result={result} onClick={onReset} />
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Transfer Funds">
      <Card className="max-w-[480px]">
        <TransferForm
          activeAccounts={activeAccounts || []}
          fromAccount={fromAccount}
          isPending={mutation.isPending}
          isError={mutation.isError}
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        />
      </Card>
    </PageLayout>
  );
}
