import React, { useState, useEffect } from "react";
import { Row, Col, Space, Select, Table, message, Typography, Spin, Card } from "antd";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const { Title } = Typography;

interface ProductRating {
  tb_product_id: number;
  product_name: string;
  total_reviews: number;
  average_rating: string;
  month: number;
  year: number;
}

interface ApiResponse {
  message: string;
  data: Record<string, ProductRating[]>;
}

const TopRatedProducts: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");
  const [displayData, setDisplayData] = useState<ProductRating[]>([]);

  const fetchRatings = async (type: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://127.0.0.1:8000/api/statistics/top-rate?type=${type}`
      );
      if (!response.ok) throw new Error("Failed to fetch");
      const result: ApiResponse = await response.json();
      setDisplayData(Object.values(result.data)[0] || []);
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
      width: "40%",
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
    }
  ];

  const chartData = displayData.map(item => ({
    name: item.product_name.substring(0, 20),
    rating: parseFloat(item.average_rating),
    reviews: item.total_reviews
  }));

  if (loading) return <Spin className="flex justify-center min-h-[400px]" />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={4} className="mb-2">Top 5 sản phẩm đánh giá cao nhất</Title>
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
            ]}
          />
        </Space>
      </div>

      <Row gutter={24}>
        <Col span={12}>
          <Table
            columns={columns}
            dataSource={displayData}
            rowKey="tb_product_id"
            pagination={false}
            className="shadow-sm rounded-lg"
          />
        </Col>
        <Col span={12}>
          <Card className="h-[400px]">
            <LineChart
              width={500}
              height={300}
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={60}
              />
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
    </div>
  );
};

export default TopRatedProducts;