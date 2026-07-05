import type { ReactNode } from "react";
import Tag from "../Tag";
import { statusMapping } from "@utils/statusMapping";

const Status = ({
  status,
  children,
}: {
  status: string;
  children?: ReactNode;
}) => {
  return (
    <Tag className="capitalize" color={statusMapping(status)}>
      {children || status}
    </Tag>
  );
};

export default Status;
