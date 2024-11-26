import React, { useEffect, useState } from 'react';
import { 
  Card, 
  Col, 
  Row, 
  Statistic, 
  Progress, 
  Spin,
  Select,
  DatePicker,
  Table,
  Typography,
  Badge,
  Tooltip,
  Space,
  Divider
} from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarCircleOutlined,
  BarChartOutlined,
  RiseOutlined,
  FallOutlined,
  LoadingOutlined,
  ReloadOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';

import 'bootstrap/dist/css/bootstrap.min.css';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
const { Option } = Select;

// Interface definitions
interface StatisticData {
  totalUsers: number;
  totalOrders: number;
  revenue: number;
  completionRate: number;
  userGrowth: number;
  orderGrowth: number;
  revenueGrowth: number;
}

interface DailyStats {
  date: string;
  revenue: number;
  orders: number;
  users: number;
  revenueGrowth: number;
  ordersGrowth: number;
  usersGrowth: number;
}

interface TopProduct {
  id: number;
  name: string;
  sales: number;
  revenue: number;
  growth: number;
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
  const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment]>([
    moment().subtract(7, 'days'),
    moment()
  ]);
  const [statistics, setStatistics] = useState<StatisticData>({
    totalUsers: 0,
    totalOrders: 0,
    revenue: 0,
    completionRate: 0,
    userGrowth: 0,
    orderGrowth: 0,
    revenueGrowth: 0
  });

  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);

  // Mock data generator
  const generateMockData = () => {
    setLoading(true);
    
    // Generate overall statistics
    setStatistics({
      totalUsers: 1528,
      totalOrders: 687,
      revenue: 152893000,
      completionRate: 93.5,
      userGrowth: 12.5,
      orderGrowth: 8.3,
      revenueGrowth: 15.7
    });

    // Generate daily statistics
    const dailyData: DailyStats[] = [];
    for (let i = 6; i >= 0; i--) {
      dailyData.push({
        date: moment().subtract(i, 'days').format('DD/MM/YYYY'),
        revenue: Math.floor(Math.random() * 50000000) + 10000000,
        orders: Math.floor(Math.random() * 100) + 20,
        users: Math.floor(Math.random() * 50) + 10,
        revenueGrowth: Math.floor(Math.random() * 20) - 10,
        ordersGrowth: Math.floor(Math.random() * 20) - 10,
        usersGrowth: Math.floor(Math.random() * 20) - 10
      });
    }
    setDailyStats(dailyData);

    // Generate top products
    setTopProducts([
      { id: 1, name: "Áo thun nam", sales: 156, revenue: 15600000, growth: 12.5 },
      { id: 2, name: "Quần jean nữ", sales: 142, revenue: 21300000, growth: 8.3 },
      { id: 3, name: "Giày thể thao", sales: 128, revenue: 32000000, growth: -5.2 },
      { id: 4, name: "Túi xách", sales: 98, revenue: 19600000, growth: 15.7 },
      { id: 5, name: "Đồng hồ", sales: 89, revenue: 44500000, growth: 9.1 }
    ]);

    setLoading(false);
  };

  useEffect(() => {
    generateMockData();
  }, [timeRange, dateRange]);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  // Daily stats columns
  const dailyStatsColumns = [
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
    {
      title: 'Đơn hàng',
      key: 'orders',
      render: (record: DailyStats) => (
        <Space direction="vertical" size="small">
          <Text>{record.orders}</Text>
          <Badge
            count={
              <Space>
                {record.ordersGrowth >= 0 ? (
                  <ArrowUpOutlined style={{ color: '#52c41a' }} />
                ) : (
                  <ArrowDownOutlined style={{ color: '#f5222d' }} />
                )}
                <span style={{ 
                  color: record.ordersGrowth >= 0 ? '#52c41a' : '#f5222d',
                  fontSize: '12px'
                }}>
                  {Math.abs(record.ordersGrowth)}%
                </span>
              </Space>
            }
            style={{ backgroundColor: 'transparent' }}
          />
        </Space>
      ),
    },
    {
      title: 'Người dùng mới',
      key: 'users',
      render: (record: DailyStats) => (
        <Space direction="vertical" size="small">
          <Text>{record.users}</Text>
          <Badge
            count={
              <Space>
                {record.usersGrowth >= 0 ? (
                  <ArrowUpOutlined style={{ color: '#52c41a' }} />
                ) : (
                  <ArrowDownOutlined style={{ color: '#f5222d' }} />
                )}
                <span style={{ 
                  color: record.usersGrowth >= 0 ? '#52c41a' : '#f5222d',
                  fontSize: '12px'
                }}>
                  {Math.abs(record.usersGrowth)}%
                </span>
              </Space>
            }
            style={{ backgroundColor: 'transparent' }}
          />
        </Space>
      ),
    }
  ];

  // Top products columns
  const topProductColumns = [
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

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Title level={2}>Dashboard - Thống kê</Title>
        
        <Space>
          <Select 
            defaultValue="week" 
            style={{ width: 120 }} 
            onChange={value => setTimeRange(value)}
          >
            <Option value="today">Hôm nay</Option>
            <Option value="week">Tuần này</Option>
            <Option value="month">Tháng này</Option>
            <Option value="custom">Tùy chọn</Option>
          </Select>
          
          {timeRange === 'custom' && (
            <RangePicker 
              value={dateRange}
              onChange={(dates) => dates && setDateRange(dates as [moment.Moment, moment.Moment])}
            />
          )}

          <Tooltip title="Làm mới">
            <ReloadOutlined 
              onClick={generateMockData} 
              spin={loading}
              style={{ fontSize: '18px', cursor: 'pointer' }}
            />
          </Tooltip>
        </Space>
      </div>

      <Spin spinning={loading} indicator={<LoadingOutlined />}>
        {/* Statistics Cards */}
        <Row gutter={16}>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable className="mb-4">
              <Statistic
                title={
                  <Space>
                    <span>Tổng số người dùng</span>
                    <Badge 
                      count={`+${statistics.userGrowth}%`} 
                      style={{ backgroundColor: '#52c41a' }}
                    />
                  </Space>
                }
                value={statistics.totalUsers}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
              <Progress 
                percent={statistics.userGrowth}
                size="small"
                showInfo={false}
                strokeColor="#3f8600"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable className="mb-4">
              <Statistic
                title={
                  <Space>
                    <span>Số đơn hàng</span>
                    <Badge 
                      count={`+${statistics.orderGrowth}%`}
                      style={{ backgroundColor: '#1890ff' }}
                    />
                  </Space>
                }
                value={statistics.totalOrders}
                prefix={<ShoppingCartOutlined />}
                valueStyle={{ color: '#cf1322' }}
              />
              <Progress 
                percent={statistics.orderGrowth}
                size="small"
                showInfo={false}
                strokeColor="#cf1322"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable className="mb-4">
              <Statistic
                title={
                  <Space>
                    <span>Doanh thu</span>
                    <Badge 
                      count={`+${statistics.revenueGrowth}%`}
                      style={{ backgroundColor: '#52c41a' }}
                    />
                  </Space>
                }
                value={statistics.revenue}
                prefix={<DollarCircleOutlined />}
                valueStyle={{ color: '#1890ff' }}
                formatter={value => formatCurrency(Number(value))}
              />
              <Progress 
                percent={statistics.revenueGrowth}
                size="small"
                showInfo={false}
                strokeColor="#1890ff"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable className="mb-4">
              <Statistic
                title="Tỉ lệ hoàn thành"
                value={statistics.completionRate}
                prefix={<BarChartOutlined />}
                valueStyle={{ color: '#52c41a' }}
                suffix="%"
              />
              <Progress 
                percent={statistics.completionRate} 
                status="active"
                strokeColor={{ '0%': '#108ee9', '100%': '#52c41a' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Daily Stats Table */}
        <Card title="Thống kê theo ngày" className="mb-4">
          <Table 
            columns={dailyStatsColumns}
            dataSource={dailyStats}
            pagination={false}
            rowKey="date"
          />
        </Card>

        {/* Top Products Table */}
        <Card title="Top sản phẩm bán chạy">
          <Table 
            columns={topProductColumns}
            dataSource={topProducts}
            pagination={false}
            rowKey="id"
          />
        </Card>
      </Spin>
    </div>
  );
};

export default Dashboard;