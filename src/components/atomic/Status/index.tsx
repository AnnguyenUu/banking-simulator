import type { ReactNode } from "react";
import Tag from "../Tag";

const Status = ({
  status,
  children,
}: {
  status: string;
  children?: ReactNode;
}) => {
  const statusMapping = (status: string) => {
    switch (status) {
      case "checking":
        return "blue";
      case "savings":
      case "completed":
      case "active":
        return "green";
      case "pending":
      case "frozen":
        return "warning";
      case "credit":
        return "purple";
    }
  };
  return (
    <Tag className="capitalize" color={statusMapping(status)}>
      {children || status}
    </Tag>
  );
};

export default Status;
