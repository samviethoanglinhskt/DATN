import React, { useState } from "react";
import {
  Card,
  Col,
  Row,
  Statistic,
  Progress,
  Spin,
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
  WarningOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboardData } from "./dashboardService";
import "bootstrap/dist/css/bootstrap.min.css";
import { formatCurrency } from "./TableColums";
import ModalSuccess from "./modaldashboard/ModalSuccess";
import ModalError from "./modaldashboard/ModalError";
import ModalDooble from "./modaldashboard/ModalThree";
import RevenueModal from "./modaldashboard/ModalDoanhThu";
import ModalAllOrder from "./modaldashboard/ModalAllOrder";
import ModalUserStats from "./modaldashboard/Modalusser";
import TopBrandComponent from "./TopBrand";
import TopSellingProductsComponent from "./TopProduct";
import "./style.css";
import TopRatedProducts from "./TopRate";

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const [timeType] = useState<string>("day");
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard", timeType],
    queryFn: () => fetchDashboardData(timeType),
    refetchOnWindowFocus: false,
  });
  const statistics = data?.statistics ?? {
    totalRevenue: 0,
    totalUsers: 0,
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    cancelledOrders: 0,
    completionRate: 0,
    cancellationRate: 0,
    failedDeliveryOrders: 0,
    userGrowth: "0",
    orderGrowth: "0",
    revenueGrowth: "0",
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
              <Card hoverable className="mb-4 card-hover-container">
                <div className="revenue-modal-container">
                  <ModalUserStats />
                </div>
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
              <Card hoverable className="mb-4 card-hover-container">
                <div className="revenue-modal-container">
                  <ModalAllOrder />
                </div>
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
              <Card hoverable className="mb-4 card-hover-container">
                {/* Ẩn RevenueModal ban đầu và hiển thị khi hover vào Card */}
                <div className="revenue-modal-container">
                  <RevenueModal />
                </div>
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
              <Card hoverable className="mb-4 card-hover-container">
                <div className="revenue-modal-container">
                  <ModalSuccess />
                </div>
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
              <Card hoverable className="mb-4 card-hover-container">
                <div className="revenue-modal-container">
                  <ModalError />
                </div>

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
            <Col xs={24} sm={12} lg={8}>
              <Card hoverable className="mb-4 card-hover-container">
                <div className="revenue-modal-container">
                  <ModalDooble />
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  {/* Đơn hàng chờ xử lý */}
                  <div style={{ flex: 1, marginRight: "8px" }}>
                    <Statistic
                      title={
                        <Space>
                          <span>Đơn hàng chờ xử lý</span>
                          <Badge
                            count={statistics.pendingOrders}
                            style={{ backgroundColor: "#faad14" }}
                          />
                        </Space>
                      }
                      value={statistics.pendingOrders}
                      prefix={<ClockCircleOutlined />}
                      valueStyle={{ color: "#faad14" }}
                    />
                    <Progress
                      percent={100}
                      size="small"
                      showInfo={false}
                      strokeColor="#faad14"
                    />
                  </div>

                  {/* Đơn hàng giao thất bại */}
                  <div style={{ flex: 1, marginLeft: "8px" }}>
                    <Statistic
                      title={
                        <Space>
                          <span>Đơn hàng giao thất bại</span>
                        </Space>
                      }
                      value={statistics.failedDeliveryOrders}
                      prefix={<WarningOutlined />}
                      valueStyle={{ color: "#ff4d4f" }}
                    />
                    <Progress
                      percent={100}
                      size="small"
                      showInfo={false}
                      strokeColor="#ff4d4f"
                    />
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
          <Card>
            <TopSellingProductsComponent />
          </Card>

          <Card title="Top sản phẩm bán chạy" className="shadow-lg">
            <TopBrandComponent />
          </Card>
          <Card>
            <TopRatedProducts />
          </Card>
        </Spin>
      )}
    </div>
  );
};

export default Dashboard;
