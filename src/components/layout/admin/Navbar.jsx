import React from "react";
import { Layout, Input, Avatar, Space, Typography, Dropdown, Menu } from "antd";
import { SearchOutlined, BellOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../../../redux/auth/authAPI";

const { Header } = Layout;
const { Text } = Typography;

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
      <Menu.Divider />
      <Menu.Item key="2" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#fff",
        padding: "0 20px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Ô tìm kiếm */}
      <Input
        placeholder="Search"
        prefix={<SearchOutlined />}
        style={{
          width: 250,
          borderRadius: 20,
          border: "none",
          padding: "8px 16px",
        }}
      />

      {/* Biểu tượng bên phải */}
      <Space size="middle">
        {/* Cờ chọn ngôn ngữ */}
        <img
          src="https://flagcdn.com/w40/gb.png"
          alt="English"
          style={{ width: 40, height: 16, borderRadius: 4, cursor: "pointer" }}
        />

        {/* Icon thông báo */}
        <BellOutlined style={{ fontSize: 20, cursor: "pointer" }} />

        {/* Avatar & tên người dùng */}
        <Dropdown overlay={userMenu} trigger={['click']} placement="bottomRight">
          <Space style={{ cursor: "pointer" }}>
            <Text>{user?.name || "Guest"}</Text>
            <Avatar src={user?.avatar || "https://i.pravatar.cc/40"} />
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default Navbar;
