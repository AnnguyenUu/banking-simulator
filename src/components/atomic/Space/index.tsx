import { memo } from 'react';
import { Space as SpacePrimitive, type SpaceProps } from 'antd';

const Space = (props: SpaceProps) => {
  return <SpacePrimitive {...props} />;
};

export default Object.assign(memo(Space), {
  Compact: SpacePrimitive.Compact,
  Addon: SpacePrimitive.Addon,
});