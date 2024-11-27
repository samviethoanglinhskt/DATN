import React, { useState } from "react";
import {
  Card,
  Col,
  Row,
  Statistic,
  Progress,
  Spin,
  Select,
  Table,
  Typography,
  Badge,
  Space,
  Alert,
} from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarCircleOutlined,
  BarChartOutlined,
  LoadingOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboardData } from "./dashboardService";

import "bootstrap/dist/css/bootstrap.min.css";
import { getDailyStatsColumns, getTopProductColumns } from "./TableColums";

const { Title } = Typography;
const { Option } = Select;

const Dashboard: React.FC = () => {
  const [timeType, setTimeType] = useState<string>("day");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard', timeType],
    queryFn: () => fetchDashboardData(timeType),
    refetchOnWindowFocus: false,
  });

  const statistics = data?.statistics ?? {
    totalUsers: 0,
    totalOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    completionRate: 0,
    cancellationRate: 0,
    userGrowth: "0",
    orderGrowth: "0",
  };

  const dailyStats = data?.dailyStats ?? [];
  const topProducts = data?.topProducts ?? [];

  const getStatsTitle = () => {
    switch (timeType) {
      case 'day':
        return 'Thống kê doanh thu theo ngày';
      case 'month':
        return 'Thống kê doanh thu theo tháng';
      case 'year':
        return 'Thống kê doanh thu theo năm';
      default:
        return 'Thống kê doanh thu';
    }
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Title level={2}>Dashboard - Thống kê</Title>
      </div>

      {error ? (
        <Alert
          message="Error"
          description="Có lỗi xảy ra khi tải dữ liệu"
          type="error"
          showIcon
        />
      ) : (
        <Spin spinning={isLoading} indicator={<LoadingOutlined />}>
          {/* Statistics Cards */}
          <Row gutter={16}>
            <Col xs={24} sm={12} lg={6}>
              <Card hoverable className="mb-4">
                <Statistic
                  title={
                    <Space>
                      <span>Tổng số người dùng</span>
                      <Badge
                        count={`+${statistics.userGrowth}`}
                        style={{ backgroundColor: "#52c41a" }}
                      />
                    </Space>
                  }
                  value={statistics.totalUsers}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: "#3f8600" }}
                />
                <Progress
                  percent={parseFloat(statistics.userGrowth)}
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
                        count={`+${statistics.orderGrowth}`}
                        style={{ backgroundColor: "#1890ff" }}
                      />
                    </Space>
                  }
                  value={statistics.totalOrders}
                  prefix={<ShoppingCartOutlined />}
                  valueStyle={{ color: "#cf1322" }}
                />
                <Progress
                  percent={parseFloat(statistics.orderGrowth)}
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
                      <span>Đơn hàng đã hủy</span>
                      <Badge
                        count={`${statistics.cancellationRate}%`}
                        style={{ backgroundColor: "#ff4d4f" }}
                      />
                    </Space>
                  }
                  value={statistics.cancelledOrders}
                  prefix={<DollarCircleOutlined />}
                  valueStyle={{ color: "#ff4d4f" }}
                />
                <Progress
                  percent={statistics.cancellationRate}
                  size="small"
                  showInfo={false}
                  strokeColor="#ff4d4f"
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card hoverable className="mb-4">
                <Statistic
                  title="Tỉ lệ hoàn thành"
                  value={statistics.completionRate}
                  prefix={<BarChartOutlined />}
                  valueStyle={{ color: "#52c41a" }}
                  suffix="%"
                />
                <Progress
                  percent={statistics.completionRate}
                  status="active"
                  strokeColor={{ "0%": "#108ee9", "100%": "#52c41a" }}
                />
              </Card>
            </Col>
          </Row>

          {/* Revenue Stats Table */}
          <Card 
            title={getStatsTitle()}
            className="mb-4"
            extra={
              <Space>
                <Select
                  value={timeType}
                  style={{ width: 150 }}
                  onChange={setTimeType}
                >
                  <Option value="day">Theo ngày</Option>
                  <Option value="month">Theo tháng</Option>
                  <Option value="year">Theo năm</Option>
                </Select>
                <ReloadOutlined 
                  onClick={() => refetch()} 
                  spin={isLoading}
                  style={{ fontSize: '18px', cursor: 'pointer' }}
                />
              </Space>
            }
          >
            <Table
              columns={getDailyStatsColumns()}
              dataSource={dailyStats}
              pagination={false}
              rowKey="date"
              loading={isLoading}
            />
          </Card>

          {/* Top Products Table */}
          <Card title="Top sản phẩm bán chạy">
            <Table
              columns={getTopProductColumns()}
              dataSource={topProducts}
              pagination={false}
              rowKey="id"
            />
          </Card>
        </Spin>
      )}
    </div>
  );
};

export default Dashboard;