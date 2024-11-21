import React, { useState } from 'react';
import { Tabs, Table, Tag, Button, Card, Space, Badge } from 'antd';
import { ShoppingOutlined, ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';

const MyOrders: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderCode',
      key: 'orderCode',
      render: (text: string) => <a className="font-semibold text-blue-600">{text}</a>,
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'orderDate',
      key: 'orderDate',
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'products',
      key: 'products',
      render: (products: any[]) => (
        <Space direction="vertical">
          {products.map((product, index) => (
            <div key={index} className="flex items-center gap-2">
              <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
              <div>
                <div className="font-medium">{product.name}</div>
                <div className="text-gray-500 text-sm">x{product.quantity}</div>
              </div>
            </div>
          ))}
        </Space>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      render: (amount: number) => (
        <span className="font-semibold text-lg">
          {amount.toLocaleString()}đ
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          pending: { color: 'processing', text: 'Chờ xác nhận', icon: <ClockCircleOutlined /> },
          confirmed: { color: 'warning', text: 'Đã xác nhận', icon: <ShoppingOutlined /> },
          completed: { color: 'success', text: 'Hoàn thành', icon: <CheckCircleOutlined /> },
          cancelled: { color: 'error', text: 'Đã hủy', icon: <CloseCircleOutlined /> },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        
        return (
          <Badge 
            status={config.color as any} 
            text={
              <Space>
                {config.icon}
                {config.text}
              </Space>
            }
          />
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button type="primary" ghost>
            Chi tiết
          </Button>
          {record.status === 'pending' && (
            <Button danger>Hủy đơn</Button>
          )}
        </Space>
      ),
    },
  ];

  const mockData = [
    {
      key: '1',
      orderCode: 'DH001',
      orderDate: '2024-03-21',
      products: [
        {
          name: 'Áo thun nam',
          quantity: 2,
          image: 'https://via.placeholder.com/100',
        },
      ],
      total: 500000,
      status: 'pending',
    },
    {
      key: '2',
      orderCode: 'DH002',
      orderDate: '2024-03-20',
      products: [
        {
          name: 'Quần jean',
          quantity: 1,
          image: 'https://via.placeholder.com/100',
        },
      ],
      total: 750000,
      status: 'completed',
    },
  ];

  const items: TabsProps['items'] = [
    {
      key: 'all',
      label: (
        <Space>
          <ShoppingOutlined />
          Tất cả
        </Space>
      ),
    },
    {
      key: 'pending',
      label: (
        <Space>
          <ClockCircleOutlined />
          Chờ xác nhận
        </Space>
      ),
    },
    {
      key: 'confirmed',
      label: (
        <Space>
          <ShoppingOutlined />
          Đã xác nhận
        </Space>
      ),
    },
    {
      key: 'completed',
      label: (
        <Space>
          <CheckCircleOutlined />
          Hoàn thành
        </Space>
      ),
    },
    {
      key: 'cancelled',
      label: (
        <Space>
          <CloseCircleOutlined />
          Đã hủy
        </Space>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <Card 
        title={<h1 className="text-2xl font-bold">Đơn hàng của tôi</h1>}
        className="shadow-md rounded-lg"
      >
        <Tabs 
          activeKey={activeTab}
          items={items}
          onChange={setActiveTab}
          className="mb-6"
        />
        <Table 
          columns={columns} 
          dataSource={mockData}
          pagination={{ 
            pageSize: 10,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng` 
          }}
        />
      </Card>
    </div>
  );
};

export default MyOrders;