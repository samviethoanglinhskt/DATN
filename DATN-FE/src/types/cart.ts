import { ReactNode } from "react";
import { Variant } from "./product";

// Định nghĩa kiểu dữ liệu cho một sản phẩm trong giỏ hàng
export interface CartItem {
  id?: number;
  tb_product_id: number;
  quantity: number;
  name?: string;
  price?: number;
  tb_size_id?: number;
  tb_color_id?: number;
  sku?: string;
  image?: string;
  tb_variant_id: number;
  variant: Variant;
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
  addToBuy: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  reduceCartItemQuantity: (id: number, quantity: number) => void;
  upCartItemQuantity: (id: number, quantity: number) => void;
  loading: boolean; // Add the loading property here
}
