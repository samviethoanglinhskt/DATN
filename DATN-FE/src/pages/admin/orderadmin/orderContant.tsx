  import {
    ShoppingOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
  } from "@ant-design/icons";
import { OrderStatus, StatusConfig } from "./ordertype";

  export const STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
    "Chờ xử lý": {
      color: "processing",
      icon: <ClockCircleOutlined />,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    "Đã Xử Lí": {
      color: "warning",
      icon: <ShoppingOutlined />,
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
    },
    "Đang Giao Hàng": {
      color: "processing",
      icon: <ShoppingOutlined />,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    "Chưa Thanh Toán": {
      color: "error",
      icon: <ClockCircleOutlined />,
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
    "Đã Thanh Toán": {
      color: "success",
      icon: <CheckCircleOutlined />,
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    "Đã Hoàn Thành": {
      color: "success",
      icon: <CheckCircleOutlined />,
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    "Đã hủy đơn hàng": {
      color: "error",
      icon: <CloseCircleOutlined />,
      bgColor: "bg-red-50",
      textColor: "text-red-600",
    },
  };

  export const API_ENDPOINTS = {
    LIST_ORDERS: "http://127.0.0.1:8000/api/list-oder-admin",
    UPDATE_ORDER: "http://127.0.0.1:8000/api/order",
  };
