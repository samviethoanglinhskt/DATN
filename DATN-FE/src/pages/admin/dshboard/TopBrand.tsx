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
} from "antd";
import { Pie } from '@ant-design/plots';

const { Title } = Typography;

interface BrandStats {
  brand_name: string;
  total_sales: number;
  total_quantity: string;
  year: number;
  month: number;
  growthPercentageSales: string;
  growthPercentageQuantity: string;
}

interface TopBrandData {
  "Top thương hiệu bán chạy": BrandStats[];
  "Tổng sản phẩm của tất cả thương hiệu bán chạy": number;
  "Tổng số lượng bán ra": number;
}

const TopBrandComponent: React.FC = () => {
  const [data, setData] = useState<TopBrandData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month"); // Default time range is "month"
  const [filteredData, setFilteredData] = useState<BrandStats[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  // Fetch brand statistics based on selected time range
  const fetchBrandStats = async (type: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://127.0.0.1:8000/api/statistics/top-brand?type=${type}`
      );
      if (!response.ok) throw new Error("Failed to fetch brand statistics");
      const result = await response.json();
      setData(result);
      setFilteredData(result["Top thương hiệu bán chạy"]); // Set data to display initially
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Không thể tải dữ liệu thống kê thương hiệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrandStats(timeRange); // Fetch data on component mount or when time range changes
  }, [timeRange]);

  // Handle time range selection
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    fetchBrandStats(value); // Fetch data based on the new time range
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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

  // Pagination
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  // Pie chart data (Total sales by brand)
  const pieData = filteredData.map((item) => ({
    name: item.brand_name,
    value: item.total_sales,
  }));

  // Columns for the table
  const columns = [
    {
      title: "Thương hiệu",
      dataIndex: "brand_name",
      key: "brand_name",
    },
    {
      title: "Tổng doanh thu",
      dataIndex: "total_sales",
      key: "total_sales",
      align: "center",
    },
    {
      title: "Tổng số lượng",
      dataIndex: "total_quantity",
      key: "total_quantity",
      align: "center",
    },
    {
      title: "Tăng trưởng doanh thu",
      dataIndex: "growthPercentageSales",
      key: "growthPercentageSales",
      align: "center",
    },
    {
      title: "Tăng trưởng số lượng",
      dataIndex: "growthPercentageQuantity",
      key: "growthPercentageQuantity",
      align: "center",
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Title level={4}>Thống kê thương hiệu bán chạy</Title>

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

      {/* Display table and pie chart */}
      <Row gutter={24}>
        {/* Left side: Table */}
        <Col span={12}>
          <Table
            columns={columns}
            dataSource={paginatedData}
            rowKey={(record) => record.brand_name}
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

        {/* Right side: Pie Chart */}
        <Col span={12}>
          <Pie
            data={pieData}
            angleField="value"
            colorField="name"
            radius={0.8}
            label={{
              type: "inner",
              content: "{name}: {value}",
              style: {
                fontSize: 14,
                fontWeight: "bold",
                fill: "#fff",
              },
            }}
            style={{
              height: "300px",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
              borderRadius: "8px",
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default TopBrandComponent;
