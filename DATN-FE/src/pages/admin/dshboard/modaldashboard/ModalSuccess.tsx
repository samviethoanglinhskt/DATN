import React, { useState, useEffect } from "react";
import {
  Modal,
  Row,
  Col,
  Space,
  Select,
  Button,
  Spin,
  Table,
  Input,
  message,
} from "antd";

interface OrderStats {
  year: number;
  month?: number; // Make month optional
  total_revenue: string;
  growthPercentageComplete: string;
  total_orders: number;
  completed_orders: string;
}

interface DashboardData {
  "Tổng đơn hàng": OrderStats[];
  "Tỉ lệ hoàn thành": number;
}

const ModalSuccess: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month"); // Default time range is "month"
  const [modalVisible, setModalVisible] = useState(false);
  const [filteredData, setFilteredData] = useState<OrderStats[]>([]);
  const [filterText, setFilterText] = useState(""); // Text input for filtering

  // Fetch data with type as the time range (day, week, month, quarter, year)
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

  // Handle time range changes
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    fetchOrderStats(value); // Fetch data with new time range
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  // Handle text filter change
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilterText(value);

    if (data) {
      let filtered: OrderStats[] = [];

      // Lọc dữ liệu theo phạm vi thời gian
      if (timeRange === "month" || timeRange === "year") {
        filtered = data["Tổng đơn hàng"].filter(
          (record) =>
            record.month?.toString().includes(value) ||
            record.year.toString().includes(value)
        );
      }

      if (timeRange === "quarter") {
        filtered = data["Tổng đơn hàng"].filter((record) => {
          // Lọc theo Quý
          const quarter = Math.ceil((record.month || 1) / 3);
          return (
            `Quý ${quarter}`.includes(value) ||
            record.year.toString().includes(value)
          );
        });
      }

      if (timeRange === "week") {
        filtered = data["Tổng đơn hàng"].filter((record) => {
          // Lọc theo Tuần
          return (
            record.year.toString().includes(value) ||
            record.month?.toString().includes(value)
          );
        });
      }

      if (timeRange === "day") {
        // Nếu cần lọc theo ngày, bạn có thể sử dụng logic lọc khác tùy theo định dạng ngày
        filtered = data["Tổng đơn hàng"].filter((record) =>
          `${record.month}/${record.year}`.includes(value)
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

  // Define columns for the table inside modal
  const columns = [
    {
      title: "Tháng/Năm",
      dataIndex: "month",
      key: "month",
      render: (text: any, record: OrderStats) => {
        if (timeRange === "year") {
          return `${record.year}`;
        } else if (timeRange === "quarter") {
          const quarter = Math.ceil((record.month || 1) / 3);
          return `Quý ${quarter} - ${record.year}`;
        } else if (timeRange === "week") {
          return `Tuần ${record.month} - ${record.year}`;
        } else if (timeRange === "month") {
          return `${record.month}/${record.year}`;
        } else if (timeRange === "day") {
          return `Ngày ${record.month || ""}/${record.year}`;
        }
        return null;
      },
    },
    {
      title: "Tổng đơn hàng",
      dataIndex: "total_orders",
      key: "total_orders",
    },
    {
      title: "Đơn hàng hoàn thành",
      dataIndex: "completed_orders",
      key: "completed_orders",
    },
    {
      title: "Tỷ lệ hoàn thành",
      key: "completion_rate",
      render: (text: string, record: OrderStats) =>
        `${(
          (parseInt(record.completed_orders, 10) / record.total_orders) *
          100
        ).toFixed(2)} %`,
    },
  ];

  return (
    <Space
      direction="vertical"
      size="large"
      style={{ width: "100%", padding: 24 }}
    >
      {/* Open Modal Button */}
      <Row justify="center">
        <Button type="primary" onClick={openModal}>
          Xem chi tiết tỷ lệ hoàn thành
        </Button>
      </Row>

      {/* Modal */}
      <Modal
        title="Chi tiết tỉ lệ hoàn thành"
        visible={modalVisible}
        onCancel={closeModal}
        footer={null}
        width={800}
      >
        <div>
          <Row
            justify="space-between"
            align="middle"
            style={{ marginBottom: 16 }}
          >
            {/* You can add summary or statistics here */}
          </Row>

          <Col>
            <Space>
              Thống kê theo:
              <Select
                value={timeRange}
                onChange={handleTimeRangeChange}
                style={{ width: 120 }}
                options={[
                  { value: "week", label: "Tuần" },
                  { value: "month", label: "Tháng" },
                  { value: "quarter", label: "Quý" },
                  { value: "year", label: "Năm" },
                ]}
              />
            </Space>
          </Col>

          {/* Filter Input Inside Modal */}
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

          {/* Table */}
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey={(record) => `${record.month || record.year}-${record.year}`}
            pagination={false}
            scroll={{ y: 240 }}
          />
        </div>
      </Modal>
    </Space>
  );
};

export default ModalSuccess;
