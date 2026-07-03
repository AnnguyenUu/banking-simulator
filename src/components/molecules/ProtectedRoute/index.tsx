import { memo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}
const ProtectedRoute = ({ children }: Props) => {
  console.log("guard")
  return <>{children}</>;
};

export default memo(ProtectedRoute);
