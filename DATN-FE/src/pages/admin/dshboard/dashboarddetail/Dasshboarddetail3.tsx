import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Space,
  Select,
  Button,
  Spin,
  Table,
  Input,
  message,
  Statistic,
  Card,
} from "antd";

interface OrderStats {
  year: number;
  month?: number; // Make month optional
  day?: number; // Add day as optional
  total_revenue: string;
  growthPercentageComplete: string;
  total_orders: number;
  completed_orders: string; // Keep as string to handle the response format
  pending_orders: string;
  failed_delivery_orders: string;
  cancelled_orders: string;
  growth_percentageOrder: string;
  growthPercentageCancel: string;
  growthPercentageRevenue: string;
  growthPercentagePending: string;
  growthPercentageFailDelivery: string;
}

interface DashboardData {
  "Tổng đơn hàng": OrderStats[]; // Assuming the key is "Tổng đơn hàng" in the response
  "Tỉ lệ hoàn thành": number; // You might not need this
}

const OrderStatistics: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");
  const [filteredData, setFilteredData] = useState<OrderStats[]>([]);
  const [filterText, setFilterText] = useState("");

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
      let filtered: OrderStats[] = [];

      if (timeRange === "month" || timeRange === "year") {
        filtered = data["Tổng đơn hàng"].filter(
          (record) =>
            record.month?.toString().includes(value) ||
            record.year.toString().includes(value)
        );
      }

      if (timeRange === "quarter") {
        filtered = data["Tổng đơn hàng"].filter((record) => {
          const quarter = Math.ceil((record.month || 1) / 3);
          return (
            `Quý ${quarter}`.includes(value) ||
            record.year.toString().includes(value)
          );
        });
      }

      if (timeRange === "week") {
        filtered = data["Tổng đơn hàng"].filter((record) => {
          return (
            record.year.toString().includes(value) ||
            record.month?.toString().includes(value)
          );
        });
      }

      if (timeRange === "day") {
        filtered = data["Tổng đơn hàng"].filter((record) =>
          `${record.day}/${record.month}/${record.year}`.includes(value)
        );
      }

      setFilteredData(filtered || []);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!data) {
    return <div>Không có dữ liệu</div>;
  }

  // Function to calculate "Đơn hàng hoàn thành" for a specific time range
  const getCompletedOrdersForRange = (range: string) => {
    const today = new Date();
    let completedOrders = 0;

    data["Tổng đơn hàng"].forEach((record) => {
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
            completedOrders += parseInt(record.completed_orders || "0");
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
            completedOrders += parseInt(record.completed_orders || "0");
          }
          break;
        case "month":
          if (
            recordDate.getMonth() === today.getMonth() &&
            recordDate.getFullYear() === today.getFullYear()
          ) {
            completedOrders += parseInt(record.completed_orders || "0");
          }
          break;
        case "quarter":
          const quarterStartMonth = Math.floor(today.getMonth() / 3) * 3;
          if (
            recordDate.getMonth() >= quarterStartMonth &&
            recordDate.getMonth() < quarterStartMonth + 3 &&
            recordDate.getFullYear() === today.getFullYear()
          ) {
            completedOrders += parseInt(record.completed_orders || "0");
          }
          break;
        case "year":
          if (recordDate.getFullYear() === today.getFullYear()) {
            completedOrders += parseInt(record.completed_orders || "0");
          }
          break;
        default:
          break;
      }
    });

    return completedOrders;
  };

  // Define columns for the table
  const columns = [
    {
      title: "Ngày/Tháng/Năm",
      dataIndex: "day",
      key: "day",
      render: (text: any, record: OrderStats) => {
        if (timeRange === "year") {
          return `${record.year}`;
        } else if (timeRange === "quarter") {
          const quarter = Math.ceil((record.month || 1) / 3);
          return `Quý ${quarter} - ${record.month}/${record.year}`;
        } else if (timeRange === "week") {
          return `Tuần ${record.month} - ${record.month}/${record.year}`;
        } else if (timeRange === "month") {
          return `Tháng ${record.month}/${record.year}`;
        } else if (timeRange === "day") {
          return `Ngày ${record.day}/${record.month}/${record.year}`;
        }
        return null;
      },
    },
    {
      title: "Đơn hàng hoàn thành",
      dataIndex: "completed_orders",
      key: "completed_orders",
    },
    {
      title: "Tỷ lệ hoàn thành",
      dataIndex: "growthPercentageComplete",
      key: "growthPercentageComplete",
    },
  ];

  return (
    <Space
      direction="vertical"
      size="large"
      style={{ width: "100%", padding: 24 }}
    >
      <Row justify="start" style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Input
            value={filterText}
            onChange={handleFilterChange}
            placeholder={`Tìm kiếm theo ${
              timeRange === "month"
                ? "tháng"
                : timeRange === "year"
                ? "năm"
                : timeRange === "quarter"
                ? "quý"
                : timeRange === "week"
                ? "tuần"
                : "ngày"
            }`}
            style={{ width: "100%" }}
          />
        </Col>
      </Row>

      <Row>
        <Col span={24}>
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
        </Col>
      </Row>
      <Card className="bg-gray-50">
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Row gutter={16}>
            <Col span={12}>
              <strong> Đơn hàng hoàn thành hôm nay</strong>
              </Col>
              <Col span={12}>{getCompletedOrdersForRange("day")} đơn</Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <strong> Đơn hàng hoàn thành tuần nay</strong>
              </Col>
              <Col span={12}>{getCompletedOrdersForRange("week")} đơn</Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <strong> Đơn hàng hoàn thành Tháng nay</strong>
              </Col>
              <Col span={12}>{getCompletedOrdersForRange("month")} đơn</Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <strong> Đơn hàng hoàn thành Quý nay</strong>
              </Col>
              <Col span={12}>{getCompletedOrdersForRange("quarter")} đơn</Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <strong> Đơn hàng hoàn thành Năm nay</strong>
              </Col>
              <Col span={12}>{getCompletedOrdersForRange("year")} đơn</Col>
          </Row>
        </Space>
      </Card>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey={(record) =>
          `${record.day || record.month || record.year}-${record.year}`
        }
        pagination={false}
        scroll={{ y: 240 }}
      />
    </Space>
  );
};

export default OrderStatistics;