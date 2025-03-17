import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Image, Space, Tag, Spin, Input, Pagination, Empty } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchUserProducts } from '../../redux/product/productAPI';
import { fetchUserCategories } from '../../redux/category/categoryAPI';
import Navbar from '../../components/layout/user/Navbar';
import { debounce } from 'lodash';

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
            <>
                <Navbar />
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Spin size="large" />
                </div>
            </>
        );
    }

    return (
        <div>
            <Navbar />
            <div style={{ padding: '24px' }}>
                <Title level={2}>{category ? category.name : 'Category Not Found'}</Title>
                {filteredProducts.length === 0 ? (
                    <Empty description="No products found" />
                ) : (
                    <>
                        <Row gutter={[16, 16]}>
                            {paginatedProducts.map(product => (
                                <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                                    <Card
                                        hoverable
                                        cover={<Image alt={product.name} src={product.imageUrl} />}
                                    >
                                        <Meta
                                            title={product.name}
                                            description={
                                                <Space direction="vertical">
                                                    <Text strong>{product.price} VND</Text>
                                                    <Tag color="blue">{category?.name}</Tag>
                                                </Space>
                                            }
                                        />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;
