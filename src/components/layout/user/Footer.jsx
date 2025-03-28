import React from 'react';
import { Layout, Row, Col, Typography, Space, Divider } from 'antd';
import { 
    PhoneOutlined, 
    MailOutlined, 
    FacebookOutlined, 
    InstagramOutlined, 
    YoutubeOutlined 
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Text, Title } = Typography;
const { Footer } = Layout;

const AppFooter = () => {
    return (
        <Footer style={{ 
            backgroundColor: '#fff', 
            padding: '40px 20px',
            borderTop: '1px solid #eaeaea'
        }}>
            <Row gutter={[32, 32]}>
                <Col xs={24} sm={12} md={6}>
                    <Title level={4} style={{ color: '#ff6600' }}>Pesco</Title>
                    <Space direction="vertical">
                        <Text>Địa chỉ: 475A Điện Biên Phủ, P.25, Q.Bình Thạnh, TP.HCM</Text>
                        <Text><PhoneOutlined /> Hotline: 894.4567 123 94+</Text>
                        <Text><MailOutlined /> Email: support@pesco.com</Text>
                    </Space>
                </Col>

                <Col xs={24} sm={12} md={6}>
                    <Title level={4}>Về Pesco</Title>
                    <Space direction="vertical">
                        <Link to="/about">Giới thiệu</Link>
                        <Link to="/contact">Liên hệ</Link>
                        <Link to="/recruitment">Tuyển dụng</Link>
                        <Link to="/news">Tin tức</Link>
                    </Space>
                </Col>

                <Col xs={24} sm={12} md={6}>
                    <Title level={4}>Hỗ trợ khách hàng</Title>
                    <Space direction="vertical">
                        <Link to="/shipping-policy">Chính sách vận chuyển</Link>
                        <Link to="/return-policy">Chính sách đổi trả</Link>
                        <Link to="/payment-guide">Hướng dẫn thanh toán</Link>
                        <Link to="/faq">Câu hỏi thường gặp</Link>
                    </Space>
                </Col>

                <Col xs={24} sm={12} md={6}>
                    <Title level={4}>Kết nối với chúng tôi</Title>
                    <Space size="large">
                        <FacebookOutlined style={{ fontSize: '24px', color: '#ff6600' }} />
                        <InstagramOutlined style={{ fontSize: '24px', color: '#ff6600' }} />
                        <YoutubeOutlined style={{ fontSize: '24px', color: '#ff6600' }} />
                    </Space>
                    <div style={{ marginTop: '20px' }}>
                        <img 
                            src="/images/payment-methods.png" 
                            alt="Payment methods" 
                            style={{ maxWidth: '200px' }}
                        />
                    </div>
                </Col>
            </Row>
            
            <Divider />
            
            <div style={{ textAlign: 'center' }}>
                <Text type="secondary">
                    © {new Date().getFullYear()} Pesco. Tất cả các quyền được bảo lưu.
                </Text>
            </div>
        </Footer>
    );
};

export default AppFooter;