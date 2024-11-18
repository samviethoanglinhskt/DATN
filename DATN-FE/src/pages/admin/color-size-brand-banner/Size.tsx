import React, { useEffect, useState } from 'react';
import { Table, Button, Tooltip, message, Modal, Form, Input, Card, Space } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import axiosInstance from 'src/config/axiosInstance';
import { RuleFolderOutlined } from '@mui/icons-material';

interface Size {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

const SizeManagement: React.FC = () => {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editingSize, setEditingSize] = useState<Size | null>(null);
  const [addModal, setAddModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  const fetchSizes = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/size');
      setSizes(response.data);
    } catch (error: any) {
      message.error('Không thể tải danh sách kích thước');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSizes();
  }, []);

  const handleAdd = async (values: { name: string }) => {
    try {
      await axiosInstance.post('/api/size', values);
      message.success('Thêm kích thước thành công');
      setAddModal(false);
      form.resetFields();
      fetchSizes();
    } catch (error) {
      message.error('Không thể thêm kích thước');
    }
  };

  const handleEdit = async (values: { name: string }) => {
    try {
      if (editingSize) {
        await axiosInstance.put(`/api/size/${editingSize.id}`, values);
        message.success('Cập nhật kích thước thành công');
        setEditModal(false);
        form.resetFields();
        fetchSizes();
      }
    } catch (error) {
      message.error('Không thể cập nhật kích thước');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/api/size/${id}`);
      message.success('Xóa kích thước thành công');
      fetchSizes();
    } catch (error) {
      message.error('Không thể xóa kích thước');
    }
  };

  // Filter sizes based on search text
  const filteredSizes = sizes.filter(size =>
    size.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Tên kích thước',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Space>
          <RuleFolderOutlined />
          <span className="fw-semibold">{text}</span>
        </Space>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_: any, record: Size) => (
        <Space size="small">
          <Tooltip title="Sửa">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => {
                setEditingSize(record);
                form.setFieldsValue(record);
                setEditModal(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={
        <Space>
          <RuleFolderOutlined className="fs-4" />
          <span>Quản lý kích thước</span>
        </Space>
      }
      extra={
        <Space>
          <Input
            placeholder="Tìm kiếm kích thước..."
            prefix={<SearchOutlined />}
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
            value={searchText}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setAddModal(true)}
          >
            Thêm kích thước
          </Button>
        </Space>
      }
    >
      <div className="mb-3 text-muted">
        Hiển thị {filteredSizes.length} / {sizes.length} kích thước
      </div>

      <Table
        columns={columns}
        dataSource={filteredSizes}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showTotal: (total) => `Tổng ${total} kích thước`,
          showSizeChanger: true,
        }}
      />

      <Modal
        title="Thêm kích thước"
        open={addModal}
        onOk={() => form.submit()}
        onCancel={() => {
          setAddModal(false);
          form.resetFields();
        }}
        destroyOnClose
      >
        <Form form={form} onFinish={handleAdd}>
          <Form.Item
            name="name"
            label="Tên kích thước"
            rules={[{ required: true, message: 'Vui lòng nhập tên kích thước!' }]}
          >
            <Input placeholder="Nhập tên kích thước" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Sửa kích thước"
        open={editModal}
        onOk={() => form.submit()}
        onCancel={() => {
          setEditModal(false);
          form.resetFields();
        }}
        destroyOnClose
      >
        <Form form={form} onFinish={handleEdit}>
          <Form.Item
            name="name"
            label="Tên kích thước"
            rules={[{ required: true, message: 'Vui lòng nhập tên kích thước!' }]}
          >
            <Input placeholder="Nhập tên kích thước" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default SizeManagement;