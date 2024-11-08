import {
    createContext,
    useContext,
    useState,
    useEffect,
} from "react";
import axiosInstance from "src/config/axiosInstance";
import { CartItem, CartProviderProps, CartContextType } from "src/types/cart";

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

    const addToCart = (item: CartItem) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(
                (cartItem) => cartItem.id === item.id
            );
            if (existingItem) {
                return prevItems.map((cartItem) =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                        : cartItem
                );
            } else {
                return [...prevItems, item];
            }
        });
    };

    const removeFromCart = async (id: string) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
        try {
            const token = localStorage.getItem("token");
            const response = await axiosInstance.post(
                "api/cart/del-one-cart",
                { tb_product_id: id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200) {
                alert("Sản phẩm đã được gỡ khỏi giỏ hàng!");
            } else {
                alert("Có lỗi xảy ra khi gỡ sản phẩm khỏi giỏ hàng.");
            }
        } catch (error) {
            console.error("Error removing product from cart:", error);
            alert("Có lỗi xảy ra. Vui lòng thử lại.");
        }
    };

    const updateQuantity = (id: string, quantity: number) => {
        setCartItems((prevItems) =>
            prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
        );
    };

    const updateCartItemQuantity = async (id: string, quantity: number) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
            )
        );
        try {
            const token = localStorage.getItem("token");
            const response = await axiosInstance.post(
                "api/cart/update-quantity-cart",
                { tb_product_id: id, quantity: 1 },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status !== 200) {
                alert("Có lỗi xảy ra khi thay đổi sản phẩm trong giỏ hàng.");
            }
        } catch (error) {
            console.error("Error updating product quantity in cart:", error);
            alert("Có lỗi xảy ra. Vui lòng thử lại.");
        }
    };

    const upCartItemQuantity = async (id: string, quantity: number) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
            )
        );
        try {
            const token = localStorage.getItem("token");
            const response = await axiosInstance.post(
                "api/cart/up-quantity-cart",
                { tb_product_id: id, quantity: 1 },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status !== 200) {
                alert("Có lỗi xảy ra khi thay đổi số lượng sản phẩm trong giỏ hàng.");
            }
        } catch (error) {
            console.error("Error updating product quantity in cart:", error);
            alert("Có lỗi xảy ra. Vui lòng thử lại.");
        }
    };

    const clearCart = async () => {
        setCartItems([]);
        try {
            const token = localStorage.getItem("token");
            const response = await axiosInstance.delete("api/cart/del-all-cart", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                alert("Tất cả sản phẩm đã được xóa!");
            } else {
                alert("Có lỗi xảy ra khi xóa tất cả sản phẩm trong giỏ hàng.");
            }
        } catch (error) {
            console.error("Error clearing cart:", error);
            alert("Có lỗi xảy ra. Vui lòng thử lại.");
        }
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
                upCartItemQuantity,
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
