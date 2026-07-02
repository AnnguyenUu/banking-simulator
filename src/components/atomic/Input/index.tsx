import { memo } from "react";
import { Input as InputPrimitive, type InputProps } from "antd";

const Input = (props: InputProps) => {
  return <InputPrimitive {...props} />;
};

export default Object.assign(memo(Input), {
  Group: InputPrimitive.Group,
  Search: InputPrimitive.Search,
  TextArea: InputPrimitive.TextArea,
  Password: InputPrimitive.Password,
  OTP: InputPrimitive.OTP,
});