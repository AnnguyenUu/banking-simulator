import type { TagProps } from "antd";

export const statusMapping = (status: string): TagProps["color"] => {
  return STATUS_COLORS[status]
};

const STATUS_COLORS: Record<string, TagProps["color"]> = {
  checking: "blue",
  
  savings: "green",
  completed: "green",
  active: "green",
  
  pending: "warning",
  
  frozen: "error",
  
  credit: "purple",
};
