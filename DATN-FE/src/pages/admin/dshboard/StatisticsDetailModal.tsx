import React from 'react';
import { Modal, Table, Space, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { formatCurrency } from './TableColums';
import { UserStatistic, OrderStatistic } from './type';

const { Text } = Typography;

interface StatisticsDetailModalProps {
  open: boolean;
  onClose: () => void;
  type: 'users' | 'orders';
  data: {
    "Người dùng": UserStatistic[];
    "Tổng đơn hàng": OrderStatistic[];
  };
}

const StatisticsDetailModal: React.FC<StatisticsDetailModalProps> = ({
  open,
  onClose,
  type,
  data
}) => {
  const userColumns = [
    {
      title: 'Tháng/Năm',
      key: 'month',
      render: (_: any, record: UserStatistic) => `Tháng ${record.month}/${record.year}`
    },
    {
      title: 'Số người dùng',
      dataIndex: 'total_users',
      key: 'total_users',
    },
    {
      title: 'Tăng trưởng',
      key: 'growth',
      render: (_: any, record: UserStatistic) => (
        <Space>
          {parseFloat(record.growth_percentage) > 0 ? (
            <ArrowUpOutlined style={{ color: '#52c41a' }} />
          ) : parseFloat(record.growth_percentage) < 0 ? (
            <ArrowDownOutlined style={{ color: '#f5222d' }} />
          ) : null}
          <Text style={{ 
            color: parseFloat(record.growth_percentage) > 0 ? '#52c41a' : 
                  parseFloat(record.growth_percentage) < 0 ? '#f5222d' : '#666'
          }}>
            {record.growth_percentage}
          </Text>
        </Space>
      )
    }
  ];

  const orderColumns = [
    {
      title: 'Tháng/Năm',
      key: 'month',
      render: (_: any, record: OrderStatistic) => `Tháng ${record.month}/${record.year}`
    },
    {
      title: 'Tổng đơn hàng',
      dataIndex: 'total_orders',
      key: 'total_orders',
    },
    {
      title: 'Đơn thành công',
      dataIndex: 'completed_orders',
      key: 'completed_orders',
    },
    {
      title: 'Đơn hủy',
      dataIndex: 'cancelled_orders',
      key: 'cancelled_orders',
    },
    {
      title: 'Doanh thu',
      dataIndex: 'total_revenue',
      key: 'total_revenue',
      render: (value: string) => formatCurrency(parseInt(value))
    },
    {
      title: 'Tăng trưởng đơn hàng',
      key: 'growth',
      render: (_: any, record: OrderStatistic) => (
        <Space>
          {parseFloat(record.growth_percentageOrder) > 0 ? (
            <ArrowUpOutlined style={{ color: '#52c41a' }} />
          ) : parseFloat(record.growth_percentageOrder) < 0 ? (
            <ArrowDownOutlined style={{ color: '#f5222d' }} />
          ) : null}
          <Text style={{ 
            color: parseFloat(record.growth_percentageOrder) > 0 ? '#52c41a' : 
                  parseFloat(record.growth_percentageOrder) < 0 ? '#f5222d' : '#666'
          }}>
            {record.growth_percentageOrder}
          </Text>
        </Space>
      )
    }
  ];


  return (
    <Modal
      title={type === 'users' ? 'Chi tiết người dùng theo tháng' : 'Chi tiết đơn hàng theo tháng'}
      open={open}
      onCancel={onClose}
      width={type === 'users' ? 800 : 1200}
      footer={null}
    >
      <Table
        columns={type === 'users' ? userColumns : orderColumns}
        dataSource={type === 'users' ? data["Người dùng"] : data["Tổng đơn hàng"]}
        pagination={false}
        rowKey={(record) => `${record.month}-${record.year}`}
      />
    </Modal>
  );
};

export default StatisticsDetailModal;