import type { TransferFormValues, TransferResult } from "@apptypes/transfers";
import { useAccounts } from "@queries";
import { Form } from "antd";
import { useState } from "react";

export const useTransferForm = () => {
  const { accounts } = useAccounts();

  const [form] = Form.useForm<TransferFormValues>();

  const fromAccountId = Form.useWatch("fromAccountId", form);

  const [result, setResult] = useState<TransferResult | null>(null);

  const activeAccounts =
    accounts?.filter((account) => account.status === "active") ?? [];

  const fromAccount = accounts?.find((account) => account.id === fromAccountId);


  const onResetForm = () => {
    setResult(null)
  }

  return {
    fromAccount,
    activeAccounts,
    result,
    onResetForm,
    form
  }
}