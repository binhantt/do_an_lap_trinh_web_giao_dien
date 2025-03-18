import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Row, Col, Typography, Image, Space, Tag, Button, InputNumber, Descriptions, Input, message } from 'antd';
import { ShoppingCartOutlined, LoginOutlined } from '@ant-design/icons';
import Navbar from '../../components/layout/user/Navbar';
import { createOrder } from '../../redux/order/orderAPI';
import { fetchUserProducts } from '../../redux/product/productAPI';
import { Modal } from 'antd'; // Import Modal from Ant Design

const { Title, Text } = Typography;

const ProductDetail = () => {
    const { productname } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);
    const [shippingAddress, setShippingAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    useEffect(() => {
        dispatch(fetchUserProducts());
    }, [dispatch]);
    console.log(productname);
    const formatProductName = (name) => {
        return name.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .replace(/\s+/g, '-')
            .replace(/[^\w-]/g, '');
    };

    const product = useSelector(state =>
        state.product.products.find(p =>
            formatProductName(p.name) === productname
        )
    );
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const user = useSelector(state => state.auth.user);
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

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            message.warning('Please login to add items to cart');
            navigate('/login');
            return;
        }

        if (product.stock < quantity) {
            message.error('Not enough stock available');
            return;
        }

        if (!shippingAddress || !phoneNumber) {
            message.error('Please provide shipping address and phone number');
            return;
        }

        Modal.confirm({
            title: 'Confirm Purchase',
            content: 'Do you want to purchase this product?',
            onOk: async () => {
                const orderData = {
                    userId: user.id,
                    orderDate: new Date().toISOString(),
                    status: 'Pending',
                    totalAmount: product.price * quantity,
                    shippingAddress,
                    phoneNumber,
                    paymentMethod: 'COD',
                    paymentStatus: 'Pending',
                    orderDetails: [
                        {
                            ProductId: product.id,
                            quantity,
                            Price: product.price
                        }
                    ]
                };

                const result = await dispatch(createOrder(orderData));

                if (result) {
                    message.success('Order created successfully');
                } else {
                    message.error('Failed to create order');
                }
            }
        });
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

                                <Input
                                    placeholder="Enter shipping address"
                                    value={shippingAddress}
                                    onChange={(e) => setShippingAddress(e.target.value)}
                                />

                                <Input
                                    placeholder="Enter phone number"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />

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
                                        mua san pham
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