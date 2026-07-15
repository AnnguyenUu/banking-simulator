import { useState } from "react";
import { Dropdown, Spin } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useCurrentUser } from "@modules/user/core/handlers/useCurrentUser";
import { useLogout } from "@modules/auth/core/handlers/useLogout";
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

  const { user, status } = useCurrentUser();

  const { logout } = useLogout();

  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => navigate("/login", { replace: true }),
    });
  };

  if (status === "error" || status === "pending") {
    return (
      <Spin spinning>
        <Outlet />
      </Spin>
    );
  }

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
          <Dropdown
            menu={{
              items: [
                {
                  key: "logout",
                  icon: <LogoutOutlined />,
                  label: "Log out",
                  onClick: handleLogout,
                },
              ],
            }}
          >
            <Space className="cursor-pointer">
              <Avatar icon={<UserOutlined />} />
              <Typography.Text>{user?.name ?? "Loading…"}</Typography.Text>
            </Space>
          </Dropdown>
        </Header>
        {/* ---Content--- */}
        <Content className="m-6">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
