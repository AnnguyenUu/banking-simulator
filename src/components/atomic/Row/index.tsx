import { memo } from "react";
import { Row as RowPrimitive, type RowProps } from "antd";

const Row = (props: RowProps) => {
  return <RowPrimitive {...props} />;
};

export default memo(Row);