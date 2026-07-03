import type { TransferFormValues } from "@apptypes/transfers";
import { useAccounts } from "@queries";
import { Form } from "antd";

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

  return {
    fromAccount,
    toAccount,
    amount,
    note,
    activeAccounts,
    form
  }
}