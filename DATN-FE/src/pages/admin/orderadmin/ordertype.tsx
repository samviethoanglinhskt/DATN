import { ReactNode } from "react";

export interface OrderDetail {
  id: number;
  product: {
    name: string;
    image: string;
  };
  variant: {
    size?: { name: string };
    color?: { name: string };
  };
  quantity: number;
  price: number;
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
  | "Chờ Xử Lí"
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