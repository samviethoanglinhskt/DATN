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
    fetchUserStats(value); // Fetch data when the time range changes
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
      align: "center", // Corrected to use one of the valid AlignType values
      render: (value: any, record: UserStats) => (
        <div>
          {record.month}/{record.year} - Tuần {record.week_in_month}
        </div>
      ),
    },
    {
      title: "Số lượng người dùng",
      dataIndex: "total_users",
      key: "total_users",
      align: "center", // Corrected
    },
    {
      title: "Tăng trưởng",
      dataIndex: "growth_percentage",
      key: "growth_percentage",
      align: "center", // Corrected
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
                { value: "day", label: "Ngày" },
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
