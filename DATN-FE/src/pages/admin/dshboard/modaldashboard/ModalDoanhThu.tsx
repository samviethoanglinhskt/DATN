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
  month: number;
  total_revenue: string;
  growthPercentageRevenue: string;
}

interface DashboardData {
  "Tổng đơn hàng": OrderStats[];
  "Tổng doanh thu": number;
}

const RevenueModal: React.FC = () => {
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

  const formatCurrency = (value: string | number): string => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numValue);
  };

  const GrowthIndicator: React.FC<{ value: string }> = ({ value }) => {
    const numValue = parseFloat(value.replace(" %", ""));
    return (
      <Space>
        {numValue !== 0 &&
          (numValue > 0 ? (
            <span style={{ color: "#52c41a" }}>↑</span>
          ) : (
            <span style={{ color: "#ff4d4f" }}>↓</span>
          ))}
        <span
          style={{
            color:
              numValue > 0 ? "#52c41a" : numValue < 0 ? "#ff4d4f" : "inherit",
          }}
        >
          {value}
        </span>
      </Space>
    );
  };

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

      // Lọc dữ liệu theo các phạm vi thời gian
      if (timeRange === "month" || timeRange === "year") {
        filtered = data["Tổng đơn hàng"].filter((record) => {
          return (
            record.month.toString().includes(value) ||
            record.year.toString().includes(value)
          );
        });
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
            record.month.toString().includes(value)
          );
        });
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
        }
        return null;
      },
    },
    {
      title: "Doanh thu",
      dataIndex: "total_revenue",
      key: "total_revenue",
      render: (text: string) => formatCurrency(text),
    },
    {
      title: "Tăng trưởng",
      dataIndex: "growthPercentageRevenue",
      key: "growthPercentageRevenue",
      render: (text: string) => <GrowthIndicator value={text} />,
    },
  ];

  return (
    <Space
      direction="vertical"
      size="large"
      style={{ width: "100%", padding: 24 }}
    >
      <div className="relative">
        <Button type="primary" onClick={openModal}>
          Xem chi tiết
        </Button>
      </div>

      {/* Modal */}
      <Modal
        title="Doanh thu chi tiết"
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
            <Col span={12}>
              <strong>Doanh thu tổng:</strong>{" "}
              {formatCurrency(data["Tổng doanh thu"])}
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <strong>Thống kê theo thời gian</strong>
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
                placeholder={`Tìm kiếm theo ${
                  timeRange === "month"
                    ? "tháng"
                    : timeRange === "year"
                    ? "năm"
                    : timeRange === "quarter"
                    ? "quý"
                    : "tuần"
                }`}
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

export default RevenueModal;
