import React from 'react';
import { Layout } from 'antd';
import Navbar from './Navbar';
import AppFooter from './Footer';

const LayoutUser = ({ children }) => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Navbar />
            <Layout.Content style={{ 
                backgroundColor: '#f5f5f5',
                minHeight: 'calc(100vh - 120px)'
            }}>
                {children}
            </Layout.Content>
            <AppFooter />
        </Layout>
    );
};

export default LayoutUser;