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
  | "Đã Xử Lí"
  | "Đang Giao Hàng"
  | "Chưa Thanh Toán"
  | "Đã Thanh Toán"
  | "Đã Hoàn Thành"
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
