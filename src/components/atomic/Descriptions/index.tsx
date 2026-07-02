import { Descriptions as DescriptionPrimitve, type DescriptionsProps } from "antd";
import { memo } from "react";

const Descriptions = (props: DescriptionsProps) => {
  return <DescriptionPrimitve {...props} />
}

export default Object.assign(memo(Descriptions), {
  Item: DescriptionPrimitve.Item,
});