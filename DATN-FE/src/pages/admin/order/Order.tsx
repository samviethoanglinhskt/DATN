import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, Space, Select, Button, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ReloadOutlined } from '@ant-design/icons';

type OrderStatus = 'Chờ xử lý' | 'Đang xử lý' | 'Đã hoàn thành' | 'Đã hủy';

interface IOrder {
  id: number;
  order_code: string;
  order_date: string;
  total_amount: number;
  order_status: OrderStatus;
  name: string;
  phone: string;
  address: string;
  email: string;
}

const Order: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    { value: 'Chờ xử lý', label: 'Chờ xử lý' },
    { value: 'Đang xử lý', label: 'Đang xử lý' },
    { value: 'Đã hoàn thành', label: 'Đã hoàn thành' },
    { value: 'Đã hủy', label: 'Đã hủy' }
  ];

  const statusColors: Record<OrderStatus, string> = {
    'Chờ xử lý': 'warning',
    'Đang xử lý': 'processing',
    'Đã hoàn thành': 'success',
    'Đã hủy': 'error'
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/list-oder-admin');
      if (!res.ok) throw new Error('Failed to fetch orders');
      
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      message.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  // Chỉ cập nhật state local, không gọi API
  const handleStatusChange = (orderId: number, newStatus: OrderStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, order_status: newStatus } 
          : order
      )
    );
    message.success('Đã cập nhật trạng thái');
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const columns: ColumnsType<IOrder> = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'order_code',
      width: 120,
      fixed: 'left'
    },
    {
      title: 'Khách hàng',
      dataIndex: 'name',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <span className='fw-bold'>{record.name}</span>
          <span style={{ color: '#666', fontSize: '12px' }}>{record.email}</span>
        </Space>
      )
    },
    {
      title: 'Liên hệ',
      dataIndex: 'phone',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <span>{record.phone}</span>
          <span style={{ color: '#666', fontSize: '12px' }}>{record.address}</span>
        </Space>
      )
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'order_date',
      width: 120,
      render: (date) => new Date(date).toLocaleDateString('vi-VN')
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total_amount',
      width: 150,
      align: 'right',
      render: (amount) => new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(amount)
    },
    {
      title: 'Trạng thái',
      dataIndex: 'order_status',
      width: 150,
      render: (status: OrderStatus) => (
        <Tag color={statusColors[status]}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Thao tác',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Select
          style={{ width: '100%' }}
          value={record.order_status}
          onChange={(value: OrderStatus) => handleStatusChange(record.id, value)}
          options={statusOptions}
        />
      )
    }
  ];

  return (
    <Card 
      title="Quản lý đơn hàng"
      extra={
        <Button 
          icon={<ReloadOutlined />} 
          onClick={fetchOrders}
          loading={loading}
        >
          Làm mới
        </Button>
      }
      className="shadow-sm"
    >
      <Table<IOrder>
        columns={columns}
        dataSource={orders}
        rowKey="id"
        loading={loading}
        pagination={{
          showTotal: (total) => `Tổng ${total} đơn hàng`,
          showQuickJumper: true
        }}
        scroll={{ x: 1200 }}
        rowClassName="hover:bg-gray-50"
        size="middle"
      />
    </Card>
  );
};

export default Order;