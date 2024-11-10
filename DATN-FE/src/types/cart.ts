import { ReactNode } from "react";

// Định nghĩa kiểu dữ liệu cho một sản phẩm trong giỏ hàng
export interface CartItem {
  tb_product_id: number;
  quantity: number;
  id?: number;
  name?: string;
  price?: number;
  tb_size_id?: number;
  tb_color_id?: number;
  sku?: string;
}

// Định nghĩa kiểu cho các props của CartProvider
export interface CartProviderProps {
  children: ReactNode;
}

// Định nghĩa kiểu dữ liệu cho CartContext
export interface CartContextType {
  cartItems: CartItem[];
  totalQuantity: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  reduceCartItemQuantity: (id: number, quantity: number) => void;
  upCartItemQuantity: (id: number, quantity: number) => void;
}
