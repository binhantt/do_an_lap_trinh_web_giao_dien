import React, { useEffect, useState } from 'react';

import { Table, Button, Space, Input, Modal, Form, Typography, Card, message, Popconfirm, Row, Col, Statistic } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, AppstoreOutlined, ShoppingOutlined, FileSearchOutlined } from '@ant-design/icons';
import AdminLayout from '../../components/layout/admin/AdminLayout';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../../redux/category/categoryAPI';
import StatCard from '../../components/base/StatCard';

const { Title } = Typography;

const AdminCategories = () => {
    const dispatch = useDispatch();
    const categoryState = useSelector(state => state.category) || { categories: [], loading: false };
    const { categories, loading } = categoryState;
    
    // Mock data for products - replace with actual data from Redux store when available
    const totalProducts = 156;
    const searchCount = 24;
    
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingCategory, setEditingCategory] = useState(null);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const showModal = (category = null) => {
        setEditingCategory(category);
        if (category) {
            form.setFieldsValue({
                name: category.name,
                description: category.description
            });
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleSubmit = async (values) => {
        if (editingCategory) {
            const result = await dispatch(updateCategory(editingCategory.id, values));
            if (result) {
                message.success('Category updated successfully');
            } else {
                message.error('Failed to update category');
            }
        } else {
            const result = await dispatch(createCategory(values));
            if (result) {
                message.success('Category created successfully');
            } else {
                message.error('Failed to create category');
            }
        }
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleDelete = async (id) => {
        const result = await dispatch(deleteCategory(id));
        if (result) {
            message.success('Category deleted successfully');
        } else {
            message.error('Failed to delete category');
        }
    };

    const filteredCategories = categories.filter(
        category => 
            category.name?.toLowerCase().includes(searchText.toLowerCase()) ||
            category.description?.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
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
                    <Popconfirm
                        title="Are you sure you want to delete this category?"
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
                </Space>
            ),
        },
    ];

    return(
        <AdminLayout>
            {/* Summary Cards */}
            <div className="pb-4">
                <Row gutter={[16, 16]}>
                    {[
                        {
                            icon: <AppstoreOutlined />,
                            title: "Categories",
                            value: categories.length,
                            color: "#722ed1",
                            change: 2,
                            changeText: "more than last month",
                            tooltip: "Total number of active categories"
                        },
                        {
                            icon: <ShoppingOutlined />,
                            title: "Products",
                            value: totalProducts,
                            color: "#13c2c2",
                            change: 12,
                            changeText: "more than last month",
                            tooltip: "Total number of products across all categories"
                        },
                        {
                            icon: <FileSearchOutlined />,
                            title: "Search Count",
                            value: searchCount,
                            color: "#1890ff",
                            change: -3,
                            changeText: "less than last month",
                            tooltip: "Number of category searches this month"
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px'  ,}}>
                        <Title level={4}>Categories Management</Title>
                        <Space>
                            <Input
                                placeholder="Search categories"
                                prefix={<SearchOutlined />}
                                value={searchText}
                                onChange={e => setSearchText(e.target.value)}
                                style={{ width: 250 }}
                            />
                            <Button 
                                type="primary" 
                                icon={<PlusOutlined />}
                                onClick={() => showModal()}
                            >
                                Add Category
                            </Button>
                        </Space>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={filteredCategories}
                        rowKey="id"
                        loading={loading}
                        pagination={{ pageSize: 10 }}
                    />

                    <Modal
                        title={editingCategory ? "Edit Category" : "Add New Category"}
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
                                name="name"
                                label="Category Name"
                                rules={[{ required: true, message: 'Please enter category name' }]}
                            >
                                <Input placeholder="Enter category name" />
                            </Form.Item>
                            <Form.Item
                                name="description"
                                label="Description"
                                rules={[{ required: true, message: 'Please enter description' }]}
                            >
                                <Input.TextArea rows={4} placeholder="Enter category description" />
                            </Form.Item>
                            <Form.Item style={{ textAlign: 'right' }}>
                                <Space>
                                    <Button onClick={() => setIsModalVisible(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="primary" htmlType="submit">
                                        {editingCategory ? 'Update' : 'Create'}
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </Modal>
                </Card>
            </div>
        </AdminLayout>
    )
}

export default AdminCategories;