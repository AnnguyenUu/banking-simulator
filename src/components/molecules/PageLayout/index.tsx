import Flex from "@components/atomic/Flex";
import Typography from "@components/atomic/Typography";
import { memo, useMemo } from "react";
import { GAP } from "@context/design-tokens";
import Space from "@components/atomic/Space";

interface Props {
  title: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode
}

const PageLayout = (props: Props) => {
  const { title, children, actions } = props;

  const titleRender = useMemo(() => {
    if(typeof title === "string" || typeof title === "number") {
      return <Typography.Title level={3}>
        {title}
      </Typography.Title>
    }

    return title
  }, [title])

  const header = useMemo(() => {
    if(!actions) return titleRender
    return <Space className="mb-4 w-full justify-between" wrap>
      {titleRender}
      {actions}
    </Space>

  }, [titleRender, actions])
  return (
    <Flex vertical gap={GAP.SMALL}>
      {header}
      {children}
    </Flex>
  );
};

export default memo(PageLayout);
