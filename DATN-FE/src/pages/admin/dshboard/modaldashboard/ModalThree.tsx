import React, { useState, useEffect } from "react";
import {
  Modal,
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

const ModalDooble: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalFailureVisible, setModalFailureVisible] = useState(false);
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
      let filtered = data["Tổng đơn hàng"].filter((record) => {
        if (timeRange === "year") {
          return record.year.toString().includes(value);
        } else if (timeRange === "quarter") {
          const quarter = Math.ceil((record.month || 1) / 3);
          return (
            `Quý ${quarter}`.includes(value) ||
            record.year.toString().includes(value)
          );
        } else if (timeRange === "week") {
          return (
            `Tuần ${record.month}`.includes(value) ||
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

  const renderTimeColumn = (record: OrderStats) => {
    switch (timeRange) {
      case "year":
        return `Năm ${record.year}`;
      case "quarter":
        const quarter = Math.ceil((record.month || 1) / 3);
        return `Quý ${quarter}/${record.year}`;
      case "week":
        return `Tuần ${record.month}/${record.year}`;
      default:
        return `Tháng ${record.month}/${record.year}`;
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
          {((parseInt(record.pending_orders, 10) / record.total_orders) * 100).toFixed(2)}%
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
          {((parseInt(record.failed_delivery_orders, 10) / record.total_orders) * 100).toFixed(2)}%
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
          placeholder={`Tìm kiếm theo ${
            timeRange === "month"
              ? "tháng"
              : timeRange === "year"
              ? "năm"
              : timeRange === "quarter"
              ? "quý"
              : "tuần"
          }`}
        />
      </Col>
    </Row>
  );

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <Button type="primary" onClick={() => setModalFailureVisible(true)}>
        Xem chi tiết
      </Button>

      <Modal
        title={
          <Title level={4} style={{ margin: 0 }}>
            Chi tiết giao hàng thất bại và chờ xử lý
          </Title>
        }
        visible={modalFailureVisible}
        onCancel={() => setModalFailureVisible(false)}
        width={1200}
        footer={null}
        bodyStyle={{ padding: "24px" }}
      >
        <FilterSection />

        <Row gutter={24}>
          <Col span={12}>
            <Card
              bordered={false}
              className="shadow-sm"
              title={
                <div style={{ padding: "8px 0" }}>
                  <div style={{ fontSize: "16px", fontWeight: 600, color: "#1890ff" }}>
                    Đơn hàng chờ xử lý
                  </div>
                  <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                    Pending Orders
                  </div>
                </div>
              }
              headStyle={{ borderBottom: "1px solid #f0f0f0" }}
            >
              <div style={{ marginBottom: "12px", color: "#666" }}>
                Tỷ lệ chờ xử lý:{" "}
                <span style={{ color: "#1890ff", fontWeight: 600 }}>
                  {data?.["Tỉ lệ đơn hàng chờ xử lý"]}%
                </span>
              </div>
              <Table
                columns={pendingColumns}
                dataSource={filteredData}
                rowKey={(record) => `pending-${record.month}-${record.year}`}
                pagination={false}
                scroll={{ y: 400 }}
                size="middle"
                style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)", borderRadius: "8px" }}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card
              bordered={false}
              className="shadow-sm"
              title={
                <div style={{ padding: "8px 0" }}>
                  <div style={{ fontSize: "16px", fontWeight: 600, color: "#f5222d" }}>
                    Đơn hàng giao thất bại
                  </div>
                  <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                    Failed Deliveries
                  </div>
                </div>
              }
              headStyle={{ borderBottom: "1px solid #f0f0f0" }}
            >
              <div style={{ marginBottom: "12px", color: "#666" }}>
                Tỷ lệ thất bại:{" "}
                <span style={{ color: "#f5222d", fontWeight: 600 }}>
                  {data?.["Tỉ lệ giao hàng thất bại"]}%
                </span>
              </div>
              <Table
                columns={failureColumns}
                dataSource={filteredData}
                rowKey={(record) => `failure-${record.month}-${record.year}`}
                pagination={false}
                scroll={{ y: 400 }}
                size="middle"
                style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)", borderRadius: "8px" }}
              />
            </Card>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

export default ModalDooble;