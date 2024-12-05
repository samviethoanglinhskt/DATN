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
  growthPercentageComplete: string;
  total_orders: number;
  completed_orders: string;
  cancelled_orders: string;
}

interface DashboardData {
  "Tổng đơn hàng": OrderStats[];
  "Tỉ lệ hủy đơn hàng": number; 
}

const ModalError: React.FC = () => {
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
      message.error("Không thể tải dữ liệu thống kê");
    } finally {
      setLoading(false);
    }
  };
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

    // Filter based on the month or year
    const filtered = data?.["Tổng đơn hàng"].filter(
      (record) =>
        record.month.toString().includes(value) ||
        record.year.toString().includes(value)
    );
    setFilteredData(filtered || []);
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
      render: (text: any, record: OrderStats) =>
        timeRange === "year"
          ? `${record.year}`
          : `${record.month}/${record.year}`,
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
      {/* Open Modal Button */}
      <Row justify="center">
        <Button type="primary" onClick={openModal}>
          Xem chi tiết
        </Button>
      </Row>

      {/* Modal */}
      <Modal
        title="Chi tiết tỉ lệ hủy đơn hàng"
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
              <strong>Tỷ lệ hủy đơn hàng tổng:</strong>{" "}
              {data["Tỉ lệ hủy đơn hàng"]}%
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
                  { value: "day", label: "Ngày" },
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

export default ModalError;
