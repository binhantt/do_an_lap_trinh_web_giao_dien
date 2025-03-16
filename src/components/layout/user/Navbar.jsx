import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import menuItems from '../../../config/menuConfig';

const Navbar = () => {
    return (
        <div className="navbar">
            <div className="logo">
                <Link to="/">Đom Đóm Hack</Link>
            </div>
            <Menu mode="horizontal" defaultSelectedKeys={['home']}>
                {menuItems.map(item => (
                    <Menu.Item key={item.key}>
                        <Link to={item.path}>{item.label}</Link>
                    </Menu.Item>
                ))}
            </Menu>
        </div>
    );
};

export default Navbar;