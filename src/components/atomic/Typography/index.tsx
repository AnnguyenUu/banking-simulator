import { memo } from 'react';
import { Typography as TypographyPrimitive, type TypographyProps } from 'antd';

const Typography = (props: TypographyProps) => {
  const { className, ...rest } = props;
  return <TypographyPrimitive className={`${className} m-0`} {...rest} />;
};

const MemoTypography = memo(Typography);
MemoTypography.displayName = "Typography";

export default Object.assign(MemoTypography, {
  Title: TypographyPrimitive.Title,
  Text: TypographyPrimitive.Text,
  Paragraph: TypographyPrimitive.Paragraph,
});