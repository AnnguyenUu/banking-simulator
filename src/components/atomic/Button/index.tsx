import { Button as ButtonPrimitive, type ButtonProps } from "antd"
import { memo } from "react"

const Button = (props: ButtonProps) => {
  return <ButtonPrimitive {...props} />
}

const MemoButton = memo(Button);
MemoButton.displayName = "Button";

export default Object.assign(MemoButton, {
  Group: ButtonPrimitive.Group,
});