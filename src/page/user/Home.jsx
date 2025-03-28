import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Image, Space, Tag, Spin, Input, Pagination, Empty, Carousel } from 'antd';
import { SearchOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProducts } from '../../redux/product/productAPI';
import { fetchUserCategories } from '../../redux/category/categoryAPI';
import LayoutUser from '../../components/layout/user/LayoutUser';
import { Link } from 'react-router-dom';
import { formatProductName } from '../../utils/formatters';

const { Title, Text } = Typography;
const { Meta } = Card;
const { Search } = Input;

const Home = () => {
    const dispatch = useDispatch();
    const { products, loading } = useSelector(state => state.product);
    const { categories } = useSelector(state => state.category);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;

    useEffect(() => {
        dispatch(fetchUserProducts());
        dispatch(fetchUserCategories());
    }, [dispatch]);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchText.toLowerCase()) ||
        product.description.toLowerCase().includes(searchText.toLowerCase())
    );

    const groupedProducts = categories.map(category => ({
        category,
        products: filteredProducts.filter(product => product.categoryId === category.id)
    })).filter(group => group.products.length > 0);

    const totalProducts = filteredProducts.length;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedGroups = groupedProducts.map(group => ({
        ...group,
        products: group.products.slice(startIndex, endIndex)
    })).filter(group => group.products.length > 0);

    if (loading) {
        return (
            <LayoutUser>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Spin size="large" />
                </div>
            </LayoutUser>
        );
    }

    return (
        <LayoutUser>
            {/* Banner Section */}
            <Carousel autoplay>
                <div>
                    <div style={{ height: '400px', background: '#364d79', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Title level={2} style={{ color: 'white' }}>Chào mừng đến với Đom Đóm Shop</Title>
                    </div>
                </div>
                <div>
                    <div style={{ height: '400px', background: '#ff6600', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Title level={2} style={{ color: 'white' }}>Khuyến mãi đặc biệt</Title>
                    </div>
                </div>
            </Carousel>

            {/* Search Section */}
            <div style={{ 
                padding: '24px',
                background: '#fff8e6',
                borderBottom: '1px solid #eaeaea'
            }}>
                <div style={{ 
                    maxWidth: '800px',
                    margin: '0 auto',
                    textAlign: 'center'
                }}>
                    <Title level={2} style={{ marginBottom: '20px' }}>Tìm kiếm sản phẩm</Title>
                    <Search
                        placeholder="Nhập tên sản phẩm..."
                        allowClear
                        enterButton={<SearchOutlined />}
                        size="large"
                        onChange={(e) => {
                            setSearchText(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            </div>

            {/* Products Section */}
            <div style={{ 
                padding: '40px 24px',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {paginatedGroups.length === 0 ? (
                    <Empty description="Không tìm thấy sản phẩm" />
                ) : (
                    paginatedGroups.map(group => (
                        <div key={group.category.id} style={{ marginBottom: '40px' }}>
                            <Title level={2} style={{ 
                                borderBottom: '2px solid #ff6600',
                                paddingBottom: '10px',
                                marginBottom: '20px'
                            }}>
                                {group.category.name}
                            </Title>
                            <Row gutter={[24, 24]}>
                                {group.products.map(product => (
                                    <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                                        <Link to={`/product/${formatProductName(product.name)}`}>
                                            <Card
                                                hoverable
                                                style={{ 
                                                    height: '100%',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                }}
                                                cover={
                                                    product.imageUrl && (
                                                        <Image
                                                            alt={product.name}
                                                            src={product.imageUrl}
                                                            style={{ 
                                                                height: '200px',
                                                                objectFit: 'cover',
                                                                borderBottom: '1px solid #eaeaea'
                                                            }}
                                                            preview={false}
                                                        />
                                                    )
                                                }
                                            >
                                                <Meta
                                                    title={<Text strong style={{ fontSize: '16px' }}>{product.name}</Text>}
                                                    description={
                                                        <Space direction="vertical" style={{ width: '100%' }}>
                                                            <Text type="secondary" style={{ 
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: 'vertical',
                                                            }}>
                                                                {product.description}
                                                            </Text>
                                                            <Text strong style={{ color: '#ff6600', fontSize: '18px' }}>
                                                                {product.price.toLocaleString()} VND
                                                            </Text>
                                                            <Tag color={product.stock > 0 ? 'green' : 'red'}>
                                                                {product.stock > 0 ? `Còn hàng (${product.stock})` : 'Hết hàng'}
                                                            </Tag>
                                                            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                                                                <ShoppingCartOutlined style={{ fontSize: '20px', color: '#ff6600' }} />
                                                            </div>
                                                        </Space>
                                                    }
                                                />
                                            </Card>
                                        </Link>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    ))
                )}
            </div>
        </LayoutUser>
    );
};

export default Home;
                                                   