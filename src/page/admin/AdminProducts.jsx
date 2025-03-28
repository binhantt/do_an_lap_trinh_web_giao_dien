import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Modal, Form, Typography, Card, message, Popconfirm, Select, Upload } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, LoadingOutlined } from '@ant-design/icons';
import AdminLayout from '../../components/layout/admin/AdminLayout';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../redux/product/productAPI';
import { fetchCategories } from '../../redux/category/categoryAPI';
// Remove these duplicate imports:
// import { Upload } from 'antd';
// import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const AdminProducts = () => {
    const dispatch = useDispatch();
    const productsState = useSelector(state => state.product) || { products: [], loading: false };
    const { products, loading } = productsState;

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [imageLoading, setImageLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    const categoriesState = useSelector(state => state.category);
    const { categories } = categoriesState;

    // Move columns definition here, before it's used
    const columns = [
        {
            title: 'Product ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Image',
            dataIndex: 'imageUrl',
            key: 'image',
            width: 100,
            render: url => (
                <img
                    src={url || 'https://placehold.co/100x100'}
                    alt="Product"
                    style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '4px'
                    }}
                />
            ),
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
            ellipsis: true,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: price => `$${price.toFixed(2)}`,
            width: 100,
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
            width: 80,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            width: 120,
            render: category => category?.name || 'N/A',
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 100,
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

    // Define filteredProducts after columns
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchText.toLowerCase()) ||
        product.description.toLowerCase().includes(searchText.toLowerCase()) ||
        product.category?.name.toLowerCase().includes(searchText.toLowerCase())
    );

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchCategories());
    }, [dispatch]);

    // Remove the standalone Table component that was here before

    const handleImageUpload = async (file) => {
        setImageLoading(true);
        const formData = new FormData();
        formData.append('image', file);
        formData.append('key', '76cbe35884a59e2a3cee66b8113d0753');

        try {
            const response = await fetch('https://api.imgbb.com/1/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            
            if (data.success) {
                setImageUrl(data.data.url);
                form.setFieldValue('imageUrl', data.data.url);
                message.success('Image uploaded successfully');
            } else {
                message.error('Failed to upload image');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            message.error('Failed to upload image');
        } finally {
            setImageLoading(false);
        }
    };

    const handleSubmit = async (values) => {
        const selectedCategory = categories.find(cat => cat.id === values.categoryId);
        
        const payload = {
            name: values.name,
            description: values.description,
            price: parseFloat(values.price),
            stock: parseInt(values.stock),
            imageUrl: values.imageUrl,
            categoryId: parseInt(values.categoryId)
        };
    
        try {
            if (editingProduct) {
                const result = await dispatch(updateProduct(editingProduct.id, payload));
                if (result.success) {
                    message.success('Product updated successfully');
                    await dispatch(fetchProducts());
                } else {
                    message.error(result.message || 'Failed to update product');
                }
            } else {
                const result = await dispatch(createProduct(payload));
                if (result.success) {
                    message.success('Product created successfully');
                    await dispatch(fetchProducts());
                } else {
                    message.error('Failed to create product');
                }
            }
            setIsModalVisible(false);
            form.resetFields();
            setImageUrl('');
        } catch (error) {
            console.error('Error submitting product:', error);
            message.error('An error occurred while saving the product');
        }
    };

    const handleDelete = async (id) => {
        try {
            const result = await dispatch(deleteProduct(id));
            if (result.success) {
                message.success('Product deleted successfully');
                await dispatch(fetchProducts());
            } else {
                message.error(result.message || 'Failed to delete product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            message.error('An error occurred while deleting the product');
        }
    };

    const showModal = (product = null) => {
        setEditingProduct(product);
        if (product) {
            form.setFieldsValue({
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
                imageUrl: product.imageUrl,
                categoryId: product.category?.id,
                categoryName: product.category?.name
            });
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

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
                    pagination={{ 
                        pageSize: 4,
                        onChange: () => {
                            dispatch(fetchProducts());
                        }
                    }}
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
                        <Form.Item 
                            name="imageUrl" 
                            label="Image" 
                            rules={[{ required: true, message: 'Please upload an image' }]}
                        >
                            <div className="flex flex-col gap-2">
                                <Upload
                                    name="image"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    beforeUpload={(file) => {
                                        const isImage = file.type.startsWith('image/');
                                        if (!isImage) {
                                            message.error('You can only upload image files!');
                                            return false;
                                        }
                                        const isLt2M = file.size / 1024 / 1024 < 2;
                                        if (!isLt2M) {
                                            message.error('Image must be smaller than 2MB!');
                                            return false;
                                        }
                                        handleImageUpload(file);
                                        return false;
                                    }}
                                >
                                    {form.getFieldValue('imageUrl') || imageUrl ? (
                                        <img 
                                            src={form.getFieldValue('imageUrl') || imageUrl} 
                                            alt="avatar" 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                        />
                                    ) : (
                                        <div>
                                            {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                    )}
                                </Upload>
                                {(form.getFieldValue('imageUrl') || imageUrl) && (
                                    <Input 
                                        value={form.getFieldValue('imageUrl') || imageUrl} 
                                        readOnly 
                                        addonAfter={
                                            <a href={form.getFieldValue('imageUrl') || imageUrl} target="_blank" rel="noopener noreferrer">
                                                View
                                            </a>
                                        }
                                    />
                                )}
                            </div>
                        </Form.Item>
                        <Form.Item name="categoryId" label="Category" rules={[{ required: true, message: 'Please select a category' }]}>
                            <Select>
                                {categories.map(category => (
                                    <Option key={category.id} value={category.id}>
                                        {category.name}
                                    </Option>
                                ))}
                            </Select>
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