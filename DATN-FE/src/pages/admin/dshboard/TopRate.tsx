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
  Card,
} from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const { Title } = Typography;

interface ProductRating {
  tb_product_id: number;
  product_name: string;
  total_reviews: number;
  average_rating: string;
  month: number;
  year: number;
  week_in_month?: number; // Thêm tuần trong tháng nếu có
  week?: number; // Tuần trong năm
  quarter?: number; // Quý trong năm
}

interface ApiResponse {
  message: string;
  data: Record<string, ProductRating[]>;
}

const TopRatedProducts: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");
  const [displayData, setDisplayData] = useState<ProductRating[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // Add currentPage state
  const [totalProducts, setTotalProducts] = useState(0); // Total number of products

  // Fetch product ratings data
  const fetchRatings = async (type: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://127.0.0.1:8000/api/statistics/top-rate?type=${type}`
      );
      if (!response.ok) throw new Error("Failed to fetch");
      const result: ApiResponse = await response.json();

      // Kiểm tra dữ liệu API trả về
      console.log(result.data); // Kiểm tra cấu trúc dữ liệu API trả về

      // Lấy tất cả dữ liệu từ API
      const allData: ProductRating[] = [];
      for (const key in result.data) {
        allData.push(...result.data[key]);
      }

      setDisplayData(allData);
      setTotalProducts(allData.length); // Set total product count
    } catch (error) {
      message.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings(timeRange);
  }, [timeRange]);

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "product_name",
      width: "30%",
    },
    {
      title: "Số đánh giá",
      dataIndex: "total_reviews",
      align: "right" as const,
    },
    {
      title: "Điểm trung bình",
      dataIndex: "average_rating",
      align: "right" as const,
      render: (value: string) => Number(value).toFixed(1),
    },
    {
      title: "Thời gian",
      dataIndex: "timePeriod",
      align: "center" as const,
      render: (_: any, record: ProductRating) => {
        const { month, year, week_in_month, week, quarter } = record;

        if (timeRange === "year") {
          return year;
        } else if (timeRange === "month") {
          return `${month}/${year}`;
        } else if (timeRange === "week") {
          return `Tuần ${week_in_month}, ${year}`;
        } else if (timeRange === "quarter") {
          return `Quý ${quarter}, ${year}`;
        }
        return "";
      },
    },
  ];

  // Paginate the data client-side (5 products per page)
  const paginatedData = displayData.slice(
    (currentPage - 1) * 5,
    currentPage * 5
  );

  // Chart data
  const chartData = displayData.map((item) => ({
    name: item.product_name.substring(0, 20),
    rating: parseFloat(item.average_rating),
    reviews: item.total_reviews,
  }));

  if (loading) return <Spin className="flex justify-center min-h-[400px]" />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={4} className="mb-2">
          Top 5 sản phẩm đánh giá cao nhất
        </Title>
        <Space>
          <span>Thống kê theo:</span>
          <Select
            className="mb-2"
            value={timeRange}
            onChange={setTimeRange}
            style={{ width: 120 }}
            options={[
              { value: "week", label: "Tuần" },
              { value: "month", label: "Tháng" },
              { value: "quarter", label: "Quý" },
              { value: "year", label: "Năm" },
              { value: "week_in_month", label: "Tuần trong tháng" },
            ]}
          />
        </Space>
      </div>

      {/* Chart Section (Top Section) */}
      <Row gutter={24} style={{ marginBottom: "20px" }}>
        <Col span={24}>
          <Card className="shadow-sm rounded-lg">
            <LineChart
              width={1600}
              height={500}
              data={chartData}
              margin={{ top: 5, left: 30, bottom: 50 }}
            >
              <CartesianGrid  strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="rating"
                stroke="#8884d8"
                name="Điểm đánh giá"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="reviews"
                stroke="#82ca9d"
                name="Số lượt đánh giá"
              />
            </LineChart>
          </Card>
        </Col>
      </Row>

      {/* Table Section (Bottom Section) */}
      <Row gutter={24}>
        <Col span={24}>
          <Table
            columns={columns}
            dataSource={paginatedData}
            rowKey="tb_product_id"
            pagination={{
              current: currentPage,
              pageSize: 5,
              total: totalProducts,
              onChange: (page) => setCurrentPage(page), 
            }}
            className="shadow-sm rounded-lg"
          />
        </Col>
      </Row>
    </div>
  );
};

export default TopRatedProducts;
