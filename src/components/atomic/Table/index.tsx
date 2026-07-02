import { Table as TablePrimitive, type TableProps } from "antd"
import { memo } from "react"

function Table<T extends object>(props: TableProps<T>) {
  return <TablePrimitive {...props} />
}

export default memo(Table) as <T extends object>(props: TableProps<T>) => React.ReactElement