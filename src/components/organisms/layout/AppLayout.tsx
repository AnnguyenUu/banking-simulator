import { useState } from 'react';
import {
  DashboardOutlined,
  SwapOutlined,
  UserOutlined,
  SendOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '@queries';
import Layout from '@components/molecules/Layout';
import Avatar from '@components/atomic/Avatar';
import Space from '@components/atomic/Space';
import Menu from '@components/atomic/Menu';
import Typography from '@components/atomic/Typography';

const { Header, Sider, Content } = Layout;

const navItems = [
  { key: '/', label: 'Overview', icon: <DashboardOutlined /> },
  { key: '/transactions', label: 'Transactions', icon: <SwapOutlined /> },
  { key: '/transfer', label: 'Transfer', icon: <SendOutlined /> },
  { key: '/insights', label: 'Insights', icon: <PieChartOutlined /> },
];

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: user } = useCurrentUser();
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
        <div className="m-4 h-12 overflow-hidden whitespace-nowrap text-base font-semibold text-slate-800">
          {collapsed ? 'BB' : 'Baking Bank'}
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={navItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header className="sticky top-0 z-10 flex items-center justify-end bg-white px-6">
          <Space>
            <Avatar icon={<UserOutlined />} />
            <Typography.Text>{user?.name ?? 'Loading…'}</Typography.Text>
          </Space>
        </Header>
        <Content className="m-6">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
