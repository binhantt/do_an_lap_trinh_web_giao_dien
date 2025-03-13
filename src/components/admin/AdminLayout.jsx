import React, { useState } from 'react';
import { Layout } from 'antd';
import { useSelector } from 'react-redux';
import Navbar from '../layout/admin/Navbar';
import Sidebar from '../layout/admin/Sidebar';

const { Content } = Layout;

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector((state) => state.auth);

  return (
    <Layout className="min-h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout>
        <Navbar user={user} />
        <Content className="m-6 bg-white p-6 rounded shadow-sm">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;