import { memo } from "react";
import { Select as SelectPrimitive, type SelectProps } from "antd"

const Select = (props: SelectProps) => {
  return <SelectPrimitive {...props} />
}

export default memo(Select)