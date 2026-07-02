import type { Account, TransferFormValues } from "@apptypes/banking";
import Flex from "@components/atomic/Flex";
import Select from "@components/atomic/Select";
import { formatCurrency } from "@utils/formatCurrency";
import { Form, InputNumber, type FormProps } from "antd";
import { memo } from "react";
import { ArrowDownOutlined } from "@ant-design/icons";
import Divider from "@components/atomic/Divider";
import Input from "@components/atomic/Input";
import Button from "@components/atomic/Button";
import Alert from "@components/atomic/Alert";

interface Props extends Pick<
  FormProps<TransferFormValues>,
  "onFinish" | "form" | "layout"
> {
  activeAccounts: Account[];
  fromAccount: Account | undefined;
  isPending: boolean;
  isError: boolean;
}
const TransferForm = ({
  activeAccounts,
  fromAccount,
  isPending,
  isError,
  ...rest
}: Props) => {
  return (
    <Form {...rest}>
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

      {isError && (
        <Alert
          type="error"
          showIcon
          title={"Transfer failed. Please try again."}
          className="mb-4"
        />
      )}

      <Button type="primary" htmlType="submit" loading={isPending} block>
        Transfer
      </Button>
    </Form>
  );
};

export default memo(TransferForm);
