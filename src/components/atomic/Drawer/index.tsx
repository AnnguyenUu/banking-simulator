import { memo } from "react";
import { Drawer as DrawerPrimitive, type DrawerProps } from "antd";

const Drawer = (props: DrawerProps) => {
  return <DrawerPrimitive {...props} />
}

export default memo(Drawer)