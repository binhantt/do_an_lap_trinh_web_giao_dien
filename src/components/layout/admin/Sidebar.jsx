import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  AppstoreOutlined,
  FileOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  ProjectOutlined,
  TeamOutlined,
  BarChartOutlined,
  MailOutlined,
  BellOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Sider } = Layout;
const { Title } = Typography;

const Sidebar = ({ collapsed }) => {
  return (
    <Sider 
      trigger={null} 
      collapsible 
      collapsed={collapsed} 
      className="h-screen"
      width={220}
      style={{ background: '#ffffff' }}
    >
      <div className="p-4 flex items-center justify-center text-center">
        <div className="text-blue-500 text-3xl r mr-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <Title level={5} className="m-0 text-gray-700 text-center">DDHACK Admin</Title>
      </div>
      
      <Menu
        mode="inline"
        defaultSelectedKeys={['dashboard']}
        style={{ borderRight: 0, background: '#ffffff' }}
        className="border-0 mt-4"
      >
        <Menu.Item key="dashboard" icon={<DashboardOutlined />} className="rounded-md mx-2">
          <Link to="/admin/dashboard">Dashboard</Link>
        </Menu.Item>
        
        <Menu.Divider className="my-2" />
        
        <Menu.ItemGroup title="Management" className="px-4 text-xs font-medium text-gray-400">
          <Menu.Item key="users" icon={<UserOutlined />} className="rounded-md mx-2">
            <Link to="/admin/users">Users</Link>
          </Menu.Item>
          <Menu.Item key="categories" icon={<AppstoreOutlined />} className="rounded-md mx-2">
            <Link to="/admin/dashboard/categories">Categories</Link>
          </Menu.Item>
          <Menu.Item key="game" icon={<ProjectOutlined />} className="rounded-md mx-2">
            <Link to="/admin/games">Game</Link>
          </Menu.Item>
          <Menu.Item key="packages" icon={<FileOutlined />} className="rounded-md mx-2">
            <Link to="/admin/packages">Packages</Link>
          </Menu.Item>
        </Menu.ItemGroup>
        
        <Menu.Divider className="my-2" />
        
        <Menu.ItemGroup title="System" className="px-4 text-xs font-medium text-gray-400">
          <Menu.Item key="settings" icon={<SettingOutlined />} className="rounded-md mx-2">
            <Link to="/admin/settings">Settings</Link>
          </Menu.Item>
        </Menu.ItemGroup>
      </Menu>
    </Sider>
  );
};

export default Sidebar;