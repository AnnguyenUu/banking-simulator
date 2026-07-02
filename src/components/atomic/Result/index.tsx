import { Result as ResultPrimitive, type ResultProps } from "antd"
import { memo } from "react"

const Result = (props: ResultProps) => {
  return <ResultPrimitive {...props} />
}

export default memo(Result)