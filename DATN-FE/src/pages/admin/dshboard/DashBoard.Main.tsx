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
import StatisticsDetailModal from "./StatisticsDetailModal";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  formatCurrency,
  getDailyStatsColumns,
  getTopProductColumns,
} from "./TableColums";
import { Column, Bar, Pie } from "@ant-design/plots";

const { Title } = Typography;
const { Option } = Select;

const Dashboard: React.FC = () => {
  const [timeType, setTimeType] = useState<string>("day");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"users" | "orders">("users");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["dashboard", timeType],
    queryFn: () => fetchDashboardData(timeType),
    refetchOnWindowFocus: false,
  });
  const statistics = data?.statistics ?? {
    totalRevenue: 0,
    totalUsers: 0,
    totalOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    completionRate: 0,
    cancellationRate: 0,
    userGrowth: "0",
    orderGrowth: "0",
    revenueGrowth: "0",
  };

  const dailyStats = data?.dailyStats ?? [];
  const topProducts = data?.topProducts ?? [];

  const getStatsTitle = () => {
    switch (timeType) {
      case "day":
        return "Thống kê doanh thu theo ngày";
      case "month":
        return "Thống kê doanh thu theo tháng";
      case "year":
        return "Thống kê doanh thu theo năm";
      default:
        return "Thống kê doanh thu";
    }
  };

  const handleCardClick = (type: "users" | "orders") => {
    setModalType(type);
    setModalVisible(true);
  };
  return (
    <div className="container-fluid py-4">
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
          <Row gutter={16}>
            <Col xs={24} sm={12} lg={8}>
              <Card
                hoverable
                className="mb-4"
                onClick={() => handleCardClick("users")}
              >
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

            <Col xs={24} sm={12} lg={8}>
              <Card
                hoverable
                className="mb-4"
                onClick={() => handleCardClick("orders")}
              >
                <Statistic
                  title={
                    <Space>
                      <span>Số đơn hàng</span>
                      <Badge
                        count={`+${statistics.orderGrowth}`}
                        style={{ backgroundColor: "#FF9900" }}
                      />
                    </Space>
                  }
                  value={statistics.totalOrders}
                  prefix={<ShoppingCartOutlined />}
                  valueStyle={{ color: "#FF9900" }}
                />
                <Progress
                  percent={parseFloat(statistics.orderGrowth)}
                  size="small"
                  showInfo={false}
                  strokeColor="#FF9900"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card hoverable className="mb-4">
                <Statistic
                  title={
                    <Space>
                      <span>Tổng doanh thu</span>
                      <Badge
                        count={`${statistics.revenueGrowth}%`}
                        style={{ backgroundColor: "#1890ff" }}
                      />
                    </Space>
                  }
                  value={statistics.totalRevenue}
                  prefix={<DollarCircleOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                  formatter={(value) => formatCurrency(Number(value))}
                />
                <Progress
                  percent={parseFloat(statistics.orderGrowth)}
                  size="small"
                  showInfo={false}
                  strokeColor="#1890ff"
                  style={{ marginTop: "12px" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card hoverable className="mb-4">
                <Statistic
                  title={
                    <Space>
                      <span>Tỉ lệ hoàn thành</span>
                      <Badge
                        count={`${statistics.completionRate}%`}
                        style={{ backgroundColor: "#52c41a" }}
                      />
                    </Space>
                  }
                  value={statistics.completedOrders}
                  prefix={<BarChartOutlined />}
                  valueStyle={{ color: "#52c41a" }}
                />
                <Progress
                  percent={statistics.completionRate}
                  size="small"
                  showInfo={false}
                  strokeColor="#52c41a"
                  status="active"
                  style={{ marginTop: "12px" }}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={8}>
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
                  style={{ marginTop: "12px" }}
                />
              </Card>
            </Col>
          </Row>
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
                  style={{ fontSize: "18px", cursor: "pointer" }}
                />
              </Space>
            }
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              {/* Biểu đồ cột */}
              <div style={{ width: "60%", paddingRight: "20px" }}>
                <Column
                  data={dailyStats}
                  xField="date" 
                  yField="revenue" 
                  label={{
                    position: "middle",
                    style: {
                      fill: "#FFFFFF",
                      fontSize: 12,
                      fontWeight: 500,
                    },
                  }}
                  tooltip={{
                    formatter: (datum) => ({
                      name: "Doanh thu",
                      value: formatCurrency(datum.revenue),
                    }),
                  }}
                  columnStyle={{
                    radius: [4, 4, 0, 0],
                    shadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                  color="#4CAF50" 
                  animation={{
                    appear: {
                      animation: "wave-in",
                      duration: 1000,
                    },
                  }}
                />
              </div>
              <div style={{ width: "35%" }}>
                <Table
                  columns={getDailyStatsColumns()}
                  dataSource={dailyStats}
                  pagination={false}
                  rowKey="date"
                  loading={isLoading}
                />
              </div>
            </div>
          </Card>

          <Card title="Top sản phẩm bán chạy" className="shadow-lg">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ width: "60%" }}>
                <Table
                  columns={getTopProductColumns()}
                  dataSource={topProducts}
                  pagination={false}
                  rowKey="id"
                />
              </div>

              <div style={{ width: "35%" }}>
                <Pie
                  data={topProducts}
                  angleField="sales" 
                  colorField="name" 
                  radius={0.8}
                  label={{
                    type: "outer",
                    content: "{name} {percentage}",
                  }}
                  tooltip={{
                    formatter: (datum) => ({
                      name: datum.name,
                      value: `${datum.sales} sản phẩm - ${formatCurrency(
                        datum.revenue
                      )}`,
                    }),
                  }}
                  interactions={[{ type: "element-active" }]}
                  animation={{
                    appear: {
                      animation: "fade-in",
                      duration: 1000,
                    },
                  }}
                />
              </div>
            </div>
          </Card>

          {data && (
            <StatisticsDetailModal
              open={modalVisible}
              onClose={() => setModalVisible(false)}
              type={modalType}
              data={data} // Pass entire data object instead of trying to destructure
            />
          )}
        </Spin>
      )}
    </div>
  );
};

export default Dashboard;