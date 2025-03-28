import React, { useState } from 'react';
import { Layout } from 'antd';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const { Content } = Layout;

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector((state) => state.auth);

  return (
    <Layout className="min-h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout>
        <Navbar user={user} />
        <Content  className="m-0 p-4 overflow-auto" style={{ height: 'calc(100vh - 64px)' , padding : "2rem"}}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
