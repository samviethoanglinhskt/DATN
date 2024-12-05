import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Card,
  Tag,
  Space,
  Select,
  Button,
  message,
  Tabs,
  Tooltip,
  Modal,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  ShoppingOutlined,
  FilterOutlined,
  DownloadOutlined,
  EyeOutlined,
} from "@ant-design/icons";

import axios from "axios";
// import "./styles/Order.css";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import "dayjs/locale/vi";

import OrderDetailModal from "./orderModal";
import { FailureModalProps, Order, OrderStatus } from "./ordertype";
import { API_ENDPOINTS, STATUS_CONFIG } from "./orderContant";
import TextArea from "antd/es/input/TextArea";

dayjs.locale("vi");

const FailureModal: React.FC<FailureModalProps> = ({
  visible,
  onClose,
  onConfirm,
  loading,
}) => {
  const [feedback, setFeedback] = useState("");

  const handleConfirm = () => {
    if (!feedback.trim()) {
      message.error("Vui lòng nhập lý do giao hàng thất bại!");
      return;
    }
    onConfirm(feedback);
  };

  return (
    <Modal
      title="Lý do giao hàng thất bại"
      open={visible}
      onCancel={() => {
        setFeedback("");
        onClose();
      }}
      confirmLoading={loading}
      okText="Xác nhận"
      cancelText="Hủy"
      onOk={handleConfirm}
    >
      <div className="space-y-4">
        <p className="text-gray-600">
          Vui lòng cho biết lý do giao hàng thất bại:
        </p>
        <TextArea
          rows={4}
          placeholder="Nhập lý do giao hàng thất bại..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          maxLength={500}
          showCount
        />
      </div>
    </Modal>
  );
};

