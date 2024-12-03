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
  "Đã xử lý": {
    color: "warning",
    icon: <ShoppingOutlined />,
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-600",
  },
  "Đang giao hàng": {
    color: "processing",
    icon: <ShoppingOutlined />,
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
  },
  "Chưa thanh toán": {
    color: "error",
    icon: <ClockCircleOutlined />,
    bgColor: "bg-orange-50",
    textColor: "text-orange-600",
  },
  "Đã thanh toán": {
    color: "success",
    icon: <CheckCircleOutlined />,
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-600",
  },
  "Đã hoàn thành": {
    color: "success",
    icon: <CheckCircleOutlined />,
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-600",
  },
  "Giao hàng thất bại": {
    color: "success",
    icon: <CheckCircleOutlined />,
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-600",
  },
  "Đã giao hàng": {
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
