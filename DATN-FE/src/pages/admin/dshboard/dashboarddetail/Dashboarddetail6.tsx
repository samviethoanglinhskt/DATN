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
  Statistic,
  Card,
} from "antd";
import moment from "moment";

interface OrderStats {
  week_in_month: number;
  day?: number;
  year: number;
  month: number;
  total_revenue: string;
  growth_percentageOrder: string;
  total_orders: number;
}

interface DashboardData {
  "Tổng đơn hàng": OrderStats[];
  "Tỉ lệ hoàn thành": number;
}

const ModalAllOrder: React.FC = () => {
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
      const filtered = data["Tổng đơn hàng"].filter((record) => {
        if (timeRange === "day") {
          return (
            record.day?.toString().includes(value) ||
            record.month.toString().includes(value) ||
            record.year.toString().includes(value)
          );
        }
        if (timeRange === "month" || timeRange === "year") {
          return (
            record.month?.toString().includes(value) ||
            record.year.toString().includes(value)
          );
        }
        if (timeRange === "quarter" || timeRange === "week") {
          return (
            record.year.toString().includes(value) &&
            record.growth_percentageOrder.includes(value)
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

  const totalOrders = filteredData.reduce(
    (total, record) => total + record.total_orders,
    0
  );

  // Get current date information
  const today = moment();
  const currentWeek = today.isoWeek();
  const currentMonth = today.month() + 1;
  const currentQuarter = Math.ceil(currentMonth / 3);
  const currentYear = today.year();

  const todayOrders =
    data["Tổng đơn hàng"].find(
      (order) =>
        order.day === today.date() &&
        order.month === currentMonth &&
        order.year === currentYear
    )?.total_orders || 0;

  const weekOrders = data["Tổng đơn hàng"]
    .filter(
      (order) =>
        order.week_in_month === currentWeek && order.year === currentYear
    )
    .reduce((total, order) => total + order.total_orders, 0);

  const monthOrders = data["Tổng đơn hàng"]
    .filter(
      (order) => order.month === currentMonth && order.year === currentYear
    )
    .reduce((total, order) => total + order.total_orders, 0);

  const quarterOrders = data["Tổng đơn hàng"]
    .filter(
      (order) =>
        Math.ceil(order.month / 3) === currentQuarter &&
        order.year === currentYear
    )
    .reduce((total, order) => total + order.total_orders, 0);

  const yearOrders = data["Tổng đơn hàng"]
    .filter((order) => order.year === currentYear)
    .reduce((total, order) => total + order.total_orders, 0);

  const columns = [
    {
      title: "Ngày/Tháng/Năm",
      dataIndex: "day",
      key: "day",
      render: (text: any, record: OrderStats) => {
        if (timeRange === "day") {
          return `${record.day}/${record.month}/${record.year}`;
        } else if (timeRange === "month") {
          return `Tháng ${record.month}/${record.year}`;
        } else if (timeRange === "quarter") {
          return `Quý ${Math.ceil((record.month || 1) / 3)} - ${record.month}/${
            record.year
          }`;
        } else if (timeRange === "week") {
          return `Tuần ${record.week_in_month} - ${record.month}/${record.year}`;
        } else if (timeRange === "year") {
          return `${record.year}`;
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
      title: "Tỷ lệ đơn hàng",
      key: "growth_percentageOrder",
      render: (text: string, record: OrderStats) => {
        return `${record.growth_percentageOrder}`;
      },
    },
  ];

  return (
    <Space
      direction="vertical"
      size="large"
      style={{ width: "100%", padding: 24 }}
    >
      {/* Statistics */}
      <Card className="bg-gray-50">
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Row gutter={16}>
            <Col span={12}>{<strong>Doanh thu hôm nay:</strong>}</Col>
            <Col span={12}>{todayOrders} đơn</Col>
          </Row>
           <Row gutter={16}>
            <Col span={12}>{<strong>Doanh thu tuần nay:</strong>}</Col>
            <Col span={12}>{weekOrders} đơn</Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>{<strong>Doanh thu tháng nay:</strong>}</Col>
            <Col span={12}>{monthOrders} đơn</Col>
          </Row>
  
            <Row gutter={16}>
            <Col span={12}>{<strong>Doanh thu quý nay:</strong>}</Col>
            <Col span={12}>{quarterOrders} đơn</Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>{<strong>Doanh thu Năm nay:</strong>}</Col>
            <Col span={12}>{yearOrders} đơn</Col>
          </Row>
        </Space>
      </Card>

      {/* Time Range Filter */}
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

      {/* Search Input */}
      <Row justify="start" style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Input
            value={filterText}
            onChange={handleFilterChange}
            placeholder="Tìm kiếm theo tháng/năm/ngày"
            style={{ width: "100%" }}
          />
        </Col>
      </Row>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey={(record) => `${record.day || record.month}-${record.year}`}
        pagination={false}
        scroll={{ y: 240 }}
      />
    </Space>
  );
};

export default ModalAllOrder;
