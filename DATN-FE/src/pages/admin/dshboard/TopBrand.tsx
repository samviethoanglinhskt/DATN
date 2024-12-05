import React, { useState, useEffect } from "react";
import { Row, Col, Space, Select, Table, message, Typography, Spin } from "antd";
import { Pie } from "@ant-design/plots";
import { ColumnGroupType, ColumnType } from "antd/es/table";

const { Title } = Typography;

interface BrandStats {
  brand_name: string;
  total_sales: number;
  total_quantity: string;
  total_revenue: string;
  salesPercentage: string;
  quantityPercentage: string;
  year: number;
  quarter: number | null;
  month: number | null;
  week_in_month: number | null;
}

interface ApiResponse {
  message: string;
  data: Record<string, BrandStats[]>;
  "Tổng sản phẩm của tất cả thương hiệu bán chạy": number;
  "Tổng số lượng bán ra": number;
}

const TopBrandComponent: React.FC = () => {
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");
  const [displayData, setDisplayData] = useState<BrandStats[]>([]);

  const fetchBrandStats = async (type: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://127.0.0.1:8000/api/statistics/top-brand?type=${type}`
      );
      if (!response.ok) throw new Error("Failed to fetch statistics");
      
      const result: ApiResponse = await response.json();
      setApiData(result);
      
      // Process data based on time range
      const latestPeriodData = processDataByTimeRange(result.data, type);
      setDisplayData(latestPeriodData);
    } catch (error) {
      console.error("Error:", error);
      message.error("Không thể tải dữ liệu thống kê");
    } finally {
      setLoading(false);
    }
  };

  const processDataByTimeRange = (data: Record<string, BrandStats[]>, type: string): BrandStats[] => {
    const periods = Object.keys(data).sort().reverse();
    if (periods.length === 0) return [];

    const latestPeriod = periods[0];
    return data[latestPeriod] || [];
  };

  useEffect(() => {
    fetchBrandStats(timeRange);
  }, [timeRange]);

  const columns: (ColumnGroupType<BrandStats> | ColumnType<BrandStats>)[] = [
    {
      title: "Thương hiệu",
      dataIndex: "brand_name",
      key: "brand_name",
    },
    {
      title: "Doanh số",
      dataIndex: "total_sales",
      key: "total_sales",
      render: (value) => value.toLocaleString(),
      align: "right",
    },
    {
      title: "Số lượng",
      dataIndex: "total_quantity",
      key: "total_quantity",
      align: "right",
    },
    {
      title: "Doanh thu",
      dataIndex: "total_revenue",
      key: "total_revenue",
      render: (value) => parseInt(value).toLocaleString() + " đ",
      align: "right",
    },
    {
      title: "% Doanh số",
      dataIndex: "salesPercentage",
      key: "salesPercentage",
      align: "right",
    },
    {
      title: "% Số lượng",
      dataIndex: "quantityPercentage",
      key: "quantityPercentage",
      align: "right",
    },
  ];

  const pieData = displayData.map((item) => ({
    type: item.brand_name,
    value: item.total_sales,
  }));

  if (loading) {
    return <Spin size="large" className="flex justify-center items-center min-h-[400px]" />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={4} className="mb-2">Thống kê thương hiệu bán chạy</Title>
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
        <Col span={14}>
          <Table
            columns={columns}
            dataSource={displayData}
            rowKey="brand_name"
            pagination={false}
            className="shadow-sm rounded-lg"
            summary={() => (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}>Tổng cộng</Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="right">
                    {apiData?.["Tổng sản phẩm của tất cả thương hiệu bán chạy"]?.toLocaleString()}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2} align="right">
                    {apiData?.["Tổng số lượng bán ra"]?.toLocaleString()}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3} colSpan={3} />
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />
        </Col>
        <Col span={10}>
          <div className="shadow-sm rounded-lg p-4 bg-white">
            <Pie
              data={pieData}
              angleField="value"
              colorField="type"
              radius={0.8}
              label={{
                type: "outer",
                content: "{name}: {percentage}",
              }}
              interactions={[
                { type: "element-active" },
                { type: "pie-statistic-active" },
              ]}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default TopBrandComponent;