import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  message,
  Card,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import axios from 'axios';

interface Category {
  id: number;
  name: string;
  created_at: string | null;
  updated_at: string | null;
}

interface CategoryFormData {
  name: string;
}

const AppCategoryyy = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/api/category');
      setCategories(response.data);
    } catch (error) {
      message.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle form submission
  const handleSubmit = async (values: CategoryFormData) => {
    try {
      if (editingCategory) {
        await axios.put(`http://127.0.0.1:8000/api/category/${editingCategory.id}`, values);
        message.success('Category updated successfully');
      } else {
        await axios.post('http://127.0.0.1:8000/api/category', values);
        message.success('Category created successfully');
      }
      setModalVisible(false);
      form.resetFields();
      fetchCategories();
      setEditingCategory(null);
    } catch (error) {
      message.error('Operation failed');
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/category/${id}`);
      message.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      message.error('Delete failed');
    }
  };

  // Handle edit
  const handleEdit = (record: Category) => {
    setEditingCategory(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  // Table columns
  const columns: ColumnsType<Category> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Twn Danh Mục',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    // {
    //   title: 'Created At',
    //   dataIndex: 'created_at',
    //   key: 'created_at',
    //   responsive: ['md'],
    //   render: (date: string | null) => date ? new Date(date).toLocaleDateString() : '-'
    // },
    // {
    //   title: 'Updated At',
    //   dataIndex: 'updated_at',
    //   key: 'updated_at',
    //   responsive: ['lg'],
    //   render: (date: string | null) => date ? new Date(date).toLocaleDateString() : '-'
    // },
    {
      title: 'Thao Tác',
      key: 'actions',
      width: 150,
      render: (_: unknown, record: Category) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
        
          </Button>
          <Popconfirm
            title="Delete Category"
            description="Are you sure you want to delete this category?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
          >
            <Button type="primary" danger icon={<DeleteOutlined />} size="small">
          
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Category Management" extra={
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setEditingCategory(null);
          form.resetFields();
          setModalVisible(true);
        }}
      >
        Thêm danh mục
      </Button>
    }>
      <Table<Category>
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={loading}
        scroll={{ x: 'max-content' }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
        }}
      />

      <Modal
        title={editingCategory ? 'Sửa danh mục' : 'Thêm danh mục'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingCategory(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={editingCategory || {}}
        >
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[
              { required: true, message: 'Please input category name!' },
              { min: 2, message: 'Name must be at least 2 characters!' },
              { max: 50, message: 'Name cannot be longer than 50 characters!' },
            ]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => {
                setModalVisible(false);
                setEditingCategory(null);
                form.resetFields();
              }}>
                Bỏ qua
              </Button>
              <Button type="primary" htmlType="submit">
                {editingCategory ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default AppCategoryyy;