import type { TransferFormValues, TransferResult } from "@apptypes/transfers";
import { useAccounts } from "@queries";
import { Form, message } from "antd";
import { useState } from "react";

export const useTransferForm = () => {
  const { accounts } = useAccounts();

  const [form] = Form.useForm<TransferFormValues>();

  const fromAccountId = Form.useWatch("fromAccountId", form);

  const toAccountId = Form.useWatch("toAccountId", form);

  const amount = Form.useWatch("amount", form);

  const note = Form.useWatch("note", form);

  const activeAccounts =
    accounts?.filter((account) => account.status === "active") ?? [];

  const fromAccount = accounts?.find((account) => account.id === fromAccountId);
  const toAccount = accounts?.find((account) => account.id === toAccountId);

  const [result, setResult] = useState<TransferResult | null>(null);

  const onReset = () => setResult(null);

  const onSuccess = (data: TransferResult) => {
    debugger
    setResult(data);
    form.resetFields();
    message.open({
      type: "success",
      content: "Transfer successfully",
    });
  };

  return {
    view: {
      fromAccount,
      toAccount,
      amount,
      note,
      activeAccounts,
      form,
      result,
    },
    action: {
      onReset,
      onSuccess,
    },
  };
};
