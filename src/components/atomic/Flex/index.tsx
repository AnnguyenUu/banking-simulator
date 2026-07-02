import { memo } from "react";
import { Flex as FlexPrimitive, type FlexProps } from "antd";

const Flex = (props: FlexProps) => {
  return <FlexPrimitive {...props} />;
};

export default memo(Flex);