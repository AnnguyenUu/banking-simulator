import { memo } from "react";
import { Skeleton as SkeletonPrimitive, type SkeletonProps } from "antd";

const Skeleton = (props: SkeletonProps) => {
  return <SkeletonPrimitive {...props} />;
};

export default memo(Skeleton);