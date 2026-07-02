import { memo } from "react";
import { Divider as DividerPrimitive, type DividerProps } from "antd";

const Divider = (props: DividerProps) => {
  return <DividerPrimitive {...props} />;
};

export default memo(Divider);