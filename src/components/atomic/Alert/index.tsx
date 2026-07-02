import { Alert as AlertPrimitive, type AlertProps } from "antd"
import { memo } from "react"

const Alert = (props: AlertProps) => {
  return <AlertPrimitive {...props} />
}


export default Object.assign(memo(Alert), {
  ErrorBoundary: AlertPrimitive.ErrorBoundary,
});