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
    const user = useSelector(state => {
        if (!state.auth.user) return null;
      
        return state.auth.user.user || state.auth.user;
    });

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
                <Link to={`/profile/${user?.fullName || 'default'}`}>Profile</Link> 
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

    const formatCategoryName = (name) => {
        return name.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .replace(/\s+/g, '-');
    };

    return (
        <div className="navbar" style={{ display: 'flex', alignItems: 'center', padding: '0 20px', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
            <div className="logo" style={{ flex: '1' }}>
                <Link to="/" style={{ fontSize: '24px', fontWeight: 'bold' }} className='text-[#40a9ff]'>Đom Đóm Hack</Link>
            </div>
            <Menu mode="horizontal" style={{ flex: '2', justifyContent: 'end' }}>
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
                    <Dropdown overlay={userMenu} trigger={['click']} style={{ marginLeft: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <Avatar 
                                src={user?.avatarUrl} 
                                icon={<UserOutlined />}
                                style={{ marginRight: '8px' }}
                            />
                            <span>{user?.fullName || 'Guest'}</span>
                        </div>
                    </Dropdown>
                )}
            </Menu>
        </div>
    );
};

export default Navbar;