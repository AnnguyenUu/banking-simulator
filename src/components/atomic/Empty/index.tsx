import { Empty as EmptyPrimitive, type EmptyProps } from "antd"
import { memo } from "react"

const Empty = (props: EmptyProps) => {
  return <EmptyPrimitive {...props} />

}

export default memo(Empty)