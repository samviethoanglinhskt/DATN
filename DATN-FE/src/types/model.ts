export interface OrderDetail {
    id: number;
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
      size?: {
        name: string;
      };
      color?: {
        name: string; 
      };
    };
  }
  
  export interface Order {
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