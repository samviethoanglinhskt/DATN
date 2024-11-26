import { Discount } from "./discount";

export interface OrderDetail {
  id: number;
  is_reviewed: boolean;
  tb_oder_id: number;
  tb_product_id: number;
  tb_variant_id: number;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
  product: {
    id: number;
    name: string;
    image: string;
  };
  variant: {
    size?: { name: string };
    color?: { name: string };
  };
}

export interface Order {
  discount: Discount;
  id: number;
  order_code: string;
  user_id: number;
  tb_discount_id: number | null;
  order_date: string;
  total_amount: number;
  final_amount?: number;
  order_status: string;
  feedback: string | null;
  name: string;
  phone: string;
  address: string;
  email: string;
  created_at: string;
  updated_at: string;
  oder_details: OrderDetail[];
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: Order[];
}

export interface OrderDetailModalProps {
  order: Order | null;
  visible: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onOpenRatingModal: (product: any, order_id: number, orderdetail_id: number) => void;
}

export interface CancellationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (orderId: number, feedback: string) => void;
  orderId: number | null;
  loading: boolean;
}