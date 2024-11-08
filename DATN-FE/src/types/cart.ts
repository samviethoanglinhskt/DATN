import { ReactNode } from "react";

// Định nghĩa kiểu dữ liệu cho một sản phẩm trong giỏ hàng
export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

// Định nghĩa kiểu cho các props của CartProvider
export interface CartProviderProps {
    children: ReactNode;
}

// Định nghĩa kiểu dữ liệu cho CartContext
export interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    updateCartItemQuantity: (id: string, quantity: number) => void;
    upCartItemQuantity: (id: string, quantity: number) => void;
}
