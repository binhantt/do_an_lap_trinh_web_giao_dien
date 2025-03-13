import React from 'react';
import { Layout, Badge, Avatar, Space, Dropdown, Menu } from 'antd';
import { UserOutlined, BellOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutAdmin } from "../../../redux/auth/authAPI";

const { Header } = Layout;

const Navbar = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      dispatch(logoutAdmin());
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />}>Profile</Menu.Item>
      <Menu.Item key="2" icon={<SettingOutlined />}>Settings</Menu.Item>
      <Menu.Item key="3" icon={<LogoutOutlined />} onClick={handleLogout}>Logout</Menu.Item>
    </Menu>
  );

  return (
    <Header className="bg-white p-4 flex justify-between items-center shadow-sm">
      <Space>
        <Badge count={1} className="mr-4">
          <BellOutlined style={{ fontSize: '20px' }} />
        </Badge>
        <Dropdown overlay={userMenu} trigger={['click']}>
          <Space className="cursor-pointer">
            <Avatar icon={<UserOutlined />} />
            <span>{user?.name || 'Admin'}</span>
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default Navbar;