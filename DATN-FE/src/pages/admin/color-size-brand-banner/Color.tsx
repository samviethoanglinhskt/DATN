import React, { useEffect, useState } from 'react';
import { Table, Button, Tooltip, message, Modal, Form, Input, Card, Space } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, BgColorsOutlined, SearchOutlined } from '@ant-design/icons';
import axiosInstance from 'src/config/axiosInstance';

interface Color {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

const ColorManagement: React.FC = () => {
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editingColor, setEditingColor] = useState<Color | null>(null);
  const [addModal, setAddModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  const fetchColors = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/color');
      setColors(response.data);
    } catch (error: any) {
      message.error('Không thể tải danh sách màu sắc');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColors();
  }, []);

  const handleAdd = async (values: { name: string }) => {
    try {
      await axiosInstance.post('/api/color', values);
      message.success('Thêm màu sắc thành công');
      setAddModal(false);
      form.resetFields();
      fetchColors();
    } catch (error) {
      message.error('Không thể thêm màu sắc');
    }
  };

  const handleEdit = async (values: { name: string }) => {
    try {
      if (editingColor) {
        await axiosInstance.put(`/api/color/${editingColor.id}`, values);
        message.success('Cập nhật màu sắc thành công');
        setEditModal(false);
        form.resetFields();
        fetchColors();
      }
    } catch (error) {
      message.error('Không thể cập nhật màu sắc');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/api/color/${id}`);
      message.success('Xóa màu sắc thành công');
      fetchColors();
    } catch (error) {
      message.error('Không thể xóa màu sắc');
    }
  };

  // Filter colors based on search text
  const filteredColors = colors.filter(color =>
    color.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Tên màu sắc',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Space>
          <BgColorsOutlined style={{ color: text.toLowerCase() }} />
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
      render: (_: any, record: Color) => (
        <Space size="small">
          <Tooltip title="Sửa">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => {
                setEditingColor(record);
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
          <BgColorsOutlined className="fs-4" />
          <span>Quản lý màu sắc</span>
        </Space>
      }
      extra={
        <Space>
          <Input
            placeholder="Tìm kiếm màu sắc..."
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
            Thêm màu sắc
          </Button>
        </Space>
      }
    >
      <div className="mb-3 text-muted">
        Hiển thị {filteredColors.length} / {colors.length} màu sắc
      </div>
      
      <Table
        columns={columns}
        dataSource={filteredColors}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showTotal: (total) => `Tổng ${total} màu sắc`,
          showSizeChanger: true,
        }}
      />

      <Modal
        title="Thêm màu sắc"
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
            label="Tên màu sắc"
            rules={[{ required: true, message: 'Vui lòng nhập tên màu sắc!' }]}
          >
            <Input placeholder="Nhập tên màu sắc" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Sửa màu sắc"
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
            label="Tên màu sắc"
            rules={[{ required: true, message: 'Vui lòng nhập tên màu sắc!' }]}
          >
            <Input placeholder="Nhập tên màu sắc" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ColorManagement;