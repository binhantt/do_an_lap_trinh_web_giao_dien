import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import { 
  DashboardOutlined, 
  UserOutlined, 
  AppstoreOutlined, 
  ShoppingCartOutlined, 
  SolutionOutlined, 
  ProjectOutlined, 
  FileOutlined, 
  SettingOutlined 
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const { Sider } = Layout;
const { Title } = Typography;

const Sidebar = ({ collapsed }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Menu data structure
  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      path: '/admin/dashboard',
      type: 'item'
    },
    {
      type: 'divider'
    },
    {
      type: 'group',
      title: 'Quản lý bán hàng',
      items: [
        {
          key: 'products',
          icon: <ProjectOutlined />,
          label: 'Sản phẩm',
          path: '/admin/dashboard/products',
          type: 'item'
        },
        {
          key: 'categories',
          icon: <AppstoreOutlined />,
          label: 'Danh mục',
          path: '/admin/dashboard/categories',
          type: 'item'
        },
        {
          key: 'orders',
          icon: <ShoppingCartOutlined />,
          label: 'Đơn hàng',
          path: '/admin/dashboard/orders',
          type: 'item'
        },
        {
          key: 'customers',
          icon: <SolutionOutlined />,
          label: 'Khách hàng',
          path: '/admin/dashboard/customers',
          type: 'item'
        }
      ]
    },
    {
      type: 'divider'
    },
   
  ];

  // Function to render menu items
  const renderMenuItems = (items) => {
    return items.map(item => {
      if (item.type === 'divider') {
        return <Menu.Divider key={`divider-${Math.random()}`} className="my-2" />;
      } else if (item.type === 'group') {
        return (
          <Menu.ItemGroup 
            key={`group-${item.title}`} 
            title={item.title} 
            className="px-4 text-xs font-medium text-gray-400"
          >
            {renderMenuItems(item.items)}
          </Menu.ItemGroup>
        );
      } else if (item.type === 'item') {
        return (
          <Menu.Item key={item.key} icon={item.icon} className="rounded-md mx-2">
            <Link to={item.path}>{item.label}</Link>
          </Menu.Item>
        );
      }
      return null;
    });
  };

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
        defaultSelectedKeys={[currentPath.split('/').pop() || 'dashboard']}
        style={{ borderRight: 0, background: '#ffffff' }}
        className="border-0 mt-4"
      >
        {renderMenuItems(menuItems)}
      </Menu>
    </Sider>
  );
};

export default Sidebar;