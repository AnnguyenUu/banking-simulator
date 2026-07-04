import { memo } from "react";
import { Input as InputPrimitive, type InputProps } from "antd";

const Input = (props: InputProps) => {
  return <InputPrimitive {...props} />;
};

const MemoInput = memo(Input);
MemoInput.displayName = "Input";

export default Object.assign(MemoInput, {
  Group: InputPrimitive.Group,
  Search: InputPrimitive.Search,
  TextArea: InputPrimitive.TextArea,
  Password: InputPrimitive.Password,
  OTP: InputPrimitive.OTP,
});