import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  AppstoreOutlined,
  FileOutlined,
  SettingOutlined
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
      className="bg-white h-screen"
      width={220}

     
    >
      
      <Menu
        mode="inline"
        defaultSelectedKeys={['dashboard']}
        style={{ borderRight: 0 }}
        items={[
          {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: <Link to="/admin/dashboard">Dashboard</Link>,
            className: 'font-medium'
          },
          {
            type: 'divider'
          },
          {
            type: 'group',
            label: 'Management',
            children: [
              {
                key: 'users',
                icon: <UserOutlined />,
                label: <Link to="/admin/users">Users</Link>
              },
              {
                key: 'categories',
                icon: <AppstoreOutlined />,
                label: <Link to="/admin/categories">Categories</Link>
              },
              {
                key: 'game',
                icon:<></>,
                label: <Link to="/admin/games">Game</Link>
              },
              {
                key: 'packages',
                icon: <FileOutlined />,
                label: <Link to="/admin/packages">Packages</Link>
              }
            ]
          },
          {
            type: 'divider'
          },
          {
            type: 'group',
            label: 'System',
            children: [
              {
                key: 'settings',
                icon: <SettingOutlined />,
                label: <Link to="/admin/settings">Settings</Link>
              }
            ]
          }
        ]}
      />
    </Sider>
  );
};

export default Sidebar;