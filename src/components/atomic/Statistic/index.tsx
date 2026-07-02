import { memo } from "react";
import { Statistic as StatisticPrimitive, type StatisticProps } from "antd";

const Statistic = (props: StatisticProps) => {
  return <StatisticPrimitive {...props} />;
};

export default memo(Statistic);