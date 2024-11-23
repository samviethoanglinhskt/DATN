import React, { useState, useEffect } from "react";
import { Table, Card, Tag, Space, Select, Button, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ReloadOutlined } from "@ant-design/icons";

type OrderStatus =
  | "Chờ Xử Lí"
  | "Đã Xử Lí"
  | "Đang Giao Hàng"
  | "Chưa Thanh Toán"
  | "Đã Thanh Toán"
  | "Đã Hoàn Thành"
  | "Đã hủy đơn hàng";

interface IOrder {
  id: number;
  order_code: string;
  order_date: string;
  total_amount: number;
  order_status: OrderStatus;
  name: string;
  phone: string;
  address: string;
  email: string;
}

const Order: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(false);

  // Định nghĩa thứ tự cho các trạng thái
  const statusOrder: Record<OrderStatus, number> = {
    "Chờ Xử Lí": 1,
    "Đã Xử Lí": 2,
    "Đang Giao Hàng": 3,
    "Chưa Thanh Toán": 4,
    "Đã Thanh Toán": 5,
    "Đã Hoàn Thành": 6,
    "Đã hủy đơn hàng": 7,
  };

  const statusOptions = [
    { value: "Chờ Xử Lí", label: "Chờ Xử Lí" },
    { value: "Đã Xử Lí", label: "Đã Xử Lí" },
    { value: "Đang Giao Hàng", label: "Đang Giao Hàng" },
    { value: "Chưa Thanh Toán", label: "Chưa Thanh Toán" },
    { value: "Đã Thanh Toán", label: "Đã Thanh Toán" },
    { value: "Đã Hoàn Thành", label: "Đã Hoàn Thành" },
  ];

  const statusColors: Record<OrderStatus, string> = {
    "Chờ Xử Lí": "warning",
    "Đã Xử Lí": "processing",
    "Đang Giao Hàng": "cyan",
    "Đã Hoàn Thành": "success",
    "Chưa Thanh Toán": "default",
    "Đã Thanh Toán": "blue",
    "Đã hủy đơn hàng": "red",
  };

  // Fetch orders from the API
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/list-oder-admin");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const handleStatusChange = async (
    orderId: number,
    newStatus: OrderStatus
  ) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/order/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      if (!response.ok) throw new Error("Cập nhật trạng thái thất bại");

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, order_status: newStatus } : order
        )
      );
      message.success("Đã cập nhật trạng thái thành công");
    } catch (error) {
      console.error("Error updating order status:", error);
      message.error("Cập nhật trạng thái thất bại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Hàm kiểm tra xem một trạng thái có được phép chọn không
  const isStatusSelectable = (
    currentStatus: OrderStatus,
    optionStatus: OrderStatus
  ) => {
    const currentOrder = statusOrder[currentStatus];
    const optionOrder = statusOrder[optionStatus];

    // Chỉ cho phép chọn các trạng thái tiếp theo
    return optionOrder > currentOrder;
  };

  const columns: ColumnsType<IOrder> = [
    {
      title: "Mã đơn hàng",
      dataIndex: "order_code",
      width: 120,
      fixed: "left",
    },
    {
      title: "Khách hàng",
      dataIndex: "name",
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <span className="fw-bold">{record.name}</span>
          <span style={{ color: "#666", fontSize: "12px" }}>
            {record.email}
          </span>
        </Space>
      ),
    },
    {
      title: "Liên hệ",
      dataIndex: "phone",
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <span>{record.phone}</span>
          <span style={{ color: "#666", fontSize: "12px" }}>
            {record.address}
          </span>
        </Space>
      ),
    },
    {
      title: "Ngày đặt",
      dataIndex: "order_date",
      width: 120,
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_amount",
      width: 150,
      align: "right",
      render: (amount) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(amount),
    },
    {
      title: "Trạng thái",
      dataIndex: "order_status",
      width: 150,
      render: (status: OrderStatus) => (
        <Tag color={statusColors[status]}>{status}</Tag>
      ),
    },
    {
      title: "Thao tác",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <Select
          style={{ width: "100%" }}
          value={record.order_status}
          onChange={(value: OrderStatus) =>
            handleStatusChange(record.id, value)
          }
          options={statusOptions.map((option) => ({
            ...option,
            disabled: !isStatusSelectable(
              record.order_status,
              option.value as OrderStatus
            ),
          }))}
          disabled={record.order_status === "Đã Hoàn Thành"}
        />
      ),
    },
  ];

  return (
    <Card
      title="Quản lý đơn hàng"
      extra={
        <Button
          icon={<ReloadOutlined />}
          onClick={fetchOrders}
          loading={loading}
        >
          Làm mới
        </Button>
      }
      className="shadow-sm"
    >
      <Table<IOrder>
        columns={columns}
        dataSource={orders}
        rowKey="id"
        loading={loading}
        pagination={{
          showTotal: (total) => `Tổng ${total} đơn hàng`,
          showQuickJumper: true,
        }}
        scroll={{ x: 1200 }}
        rowClassName="hover:bg-gray-50"
        size="middle"
      />
    </Card>
  );
};

export default Order;
