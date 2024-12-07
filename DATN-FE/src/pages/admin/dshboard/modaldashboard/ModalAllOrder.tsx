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
  Statistic,
} from "antd";

interface OrderStats {
  year: number;
  month: number;
  total_revenue: string;
  growthPercentageComplete: string;
  total_orders: number;
  completed_orders: string;
}

interface DashboardData {
  "Tổng đơn hàng": OrderStats[];
  "Tỉ lệ hoàn thành": number;
}

const ModalAllOrder: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");
  const [modalVisible, setModalVisible] = useState(false);
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

  // Fetch data when the component mounts or when the time range changes
  useEffect(() => {
    fetchOrderStats();
  }, [timeRange]);

  // Tính toán tăng trưởng giữa các tháng, quý hoặc năm
  const calculateGrowth = (
    currentValue: number,
    previousValue: number
  ): string => {
    if (previousValue === 0) return "N/A"; // Tránh chia cho 0
    const growth = ((currentValue - previousValue) / previousValue) * 100;
    return `${growth.toFixed(2)} %`;
  };

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
      const filtered = data["Tổng đơn hàng"].filter((record) => {
        // Lọc theo tháng/năm cho các loại lọc "month", "quarter", "year"
        if (timeRange === "month" || timeRange === "year") {
          return (
            record.month?.toString().includes(value) ||
            record.year.toString().includes(value)
          );
        }
        // Lọc theo quý
        if (timeRange === "quarter") {
          return (
            record.year.toString().includes(value) &&
            record.completed_orders.includes(value)
          );
        }
        // Lọc theo tuần
        if (timeRange === "week") {
          return (
            record.year.toString().includes(value) ||
            record.completed_orders.includes(value)
          );
        }
        return false;
      });
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

  // Calculate total orders
  const totalOrders = filteredData.reduce(
    (total, record) => total + record.total_orders,
    0
  );
  const columns = [
    {
      title: "Tháng/Năm",
      dataIndex: "month",
      key: "month",
      render: (text: any, record: OrderStats) => {
        if (timeRange === "year") {
          return `${record.year}`;
        } else if (timeRange === "quarter") {
          return `Quý ${Math.ceil((record.month || 1) / 3)} - ${record.year}`;
        } else if (timeRange === "week") {
          return `${record.year} - Tuần ${record.month}`; // Sử dụng `month` cho tuần (giả sử đây là số tuần)
        } else if (timeRange === "month") {
          return `${record.month}/${record.year}`;
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
      render: (text: string, record: OrderStats) => {
        const completedOrders = parseInt(record.completed_orders, 10);
        const totalOrders = record.total_orders;
        const completionRate = ((completedOrders / totalOrders) * 100).toFixed(
          2
        );
        return `${completionRate} %`;
      },
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
          Xem chi tiết
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
            {/* Hiển thị tổng số đơn hàng */}
            <Col span={8}>
              <Statistic
                title="Tổng số đơn hàng"
                value={totalOrders}
                suffix="đơn"
              />
            </Col>
          </Row>

          <Col>
            <Space>
              Thống kê theo:
              <Select
                className="mb-2"
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
                placeholder="Tìm kiếm theo tháng/năm"
                style={{ width: "100%" }}
              />
            </Col>
          </Row>

          {/* Table */}
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey={(record) => `${record.month}-${record.year}`}
            pagination={false}
            scroll={{ y: 240 }}
          />
        </div>
      </Modal>
    </Space>
  );
};

export default ModalAllOrder;
