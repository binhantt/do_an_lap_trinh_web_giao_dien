import React, { useEffect } from 'react';
import { Menu, Avatar, Dropdown, Badge, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserCategories } from '../../../redux/category/categoryAPI';
import { fetchOrders } from '../../../redux/order/orderAPI';
import { 
  UserOutlined, 
  LogoutOutlined, 
  ShoppingCartOutlined, 
  HeartOutlined,
  MenuOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { logoutUser } from '../../../redux/auth/authAPI';

const { Text } = Typography;

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { categories } = useSelector(state => state.category);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const user = useSelector(state => state.auth.user);
    const orders = useSelector(state => state.order.orders);

    useEffect(() => {
        dispatch(fetchUserCategories());
    }, [dispatch]);

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchOrders());
        }
    }, [user, dispatch]);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/');
    };

    const userMenu = (
        <Menu>
            <Menu.Item key="profile">
                <Link to={`/profile/${user?.fullName || 'default'}`}>
                    <UserOutlined /> Hồ sơ
                </Link>
            </Menu.Item>
            <Menu.Item key="orders">
                <Link to="/orders">Đơn hàng của tôi</Link>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="logout" onClick={handleLogout}>
                <LogoutOutlined /> Đăng xuất
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

    const categoryMenu = (
        <Menu>
            {categories.map(category => (
                <Menu.Item key={`cat-${category.id}`}>
                    <Link to={`/category/${formatCategoryName(category.name)}`}>
                        {category.name}
                    </Link>
                </Menu.Item>
            ))}
        </Menu>
    );

    return (
        <>
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '8px 20px', 
                backgroundColor: 'white',
                borderBottom: '1px solid #eaeaea'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                    <Link to="/" style={{ 
                        fontSize: '22px', 
                        fontWeight: 'bold', 
                        color: '#ff6600',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                      
                        Pesco
                    </Link>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Text type="secondary" style={{ fontSize: '13px' }}>Hỗ trợ 24/7</Text>
                        <Text strong style={{ fontSize: '14px' }}>894.4567 123 94+</Text>
                    </div>
                    {isAuthenticated ? (
                        <Dropdown 
                            overlay={userMenu} 
                            trigger={['click']}
                            placement="bottomRight"
                        >
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                cursor: 'pointer',
                                gap: '8px'
                            }}>
                                <Avatar 
                                    size="small"
                                    icon={<UserOutlined />} 
                                    src={user?.avatarUrl}
                                />
                                <Text strong style={{ fontSize: '14px' }}>
                                    {user?.fullName || 'Người dùng'}
                                </Text>
                            </div>
                        </Dropdown>
                    ) : (
                        <Link to="/login" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '14px',
                            color: '#333'
                        }}>
                            <UserOutlined />
                            <Text strong>Đăng nhập</Text>
                        </Link>
                    )}
                </div>
            </div>

            <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 20px',
                backgroundColor: '#fff8e6',
                borderBottom: '1px solid #ffe6cc'
            }}>
                <Dropdown 
                    overlay={categoryMenu}
                    trigger={['hover']}
                >
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '5px',
                        cursor: 'pointer'
                    }}>
                        <MenuOutlined style={{ fontSize: '16px' }} />
                        <Text strong>Danh mục sản phẩm</Text>
                    </div>
                </Dropdown>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Link to="/khuyen-mai" style={{ 
                        color: '#ff6600', 
                        fontWeight: 'bold',
                        fontSize: '14px'
                    }}>
                        Khuyến mãi
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <Link to="/wishlist">
                            <Badge count={0} size="small">
                                <HeartOutlined style={{ fontSize: '18px', color: '#666' }} />
                            </Badge>
                        </Link>
                        <Link to={`/profile/${user?.fullName}`}>
                            <Badge count={orders?.filter(order => order.userId === user?.id)?.length || 0} size="small">
                                <ShoppingCartOutlined style={{ fontSize: '18px', color: '#666' }} />
                            </Badge>
                        </Link>
                       
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;