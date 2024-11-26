import {
  ShoppingOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

export const STATUS_CONFIG = {
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
  "Đã hủy đơn hàng": {
    color: "error",
    icon: <CloseCircleOutlined />,
    bgColor: "bg-red-50",
    textColor: "text-red-600",
  },
} as const;

// Thêm type cho Order status
export type OrderStatus = keyof typeof STATUS_CONFIG;

// Interface cho Order
export interface Order {
  id: number;
  order_code: string;
  order_date: string;
  name: string;
  phone: string;
  address: string;
  email?: string;
  total_amount: number;
  final_amount?: number;
  order_status: OrderStatus;
  // ... other fields
}