const OrderMain: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null]
  >([null, null]);
  const [failureModalVisible, setFailureModalVisible] = useState(false);
  const [selectedOrderForFailure, setSelectedOrderForFailure] = useState<
    number | null
  >(null);
  const [failureLoading, setFailureLoading] = useState(false);

  const statusOptions = Object.keys(STATUS_CONFIG).map((status) => ({
    value: status,
    label: (
      <Space>
        {STATUS_CONFIG[status as OrderStatus].icon}
        <span>{status}</span>
      </Space>
    ),
  }));

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_ENDPOINTS.LIST_ORDERS);
      const data = response.data;
      setOrders(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = React.useMemo(() => {
    let filtered = orders;

    // Filter by status
    if (activeTab !== "all") {
      filtered = filtered.filter((order) => order.order_status === activeTab);
    }

    // Filter by search text
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.order_code.toLowerCase().includes(searchLower) ||
          order.name.toLowerCase().includes(searchLower) ||
          order.phone.includes(searchText) ||
          order.email?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by date range

    return filtered;
  }, [orders, activeTab, searchText, dateRange]);

  const handleStatusChange = async (
    orderId: number,
    newStatus: OrderStatus
  ) => {
    if (newStatus === "Giao hàng thất bại") {
      setSelectedOrderForFailure(orderId);
      setFailureModalVisible(true);
      return;
    }

    if (newStatus === "Đã hủy đơn hàng") {
      Modal.confirm({
        title: "Xác nhận hủy đơn hàng",
        content: "Bạn có chắc chắn muốn hủy đơn hàng này không?",
        okText: "Xác nhận",
        cancelText: "Hủy",
        onOk: async () => {
          setLoading(true);
          try {
            await axios.put(`http://127.0.0.1:8000/api/destroy-order-admin`, {
              id: orderId,
              status: "Đã hủy đơn hàng",
            });

            setOrders((prevOrders) =>
              prevOrders.map((order) =>
                order.id === orderId
                  ? { ...order, order_status: "Đã hủy đơn hàng" }
                  : order
              )
            );
            message.success("Đã hủy đơn hàng thành công");
          } catch (error) {
            console.error("Error cancelling order:", error);
            message.error("Hủy đơn hàng thất bại");
          } finally {
            setLoading(false);
          }
        },
      });
      return;
    }

    setLoading(true);
    try {
      await axios.put(`${API_ENDPOINTS.UPDATE_ORDER}/${orderId}`, {
        status: newStatus,
      });

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

  const handleDeliveryFailure = async (feedback: string) => {
    if (!selectedOrderForFailure) return;

    setFailureLoading(true);
    try {
      await axios.put("http://127.0.0.1:8000/api/fail-order-admin", {
        id: selectedOrderForFailure,
      
      });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedOrderForFailure
            ? { ...order, order_status: "Giao hàng thất bại" }
            : order
        )
      );

      message.success("Đã cập nhật trạng thái giao hàng thất bại");
      setFailureModalVisible(false);
      setSelectedOrderForFailure(null);
    } catch (error) {
      console.error("Error updating failed delivery status:", error);
      message.error("Cập nhật trạng thái thất bại");
    } finally {
      setFailureLoading(false);
    }
  };
  const exportToExcel = () => {
    const exportData = filteredOrders.map((order) => ({
      "Mã đơn hàng": order.order_code,
      "Ngày đặt": new Date(order.order_date).toLocaleDateString("vi-VN"),
      "Khách hàng": order.name,
      "Số điện thoại": order.phone,
      Email: order.email,
      "Địa chỉ": order.address,
      "Tổng tiền": order.total_amount.toLocaleString("vi-VN") + "đ",
      "Trạng thái": order.order_status,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");

    // Generate filename with current date
    const fileName = `orders_${dayjs().format("YYYY-MM-DD")}.xlsx`;
    XLSX.writeFile(wb, fileName);

    message.success("Đã xuất file Excel thành công");
  };
  const tabItems = [
    {
      key: "all",
      label: (
        <span className="flex items-center">
          <ShoppingOutlined />
          <span className="ml-2">Tất cả</span>
        </span>
      ),
    },
    ...Object.entries(STATUS_CONFIG).map(([status, config]) => ({
      key: status,
      label: (
        <span className={`flex items-center ${config.textColor}`}>
          {config.icon}
          <span className="ml-2">{status}</span>
          <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full text-xs">
            {orders.filter((o) => o.order_status === status).length}
          </span>
        </span>
      ),
    })),
  ];

  const columns: ColumnsType<Order> = [
    {
      title: "Mã đơn hàng",
      dataIndex: "order_code",
      width: 120,
      fixed: "left",
      render: (text: string) => (
        <span className="font-medium text-blue-600">{text}</span>
      ),
    },
    {
      title: "Khách hàng",
      dataIndex: "name",
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <span className="font-medium">{record.name}</span>
          <span className="text-gray-500 text-sm">{record.email}</span>
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
          <Tooltip title={record.address}>
            <span className="text-gray-500 text-sm truncate max-w-[200px]">
              {record.address}
            </span>
          </Tooltip>
        </Space>
      ),
    },
    {
      title: "Ngày đặt",
      dataIndex: "order_date",
      width: 150,
      render: (date) => (
        <span className="whitespace-nowrap">
          {dayjs(date).format("DD/MM/YYYY HH:mm")}
        </span>
      ),
      sorter: (a, b) => dayjs(a.order_date).unix() - dayjs(b.order_date).unix(),
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_amount",
      width: 150,
      align: "right",
      render: (amount) => (
        <span className="font-medium text-green-600">
          {amount.toLocaleString("vi-VN")}đ
        </span>
      ),
      sorter: (a, b) => a.total_amount - b.total_amount,
    },
    {
      title: "Trạng thái",
      dataIndex: "order_status",
      width: 150,
      render: (status: OrderStatus) => {
        const config = STATUS_CONFIG[status];
        return (
          <Tag
            color={config.color}
            className={`${config.textColor} order-status-tag`}
            icon={config.icon}
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Thao tác",
      fixed: "right",
      width: 250,
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="primary"
              ghost
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedOrder(record);
                setIsModalVisible(true);
              }}
            >
              Chi tiết
            </Button>
          </Tooltip>
          <Select
            style={{ width: 140 }}
            value={record.order_status}
            onChange={(value: OrderStatus) =>
              handleStatusChange(record.id, value)
            }
            options={statusOptions}
            disabled={
              record.order_status === "Đã hoàn thành" ||
              record.order_status === "Đã hủy đơn hàng"
            }
          />
        </Space>
      ),
    },
  ];

  const tableHeader = (
    <div className="flex flex-wrap gap-4 mb-4">
      <div className="flex-grow max-w-md">
        <input
          placeholder="Tìm kiếm theo mã đơn, tên, SĐT, email..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        />
      </div>
      <Button
        icon={<FilterOutlined />}
        onClick={() => {
          setSearchText("");
          setDateRange([null, null]);
          setActiveTab("all");
        }}
      >
        Xóa lọc
      </Button>
      <Tooltip title="Xuất Excel">
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={exportToExcel}
          className="ml-auto"
        >
          Xuất Excel
        </Button>
      </Tooltip>
    </div>
  );

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold">Quản lý đơn hàng</span>
        </div>
      }
      className="shadow-sm"
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        className="mb-4 order-tabs"
      />

      {tableHeader}

      <Table<Order>
        columns={columns}
        dataSource={filteredOrders}
        rowKey="id"
        loading={loading}
        pagination={{
          total: filteredOrders.length,
          pageSize: 10,
          showTotal: (total) => `Tổng ${total} đơn hàng`,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        scroll={{ x: 1200 }}
        rowClassName="hover:bg-gray-50"
        className="order-table"
        size="middle"
        summary={(pageData) => {
          const total = pageData.reduce(
            (sum, order) => sum + order.total_amount,
            0
          );
          return (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell
                  index={0}
                  colSpan={4}
                  className="text-right font-medium"
                >
                  Tổng giá trị đơn hàng:
                </Table.Summary.Cell>
                <Table.Summary.Cell
                  index={1}
                  className="text-right font-bold text-green-600"
                >
                  {total.toLocaleString("vi-VN")}đ
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} colSpan={2} />
              </Table.Summary.Row>
            </Table.Summary>
          );
        }}
      />

      <OrderDetailModal
        orderId={selectedOrder?.id}
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
        }}
      />
      <FailureModal
        visible={failureModalVisible}
        onClose={() => {
          setFailureModalVisible(false);
          setSelectedOrderForFailure(null);
        }}
        onConfirm={handleDeliveryFailure}
        loading={failureLoading}
      />
    </Card>
  );
};

export default OrderMain;
