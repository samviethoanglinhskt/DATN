import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, InputNumber, Card, message, Space, Tooltip, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, GiftOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import axiosInstance from 'src/config/axiosInstance';
import 'bootstrap/dist/css/bootstrap.min.css';

const { RangePicker } = DatePicker;

interface Discount {
  id: number;
  discount_code: string;
  discount_value: number;
  name: string;
  start_day: string;
  end_day: string;
  created_at: string | null;
  updated_at: string | null;
}

const Discount: React.FC = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  // Fetch discounts
  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/discount');
      setDiscounts(response.data);
    } catch (error: any) {
      message.error('Không thể tải danh sách mã giảm giá');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  // Handle add/edit discount
  const handleSubmit = async (values: any) => {
    try {
      const formData = {
        ...values,
        start_day: values.dateRange[0].format('YYYY-MM-DD'),
        end_day: values.dateRange[1].format('YYYY-MM-DD'),
      };

      if (editingDiscount) {
        await axiosInstance.put(`/api/discount/${editingDiscount.id}`, formData);
        message.success('Cập nhật mã giảm giá thành công');
      } else {
        await axiosInstance.post('/api/discount', formData);
        message.success('Thêm mã giảm giá thành công');
      }

      setModalVisible(false);
      form.resetFields();
      fetchDiscounts();
    } catch (error: any) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại');
    }
  };

  // Handle delete discount
  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/api/discount/${id}`);
      message.success('Xóa mã giảm giá thành công');
      fetchDiscounts();
    } catch (error) {
      message.error('Không thể xóa mã giảm giá');
    }
  };

  const showModal = (record?: Discount) => {
    setEditingDiscount(record || null);
    if (record) {
      form.setFieldsValue({
        ...record,
        dateRange: [dayjs(record.start_day), dayjs(record.end_day)],
      });
    } else {
      form.resetFields();
    }
    setModalVisible(true);
  };

  const filteredDiscounts = discounts.filter(discount =>
    discount.name.toLowerCase().includes(searchText.toLowerCase()) ||
    discount.discount_code.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Mã giảm giá',
      dataIndex: 'discount_code',
      key: 'discount_code',
      render: (text: string) => (
        <Tag color="blue" icon={<GiftOutlined />} className="px-3 py-1">
          {text.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Giá trị',
      dataIndex: 'discount_value',
      key: 'discount_value',
      render: (value: number) => (
        <Tag color="green" className="px-3 py-1">
          {value}%
        </Tag>
      ),
    },
    {
      title: 'Tên chương trình',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'start_day',
      key: 'start_day',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'end_day',
      key: 'end_day',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_: any, record: Discount) => {
        const now = dayjs();
        const start = dayjs(record.start_day);
        const end = dayjs(record.end_day);
        
        if (now.isBefore(start)) {
          return <Tag color="warning">Sắp diễn ra</Tag>;
        } else if (now.isAfter(end)) {
          return <Tag color="error">Đã kết thúc</Tag>;
        } else {
          return <Tag color="success">Đang diễn ra</Tag>;
        }
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Discount) => (
        <Space>
          <Tooltip title="Sửa">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => showModal(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
              size="small"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={
        <div className="d-flex justify-content-between align-items-center">
          <span className="h5 mb-0">Quản lý mã giảm giá</span>
          <Space>
            <Input
              placeholder="Tìm theo mã hoặc tên..."
              prefix={<SearchOutlined />}
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
            />
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchText('');
                fetchDiscounts();
              }}
            >
              Làm mới
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal()}
            >
              Thêm mã giảm giá
            </Button>
          </Space>
        </div>
      }
    >
      <Table
        columns={columns}
        dataSource={filteredDiscounts}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showTotal: (total) => `Tổng ${total} mã giảm giá`,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />

      <Modal
        title={editingDiscount ? "Sửa mã giảm giá" : "Thêm mã giảm giá mới"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingDiscount(null);
        }}
        onOk={() => form.submit()}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-3"
        >
          <div className="row">
            <div className="col-md-6">
              <Form.Item
                name="discount_code"
                label="Mã giảm giá"
                rules={[{ required: true, message: 'Vui lòng nhập mã giảm giá!' }]}
              >
                <Input placeholder="Nhập mã giảm giá" />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                name="discount_value"
                label="Giá trị (%)"
                rules={[{ required: true, message: 'Vui lòng nhập giá trị giảm giá!' }]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  className="w-100"
                  placeholder="Nhập giá trị giảm giá"
                />
              </Form.Item>
            </div>
          </div>

          <Form.Item
            name="name"
            label="Tên chương trình"
            rules={[{ required: true, message: 'Vui lòng nhập tên chương trình!' }]}
          >
            <Input placeholder="Nhập tên chương trình" />
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="Thời gian áp dụng"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian áp dụng!' }]}
          >
            <RangePicker
              className="w-100"
              format="DD/MM/YYYY"
              placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Discount;