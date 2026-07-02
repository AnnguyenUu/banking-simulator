import type { TablePaginationConfig } from "antd"
import { useState } from "react"

export const useChangePage = () => {
  const [page, setPage] = useState<number>(1)
  const [perPage, setPerPage] = useState<number>(20)

  const onChangeTable = (pagination: TablePaginationConfig) => {
    setPage(pagination.current ?? 0)
    setPerPage(pagination?.pageSize ?? 0)
  }

  return {
    page,
    perPage,
    onChangeTable
  }
}