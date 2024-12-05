
import { Space, Typography, Badge } from 'antd';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined,
  RiseOutlined,
  FallOutlined 
} from '@ant-design/icons';
import { DailyStats, TopProduct } from './type';
const { Text } = Typography;
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);
};

export const getDailyStatsColumns = () => [
  {
    title: 'Ngày',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Doanh thu',
    key: 'revenue',
    render: (record: DailyStats) => (
      <Space direction="vertical" size="small">
        <Text>{formatCurrency(record.revenue)}</Text>
        <Badge
          count={
            <Space>
              {record.revenueGrowth >= 0 ? (
                <ArrowUpOutlined style={{ color: '#52c41a' }} />
              ) : (
                <ArrowDownOutlined style={{ color: '#f5222d' }} />
              )}
              <span style={{ 
                color: record.revenueGrowth >= 0 ? '#52c41a' : '#f5222d',
                fontSize: '12px'
              }}>
                {Math.abs(record.revenueGrowth)}%
              </span>
            </Space>
          }
          style={{ backgroundColor: 'transparent' }}
        />
      </Space>
    ),
  },
];

// Top products columns
export const getTopProductColumns = () => [
  {
    title: 'Sản phẩm',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Số lượng bán',
    dataIndex: 'sales',
    key: 'sales',
    sorter: (a: TopProduct, b: TopProduct) => a.sales - b.sales,
  },
  {
    title: 'Doanh thu',
    dataIndex: 'revenue',
    key: 'revenue',
    render: (value: number) => formatCurrency(value),
    sorter: (a: TopProduct, b: TopProduct) => a.revenue - b.revenue,
  },
  {
    title: 'Tăng trưởng',
    dataIndex: 'growth',
    key: 'growth',
    render: (value: number) => (
      <Space>
        {value >= 0 ? (
          <RiseOutlined style={{ color: '#52c41a' }} />
        ) : (
          <FallOutlined style={{ color: '#f5222d' }} />
        )}
        <span style={{ color: value >= 0 ? '#52c41a' : '#f5222d' }}>
          {Math.abs(value)}%
        </span>
      </Space>
    ),
    sorter: (a: TopProduct, b: TopProduct) => a.growth - b.growth,
  }
];
 