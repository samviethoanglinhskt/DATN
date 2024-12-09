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
  message,
  Typography,
} from "antd";
import { ColumnType } from "antd/es/table";
const { Title } = Typography;
interface UserStats {
  year: number;
  month: number;
  week_in_month: number;
  total_users: number;
  quarter?: number;
  growth_percentage: string;
}

interface UserDashboardData {
  "Người dùng": UserStats[];
  "Tổng tất cả người dùng": number;
}

const ModalUserStats: React.FC = () => {
  const [data, setData] = useState<UserDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");
  const [modalVisible, setModalVisible] = useState(false);
  const [filteredData, setFilteredData] = useState<UserStats[]>([]);
  const fetchUserStats = async (type: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://127.0.0.1:8000/api/statistics/user?type=${type}`
      );
      if (!response.ok) throw new Error("Failed to fetch user statistics");
      const result = await response.json();
      setData(result);
      setFilteredData(result["Người dùng"]);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Không thể tải dữ liệu thống kê người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserStats(timeRange);
  }, [timeRange]);

  // Handle time range change
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    if (data && data["Người dùng"]) {
      let filtered = data["Người dùng"];
      if (value === "week") {
        filtered = filtered.filter((item) => item.week_in_month); // Lọc theo tuần
      } else if (value === "month") {
        filtered = filtered.filter((item) => item.month); // Lọc theo tháng
      } else if (value === "quarter") {
        filtered = filtered.filter((item) => item.quarter); // Lọc theo quý
      } else if (value === "year") {
        filtered = filtered.filter((item) => item.year); // Lọc theo năm
      }
      setFilteredData(filtered);
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
  const columns: ColumnType<UserStats>[] = [
    {
      title: "Thời gian",
      dataIndex: "week_in_month",
      key: "week_in_month",
      align: "center",
      render: (value: any, record: UserStats) => {
        if (timeRange === "week") {
          return (
            <div>
              {record.month}/{record.year} - Tuần {record.week_in_month}
            </div>
          );
        } else if (timeRange === "month") {
          return (
            <div>
              {record.month}/{record.year}
            </div>
          );
        } else if (timeRange === "quarter") {
          return (
            <div>
              Quý {record.quarter} - {record.year}
            </div>
          );
        } else if (timeRange === "year") {
          return <div>{record.year}</div>;
        }
        return null;
      },
    },
    {
      title: "Số lượng người dùng",
      dataIndex: "total_users",
      key: "total_users",
      align: "center",
    },
    {
      title: "Tăng trưởng",
      dataIndex: "growth_percentage",
      key: "growth_percentage",
      align: "center",
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Button type="primary" onClick={() => setModalVisible(true)}>
        Xem chi tiết
      </Button>

      <Modal
        title={
          <Title level={4} style={{ margin: 0 }}>
            Thống kê người dùng
          </Title>
        }
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        width={1200}
        footer={null}
        bodyStyle={{ padding: "24px" }}
      >
        {/* Time range selection */}
        <Row justify="start" style={{ marginBottom: 16 }}>
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
        </Row>

        <Row gutter={24}>
          <Col span={24}>
            <div style={{ marginBottom: "12px", color: "#666" }}>
              Tổng số người dùng:{" "}
              <span style={{ color: "#1890ff", fontWeight: 600 }}>
                {data?.["Tổng tất cả người dùng"]}
              </span>
            </div>
            <Table
              columns={columns}
              dataSource={filteredData}
              rowKey={(record) =>
                `${record.year}-${record.month}-${record.week_in_month}`
              }
              pagination={false}
              scroll={{ y: 400 }}
              size="middle"
              style={{
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
                borderRadius: "8px",
              }}
            />
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

export default ModalUserStats;
