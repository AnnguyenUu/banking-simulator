import { memo } from "react";
import { DatePicker as DatePickerPrimitive, type DatePickerProps } from "antd";

const DatePicker = (props: DatePickerProps) => {
  return <DatePickerPrimitive {...props} />;
};

export default Object.assign(memo(DatePicker), {
  RangePicker: DatePickerPrimitive.RangePicker,
});
