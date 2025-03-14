import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Table, Button, Space, Input, Modal, Form, 
  Typography, Card, message, Popconfirm 
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  SearchOutlined, ExclamationCircleOutlined 
} from '@ant-design/icons';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../../redux/category/categoryAPI';

const { Title } = Typography;

const Categories = (children) => {
  const dispatch = useDispatch();
  // Fix the Redux selector to handle undefined state
  const categoryState = useSelector(state => state.category) || { categories: [], loading: false };
  const { categories, loading } = categoryState;
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchText, setSearchText] = useState('');

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Handle modal visibility
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

  // Handle form submission
  const handleSubmit = async (values) => {
    if (editingCategory) {
      // Update existing category
      const result = await dispatch(updateCategory(editingCategory.id, values));
      if (result) {
        message.success('Category updated successfully');
      } else {
        message.error('Failed to update category');
      }
    } else {
      // Create new category
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

  // Handle category deletion
  const handleDelete = async (id) => {
    const result = await dispatch(deleteCategory(id));
    if (result) {
      message.success('Category deleted successfully');
    } else {
      message.error('Failed to delete category');
    }
  };

  // Filter categories based on search text
  const filteredCategories = categories.filter(
    category => 
      category.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Table columns
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
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
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
    <div className="p-6">
      <Card>
        <div className="flex justify-between items-center mb-4">
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
          open={isModalVisible} // Changed from 'visible' to 'open'
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
            <Form.Item className="text-right">
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
  );
};

export default Categories;