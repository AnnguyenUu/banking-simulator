import { memo } from 'react';
import { Menu as MenuPrimitive, type MenuProps } from 'antd';

const Menu = (props: MenuProps) => {
  return <MenuPrimitive {...props} />;
};

export default Object.assign(memo(Menu), {
  Item: MenuPrimitive.Item,
  SubMenu: MenuPrimitive.SubMenu,
  Divider: MenuPrimitive.Divider,
  ItemGroup: MenuPrimitive.ItemGroup,
});