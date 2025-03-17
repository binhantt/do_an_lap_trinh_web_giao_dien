import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, Row, Col, Typography, Image, Space, Tag, Button, InputNumber, Descriptions, message } from 'antd';
import { ShoppingCartOutlined, LoginOutlined } from '@ant-design/icons';
import Navbar from '../../components/layout/user/Navbar';

const { Title, Text } = Typography;

const ProductDetail = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    
    const product = useSelector(state => 
        state.product.products.find(p => p.id === parseInt(productId))
    );
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const category = useSelector(state => 
        state.category.categories.find(c => c.id === product?.categoryId)
    );

    if (!product) {
        return (
            <>
                <Navbar />
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Text>Product not found</Text>
                </div>
            </>
        );
    }

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            message.warning('Please login to add items to cart');
            navigate('/login');
            return;
        }

        if (product.stock < quantity) {
            message.error('Not enough stock available');
            return;
        }
        // Add to cart logic here
    };

    return (
        <div>
            <Navbar />
            <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
                <Card>
                    <Row gutter={[32, 32]}>
                        <Col xs={24} md={12}>
                            {product.imageUrl && (
                                <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    style={{ width: '100%', maxHeight: 500, objectFit: 'cover' }}
                                />
                            )}
                        </Col>
                        <Col xs={24} md={12}>
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <Title level={2}>{product.name}</Title>
                                <Text>{product.description}</Text>
                                <Title level={3}>{product.price.toLocaleString()} VND</Title>
                                
                                <Space>
                                    <Text>Quantity:</Text>
                                    <InputNumber 
                                        min={1} 
                                        max={product.stock} 
                                        value={quantity}
                                        onChange={setQuantity}
                                        disabled={!isAuthenticated || product.stock === 0}
                                    />
                                </Space>

                                <Tag color={product.stock > 0 ? 'green' : 'red'} style={{ fontSize: '16px' }}>
                                    {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                                </Tag>

                                {isAuthenticated ? (
                                    <Button 
                                        type="primary" 
                                        size="large"
                                        icon={<ShoppingCartOutlined />}
                                        onClick={handleAddToCart}
                                        disabled={product.stock === 0}
                                        style={{ width: '200px' }}
                                    >
                                        Add to Cart
                                    </Button>
                                ) : (
                                    <Button 
                                        type="primary" 
                                        size="large"
                                        icon={<LoginOutlined />}
                                        onClick={() => navigate('/login')}
                                        style={{ width: '200px' }}
                                    >
                                        Login to Purchase
                                    </Button>
                                )}

                                <Descriptions bordered column={1}>
                                    <Descriptions.Item label="Category">
                                        {category?.name}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Product Code">
                                        {product.id}
                                    </Descriptions.Item>
                                </Descriptions>
                            </Space>
                        </Col>
                    </Row>
                </Card>
            </div>
        </div>
    );
};

export default ProductDetail;