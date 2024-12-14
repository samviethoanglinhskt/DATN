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
  Card, // Sử dụng Card thay thế Modal
} from "antd";

interface OrderStats {
  year: number;
  month: number;
  day: number;
  total_revenue: string;
  growthPercentageComplete: string;
  total_orders: number;
  completed_orders: string;
  cancelled_orders: string;
}

interface DashboardData {
  "Tổng đơn hàng": OrderStats[];
  "Tỉ lệ hủy đơn hàng": number;
}

const ModalErrorr: React.FC = () => {
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
      setFilteredData(result["Tổng đơn hàng"]); // Set filtered data initially to all records
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Không thể tải dữ liệu thống kê");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when the component mounts or when the time range changes
  useEffect(() => {
    fetchOrderStats();
  }, [timeRange]);

  // Tính toán tỷ lệ hủy đơn hàng
  const calculateCancellationRate = (
    cancelled_orders: string,
    total_orders: number
  ): string => {
    const cancelled = parseInt(cancelled_orders, 10);
    const rate = (cancelled / total_orders) * 100;
    return `${rate.toFixed(2)} %`;
  };

  // Handle time range changes
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    fetchOrderStats(value);
  };

  // Handle text filter change
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilterText(value);

    if (data) {
      let filtered: OrderStats[] = [];

      if (timeRange === "month" || timeRange === "year") {
        // Lọc theo tháng hoặc năm
        filtered = data["Tổng đơn hàng"].filter(
          (record) =>
            record.month.toString().includes(value) ||
            record.year.toString().includes(value)
        );
      }

      if (timeRange === "quarter") {
        // Lọc theo quý
        filtered = data["Tổng đơn hàng"].filter((record) => {
          const quarter = Math.ceil((record.month || 1) / 3);
          return (
            `Quý ${quarter}`.includes(value) ||
            record.year.toString().includes(value)
          );
        });
      }

      if (timeRange === "week") {
        // Lọc theo tuần (tuần 1, tuần 2, ... )
        filtered = data["Tổng đơn hàng"].filter((record) => {
          return (
            record.year.toString().includes(value) ||
            record.month.toString().includes(value)
          );
        });
      }

      if (timeRange === "day") {
        // Lọc theo ngày
        filtered = data["Tổng đơn hàng"].filter((record) =>
          `${record.day}/${record.month}/${record.year}`.includes(value)
        );
      }

      setFilteredData(filtered || []);
    }
  };

  // Tính tổng số đơn hàng hủy trong khoảng thời gian
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

  // Define columns for the table inside the Card
  const columns = [
    {
      title: "Thời gian",
      dataIndex: "time",
      key: "time",
      render: (text: any, record: OrderStats) => {
        if (timeRange === "year") {
          return `${record.year}`;
        } else if (timeRange === "quarter") {
          const quarter = Math.ceil((record.month || 1) / 3);
          return `Quý ${quarter} - ${record.month}/${record.year}`;
        } else if (timeRange === "week") {
          return `Tuần ${record.month} - ${record.month}/${record.year}`;
        } else if (timeRange === "month") {
          return `${record.month}/${record.year}`;
        } else if (timeRange === "day") {
          return `${record.day}/${record.month}/${record.year}`;
        }
        return null;
      },
    },
    {
      title: "Đơn hàng đã hủy",
      dataIndex: "cancelled_orders",
      key: "cancelled_orders",
    },
    {
      title: "Tỷ lệ hủy đơn hàng",
      key: "cancellation_rate",
      render: (text: string, record: OrderStats) =>
        calculateCancellationRate(record.cancelled_orders, record.total_orders),
    },
  ];

  return (
    <Space
      direction="vertical"
      size="large"
      style={{ width: "100%", padding: 24 }}
    >
      {/* Card for showing the details instead of Modal */}
      <Card
        title="Chi tiết tỉ lệ hủy đơn hàng"
        className="bg-gray-50"
        bordered={false}
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Row gutter={16}>
            <Col span={12}>
              <strong>Số đơn hủy hôm nay:</strong>{" "}
            </Col>
            <Col>{getCancelledOrdersForRange("day")} đơn</Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <strong>Số đơn hủy tuần nay:</strong>{" "}
            </Col>
            <Col>{getCancelledOrdersForRange("week")} đơn</Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <strong>Số đơn hủy tháng nay:</strong>{" "}
            </Col>
            <Col>{getCancelledOrdersForRange("month")} đơn</Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <strong>Số đơn hủy quý nay:</strong>{" "}
            </Col>
            <Col>{getCancelledOrdersForRange("quarter")} đơn</Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <strong>Số đơn hủy năm nay:</strong>{" "}
            </Col>
            <Col>{getCancelledOrdersForRange("year")} đơn</Col>
          </Row>
        </Space>

        <div>
          <Row
            justify="space-between"
            align="middle"
            style={{ marginBottom: 16 }}
          ></Row>

          <Col>
            <Space>
              Thống kê theo:
              <Select
                className="mb-2"
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

          {/* Filter Input inside Card */}
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

          {/* Table inside Card */}
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey={(record) => `${record.day}-${record.month}-${record.year}`}
            pagination={false}
            scroll={{ y: 240 }}
          />
        </div>
      </Card>
    </Space>
  );
};

export default ModalErrorr;
