import { memo } from 'react';
import { Space as SpacePrimitive, type SpaceProps } from 'antd';

const Space = (props: SpaceProps) => {
  return <SpacePrimitive {...props} />;
};

const MemoSpace = memo(Space);
MemoSpace.displayName = "Space";

export default Object.assign(MemoSpace, {
  Compact: SpacePrimitive.Compact,
  Addon: SpacePrimitive.Addon,
});