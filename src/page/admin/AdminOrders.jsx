import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Modal, Form, Typography, Card, message, Popconfirm, Row, Col, Select, Tag, Badge, Pagination, Descriptions } from 'antd';
import { SearchOutlined, EyeOutlined, EditOutlined, DeleteOutlined, ShoppingCartOutlined, CheckCircleOutlined, ClockCircleOutlined, DollarCircleOutlined } from '@ant-design/icons';
import AdminLayout from '../../components/layout/admin/AdminLayout';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, updateOrderStatus, deleteOrder } from '../../redux/order/orderAPI';
import StatCard from '../../components/base/StatCard';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;

const AdminOrders = () => {
    const dispatch = useDispatch();
    const ordersState = useSelector(state => state.order) || { orders: [], loading: false };
    const { orders, loading } = ordersState;
    
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [viewOrder, setViewOrder] = useState(null);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [form] = Form.useForm();
    const pageSize = 4; // 4 orders per page

    // Calculate stats - with null checks
    const pendingOrders = orders?.filter(order => order?.status === 'Pending')?.length || 0;
    const completedOrders = orders?.filter(order => order?.status === 'Completed')?.length || 0;
    const totalRevenue = orders?.reduce((sum, order) => sum + (Number(order?.totalAmount) || 0), 0) || 0;

    useEffect(() => {
        console.log('Fetching orders...');
        dispatch(fetchOrders()).then(result => {
            console.log('Orders fetched:', result);
        });
    }, [dispatch]);

    // Add debugging for the orders data
    useEffect(() => {
        console.log('Current orders state:', orders);
    }, [orders]);

    // Reset to first page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchText]);

    const handleViewOrder = (order) => {
        setViewOrder(order);
        setIsViewModalVisible(true);
    };

    const handleEditOrder = (order) => {
        setEditingOrder(order);
        form.setFieldsValue({
            status: order.status,
            paymentStatus: order.paymentStatus
        });
        setIsEditModalVisible(true);
    };

    const handleUpdateStatus = async (values) => {
        if (!editingOrder) return;
        
        try {
            // First update the order status
            const result = await dispatch(updateOrderStatus(editingOrder.id, values.status));
            
            if (result) {
                // If payment status is different from current, update it too
                if (values.paymentStatus !== editingOrder.paymentStatus) {
                    // You would need to implement updatePaymentStatus in orderAPI.js
                    // For now, we'll just show a message
                    message.info(`Payment status would be updated to: ${values.paymentStatus}`);
                }
                
                message.success('Order status updated successfully');
                dispatch(fetchOrders()); // Refresh orders
            } else {
                message.error('Failed to update order status');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            message.error('An error occurred while updating order status');
        }
        
        setIsEditModalVisible(false);
    };

    const handleDeleteOrder = async (id) => {
        try {
            const result = await dispatch(deleteOrder(id));
            if (result) {
                message.success('Order deleted successfully');
            } else {
                message.error('Failed to delete order');
            }
        } catch (error) {
            console.error('Error deleting order:', error);
            message.error('An error occurred while deleting order');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'blue';
            case 'Processing': return 'orange';
            case 'Shipped': return 'purple';
            case 'Delivered': return 'cyan';
            case 'Completed': return 'green';
            case 'Cancelled': return 'red';
            default: return 'default';
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'Paid': return 'green';
            case 'Pending': return 'orange';
            case 'Failed': return 'red';
            case 'Refunded': return 'purple';
            default: return 'default';
        }
    };

    const filteredOrders = orders?.filter(
            order => 
                (order?.id?.toString() || '').includes(searchText) ||
                (order?.status?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
                (order?.paymentMethod?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
                (order?.paymentStatus?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
                (order?.shippingAddress?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
                (order?.phoneNumber || '').includes(searchText)
        ) || [];

    // Calculate pagination
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Date',
            dataIndex: 'orderDate',
            key: 'orderDate',
            render: text => moment(text).format('DD/MM/YYYY HH:mm'),
            sorter: (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: status => (
                <Tag color={getStatusColor(status)}>
                    {status}
                </Tag>
            ),
            filters: [
                { text: 'Pending', value: 'Pending' },
                { text: 'Processing', value: 'Processing' },
                { text: 'Shipped', value: 'Shipped' },
                { text: 'Delivered', value: 'Delivered' },
                { text: 'Completed', value: 'Completed' },
                { text: 'Cancelled', value: 'Cancelled' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Total',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: amount => `$${Number(amount).toFixed(2)}`,
            sorter: (a, b) => a.totalAmount - b.totalAmount,
        },
        {
            title: 'Payment',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            render: status => (
                <Tag color={getPaymentStatusColor(status)}>
                    {status}
                </Tag>
            ),
            filters: [
                { text: 'Paid', value: 'Paid' },
                { text: 'Pending', value: 'Pending' },
                { text: 'Failed', value: 'Failed' },
                { text: 'Refunded', value: 'Refunded' },
            ],
            onFilter: (value, record) => record.paymentStatus === value,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Button 
                        type="primary" 
                        icon={<EyeOutlined />} 
                        size="small"
                        onClick={() => handleViewOrder(record)}
                    />
                    <Button 
                        type="default" 
                        icon={<EditOutlined />} 
                        size="small"
                        onClick={() => handleEditOrder(record)}
                    />
                    <Popconfirm
                        title="Are you sure you want to delete this order?"
                        description="This action cannot be undone."
                        onConfirm={() => handleDeleteOrder(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button 
                            type="primary" 
                            danger 
                            icon={<DeleteOutlined />} 
                            size="small"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout>
            {/* Summary Cards */}
            <div className="px-6 pt-6 pb-4">
                <Row gutter={[16, 16]}>
                    {[
                        {
                            icon: <ShoppingCartOutlined />,
                            title: "Total Orders",
                            value: orders.length,
                            color: "#1890ff",
                            change: 8,
                            changeText: "more than last month",
                            tooltip: "Total number of orders"
                        },
                        {
                            icon: <ClockCircleOutlined />,
                            title: "Pending Orders",
                            value: pendingOrders,
                            color: "#fa8c16",
                            change: 2,
                            changeText: "more than last month",
                            tooltip: "Orders awaiting processing"
                        },
                        {
                            icon: <DollarCircleOutlined />,
                            title: "Total Revenue",
                            value: `$${totalRevenue.toFixed(2)}`,
                            color: "#52c41a",
                            change: 12,
                            changeText: "more than last month",
                            tooltip: "Total revenue from all orders"
                        }
                    ].map((card, index) => (
                        <Col xs={24} sm={12} md={8} key={index}>
                            <StatCard 
                                icon={card.icon}
                                title={card.title}
                                value={card.value}
                                color={card.color}
                                change={card.change}
                                changeText={card.changeText}
                                tooltip={card.tooltip}
                                onClick={() => message.info(`Viewing details for ${card.title}`)}
                            />
                        </Col>
                    ))}
                </Row>
            </div>
            
            <div className="px-6 pb-6">
                <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <Title level={4}>Orders Management</Title>
                        <Space>
                            <Input
                                placeholder="Search orders"
                                prefix={<SearchOutlined />}
                                value={searchText}
                                onChange={e => setSearchText(e.target.value)}
                                style={{ width: 250 }}
                            />
                        </Space>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={paginatedOrders}
                        rowKey="id"
                        loading={loading}
                        pagination={false}
                    />
                    
                    {/* Custom pagination */}
                    <div className="mt-4 flex justify-end">
                        <Pagination
                            current={currentPage}
                            onChange={handlePageChange}
                            total={filteredOrders.length}
                            pageSize={pageSize}
                            showSizeChanger={false}
                            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} orders`}
                        />
                    </div>
                </Card>
            </div>

            {/* View Order Modal */}
            <Modal
                title={<span><ShoppingCartOutlined /> Order Details #{viewOrder?.id}</span>}
                open={isViewModalVisible}
                onCancel={() => setIsViewModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setIsViewModalVisible(false)}>
                        Close
                    </Button>
                ]}
                width={700}
            >
                {viewOrder && (
                    <>
                        <Descriptions bordered column={2} size="small" className="mb-4">
                            <Descriptions.Item label="Order Date" span={2}>
                                {moment(viewOrder.orderDate).format('DD/MM/YYYY HH:mm')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Status">
                                <Tag color={getStatusColor(viewOrder.status)}>{viewOrder.status}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Payment Status">
                                <Tag color={getPaymentStatusColor(viewOrder.paymentStatus)}>{viewOrder.paymentStatus}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Payment Method" span={2}>
                                {viewOrder.paymentMethod}
                            </Descriptions.Item>
                            <Descriptions.Item label="Shipping Address" span={2}>
                                {viewOrder.shippingAddress}
                            </Descriptions.Item>
                            <Descriptions.Item label="Phone Number" span={2}>
                                {viewOrder.phoneNumber}
                            </Descriptions.Item>
                            <Descriptions.Item label="Total Amount" span={2}>
                                <Text strong>${Number(viewOrder.totalAmount).toFixed(2)}</Text>
                            </Descriptions.Item>
                        </Descriptions>

                        <Title level={5}>Order Items</Title>
                        {viewOrder?.orderDetails && viewOrder.orderDetails.length > 0 ? (
                            <Table 
                                dataSource={viewOrder.orderDetails}
                                rowKey="id"
                                pagination={false}
                                size="small"
                                columns={[
                                    {
                                        title: 'Product',
                                        dataIndex: ['product', 'name'],
                                        key: 'product',
                                        render: (text, record) => record?.product?.name || 'Unknown Product'
                                    },
                                    {
                                        title: 'Price',
                                        dataIndex: 'price',
                                        key: 'price',
                                        render: price => `$${Number(price || 0).toFixed(2)}`
                                    },
                                    {
                                        title: 'Quantity',
                                        dataIndex: 'quantity',
                                        key: 'quantity',
                                    },
                                    {
                                        title: 'Subtotal',
                                        key: 'subtotal',
                                        render: (_, record) => `$${(Number(record?.price || 0) * (record?.quantity || 0)).toFixed(2)}`
                                    }
                                ]}
                            />
                        ) : (
                            <Text type="secondary">No order items available</Text>
                        )}
                    </>
                )}
            </Modal>

            {/* Edit Order Status Modal */}
            <Modal
                title="Update Order Status"
                open={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleUpdateStatus}
                >
                    <Form.Item
                        name="status"
                        label="Order Status"
                        rules={[{ required: true, message: 'Please select order status' }]}
                    >
                        <Select>
                            <Option value="Pending">Pending</Option>
                            <Option value="Processing">Processing</Option>
                            <Option value="Shipped">Shipped</Option>
                            <Option value="Delivered">Delivered</Option>
                            <Option value="Completed">Completed</Option>
                            <Option value="Cancelled">Cancelled</Option>
                        </Select>
                    </Form.Item>
                    
                    <Form.Item
                        name="paymentStatus"
                        label="Payment Status"
                        rules={[{ required: true, message: 'Please select payment status' }]}
                    >
                        <Select>
                            <Option value="Pending">Pending</Option>
                            <Option value="Paid">Paid</Option>
                            <Option value="Failed">Failed</Option>
                            <Option value="Refunded">Refunded</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item className="mb-0 text-right">
                        <Space>
                            <Button onClick={() => setIsEditModalVisible(false)}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Update
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </AdminLayout>
    );
};

export default AdminOrders;
                        