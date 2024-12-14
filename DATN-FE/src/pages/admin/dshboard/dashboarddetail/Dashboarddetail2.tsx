import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Space,
  Select,
  Spin,
  Table,
  Input,
  message,
  Card,
} from "antd";

interface OrderStats {
  year: number;
  month: number;
  day?: number;
  total_revenue: string;
  growthPercentageRevenue: string;
}

interface DashboardData {
  "Tổng đơn hàng": OrderStats[];
  "Tổng doanh thu": number;
}

interface PeriodTotals {
  week: number;
  month: number;
  quarter: number;
  year: number;
}

const RevenueDashboard: React.FC = () => {
  // State management
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");
  const [filteredData, setFilteredData] = useState<OrderStats[]>([]);
  const [filterText, setFilterText] = useState("");
  const [periodTotals, setPeriodTotals] = useState<PeriodTotals>({
    week: 0,
    month: 0,
    quarter: 0,
    year: 0,
  });

  // Fetch data from API
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
      calculatePeriodTotals(result["Tổng đơn hàng"]);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Không thể tải dữ liệu thống kê");
    } finally {
      setLoading(false);
    }
  };

  // Calculate week number
  const getWeekNumber = (date: Date): number => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear =
      (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  // Calculate totals for all periods
  const calculatePeriodTotals = (periodData: OrderStats[]) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const currentWeek = getWeekNumber(now);
    const currentQuarter = Math.ceil(currentMonth / 3);

    // Calculate week total
    const weekTotal = periodData
      .filter((record) => {
        if (!record.day) return false;
        const recordDate = new Date(record.year, record.month - 1, record.day);
        return (
          getWeekNumber(recordDate) === currentWeek &&
          record.year === currentYear
        );
      })
      .reduce((sum, record) => sum + parseFloat(record.total_revenue), 0);

    // Calculate month total
    const monthTotal = periodData
      .filter(
        (record) => record.year === currentYear && record.month === currentMonth
      )
      .reduce((sum, record) => sum + parseFloat(record.total_revenue), 0);

    // Calculate quarter total
    const quarterTotal = periodData
      .filter((record) => {
        const recordQuarter = Math.ceil(record.month / 3);
        return record.year === currentYear && recordQuarter === currentQuarter;
      })
      .reduce((sum, record) => sum + parseFloat(record.total_revenue), 0);

    // Calculate year total
    const yearTotal = periodData
      .filter((record) => record.year === currentYear)
      .reduce((sum, record) => sum + parseFloat(record.total_revenue), 0);

    setPeriodTotals({
      week: weekTotal,
      month: monthTotal,
      quarter: quarterTotal,
      year: yearTotal,
    });
  };

  // Format currency
  const formatCurrency = (value: string | number): string => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numValue);
  };

  // Growth indicator component
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

  // Time range change handler
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    setFilterText("");
    fetchOrderStats(value);
  };

  // Filter change handler
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilterText(value);

    if (data) {
      let filtered: OrderStats[] = [];

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
            record.month.toString().includes(value)
          );
        });
      }

      if (timeRange === "day") {
        filtered = data["Tổng đơn hàng"].filter((record) => {
          return (
            record.day?.toString().includes(value) ||
            record.month.toString().includes(value) ||
            record.year.toString().includes(value)
          );
        });
      }

      setFilteredData(filtered);
    }
  };

  // Get today's stats
  const getTodayStats = (): OrderStats | null => {
    const today = new Date();
    const todayData = data?.["Tổng đơn hàng"].find(
      (record) =>
        record.year === today.getFullYear() &&
        record.month === today.getMonth() + 1 &&
        record.day === today.getDate()
    );
    return todayData || null;
  };

  // Fetch data on mount and time range change
  useEffect(() => {
    fetchOrderStats();
  }, [timeRange]);

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
      title: "Ngày/Tháng/Năm",
      dataIndex: "day",
      key: "day",
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
          return `${record.day}/${record.month}/${record.year}`;
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

  const todayStats = getTodayStats();

  return (
    <Space
      direction="vertical"
      size="large"
      style={{ width: "100%", padding: 24 }}
    >
      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <Col span={12}>
          <strong>Doanh thu tổng:</strong>{" "}
          {formatCurrency(data["Tổng doanh thu"])}
        </Col>
      </Row>

      <Space>
        Thống kê theo:
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
      </Space>

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

      <Card className="bg-gray-50">
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Row gutter={16}>
            <Col span={12}>
              <strong>Doanh thu hôm nay:</strong>
            </Col>
            <Col span={12}>
              {todayStats
                ? formatCurrency(todayStats.total_revenue)
                : formatCurrency(0)}
            </Col>
          </Row>

          {/* Current Week Revenue */}
          <Row gutter={16}>
            <Col span={12}>
              <strong>Doanh thu tuần này:</strong>
            </Col>
            <Col span={12}>{formatCurrency(periodTotals.week.toFixed(2))}</Col>
          </Row>

          {/* Current Month Revenue */}
          <Row gutter={16}>
            <Col span={12}>
              <strong>Doanh thu tháng này:</strong>
            </Col>
            <Col span={12}>{formatCurrency(periodTotals.month)}</Col>
          </Row>

          {/* Current Quarter Revenue */}
          <Row gutter={16}>
            <Col span={12}>
              <strong>Doanh thu quý này:</strong>
            </Col>
            <Col span={12}>{formatCurrency(periodTotals.quarter)}</Col>
          </Row>

          {/* Current Year Revenue */}
          <Row gutter={16}>
            <Col span={12}>
              <strong>Doanh thu năm này:</strong>
            </Col>
            <Col span={12}>{formatCurrency(periodTotals.year)}</Col>
          </Row>
        </Space>
      </Card>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey={(record) => `${record.day}-${record.month}-${record.year}`}
        pagination={false}
        scroll={{ y: 240 }}
      />
    </Space>
  );
};

export default RevenueDashboard;
