import { useState } from 'react';
import { Card, Form, Select, InputNumber, Input, Button, Typography, Alert, Result } from 'antd';
import { useAccounts } from '@queries';
import { useTransferFunds } from '@mutations';
import type { TransferRequest, TransferResult } from '@apptypes/banking';

interface FormValues {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  note?: string;
}

export function TransferPage() {
  const { data: accounts } = useAccounts();
  const [form] = Form.useForm<FormValues>();
  const fromAccountId = Form.useWatch('fromAccountId', form);
  const mutation = useTransferFunds();
  const [result, setResult] = useState<TransferResult | null>(null);

  const activeAccounts = accounts?.filter((account) => account.status === 'active') ?? [];
  const fromAccount = accounts?.find((account) => account.id === fromAccountId);

  const handleSubmit = (values: FormValues) => {
    setResult(null);
    const request: TransferRequest = {
      fromAccountId: values.fromAccountId,
      toAccountId: values.toAccountId,
      amount: values.amount,
      note: values.note,
    };
    mutation.mutate(request, {
      onSuccess: (data) => {
        setResult(data);
        form.resetFields();
      },
    });
  };

  if (result) {
    return (
      <Card className="max-w-[480px]">
        <Result
          status="success"
          title="Transfer complete"
          subTitle={`$${Math.abs(result.transactions[0].amount).toFixed(2)} moved from ${result.fromAccount.name} to ${result.toAccount.name}.`}
        />
        <Typography.Paragraph>
          <strong>{result.fromAccount.name}</strong> new balance: ${result.fromAccount.balance.toFixed(2)}
        </Typography.Paragraph>
        <Typography.Paragraph>
          <strong>{result.toAccount.name}</strong> new balance: ${result.toAccount.balance.toFixed(2)}
        </Typography.Paragraph>
        <Button type="primary" onClick={() => setResult(null)}>
          Make another transfer
        </Button>
      </Card>
    );
  }

  return (
    <>
      <Typography.Title level={3} className="mb-4">
        Transfer Funds
      </Typography.Title>
      <Card className="max-w-[480px]">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="fromAccountId"
            label="From account"
            rules={[{ required: true, message: 'Select a source account' }]}
          >
            <Select
              placeholder="Select account"
              options={activeAccounts.map((account) => ({
                label: `${account.name} (${account.accountNumber}) — $${account.balance.toFixed(2)}`,
                value: account.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="toAccountId"
            label="To account"
            dependencies={['fromAccountId']}
            rules={[
              { required: true, message: 'Select a destination account' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || value !== getFieldValue('fromAccountId')) return Promise.resolve();
                  return Promise.reject(new Error('Destination must differ from source account'));
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

          <Form.Item
            name="amount"
            label="Amount"
            rules={[
              { required: true, message: 'Enter an amount' },
              { type: 'number', min: 0.01, message: 'Amount must be greater than zero' },
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
                (mutation.error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
                'Transfer failed. Please try again.'
              }
              className="mb-4"
            />
          )}

          <Button type="primary" htmlType="submit" loading={mutation.isPending} block>
            Transfer
          </Button>
        </Form>
      </Card>
    </>
  );
}
