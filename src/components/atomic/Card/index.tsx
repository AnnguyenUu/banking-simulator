import { memo } from "react";
import { Card as CardPrimitive, type CardProps } from "antd";

const Card = (props: CardProps) => {
  return <CardPrimitive {...props} />;
};

export default memo(Card);