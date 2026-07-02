import { memo } from "react";
import { Col as ColPrimitive, type ColProps } from "antd";

const Col = (props: ColProps) => {
  return <ColPrimitive {...props} />;
};

export default memo(Col);