import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Modal, Form, Typography, Card, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import AdminLayout from '../../components/layout/admin/AdminLayout';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../redux/product/productAPI';

const { Title } = Typography;

const AdminProducts = () => {
    const dispatch = useDispatch();
    const productsState = useSelector(state => state.product) || { products: [], loading: false };
    const { products, loading } = productsState;

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    console.log('Fetched products:', products); // Debug log

    const filteredProducts = products.filter(
        product => 
            product.name.toLowerCase().includes(searchText.toLowerCase()) ||
            product.description.toLowerCase().includes(searchText.toLowerCase())
    );

    const showModal = (product = null) => {
        setEditingProduct(product);
        if (product) {
            form.setFieldsValue({
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
                imageUrl: product.imageUrl,
                categoryId: product.categoryId,
                category: product.category // Ensure category field is set
            });
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleSubmit = async (values) => {
        // Include productUpdate field in the payload
        const payload = {
            ...values,
            productUpdate: true // Assuming productUpdate is a boolean flag
        };

        if (editingProduct) {
            const result = await dispatch(updateProduct(editingProduct.id, payload));
            if (result.success) {
                message.success('Product updated successfully');
            } else {
                message.error('Failed to update product');
            }
        } else {
            const result = await dispatch(createProduct(payload));
            if (result.success) {
                message.success('Product created successfully');
            } else {
                message.error('Failed to create product');
            }
        }
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleDelete = async (id) => {
        const result = await dispatch(deleteProduct(id));
        if (result.success) {
            message.success('Product deleted successfully');
        } else {
            message.error('Failed to delete product');
        }
    };

    const columns = [
        {
            title: 'Product ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 120,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: 200,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: price => `$${price.toFixed(2)}`,
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
        },
        {
            title: 'Category ID',
            dataIndex: 'categoryId',
            key: 'categoryId',
        },
        {
            title: 'Image URL',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: url => <a href={url} target="_blank" rel="noopener noreferrer">View Image</a>,
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
                        title="Are you sure you want to delete this product?"
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

    return (
        <AdminLayout>
            <div className="px-6 pt-6 pb-4">
                <Title level={4}>Products Management</Title>
                <Space style={{ marginBottom: '16px' }}>
                    <Input
                        placeholder="Search products"
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
                        Add Product
                    </Button>
                </Space>

                <Table
                    columns={columns}
                    dataSource={filteredProducts}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 4 }}
                />

                <Modal
                    title={editingProduct ? "Edit Product" : "Add New Product"}
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                    >
                        <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter the product name' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please enter the product description' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please enter the product price' }]}>
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item name="stock" label="Stock" rules={[{ required: true, message: 'Please enter the product stock' }]}>
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item name="imageUrl" label="Image URL" rules={[{ required: true, message: 'Please enter the product image URL' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="categoryId" label="Category ID" rules={[{ required: true, message: 'Please enter the category ID' }]}>
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Please enter the category' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                {editingProduct ? "Update Product" : "Create Product"}
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </AdminLayout>
    );
};

export default AdminProducts;