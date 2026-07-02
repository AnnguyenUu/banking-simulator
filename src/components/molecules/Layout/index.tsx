import { memo } from "react";
import { Layout as LayoutPrimitive, type LayoutProps } from "antd";

const Layout = (props: LayoutProps) => {
  return <LayoutPrimitive {...props} />;
};

export default Object.assign(memo(Layout), {
  Header: LayoutPrimitive.Header,
  Sider: LayoutPrimitive.Sider,
  Content: LayoutPrimitive.Content,
  Footer: LayoutPrimitive.Footer,
});