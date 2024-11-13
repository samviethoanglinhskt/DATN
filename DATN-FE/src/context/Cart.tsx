import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "src/config/axiosInstance";
import { CartItem, CartProviderProps, CartContextType } from "src/types/cart";

// Tạo context cho giỏ hàng
const CartContext = createContext<CartContextType | undefined>(undefined);

// Tạo provider cho giỏ hàng
export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalQuantity, setTotalQuantity] = useState(0); // Add state for total quantity
  const [loading, setLoading] = useState(true); // Loading state added
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      setLoading(true); // Start loading
      try {
        const response = await axiosInstance.get("api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          const cartData = response.data.data;
          const updatedCartItems = await Promise.all(
            cartData.map(async (item: CartItem | null) => {
              if (!item || !item.tb_product_id) return null;
              const productResponse = await axiosInstance.get(
                `api/product/${item.tb_product_id}`
              );
              const productData = productResponse.data;
              return {
                ...item,
                name: productData.name,
                price: productData.variants[0]?.price,

              };
            })
          );
          const validCartItems = updatedCartItems.filter(Boolean) as CartItem[];
          setCartItems(validCartItems);
          setTotalQuantity(
            validCartItems.reduce((sum, item) => sum + item.quantity, 0)
          ); // Update total quantity
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setCartItems([]);
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchCartItems();
  }, []);

  const addToCart = async (item: CartItem) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to add items to the cart.");
      return;
    }

    try {
      const response = await axiosInstance.post(
        "api/add-cart",
        {
          tb_product_id: item.tb_product_id,
          quantity: item.quantity,
          tb_size_id: item.tb_size_id,
          tb_color_id: item.tb_color_id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        const newItem = response.data.data;

        setCartItems((prevItems) => {
          const existingItemIndex = prevItems.findIndex(
            (i) => i.tb_product_id === newItem.tb_product_id
          );

          let updatedItems;
          if (existingItemIndex !== -1) {
            // Sản phẩm đã tồn tại, cập nhật số lượng
            updatedItems = [...prevItems];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: newItem.quantity,
            };
          } else {
            // Sản phẩm chưa tồn tại, thêm sản phẩm mới
            updatedItems = [...prevItems, newItem];
          }

          // Cập nhật tổng số lượng ngay tại đây
          const newTotalQuantity = updatedItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          setTotalQuantity(newTotalQuantity);
          return updatedItems;
        });

        alert("Thêm thành công");
        navigate("/cart");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const removeFromCart = async (tb_product_id: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to remove items from the cart.");
      return;
    }

    try {
      const response = await axiosInstance.post(
        "api/cart/del-one-cart",
        { tb_product_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.tb_product_id !== tb_product_id)
        );
        setTotalQuantity(
          (prevTotal) =>
            prevTotal -
            (cartItems.find((item) => item.tb_product_id === tb_product_id)
              ?.quantity || 0)
        ); // Update total quantity
        alert("Xóa thành công");
      }
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  };

  const reduceCartItemQuantity = async (
    tb_product_id: number,
    quantity: number
  ) => {
    if (quantity < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.tb_product_id === tb_product_id
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
    setTotalQuantity((prevTotal) => prevTotal - 1); // Update total quantity

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to update the cart.");
      return;
    }

    try {
      await axiosInstance.post(
        "api/cart/update-quantity-cart",
        { tb_product_id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Error updating product quantity in cart:", error);
    }
  };

  const upCartItemQuantity = async (
    tb_product_id: number,
    quantity: number
  ) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.tb_product_id === tb_product_id
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
    setTotalQuantity((prevTotal) => prevTotal + 1); // Update total quantity

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axiosInstance.post(
        "api/cart/up-quantity-cart",
        { tb_product_id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Error updating product quantity in cart:", error);
    }
  };

  const clearCart = async () => {
    // Hiển thị hộp thoại xác nhận
    const confirmDelete = window.confirm("Bạn có muốn xóa tất cả sản phẩm trong giỏ hàng không?");

    if (!confirmDelete) {
      // Nếu người dùng không xác nhận, dừng hành động
      return;
    }
    setCartItems([]);
    setTotalQuantity(0); // Reset total quantity

    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.delete("api/cart/del-all-cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        alert("Tất cả sản phẩm đã được xóa!");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalQuantity,
        loading,
        addToCart,
        removeFromCart,
        clearCart,
        reduceCartItemQuantity,
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
