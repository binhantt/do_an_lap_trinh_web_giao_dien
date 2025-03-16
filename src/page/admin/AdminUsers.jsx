import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Modal, Form, Typography, Card, message, Popconfirm, Row, Col, Select, Pagination, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined, UserOutlined, TeamOutlined, UserSwitchOutlined, ReloadOutlined } from '@ant-design/icons';
import AdminLayout from '../../components/layout/admin/AdminLayout';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, updateUser, deleteUser } from '../../redux/user/userAPI';
import StatCard from '../../components/base/StatCard';

const { Title, Text } = Typography;
const { Option } = Select;

const AdminUsers = () => {
    const dispatch = useDispatch();
    const usersState = useSelector(state => state.user) || { users: [], loading: false };
    const { users, loading } = usersState;
    
    // Stats for the dashboard
    // Add debugging to check the users data
    useEffect(() => {
        console.log('Current users state:', users);
    }, [users]);
    
    const adminCount = users?.filter(user => user?.role === 'Admin')?.length || 0;
    const customerCount = users?.filter(user => user?.role === 'Customer')?.length || 0;
     
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingUser, setEditingUser] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [refreshKey, setRefreshKey] = useState(0); // Add refresh key for forcing re-fetch

    useEffect(() => {
        console.log('Fetching users...');
        dispatch(fetchUsers()).then(result => {
            console.log('Users fetched:', result);
        });
    }, [dispatch, refreshKey]); // Add refreshKey dependency

    // Add refresh function
    const handleRefresh = () => {
        setRefreshKey(old => old + 1);
    };

    const showEditModal = (user) => {
        setEditingUser(user);
        form.setFieldsValue({
            email: user.email,
            fullName: user.fullName,
            password: '', // Don't show the password for security
            role: user.role
        });
        setIsEditModalVisible(true);
    };

    const handleUpdate = async (values) => {
        if (!editingUser) return;
        
        try {
            // Only include password if it's not empty
            const userData = {...values};
            if (!userData.password) {
                delete userData.password;
            }
            
            console.log('Updating user with data:', userData);
            const result = await dispatch(updateUser(editingUser.id, userData));
            
            if (result.success) {
                message.success('User updated successfully');
                handleRefresh(); // Refresh the user list
            } else {
                message.error(result.message || 'Failed to update user');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            message.error('An error occurred while updating the user');
        }
        
        setIsEditModalVisible(false);
        form.resetFields();
    };

    const handleDelete = async (id) => {
        try {
            const result = await dispatch(deleteUser(id));
            
            if (result.success) {
                message.success('User deleted successfully');
                handleRefresh(); // Refresh the user list
            } else {
                message.error(result.message || 'Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            message.error('An error occurred while deleting the user');
        }
    };

    const filteredUsers = users.filter(
        user => 
            (user.email?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
            (user.fullName?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
            (user.role?.toLowerCase() || '').includes(searchText.toLowerCase())
    );

    // Removed pagination logic

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
            sorter: (a, b) => (a.fullName || '').localeCompare(b.fullName || ''),
            render: (text) => text || 'N/A',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: (a, b) => (a.email || '').localeCompare(b.email || ''),
            render: (text) => text || 'N/A',
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
                    {role || 'N/A'}
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
            render: text => text ? new Date(text).toLocaleDateString() : 'N/A',
            sorter: (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
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
                        onClick={() => showEditModal(record)}
                    />
                    {record.role !== 'Admin' ? (
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
                    ) : (
                        <Tooltip title="Admin users cannot be deleted">
                            <Button 
                                type="primary" 
                                danger 
                                icon={<DeleteOutlined />} 
                                size="small"
                                disabled
                            />
                        </Tooltip>
                    )}
                </Space>
            ),
        },
    ];

    return(
        <AdminLayout>
            {/* Summary Cards */}
            <div className="px-6 pt-6 overflow-hidden">
                <Row gutter={[16, 16]}>
                    {[
                        {
                            icon: <TeamOutlined />,
                            title: "Total Users",
                            value: users.length,
                            color: "#1890ff",
                            tooltip: "Total number of registered users"
                        },
                        {
                            icon: <UserOutlined />,
                            title: "Admins",
                            value: adminCount,
                            color: "#722ed1",
                            tooltip: "Users with administrator privileges"
                        },
                        {
                            icon: <UserSwitchOutlined />,
                            title: "Customers",
                            value: customerCount,
                            color: "#52c41a",
                            tooltip: "Regular customer accounts"
                        }
                    ].map((card, index) => (
                        <Col xs={24} sm={12} md={8} key={index}>
                            <StatCard 
                                icon={card.icon}
                                title={card.title}
                                value={card.value}
                                color={card.color}
                                tooltip={card.tooltip}
                            />
                        </Col>
                    ))}
                </Row>
            </div>
            
            <div className="px-6 pb-6">
                <Card>
                    <div className="mb-4 flex justify-between items-center">
                        <Title level={4}>User Management</Title>
                        <Space>
                            <Input
                                placeholder="Search users"
                                prefix={<SearchOutlined />}
                                value={searchText}
                                onChange={e => setSearchText(e.target.value)}
                                style={{ width: 250 }}
                            />
                            <Button 
                                onClick={handleRefresh} 
                                loading={loading}
                                icon={<ReloadOutlined />}
                            >
                                Refresh
                            </Button>
                        </Space>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={filteredUsers} // Use all filtered users instead of paginated users
                        rowKey="id"
                        loading={loading}
                        pagination={false} // Keep pagination false to show all users
                        locale={{ emptyText: loading ? 'Loading users...' : 'No users found' }}
                    />
                    
                    {/* Removed pagination component */}

                    {/* Edit User Modal */}
                    <Modal
                        title="Edit User"
                        open={isEditModalVisible}
                        onCancel={() => {
                            setIsEditModalVisible(false);
                            form.resetFields();
                        }}
                        footer={null}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleUpdate}
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
                                        min: 6, 
                                        message: 'Password must be at least 6 characters',
                                        warningOnly: true
                                    }
                                ]}
                                tooltip="Leave blank to keep current password"
                            >
                                <Input.Password placeholder="Leave blank to keep current password" />
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
                                    <Button onClick={() => {
                                        setIsEditModalVisible(false);
                                        form.resetFields();
                                    }}>
                                        Cancel
                                    </Button>
                                    <Button type="primary" htmlType="submit">
                                        Update
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