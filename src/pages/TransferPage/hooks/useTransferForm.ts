import type { TransferFormValues } from "@apptypes/transfers";
import { useAccounts } from "@queries";
import { Form } from "antd";

export const useTransferForm = () => {
  const { accounts } = useAccounts();

  const [form] = Form.useForm<TransferFormValues>();

  const fromAccountId = Form.useWatch("fromAccountId", form);

  const activeAccounts =
    accounts?.filter((account) => account.status === "active") ?? [];

  const fromAccount = accounts?.find((account) => account.id === fromAccountId);

  return {
    fromAccount,
    activeAccounts,
    form
  }
}