import { memo } from 'react';
import { Tag as TagPrimitive, type TagProps } from 'antd';

const Tag = (props: TagProps) => {
  return <TagPrimitive {...props} />;
};

export default Object.assign(memo(Tag), {
  CheckableTag: TagPrimitive.CheckableTag,
  CheckableTagGroup: TagPrimitive.CheckableTagGroup,
});