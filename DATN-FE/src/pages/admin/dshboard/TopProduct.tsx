import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Space,
  Select,
  Table,
  message,
  Typography,
  Spin,
  Input,
} from "antd";
import { ColumnType } from "antd/es/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const { Title } = Typography;

interface ProductStats {
  id: number;
  name: string;
  total_quantity: string;
  total_revenue: string;
  year: number;
  month: number;
  growth_rate: string;
}

interface TopSellingProductsData {
  [key: string]: ProductStats[];
}

const TopSellingProductsComponent: React.FC = () => {
  const [data, setData] = useState<TopSellingProductsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month"); // Default time range is "month"
  const [filteredData, setFilteredData] = useState<ProductStats[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [filterText, setFilterText] = useState(""); // Filter text for product names

  // Fetch product statistics based on selected time range
  const fetchProductStats = async (type: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://127.0.0.1:8000/api/statistics/top-selling-products?type=${type}`
      );
      if (!response.ok) throw new Error("Failed to fetch product statistics");
      const result = await response.json();
      setData(result.data);
      setFilteredData(
        Object.values(result.data || {}).flat().map((item) => item as ProductStats)
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Không thể tải dữ liệu thống kê sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductStats(timeRange);
  }, [timeRange]);

  // Handle time range selection
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    fetchProductStats(value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilterText(value);
    const filtered = Object.values(data || {})
      .flat()
      .filter((product) =>
        product.name.toLowerCase().includes(value.toLowerCase())
      );
    setFilteredData(filtered);
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

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  const columnData = filteredData.map((item) => ({
    name: item.name,
    value: parseInt(item.growth_rate.replace("%", ""), 10),
  }));

  const columns: ColumnType<ProductStats>[] = [
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Tổng số lượng",
      dataIndex: "total_quantity",
      key: "total_quantity",
      align: "center",
    },
    {
      title: "Tổng doanh thu",
      dataIndex: "total_revenue",
      key: "total_revenue",
      align: "center",
    },
    {
      title: "Tỷ lệ tăng trưởng",
      dataIndex: "growth_rate",
      key: "growth_rate",
      align: "center",
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Title level={4}>Thống kê sản phẩm bán chạy</Title>

      {/* Time range selection */}
      <Row justify="start" style={{ marginBottom: 16 }}>
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
      </Row>

      {/* Filter input */}
      <Row justify="start" style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Input
            value={filterText}
            onChange={handleFilterChange}
            placeholder="Tìm kiếm theo tên sản phẩm"
            style={{ width: "100%" }}
          />
        </Col>
      </Row>

      {/* Display table and column chart */}
      <Row gutter={24}>
        {/* Left side: Column Chart */}
        <Col span={12}>
          <div
            style={{
              padding: "24px",
              backgroundColor: "#fff",
              borderRadius: "8px",
            }}
          >
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={columnData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#60A5FA" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Col>

        {/* Right side: Table */}
        <Col span={12}>
          <Table
            columns={columns}
            dataSource={paginatedData}
            rowKey={(record) => record.id}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: filteredData.length,
              onChange: handlePageChange,
            }}
            style={{
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
              borderRadius: "8px",
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default TopSellingProductsComponent;
