import type { MenuItem } from "@apptypes/banking";
import type { ItemType } from "antd/es/menu/interface";
import {
  DashboardOutlined,
  SwapOutlined,
  SendOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import React from "react";

const iconMap: Record<string, React.ComponentType> = {
  DashboardOutlined,
  SwapOutlined,
  SendOutlined,
  PieChartOutlined,
};

function transformMenu(menu: MenuItem[]): ItemType[] {
  return (menu || []).map((m) => {
    const Icon = iconMap[m.icon];
    return {
      key: m.path,
      label: m.label,
      icon: Icon ? React.createElement(Icon) : undefined,
    };
  });
}

export default transformMenu;
