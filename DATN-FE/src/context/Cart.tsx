import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "src/config/axiosInstance";
import { CartItem, CartProviderProps, CartContextType } from "src/types/cart";


const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState<boolean>(true);

  const fetchCartItems = async (): Promise<CartItem[]> => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      return []; // Nếu không có token, trả về mảng rỗng
    }
    try {
      const response = await axiosInstance.get("api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        const backendCart = response.data.data;
        setCartItems(backendCart);
        setTotalQuantity(
          backendCart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)
        );
        return backendCart; // Trả về dữ liệu giỏ hàng từ backend
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
    return []; // Trả về mảng rỗng nếu không có giá trị trả về nào trước đó
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setIsGuest(!token); // Nếu không có token, là khách vãng lai
  }, []);

  useEffect(() => {
    if (isGuest) {
      const localCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      setCartItems(localCart);
      setTotalQuantity(
        localCart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)
      );
      setLoading(false);
    } else {
      fetchCartItems();
    }
  }, [isGuest]);


  const addToCart = async (item: CartItem) => {
    if (isGuest) {
      const cartId = item.tb_variant_id;
      // Lấy danh sách sản phẩm từ localStorage
      const localCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      // Kiểm tra nếu sản phẩm đã tồn tại (dựa trên tb_product_id và tb_variant_id)
      const existingItemIndex = localCart.findIndex(
        (i: CartItem) =>
          i.tb_product_id === item.tb_product_id &&
          i.tb_variant_id === item.tb_variant_id // Thêm điều kiện kiểm tra biến thể
      );

      if (existingItemIndex !== -1) {
        // Nếu sản phẩm đã tồn tại, cập nhật số lượng
        localCart[existingItemIndex].quantity += item.quantity;
      } else {
        // Nếu sản phẩm chưa tồn tại, thêm vào
        const newItem = { ...item, id: cartId };
        console.log("Added new item to cart:", newItem);
        localCart.push(newItem);
      }

      // Lưu lại vào localStorage
      localStorage.setItem("guestCart", JSON.stringify(localCart));
      setCartItems(localCart);

      // Cập nhật tổng số lượng
      const newTotalQuantity = localCart.reduce(
        (sum: number, cartItem: CartItem) => sum + cartItem.quantity,
        0
      );

      setTotalQuantity(newTotalQuantity);
      alert("Sản phẩm đã được thêm vào giỏ hàng!");
      return;
    } else {
      const token = sessionStorage.getItem("token");
      try {
        const response = await axiosInstance.post(
          "api/add-cart",
          {
            tb_product_id: item.tb_product_id,
            quantity: item.quantity,
            tb_variant_id: item.tb_variant_id,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
          const newItem = response.data.data;
          console.log(newItem);

          // Kiểm tra xem newItem có tồn tại không và có đầy đủ các thuộc tính không
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
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        // Xử lý lỗi trả về từ backend
        if (error.response && error.response.status === 400) {
          const errorMessage = error.response.data.message || "Đã xảy ra lỗi.";
          alert(`Không thể thêm sản phẩm: ${errorMessage}`);
        } else {
          console.error("Error adding item to cart:", error);
          alert("Đã xảy ra lỗi, vui lòng thử lại sau.");
        }
      }
    }
  };

  const removeFromCart = async (id: number) => {
    if (isGuest) {
      // Nếu là khách vãng lai, xóa khỏi localStorage
      const localCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      const updatedCart = localCart.filter((item: CartItem) => item.id !== id);
      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
      setCartItems(updatedCart);

      // Cập nhật tổng số lượng
      const newTotalQuantity = updatedCart.reduce(
        (sum: number, item: CartItem) => sum + item.quantity,
        0
      );
      setTotalQuantity(newTotalQuantity);

      alert("Sản phẩm đã được xóa khỏi giỏ hàng!");
      return;
    } else {
      const token = sessionStorage.getItem("token");
      try {
        const response = await axiosInstance.post(
          "api/cart/del-one-cart",
          { id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.status === 200) {
          setCartItems((prevItems) =>
            prevItems.filter((item) => item.id !== id)
          );
          setTotalQuantity(
            (prevTotal) =>
              prevTotal -
              (cartItems.find((item) => item.id === id)
                ?.quantity || 0)
          ); // Update total quantity
          alert("Xóa thành công");
        }
      } catch (error) {
        console.error("Error removing product from cart:", error);
      }
    }

  };

  const reduceCartItemQuantity = async (id: number, quantity: number) => {
    if (quantity < 1) return;
    if (isGuest) {
      // Nếu là khách vãng lai, giảm số lượng trong localStorage
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, quantity) }
            : item
        )
      );
      setTotalQuantity((prevTotal) => prevTotal - 1); // Cập nhật tổng số lượng

      const localCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      const updatedCart = localCart.map((item: CartItem) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      );
      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
      return;
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, quantity) }
            : item
        )
      );
      setTotalQuantity((prevTotal) => prevTotal - 1); // Update total quantity
      const token = sessionStorage.getItem("token");
      try {
        await axiosInstance.post(
          "api/cart/update-quantity-cart",
          { id, quantity: 1 },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error("Error updating product quantity in cart:", error);
      }
    }
  };

  const upCartItemQuantity = async (id: number, quantity: number) => {
    if (isGuest) {
      // Nếu là khách vãng lai, tăng số lượng trong localStorage
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, quantity) }
            : item
        )
      );
      setTotalQuantity((prevTotal) => prevTotal + 1); // Update total quantity

      const localCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      const updatedCart = localCart.map((item: CartItem) =>
        item.id === id ? { ...item, quantity: quantity } : item
      );
      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
      return;
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, quantity) }
            : item
        )
      );
      setTotalQuantity((prevTotal) => prevTotal + 1); // Update total quantity

      const token = sessionStorage.getItem("token");
      if (!token) return;

      try {
        await axiosInstance.post(
          "api/cart/up-quantity-cart",
          { id, quantity: 1 },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error("Error updating product quantity in cart:", error);
      }
    }

  };

  const clearCart = async () => {
    // Hiển thị hộp thoại xác nhận
    const confirmDelete = window.confirm("Bạn có muốn xóa tất cả sản phẩm trong giỏ hàng không?");

    if (!confirmDelete) {
      // Nếu người dùng không xác nhận, dừng hành động
      return;
    }
    if (isGuest) {
      // Nếu là khách vãng lai, xóa giỏ hàng từ localStorage
      localStorage.removeItem("guestCart");
      setCartItems([]);
      setTotalQuantity(0); // Reset tổng số lượng
      alert("Giỏ hàng của bạn đã được xóa!");
      return;
    } else {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axiosInstance.delete("api/cart/del-all-cart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setCartItems([]);
          setTotalQuantity(0); // Reset tổng số lượng
          alert("Tất cả sản phẩm đã được xóa!");
        }
      } catch (error) {
        console.error("Error clearing cart:", error);
      }
    }
  };

  const mergeCarts = (localCart: CartItem[], backendCart: CartItem[]): CartItem[] => {
    const mergedCart = [...backendCart];
    localCart.forEach((localItem) => {
      const existingItem = mergedCart.find(
        (backendItem) =>
          backendItem.tb_product_id === localItem.tb_product_id &&
          backendItem.tb_variant_id === localItem.tb_variant_id
      );

      if (existingItem) {
        existingItem.quantity += localItem.quantity; // Cộng dồn số lượng
      } else {
        mergedCart.push(localItem); // Thêm sản phẩm chưa có trong backend
      }
    });

    return mergedCart;
  };

  const syncCartToBackend = async (mergedCart: CartItem[]) => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axiosInstance.post(
        "api/cart/sync",
        { cart_items: mergedCart },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        const syncedCart = response.data.data;
        setCartItems(syncedCart);
        setTotalQuantity(
          syncedCart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)
        );
        localStorage.removeItem("guestCart");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error syncing cart to backend:", error);
      // Hiển thị thông báo lỗi
      const errorMessage =
        error.response?.data?.message;
      console.log(error.response?.data?.message);

      alert(errorMessage);
    }
  };

  const handleLogin = async () => {
    const localCart = JSON.parse(localStorage.getItem("guestCart") || "[]");

    // Lấy giỏ hàng từ backend
    const backendCart = await fetchCartItems();

    // Hợp nhất hai giỏ hàng
    const mergedCart = mergeCarts(localCart, backendCart);

    // Đồng bộ giỏ hàng hợp nhất lên backend
    await syncCartToBackend(mergedCart);

    // Cập nhật state
    setCartItems(mergedCart);
    setTotalQuantity(
      mergedCart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)
    );
  };


  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalQuantity,
        loading,
        isGuest,
        addToCart,
        removeFromCart,
        clearCart,
        reduceCartItemQuantity,
        upCartItemQuantity,
        handleLogin,
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
