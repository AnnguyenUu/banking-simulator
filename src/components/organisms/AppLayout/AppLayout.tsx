import { useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useCurrentUser } from "@queries";
import Layout from "@components/molecules/Layout";
import Avatar from "@components/atomic/Avatar";
import Space from "@components/atomic/Space";
import Menu from "@components/atomic/Menu";
import Typography from "@components/atomic/Typography";
import transformMenu from "@utils/transformMenu";

const { Header, Sider, Content } = Layout;

export function AppLayout() {
  const navigate = useNavigate();

  const location = useLocation();

  const { user } = useCurrentUser();

  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout hasSider className="min-h-screen">
      <Sider
        theme="light"
        breakpoint="lg"
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        collapsedWidth={80}
        className="sticky start-0 top-0 h-screen overflow-auto border-r border-gray-200"
      >
        {/* ---Icon Header--- */}
        <div className="m-4 h-12 overflow-hidden whitespace-nowrap text-base font-semibold text-slate-800">
          {collapsed ? "BB" : "Baking Bank"}
        </div>
        {/* ---Menu--- */}
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={transformMenu(user?.menu || [])}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      {/* ---Layout Composition--- */}
      <Layout>
        {/* ---Header--- */}
        <Header className="sticky top-0 z-10 flex items-center justify-end bg-white px-6">
          <Space>
            <Avatar icon={<UserOutlined />} />
            <Typography.Text>{user?.name ?? "Loading…"}</Typography.Text>
          </Space>
        </Header>
        {/* ---Content--- */}
        <Content className="m-6">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
