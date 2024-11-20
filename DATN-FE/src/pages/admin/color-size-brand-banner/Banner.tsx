import React, { useEffect, useState } from 'react';
import { Table, Button, Tooltip, message, Modal, Form, Input, Card, Space, Popconfirm, Image } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined, 
  FileImageOutlined, 
  ReloadOutlined,
  SearchOutlined
} from '@ant-design/icons';
import axiosInstance from 'src/config/axiosInstance';

interface LogoBanner {
  id: number;
  name: string;
  image: string;
  created_at: string | null;
  updated_at: string | null;
}

const LogoBannerManagement: React.FC = () => {
  const [logos, setLogos] = useState<LogoBanner[]>([]);
  const [loading, setLoading] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editingLogo, setEditingLogo] = useState<LogoBanner | null>(null);
  const [addModal, setAddModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  const fetchLogos = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/logo_banner');
      setLogos(response.data);
    } catch (error: any) {
      message.error('Không thể tải danh sách logo & banner');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogos();
  }, []);

  const handleAdd = async (values: any) => {
    try {
      await axiosInstance.post('/api/logo_banner', {
        name: values.name,
        image: values.image
      });
      message.success('Thêm logo/banner thành công');
      setAddModal(false);
      form.resetFields();
      fetchLogos();
    } catch (error) {
      message.error('Không thể thêm logo/banner');
    }
  };

  const handleEdit = async (values: any) => {
    try {
      if (editingLogo) {
        await axiosInstance.put(`/api/logo_banner/${editingLogo.id}`, {
          name: values.name,
          image: values.image
        });
        message.success('Cập nhật logo/banner thành công');
        setEditModal(false);
        form.resetFields();
        fetchLogos();
      }
    } catch (error) {
      message.error('Không thể cập nhật logo/banner');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/api/logo_banner/${id}`);
      message.success('Xóa logo/banner thành công');
      fetchLogos();
    } catch (error) {
      message.error('Không thể xóa logo/banner');
    }
  };

  const validateImageUrl = (_: any, value: string) => {
    if (!value) return Promise.reject('Vui lòng nhập URL hình ảnh!');
    
    const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i;
    if (!urlPattern.test(value)) {
      return Promise.reject('URL hình ảnh không hợp lệ!');
    }
    return Promise.resolve();
  };

  const filteredLogos = logos.filter(logo =>
    logo.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 120,
      render: (image: string) => (
        <Image
          src={image}
          alt="Logo"
          width={80}
          height={80}
          style={{ objectFit: 'cover' }}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADA..."
        />
      ),
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Space>
          <FileImageOutlined />
          <span className="font-medium">{text}</span>
        </Space>
      ),
      sorter: (a: LogoBanner, b: LogoBanner) => a.name.localeCompare(b.name),
    },
    {
      title: 'URL Hình ảnh',
      dataIndex: 'image',
      key: 'imageUrl',
      ellipsis: true,
      render: (url: string) => (
        <Tooltip title={url}>
          <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
        </Tooltip>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_: any, record: LogoBanner) => (
        <Space>
          <Tooltip title="Sửa">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => {
                setEditingLogo(record);
                form.setFieldsValue(record);
                setEditModal(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa logo/banner"
            description="Bạn có chắc chắn muốn xóa mục này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button
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
    <Card
      title={
        <Space>
          <FileImageOutlined className="text-xl" />
          <span className="font-bold">Quản lý Logo & Banner</span>
        </Space>
      }
      extra={
        <Space>
          <Input
            placeholder="Tìm kiếm..."
            prefix={<SearchOutlined />}
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchLogos}
          >
            Làm mới
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setAddModal(true);
              form.resetFields();
            }}
          >
            Thêm mới
          </Button>
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={filteredLogos}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showTotal: (total) => `Tổng ${total} mục`,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />

      {/* Add Modal */}
      <Modal
        title="Thêm Logo/Banner mới"
        open={addModal}
        onOk={() => form.submit()}
        onCancel={() => {
          setAddModal(false);
          form.resetFields();
        }}
        okText="Thêm"
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAdd}
        >
          <Form.Item
            name="name"
            label="Tên"
            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
          >
            <Input placeholder="Nhập tên logo/banner" />
          </Form.Item>
          <Form.Item
            name="image"
            label="URL Hình ảnh"
            rules={[
              { validator: validateImageUrl }
            ]}
          >
            <Input placeholder="Nhập URL hình ảnh (https://example.com/image.jpg)" />
          </Form.Item>
          <Form.Item label="Xem trước">
            {form.getFieldValue('image') && (
              <Image
                src={form.getFieldValue('image')}
                alt="Preview"
                width={200}
                style={{ marginTop: 8 }}
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADA..."
              />
            )}
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Sửa Logo/Banner"
        open={editModal}
        onOk={() => form.submit()}
        onCancel={() => {
          setEditModal(false);
          form.resetFields();
        }}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEdit}
        >
          <Form.Item
            name="name"
            label="Tên"
            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
          >
            <Input placeholder="Nhập tên logo/banner" />
          </Form.Item>
          <Form.Item
            name="image"
            label="URL Hình ảnh"
            rules={[
              { validator: validateImageUrl }
            ]}
          >
            <Input placeholder="Nhập URL hình ảnh (https://example.com/image.jpg)" />
          </Form.Item>
          <Form.Item label="Xem trước">
            {form.getFieldValue('image') && (
              <Image
                src={form.getFieldValue('image')}
                alt="Preview"
                width={200}
                style={{ marginTop: 8 }}
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADA..."
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default LogoBannerManagement;