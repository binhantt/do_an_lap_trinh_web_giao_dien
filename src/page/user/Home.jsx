import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Image, Space, Tag, Spin, Input, Pagination, Empty } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProducts } from '../../redux/product/productAPI';
import { fetchUserCategories } from '../../redux/category/categoryAPI';
import Navbar from '../../components/layout/user/Navbar';
import { Link } from 'react-router-dom';

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
            <>
                <Navbar />
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Spin size="large" />
                </div>
            </>
        );
    }

    // Add a function to format product name for URL
    const formatProductName = (name) => {
        return name.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .replace(/\s+/g, '-')
            .replace(/[^\w-]/g, '');
    };

    return (
        <div>
            <Navbar />
            <div style={{ padding: '24px' }}>
                <div style={{ marginBottom: '24px', maxWidth: '500px', margin: '0 auto' }}>
                    <Search
                        placeholder="Search products..."
                        allowClear
                        enterButton={<SearchOutlined />}
                        size="large"
                        onChange={(e) => {
                            setSearchText(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>

                {paginatedGroups.length === 0 ? (
                    <Empty description="No products found" />
                ) : (
                    paginatedGroups.map(group => (
                        <div key={group.category.id} style={{ marginBottom: '32px' }}>
                            <Title level={2}>{group.category.name}</Title>
                            <Row gutter={[16, 16]}>
                                {group.products.map(product => (
                                    <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                                        <Link to={`/product/${formatProductName(product.name)}`}>
                                            <Card
                                                hoverable
                                                cover={
                                                    product.imageUrl && (
                                                        <Image
                                                            alt={product.name}
                                                            src={product.imageUrl}
                                                            style={{ height: '200px', objectFit: 'cover' }}
                                                        />
                                                    )
                                                }
                                            >
                                                <Meta
                                                    title={product.name}
                                                    description={
                                                        <Space direction="vertical">
                                                            <Text>{product.description}</Text>
                                                            <Text strong>{product.price.toLocaleString()} VND</Text>
                                                            <Tag color={product.stock > 0 ? 'green' : 'red'}>
                                                                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                                                            </Tag>
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
        </div>
    );
};

export default Home;
                                                   