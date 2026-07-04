import type { Transaction } from "@apptypes/transactions";
import { startTransition, useState } from "react";
import { useDebounceCallback } from "../../../hooks/useDebounce";

export const useGetTransactionQuery = () => {
  const [search, setSearch] = useState("");

  const [searchQuery, setSearchQuery] = useState<string>("");

  const [selectedTransaction, setSelectedTx] = useState<Transaction | null>(null);

  const [fromDate, setFromDate] = useState<string | undefined>(undefined);

  const [toDate, setToDate] = useState<string | undefined>(undefined);

  const debounced = useDebounceCallback(setSearchQuery, 500);

  const onSelectTransaction = (transaction: Transaction | null) => setSelectedTx(transaction)

  const onSearch = (value: string) => {
    setSearch(value);

    startTransition(() => {
      debounced(value)
    });
  };

  const onChangeDateRange = (
    _dates: unknown,
    dateStrings: [string, string],
  ) => {
    const [from, to] = dateStrings || [];
    setFromDate(from || undefined);
    setToDate(to || undefined);
  };

  return {
    onSearch,
    search,
    query: searchQuery,
    selectedTransaction,
    onSelectTransaction,
    fromDate,
    toDate,
    onChangeDateRange,
  }
};
