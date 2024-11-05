import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

// Định nghĩa kiểu dữ liệu cho một sản phẩm trong giỏ hàng
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// Định nghĩa kiểu cho các props của CartProvider
interface CartProviderProps {
  children: ReactNode;
}

// Định nghĩa kiểu dữ liệu cho CartContext
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  updateCartItemQuantity: (id: string, quantity: number) => void;
}

// Tạo context cho giỏ hàng
const CartContext = createContext<CartContextType | undefined>(undefined);

// Tạo provider cho giỏ hàng
export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);
  // Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const existingItem = prevItems.find(
        (cartItem) => cartItem.id === item.id
      );
      if (existingItem) {
        // Nếu đã có, cập nhật số lượng
        return prevItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      } else {
        // Nếu chưa có, thêm sản phẩm mới vào giỏ hàng
        return [...prevItems, item];
      }
    });
  };

  // Hàm xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Hàm cập nhật số lượng của một sản phẩm trong giỏ hàng
  const updateQuantity = (id: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };
  // In Cartshop.tsx (or where `useCart` is defined)
  const updateCartItemQuantity = (id: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  // Hàm xóa toàn bộ giỏ hàng
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        updateCartItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook để sử dụng giỏ hàng trong các component khác
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
