import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Table,
  Button,
  Spin,
  Typography,
  Card,
  message,
  Select,
  Space,
  Input,
} from "antd";

const { Title } = Typography;

interface OrderStats {
  week_in_month: number;
  day: number;
  year: number;
  month?: number;
  total_revenue: string;
  growthPercentageComplete: string;
  total_orders: number;
  completed_orders: string;
  cancelled_orders: string;
  pending_orders: string;
  failed_delivery_orders: string;
}

interface DashboardData {
  "Tổng đơn hàng": OrderStats[];
  "Tỉ lệ hủy đơn hàng": number;
  "Tỉ lệ đơn hàng chờ xử lý": number;
  "Tỉ lệ giao hàng thất bại": number;
}

const DashboardEror: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");
  const [filteredData, setFilteredData] = useState<OrderStats[]>([]);
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const fetchOrderStats = async (period: string = timeRange) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://127.0.0.1:8000/api/statistics/order?type=${period}`
      );
      if (!response.ok) throw new Error("Failed to fetch order statistics");
      const result = await response.json();
      setData(result);
      setFilteredData(result["Tổng đơn hàng"]);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Không thể tải dữ liệu thống kê");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderStats();
  }, [timeRange]);

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    fetchOrderStats(value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilterText(value);

    if (data) {
      let filtered = data["Tổng đơn hàng"].filter((record) => {
        if (timeRange === "year") {
          return record.year.toString().includes(value);
        } else if (timeRange === "day") {
          filtered = data["Tổng đơn hàng"].filter((record) =>
            `${record.day}/${record.month}/${record.year}`.includes(value)
          );
        } else if (timeRange === "quarter") {
          const quarter = Math.ceil((record.month || 1) / 3);
          return (
            `Quý ${quarter}`.includes(value) ||
            record.year.toString().includes(value)
          );
        } else if (timeRange === "week") {
          return (
            `Tuần ${record.week_in_month}`.includes(value) ||
            record.year.toString().includes(value)
          );
        } else {
          return (
            record.month?.toString().includes(value) ||
            record.year.toString().includes(value)
          );
        }
      });
      setFilteredData(filtered);
    }
  };

  const getCancelledOrdersForRange = (range: string) => {
    const today = new Date();
    let cancelledOrders = 0;

    data?.["Tổng đơn hàng"].forEach((record) => {
      const recordDate = new Date(
        record.year,
        (record.month || 1) - 1,
        record.day || 1
      );

      switch (range) {
        case "day":
          if (
            recordDate.getDate() === today.getDate() &&
            recordDate.getMonth() === today.getMonth() &&
            recordDate.getFullYear() === today.getFullYear()
          ) {
            cancelledOrders += parseInt(record.cancelled_orders || "0");
          }
          break;
        case "week":
          const weekStartDate = new Date(
            today.setDate(today.getDate() - today.getDay())
          );
          if (
            recordDate >= weekStartDate &&
            recordDate.getFullYear() === today.getFullYear()
          ) {
            cancelledOrders += parseInt(record.cancelled_orders || "0");
          }
          break;
        case "month":
          if (
            recordDate.getMonth() === today.getMonth() &&
            recordDate.getFullYear() === today.getFullYear()
          ) {
            cancelledOrders += parseInt(record.cancelled_orders || "0");
          }
          break;
        case "quarter":
          const quarterStartMonth = Math.floor(today.getMonth() / 3) * 3;
          if (
            recordDate.getMonth() >= quarterStartMonth &&
            recordDate.getMonth() < quarterStartMonth + 3 &&
            recordDate.getFullYear() === today.getFullYear()
          ) {
            cancelledOrders += parseInt(record.cancelled_orders || "0");
          }
          break;
        case "year":
          if (recordDate.getFullYear() === today.getFullYear()) {
            cancelledOrders += parseInt(record.cancelled_orders || "0");
          }
          break;
        default:
          break;
      }
    });

    return cancelledOrders;
  };

  const getPendingOrdersForRange = (range: string) => {
    const today = new Date();
    let pendingOrders = 0;

    data?.["Tổng đơn hàng"].forEach((record) => {
      const recordDate = new Date(
        record.year,
        (record.month || 1) - 1,
        record.day || 1
      );

      switch (range) {
        case "day":
          if (
            recordDate.getDate() === today.getDate() &&
            recordDate.getMonth() === today.getMonth() &&
            recordDate.getFullYear() === today.getFullYear()
          ) {
            pendingOrders += parseInt(record.pending_orders || "0");
          }
          break;
        case "week":
          const weekStartDate = new Date(
            today.setDate(today.getDate() - today.getDay())
          );
          if (
            recordDate >= weekStartDate &&
            recordDate.getFullYear() === today.getFullYear()
          ) {
            pendingOrders += parseInt(record.pending_orders || "0");
          }
          break;
        case "month":
          if (
            recordDate.getMonth() === today.getMonth() &&
            recordDate.getFullYear() === today.getFullYear()
          ) {
            pendingOrders += parseInt(record.pending_orders || "0");
          }
          break;
        case "quarter":
          const quarterStartMonth = Math.floor(today.getMonth() / 3) * 3;
          if (
            recordDate.getMonth() >= quarterStartMonth &&
            recordDate.getMonth() < quarterStartMonth + 3 &&
            recordDate.getFullYear() === today.getFullYear()
          ) {
            pendingOrders += parseInt(record.pending_orders || "0");
          }
          break;
        case "year":
          if (recordDate.getFullYear() === today.getFullYear()) {
            pendingOrders += parseInt(record.pending_orders || "0");
          }
          break;
        default:
          break;
      }
    });

    return pendingOrders;
  };

  const getFailedDeliveryOrdersForRange = (range: string) => {
    const today = new Date();
    let failedDeliveryOrders = 0;

    data?.["Tổng đơn hàng"].forEach((record) => {
      const recordDate = new Date(
        record.year,
        (record.month || 1) - 1,
        record.day || 1
      );

      switch (range) {
        case "day":
          if (
            recordDate.getDate() === today.getDate() &&
            recordDate.getMonth() === today.getMonth() &&
            recordDate.getFullYear() === today.getFullYear()
          ) {
            failedDeliveryOrders += parseInt(
              record.failed_delivery_orders || "0"
            );
          }
          break;
        case "week":
          const weekStartDate = new Date(
            today.setDate(today.getDate() - today.getDay())
          );
          if (
            recordDate >= weekStartDate &&
            recordDate.getFullYear() === today.getFullYear()
          ) {
            failedDeliveryOrders += parseInt(
              record.failed_delivery_orders || "0"
            );
          }
          break;
        case "month":
          if (
            recordDate.getMonth() === today.getMonth() &&
            recordDate.getFullYear() === today.getFullYear()
          ) {
            failedDeliveryOrders += parseInt(
              record.failed_delivery_orders || "0"
            );
          }
          break;
        case "quarter":
          const quarterStartMonth = Math.floor(today.getMonth() / 3) * 3;
          if (
            recordDate.getMonth() >= quarterStartMonth &&
            recordDate.getMonth() < quarterStartMonth + 3 &&
            recordDate.getFullYear() === today.getFullYear()
          ) {
            failedDeliveryOrders += parseInt(
              record.failed_delivery_orders || "0"
            );
          }
          break;
        case "year":
          if (recordDate.getFullYear() === today.getFullYear()) {
            failedDeliveryOrders += parseInt(
              record.failed_delivery_orders || "0"
            );
          }
          break;
        default:
          break;
      }
    });

    return failedDeliveryOrders;
  };

  const renderTimeColumn = (record: OrderStats) => {
    switch (timeRange) {
      case "year":
        return `Năm ${record.year}`;
      case "quarter":
        const quarter = Math.ceil((record.month || 1) / 3);
        return `Quý ${quarter}-${record.month}/${record.year}`;
      case "week":
        return `Tuần ${record.week_in_month}-${record.month}/${record.year}`;
      case "month":
        return `Tháng ${record.month}/${record.year}`;
      default:
        return `Ngày ${record.day}/${record.month}/${record.year}`;
    }
  };

  const pendingColumns = [
    {
      title: (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 600 }}>Thời gian</div>
          <div style={{ fontSize: "12px", color: "#666" }}>Time Period</div>
        </div>
      ),
      dataIndex: "month",
      key: "month",
      align: "center" as const,
      width: 120,
      render: (_: any, record: OrderStats) => (
        <div style={{ fontWeight: 500 }}>{renderTimeColumn(record)}</div>
      ),
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 600 }}>Số lượng</div>
          <div style={{ fontSize: "12px", color: "#666" }}>Quantity</div>
        </div>
      ),
      dataIndex: "pending_orders",
      key: "pending_orders",
      align: "center" as const,
      width: 120,
      render: (value: string) => (
        <div style={{ color: "#1890ff", fontWeight: 600, fontSize: "15px" }}>
          {value}
        </div>
      ),
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 600 }}>Tỷ lệ</div>
          <div style={{ fontSize: "12px", color: "#666" }}>Rate</div>
        </div>
      ),
      key: "pending_rate",
      align: "center" as const,
      width: 120,
      render: (_: string, record: OrderStats) => (
        <div style={{ color: "#722ed1", fontWeight: 600 }}>
          {(
            (parseInt(record.pending_orders, 10) / record.total_orders) *
            100
          ).toFixed(2)}
          %
        </div>
      ),
    },
  ];

  const failureColumns = [
    {
      title: (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 600 }}>Thời gian</div>
          <div style={{ fontSize: "12px", color: "#666" }}>Time Period</div>
        </div>
      ),
      dataIndex: "month",
      key: "month",
      align: "center" as const,
      width: 120,
      render: (_: any, record: OrderStats) => (
        <div style={{ fontWeight: 500 }}>{renderTimeColumn(record)}</div>
      ),
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 600 }}>Số lượng</div>
          <div style={{ fontSize: "12px", color: "#666" }}>Quantity</div>
        </div>
      ),
      dataIndex: "failed_delivery_orders",
      key: "failed_delivery_orders",
      align: "center" as const,
      width: 120,
      render: (value: string) => (
        <div style={{ color: "#f5222d", fontWeight: 600, fontSize: "15px" }}>
          {value}
        </div>
      ),
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 600 }}>Tỷ lệ</div>
          <div style={{ fontSize: "12px", color: "#666" }}>Rate</div>
        </div>
      ),
      key: "failure_rate",
      align: "center" as const,
      width: 120,
      render: (_: string, record: OrderStats) => (
        <div style={{ color: "#722ed1", fontWeight: 600 }}>
          {(
            (parseInt(record.failed_delivery_orders, 10) /
              record.total_orders) *
            100
          ).toFixed(2)}
          %
        </div>
      ),
    },
  ];

  const FilterSection = () => (
    <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
      <Col>
        <Space>
          Thống kê theo:
          <Select
            value={timeRange}
            onChange={handleTimeRangeChange}
            style={{ width: 120 }}
            options={[
              { value: "day", label: "Ngày" },
              { value: "week", label: "Tuần" },
              { value: "month", label: "Tháng" },
              { value: "quarter", label: "Quý" },
              { value: "year", label: "Năm" },
            ]}
          />
        </Space>
      </Col>
      <Col span={8}>
        <Input
          value={filterText}
          onChange={handleFilterChange}
          placeholder="Tìm kiếm..."
        />
      </Col>
    </Row>
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  return (
    <div>
      <FilterSection />

      <Row gutter={[16, 24]}>
        <Col span={24}>
          <Card className="bg-gray-50">
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Row gutter={16}>
                <Col span={12}>
                  <strong>Số đơn chờ hôm nay:</strong>{" "}
                </Col>
                <Col span={12}>{getPendingOrdersForRange("day")} đơn</Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <strong>Số đơn chờ tuần nay:</strong>{" "}
                </Col>
                <Col span={12}>{getPendingOrdersForRange("week")} đơn</Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <strong>Số đơn chờ tháng nay:</strong>{" "}
                </Col>
                <Col span={12}>{getPendingOrdersForRange("month")} đơn</Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <strong>Số đơn chờ quý nay:</strong>{" "}
                </Col>
                <Col span={12}>{getPendingOrdersForRange("quarter")} đơn</Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <strong>Số đơn chờ năm nay:</strong>{" "}
                </Col>
                <Col span={12}>{getPendingOrdersForRange("year")} đơn</Col>
              </Row>
            </Space>
          </Card>
          <Card title="Tổng đơn hàng">
            <Table
              dataSource={paginatedData}
              columns={pendingColumns}
              pagination={{
                current: currentPage,
                pageSize,
                total: filteredData.length,
                onChange: handlePageChange,
              }}
              bordered
            />
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Tỉ lệ giao hàng thất bại">
            <Card>
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <strong>Số đơn chờ hôm nay:</strong>{" "}
                  </Col>
                  <Col span={12}>
                    {getFailedDeliveryOrdersForRange("day")} đơn
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <strong>Số đơn chờ tuần nay:</strong>{" "}
                  </Col>
                  <Col span={12}>
                    {getFailedDeliveryOrdersForRange("week")} đơn
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <strong>Số đơn chờ tháng nay:</strong>{" "}
                  </Col>
                  <Col span={12}>
                    {getFailedDeliveryOrdersForRange("month")} đơn
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <strong>Số đơn chờ quý nay:</strong>{" "}
                  </Col>
                  <Col span={12}>
                    {getFailedDeliveryOrdersForRange("quarter")} đơn
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <strong>Số đơn chờ năm nay:</strong>{" "}
                  </Col>
                  <Col span={12}>
                    {getFailedDeliveryOrdersForRange("year")} đơn
                  </Col>
                </Row>
              </Space>
            </Card>
            <Table
              dataSource={paginatedData}
              columns={failureColumns}
              pagination={{
                current: currentPage,
                pageSize,
                total: filteredData.length,
                onChange: handlePageChange,
              }}
              bordered
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardEror;
