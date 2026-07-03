import type { Transaction } from "@apptypes/transactions";
import { startTransition, useState } from "react";
import { useDebounceCallback } from "../../../hooks/useDebounce";

export const useGetTransactionQuery = () => {
  const [search, setSearch] = useState("");
  
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [selectedTransaction, setSelectedTx] = useState<Transaction | null>(null);

  const debounced = useDebounceCallback(setSearchQuery, 500);

  const onSelectTransaction = (transaction: Transaction | null) => setSelectedTx(transaction)

  const onSearch = (value: string) => {
    setSearch(value);

    startTransition(() => {
      debounced(value)
    });
  };

  return {
    onSearch,
    search,
    query: searchQuery,
    selectedTransaction,
    onSelectTransaction
  }
};
