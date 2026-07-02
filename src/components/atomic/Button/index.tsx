import { Button as ButtonPrimitive, type ButtonProps } from "antd"
import { memo } from "react"

const Button = (props: ButtonProps) => {
  return <ButtonPrimitive {...props} />
}

export default Object.assign(memo(Button), {
  Group: ButtonPrimitive.Group,
});