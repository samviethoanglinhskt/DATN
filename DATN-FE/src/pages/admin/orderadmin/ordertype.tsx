import { ReactNode } from "react";

export interface OrderDetail {
  id: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    image: string;
  };
  variant: {
    id: number;
    price: number;
    size: {
      name: string;
    };
    color: {
      name: string;
    } | null;
  };
}

export interface Order {
  id: number;
  order_code: string;
  order_date: string;
  total_amount: number;
  final_amount?: number;
  order_status: OrderStatus;
  name: string;
  phone: string;
  address: string;
  email: string;
  oder_details?: OrderDetail[];
}

export interface StatusConfig {
  color: string;
  icon: ReactNode;
  bgColor: string;
  textColor: string;
}

export type OrderStatus =
  | "Chờ xử lý"
  | "Đã xử lý"
  | "Đang giao hàng"
  | "Chưa thanh toán"
  | "Đã thanh toán"
  | "Đã hoàn thành"
  | "Giao hàng thất bại"
  | "Đã giao hàng"
  | "Đã hủy đơn hàng";

export interface ApiResponse {
  success: boolean;
  data: Order[];
  message?: string;
}

export interface OrderDetailModalProps {
  order: Order | null;
  visible: boolean;
  onClose: () => void;
}
