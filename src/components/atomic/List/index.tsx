import { memo } from "react";
import { List as ListPrimitive, type ListProps } from "antd";


function List<T>(props: ListProps<T>) {
  return  <ListPrimitive<T> {...props} />
}

const MemoizedList = memo(List) as <T>(props: ListProps<T>) => React.ReactElement;

export default Object.assign(MemoizedList, {
  Item: ListPrimitive.Item
})