import React, { useEffect } from 'react';
import { Menu, Avatar, Dropdown } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserCategories } from '../../../redux/category/categoryAPI';
import { UserOutlined, LogoutOutlined, HomeOutlined } from '@ant-design/icons';
import { logoutUser } from '../../../redux/auth/authAPI';
import menuItems from '../../../config/menuConfig';

const { SubMenu } = Menu;

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { categories } = useSelector(state => state.category);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const user = useSelector(state => state.auth.user);

    useEffect(() => {
        dispatch(fetchUserCategories());
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/');
    };

    const userMenu = (
        <Menu>
            <Menu.Item key="profile">
                <Link to="/profile">Profile</Link>
            </Menu.Item>
            <Menu.Item key="orders">
                <Link to="/orders">My Orders</Link>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="logout" onClick={handleLogout} icon={<LogoutOutlined />}>
                Logout
            </Menu.Item>
        </Menu>
    );

    // Function to remove special characters and spaces
    const formatCategoryName = (name) => {
        return name.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .replace(/\s+/g, '-');
    };

    return (
        <div className="navbar">
            <div className="logo">
                <Link to="/">Shop </Link>
            </div>
            <Menu mode="horizontal" defaultSelectedKeys={['home']}>
                <Menu.Item key="home" icon={<HomeOutlined />}>
                    <Link to="/">Trang chủ</Link>
                </Menu.Item>
                <SubMenu key="categories" title="Sản Phẩm">
                    {categories.map(category => (
                        <Menu.Item key={`cat-${category.id}`}>
                            <Link to={`/category/${formatCategoryName(category.name)}`}>
                                {category.name}
                            </Link>
                        </Menu.Item>
                    ))}
                </SubMenu>
                {menuItems.map(item => (
                    item.path !== '/login' || !isAuthenticated ? (
                        <Menu.Item key={item.key}>
                            <Link to={item.path}>{item.label}</Link>
                        </Menu.Item>
                    ) : null
                ))}
                {isAuthenticated && (
                    <Menu.Item key="user-avatar" style={{ marginLeft: 'auto' }}>
                        <Dropdown overlay={userMenu} trigger={['click']}>
                            <Avatar 
                                style={{ cursor: 'pointer' }}
                                src={user?.avatarUrl}
                                icon={<UserOutlined />}
                            />
                        </Dropdown>
                    </Menu.Item>
                )}
            </Menu>
        </div>
    );
};

export default Navbar;