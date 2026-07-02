import { memo } from 'react';
import { Avatar as AvatarPrimitive, type AvatarProps } from 'antd';

const Avatar = (props: AvatarProps) => {
  return <AvatarPrimitive {...props} />;
};

export default Object.assign(memo(Avatar), {
  Group: AvatarPrimitive.Group,
});