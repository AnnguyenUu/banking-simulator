import { lazy, useState } from "react";
import { Form, InputNumber } from "antd";
import { ArrowDownOutlined } from "@ant-design/icons";
import { useTransferFunds } from "@mutations";
import type {
  TransferFormValues,
  TransferRequest,
  TransferResult,
} from "@apptypes/banking";
import PageLayout from "@components/molecules/PageLayout";
import Divider from "@components/atomic/Divider";
import Flex from "@components/atomic/Flex";
import { formatCurrency } from "@utils/formatCurrency";
import Button from "@components/atomic/Button";
import Input from "@components/atomic/Input";
import Card from "@components/atomic/Card";
import Select from "@components/atomic/Select";
import Alert from "@components/atomic/Alert";
import { useTransferForm } from "./hooks/useTransferForm";

const ResultTransfer = lazy(() => import("./components/ResultTransfer"));

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
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="fromAccountId"
            label="From account"
            rules={[{ required: true, message: "Select a source account" }]}
          >
            <Select
              placeholder="Select account"
              options={activeAccounts.map((account) => ({
                label: `${account.name} (${account.accountNumber}) — ${formatCurrency(account.balance)}`,
                value: account.id,
              }))}
            />
          </Form.Item>

          <Flex justify="center" className="text-gray-400 -my-1">
            <ArrowDownOutlined />
          </Flex>

          <Form.Item
            name="toAccountId"
            label="To account"
            dependencies={["fromAccountId"]}
            rules={[
              { required: true, message: "Select a destination account" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || value !== getFieldValue("fromAccountId"))
                    return Promise.resolve();
                  return Promise.reject(
                    new Error("Destination must differ from source account"),
                  );
                },
              }),
            ]}
          >
            <Select
              placeholder="Select account"
              options={activeAccounts.map((account) => ({
                label: `${account.name} (${account.accountNumber})`,
                value: account.id,
              }))}
            />
          </Form.Item>

          <Divider className="my-4" />

          <Form.Item
            name="amount"
            label="Amount"
            extra={
              fromAccount &&
              `Available in ${fromAccount.name}: ${formatCurrency(fromAccount.balance)}`
            }
            rules={[
              { required: true, message: "Enter an amount" },
              {
                type: "number",
                min: 0.01,
                message: "Amount must be greater than zero",
              },
            ]}
          >
            <InputNumber<number>
              className="w-full"
              prefix="$"
              min={0.01}
              precision={2}
              max={fromAccount?.balance}
            />
          </Form.Item>

          <Form.Item name="note" label="Note (optional)">
            <Input placeholder="e.g. Monthly savings" maxLength={80} />
          </Form.Item>

          {mutation.isError && (
            <Alert
              type="error"
              showIcon
              title={
                (
                  mutation.error as {
                    response?: { data?: { message?: string } };
                  }
                )?.response?.data?.message ??
                "Transfer failed. Please try again."
              }
              className="mb-4"
            />
          )}

          <Button
            type="primary"
            htmlType="submit"
            loading={mutation.isPending}
            block
          >
            Transfer
          </Button>
        </Form>
      </Card>
    </PageLayout>
  );
}
