import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
    Card, Row, Col, Typography, Image, Space, Tag, Button, InputNumber, 
    Breadcrumb, Form, Input, message, Divider, Rate, Alert 
} from 'antd';
import { 
    ShoppingCartOutlined, 
    HeartOutlined,
    HomeOutlined,
    ShopOutlined,
    PhoneOutlined,
    EnvironmentOutlined
} from '@ant-design/icons';
import LayoutUser from '../../components/layout/user/LayoutUser';
import { createOrder } from '../../redux/order/orderAPI';
import { fetchUserProducts } from '../../redux/product/productAPI';
import { formatProductName } from '../../utils/formatters';

const { Title, Text, Paragraph } = Typography;

const ProductDetail = () => {
    const { productname } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);
    const [form] = Form.useForm();

    useEffect(() => {
        dispatch(fetchUserProducts());
    }, []); // Remove dispatch from dependency array as it's stable

    const formatProductName = (name) => {
        return name.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .replace(/\s+/g, '-');
    };

    const product = useSelector(state =>
        state.product.products.find(p => 
            p.name && formatProductName(p.name) === productname
        )
    );
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const user = useSelector(state => state.auth.user);
    const category = useSelector(state =>
        state.category.categories.find(c => c.id === product?.categoryId)
    );

    if (!product) {
        return (
            <LayoutUser>
                <div style={{ padding: '50px' }}>
                    <Alert
                        message="Không tìm thấy sản phẩm"
                        description="Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."
                        type="error"
                        showIcon
                    />
                </div>
            </LayoutUser>
        );
    }

    return (
        <LayoutUser>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 16px' }}>
                <Breadcrumb style={{ marginBottom: '16px' }}>
                    <Breadcrumb.Item href="/">
                        <HomeOutlined /> Trang chủ
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href={`/category/${formatProductName(category?.name)}`}>
                        <ShopOutlined /> {category?.name}
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
                </Breadcrumb>

                <Card bodyStyle={{ padding: '32px' }}>
                    <Row gutter={[64, 32]}>
                        <Col xs={24} md={12}>
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <div style={{ 
                                    position: 'sticky',
                                    top: '24px'
                                }}>
                                    <Image
                                        src={product.imageUrl}
                                        alt={product.name}
                                        style={{
                                            width: '100%',
                                            borderRadius: '8px',
                                            maxHeight: '500px',
                                            objectFit: 'contain'
                                        }}
                                    />
                                    
                                    <Card style={{ marginTop: '24px' }}>
                                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                            <Title level={4}>Thông tin sản phẩm</Title>
                                            <div>
                                                <Text strong>Thương hiệu:</Text>
                                                <Text> {product.brand || 'Apple'}</Text>
                                            </div>
                                            <div>
                                                <Text strong>Danh mục:</Text>
                                                <Text> {category?.name}</Text>
                                            </div>
                                            <div>
                                                <Text strong>Tình trạng:</Text>
                                                <Text> {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}</Text>
                                            </div>
                                            <div>
                                                <Text strong>Mã sản phẩm:</Text>
                                                <Text> {product.id}</Text>
                                            </div>
                                        </Space>
                                    </Card>

                                    <Card style={{ marginTop: '24px' }}>
                                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                            <Title level={4}>Chính sách bán hàng</Title>
                                            <div>
                                                <Text>✓ Cam kết chính hãng 100%</Text>
                                            </div>
                                            <div>
                                                <Text>✓ Miễn phí giao hàng toàn quốc</Text>
                                            </div>
                                            <div>
                                                <Text>✓ Đổi trả trong vòng 7 ngày</Text>
                                            </div>
                                            <div>
                                                <Text>✓ Bảo hành 12 tháng chính hãng</Text>
                                            </div>
                                        </Space>
                                    </Card>
                                </div>
                            </Space>
                        </Col>
                        <Col xs={24} md={12}>
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <div>
                                    <Title level={2} style={{ 
                                        marginBottom: '8px',
                                        fontSize: '28px'
                                    }}>{product.name}</Title>
                                    <Rate disabled defaultValue={4.5} style={{ color: '#ff6600' }} />
                                </div>

                                <Title level={2} style={{ 
                                    color: '#ff6600', 
                                    margin: '16px 0',
                                    fontSize: '32px'
                                }}>
                                    {product.price.toLocaleString()} VND
                                </Title>

                                <Paragraph style={{ 
                                    fontSize: '16px',
                                    lineHeight: '1.8'
                                }}>{product.description}</Paragraph>

                                <Divider />

                                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <Text strong style={{ fontSize: '16px' }}>Số lượng:</Text>
                                        <InputNumber
                                            min={1}
                                            max={product.stock}
                                            value={quantity}
                                            onChange={setQuantity}
                                            style={{ width: '120px' }}
                                            size="large"
                                        />
                                    </div>

                                    <Tag color={product.stock > 0 ? 'success' : 'error'} style={{ padding: '4px 12px', fontSize: '14px' }}>
                                        {product.stock > 0 ? `Còn hàng (${product.stock})` : 'Hết hàng'}
                                    </Tag>
                                </Space>

                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={handleAddToCart}
                                    style={{ marginTop: '24px' }}
                                >
                                    <Form.Item
                                        name="shippingAddress"
                                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ giao hàng' }]}
                                    >
                                        <Input 
                                            prefix={<EnvironmentOutlined />} 
                                            placeholder="Địa chỉ giao hàng"
                                            size="large"
                                            disabled={!isAuthenticated}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="phoneNumber"
                                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                                    >
                                        <Input 
                                            prefix={<PhoneOutlined />} 
                                            placeholder="Số điện thoại"
                                            size="large"
                                            disabled={!isAuthenticated}
                                        />
                                    </Form.Item>

                                    <Space size="middle" style={{ marginTop: '16px' }}>
                                        <Button
                                            type="primary"
                                            size="large"
                                            icon={<ShoppingCartOutlined />}
                                            htmlType="submit"
                                            disabled={!isAuthenticated || product.stock === 0}
                                            onClick={() => !isAuthenticated && message.warning('Vui lòng đăng nhập để mua hàng')}
                                            style={{ 
                                                backgroundColor: '#ff6600',
                                                borderColor: '#ff6600',
                                                height: '48px',
                                                padding: '0 32px',
                                                fontSize: '16px'
                                            }}
                                        >
                                            {isAuthenticated ? 'Mua ngay' : 'Đăng nhập để mua hàng'}
                                        </Button>
                                        <Button
                                            size="large"
                                            icon={<HeartOutlined />}
                                            style={{
                                                height: '48px',
                                                padding: '0 32px',
                                                fontSize: '16px'
                                            }}
                                        >
                                            Yêu thích
                                        </Button>
                                    </Space>
                                </Form>
                            </Space>
                        </Col>
                    </Row>
                </Card>
            </div>
        </LayoutUser>
    );
};

export default ProductDetail;