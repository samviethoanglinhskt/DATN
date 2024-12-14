import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Space,
  Select,
  Table,
  message,
  Card,
} from "antd";
import dayjs from "dayjs";
import { ColumnType } from "antd/es/table";

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

const UserStatsComponent: React.FC = () => {
  const [data, setData] = useState<UserDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");
  const [filteredData, setFilteredData] = useState<UserStats[]>([]);
  const [todayStats, setTodayStats] = useState<UserStats | null>(null); // State cho dữ liệu hôm nay
  const [weeklyStats, setWeeklyStats] = useState<number>(0);
  const [monthlyStats, setMonthlyStats] = useState<number>(0);
  const [quarterlyStats, setQuarterlyStats] = useState<number>(0);
  const [yearlyStats, setYearlyStats] = useState<number>(0);

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
      // Cập nhật số lượng người dùng theo thời gian
      updateStats(result["Người dùng"]);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Không thể tải dữ liệu thống kê người dùng");
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (userStats: UserStats[]) => {
    const currentWeek = dayjs().week();
    const currentMonth = dayjs().month() + 1;
    const currentQuarter = Math.floor((currentMonth - 1) / 3) + 1;
    const currentYear = dayjs().year();

    let weekly = 0;
    let monthly = 0;
    let quarterly = 0;
    let yearly = 0;

    userStats.forEach((stats) => {
      if (stats.year === currentYear) {
        if (stats.month === currentMonth) monthly += stats.total_users;
        if (stats.quarter === currentQuarter) quarterly += stats.total_users;
        if (stats.year === currentYear) yearly += stats.total_users;
        if (stats.week_in_month === currentWeek) weekly += stats.total_users;
      }
    });

    setWeeklyStats(weekly);
    setMonthlyStats(monthly);
    setQuarterlyStats(quarterly);
    setYearlyStats(yearly);
  };

  const fetchTodayStats = async () => {
    try {
      const today = dayjs().format("YYYY-MM-DD");
      const response = await fetch(
        `http://127.0.0.1:8000/api/statistics/user?type=day&date=${today}`
      );
      if (!response.ok) throw new Error("Failed to fetch today's statistics");
      const result = await response.json();
      setTodayStats(result); // Giả định API trả về dữ liệu tương tự UserStats
    } catch (error) {
      console.error("Error fetching today's data:", error);
      message.error("Không thể tải dữ liệu người dùng hôm nay");
    }
  };

  useEffect(() => {
    fetchUserStats(timeRange);
    fetchTodayStats(); // Lấy dữ liệu hôm nay khi component mount
  }, [timeRange]);

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    if (data && data["Người dùng"]) {
      let filtered = data["Người dùng"];
      if (value === "week") {
        filtered = filtered.filter((item) => item.week_in_month);
      } else if (value === "month") {
        filtered = filtered.filter((item) => item.month);
      } else if (value === "quarter") {
        filtered = filtered.filter((item) => item.quarter);
      } else if (value === "year") {
        filtered = filtered.filter((item) => item.year);
      }
      setFilteredData(filtered);
    }
  };

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
      <Card>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          {/* Thống kê hôm nay */}
          <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
            <Col span={12}>
              <strong> Người dùng tuần này</strong>
            </Col>
            <Col>{weeklyStats} người</Col>
          </Row>

          {/* Thống kê theo tuần/tháng/quý/năm */}
          <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
            <Col span={12}>
              <strong> Người dùng tháng này</strong>
            </Col>
            <Col>{monthlyStats} người</Col>
          </Row>
          <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
            <Col span={12}>
              <strong> Người dùng quý này</strong>
            </Col>
            <Col>{quarterlyStats} người</Col>
          </Row>
          <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
            <Col span={12}>
              <strong> Người dùng năm này</strong>
            </Col>
            <Col>{yearlyStats} người</Col>
          </Row>
        </Space>
      </Card>
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

      {/* Tổng số người dùng */}
      <div style={{ marginBottom: "12px", color: "#666" }}>
        Tổng số người dùng:{" "}
        <span style={{ color: "#1890ff", fontWeight: 600 }}>
          {data?.["Tổng tất cả người dùng"]}
        </span>
      </div>

      {/* Bảng thống kê */}
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
    </div>
  );
};

export default UserStatsComponent;
