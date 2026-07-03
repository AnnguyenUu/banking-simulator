import type { Permission } from "@apptypes/user";
import Result from "@components/atomic/Result";
import { useCurrentUser } from "@queries";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  permission?: Permission | "";
}

const ProtectedRoute = ({ children, permission = "" }: Props) => {
  const { user, status } = useCurrentUser();

  const { permissions } = user || {};

  const isHasPermisson = !!permission && permissions?.includes(permission);

  if (!isHasPermisson && status === "success") {
    return (
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
      />
    );
  }

  return <div>{children}</div>;
};

export default ProtectedRoute;
