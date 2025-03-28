import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Image, Space, Tag, Spin, Input, Pagination, Empty, Breadcrumb } from 'antd';
import { SearchOutlined, HomeOutlined, ShopOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchUserProducts } from '../../redux/product/productAPI';
import { fetchUserCategories } from '../../redux/category/categoryAPI';
import LayoutUser from '../../components/layout/user/LayoutUser';
import { debounce } from 'lodash';
import { formatProductName } from '../../utils/formatters';

const { Title, Text } = Typography;
const { Meta } = Card;
const { Search } = Input;

const CategoryPage = () => {
    const { categoryName } = useParams();
    const dispatch = useDispatch();
    const { products, loading } = useSelector(state => state.product);
    const { categories } = useSelector(state => state.category);

    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 12;

    useEffect(() => {
        dispatch(fetchUserProducts());
        dispatch(fetchUserCategories());
    }, [dispatch]);

    const category = categories.find(cat => 
        cat.name.toLowerCase().normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .replace(/\s+/g, '-') === categoryName
    );

    const filteredProducts = products
        .filter(product => product.categoryId === category?.id)
        .filter(product =>
            product.name.toLowerCase().includes(searchText.toLowerCase()) ||
            product.description.toLowerCase().includes(searchText.toLowerCase())
        );

    const startIndex = (currentPage - 1) * pageSize;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);

    const handleSearch = debounce((value) => {
        setSearchText(value);
        setCurrentPage(1);
    }, 300);

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
            <div style={{ padding: '24px 60px' }}>
                <Breadcrumb style={{ marginBottom: '16px' }}>
                    <Breadcrumb.Item href="/">
                        <HomeOutlined /> Trang chủ
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <ShopOutlined /> {category ? category.name : 'Danh mục'}
                    </Breadcrumb.Item>
                </Breadcrumb>

                <Card>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Title level={2} style={{ margin: 0 }}>{category ? category.name : 'Danh mục không tồn tại'}</Title>
                            <Search
                                placeholder="Tìm kiếm sản phẩm..."
                                allowClear
                                onChange={(e) => handleSearch(e.target.value)}
                                style={{ width: 300 }}
                                prefix={<SearchOutlined />}
                            />
                        </div>

                        {filteredProducts.length === 0 ? (
                            <Empty description="Không tìm thấy sản phẩm" />
                        ) : (
                            <>
                                <Row gutter={[24, 24]}>
                                    {paginatedProducts.map(product => (
                                        <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                                            <Link to={`/product/${formatProductName(product.name)}`}>
                                                <Card
                                                    hoverable
                                                    bodyStyle={{ padding: '12px' }}
                                                    style={{ height: '100%' }}
                                                    cover={
                                                        <div style={{ 
                                                            position: 'relative',
                                                            paddingTop: '100%', // 1:1 Aspect ratio
                                                            overflow: 'hidden'
                                                        }}>
                                                            <Image
                                                                alt={product.name}
                                                                src={product.imageUrl}
                                                                style={{
                                                                    position: 'absolute',
                                                                    top: 0,
                                                                    left: 0,
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    objectFit: 'cover'
                                                                }}
                                                                preview={false}
                                                            />
                                                        </div>
                                                    }
                                                >
                                                    <Meta
                                                        title={
                                                            <Text 
                                                                strong 
                                                                style={{ 
                                                                    color: '#333',
                                                                    fontSize: '16px',
                                                                    display: '-webkit-box',
                                                                    WebkitLineClamp: 2,
                                                                    WebkitBoxOrient: 'vertical',
                                                                    overflow: 'hidden',
                                                                    height: '48px'
                                                                }}
                                                            >
                                                                {product.name}
                                                            </Text>
                                                        }
                                                        description={
                                                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                                                <Text 
                                                                    strong 
                                                                    style={{ 
                                                                        color: '#ff6600', 
                                                                        fontSize: '18px',
                                                                        display: 'block'
                                                                    }}
                                                                >
                                                                    {product.price.toLocaleString()} VND
                                                                </Text>
                                                                <Tag color="#ff6600" style={{ margin: '4px 0' }}>
                                                                    {category?.name}
                                                                </Tag>
                                                            </Space>
                                                        }
                                                    />
                                                </Card>
                                            </Link>
                                        </Col>
                                    ))}
                                </Row>

                                <Pagination
                                    current={currentPage}
                                    total={filteredProducts.length}
                                    pageSize={pageSize}
                                    onChange={setCurrentPage}
                                    style={{ textAlign: 'center', marginTop: '24px' }}
                                />
                            </>
                        )}
                    </Space>
                </Card>
            </div>
        </LayoutUser>
    );
};

export default CategoryPage;
