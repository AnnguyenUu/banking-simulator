export type Permission =
  | "overview:view"
  | "transactions:view"
  | "transfers:view"
  | "transfers:create"
  | "insights:view";

export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  theme: "light" | "dark";
  permissions: Permission[];
  menu: MenuItem[];
}
