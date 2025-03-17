import React, { use, useEffect, useState } from 'react';
import { Table, Button, Space, Input, Modal, Form, Typography, Card, message, Popconfirm, Row, Col, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, UserOutlined, TeamOutlined, UserSwitchOutlined } from '@ant-design/icons';
import AdminLayout from '../../components/layout/admin/AdminLayout';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, createUser, updateUser, deleteUser } from '../../redux/user/userAPI';
import StatCard from '../../components/base/StatCard';

const { Title } = Typography;
const { Option } = Select;

const AdminUsers = () => {
    const dispatch = useDispatch();
    const usersState = useSelector(state => state.users) || { users: [], loading: false };
    const { users, loading } = usersState;
    
    // Stats for the dashboard
    const adminCount = users.filter(user => user.role === 'Admin').length;
    const customerCount = users.filter(user => user.role === 'Customer').length;
    
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingUser, setEditingUser] = useState(null);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const showModal = (user = null) => {
        setEditingUser(user);
        if (user) {
            form.setFieldsValue({
                email: user.email,
                fullName: user.fullName,
                password: user.password, // Leave blank for security
                role: user.role
            });
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleSubmit = async (values) => {
        const payload = {
            ...values,
            password: values.password || undefined // Only include password if changed
        };

        if (editingUser) {
            const result = await dispatch(updateUser(editingUser.id, payload));
            if (result) {
                message.success('User updated successfully');
                dispatch(fetchUsers()); // Refresh user list after successful update
            } else {
                message.error('Failed to update user');
            }
        } else {
            const result = await dispatch(createUser(payload));
            if (result) {
                message.success('User created successfully');
                dispatch(fetchUsers()); // Refresh user list after successful creation
            } else {
                message.error('Failed to create user');
            }
        }
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleDelete = async (id) => {
        const result = await dispatch(deleteUser(id));
        if (result) {
            message.success('User deleted successfully');
        } else {
            message.error('Failed to delete user');
        }
    };

    const filteredUsers = users.filter(
        user => 
            user.email?.toLowerCase().includes(searchText.toLowerCase()) ||
            user.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
            user.role?.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
            sorter: (a, b) => a.fullName.localeCompare(b.fullName),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: (a, b) => a.email.localeCompare(b.email),
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: role => (
                <span style={{ 
                    color: role === 'Admin' ? '#1890ff' : '#52c41a',
                    fontWeight: 'bold'
                }}>
                    {role}
                </span>
            ),
            filters: [
                { text: 'Admin', value: 'Admin' },
                { text: 'Customer', value: 'Customer' },
            ],
            onFilter: (value, record) => record.role === value,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: text => new Date(text).toLocaleDateString(),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: text => new Date(text).toLocaleDateString(),
            sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button 
                        type="primary" 
                        icon={<EditOutlined />} 
                        size="small"
                        onClick={() => showModal(record)}
                    />
                    {record.role !== 'Admin' && (
                        <Popconfirm
                            title="Are you sure you want to delete this user?"
                            onConfirm={() => handleDelete(record.id)}
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
                    )}
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
                            icon: <TeamOutlined />,
                            title: "Total Users",
                            value: users.length,
                            color: "#1890ff",
                            change: 5,
                            changeText: "more than last month",
                            tooltip: "Total number of registered users"
                        },
                        {
                            icon: <UserOutlined />,
                            title: "Admins",
                            value: adminCount,
                            color: "#722ed1",
                            change: 1,
                            changeText: "more than last month",
                            tooltip: "Users with administrator privileges"
                        },
                        {
                            icon: <UserSwitchOutlined />,
                            title: "Customers",
                            value: customerCount,
                            color: "#52c41a",
                            change: 4,
                            changeText: "more than last month",
                            tooltip: "Regular customer accounts"
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
                        <Title level={4}>Users Management</Title>
                        <Space>
                            <Input
                                placeholder="Search users"
                                prefix={<SearchOutlined />}
                                value={searchText}
                                onChange={e => setSearchText(e.target.value)}
                                style={{ width: 250 }}
                            />
                           
                        </Space>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={filteredUsers}
                        rowKey="id"
                        loading={loading}
                        pagination={{ pageSize: 4 }} // Set pagination to 4 items per page
                    />

                    <Modal
                        title={editingUser ? "Edit User" : "Add New User"}
                        open={isModalVisible}
                        onCancel={() => setIsModalVisible(false)}
                        footer={null}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                        >
                            <Form.Item
                                name="fullName"
                                label="Full Name"
                                rules={[{ required: true, message: 'Please enter full name' }]}
                            >
                                <Input placeholder="Enter full name" />
                            </Form.Item>
                            
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: 'Please enter email' },
                                    { type: 'email', message: 'Please enter a valid email' }
                                ]}
                            >
                                <Input placeholder="Enter email address" />
                            </Form.Item>
                            
                            <Form.Item
                                name="password"
                                label="Password"
                                rules={[
                                    { 
                                        required: !editingUser, 
                                        message: 'Please enter password' 
                                    },
                                    { 
                                        min: 6, 
                                        message: 'Password must be at least 6 characters',
                                        warningOnly: !!editingUser
                                    }
                                ]}
                                tooltip={editingUser ? "Leave blank to keep current password" : ""}
                            >
                                <Input.Password placeholder={editingUser ? "Leave blank to keep current password" : "Enter password"} />
                            </Form.Item>
                            
                            <Form.Item
                                name="role"
                                label="Role"
                                rules={[{ required: true, message: 'Please select a role' }]}
                            >
                                <Select placeholder="Select a role">
                                    <Option value="Admin">Admin</Option>
                                    <Option value="Customer">Customer</Option>
                                </Select>
                            </Form.Item>
                            
                            <Form.Item style={{ textAlign: 'right' }}>
                                <Space>
                                    <Button onClick={() => setIsModalVisible(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="primary" htmlType="submit">
                                        {editingUser ? 'Update' : 'Create'}
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </Modal>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default AdminUsers;