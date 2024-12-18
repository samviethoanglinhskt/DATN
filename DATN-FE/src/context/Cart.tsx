import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "src/config/axiosInstance";
import { CartItem, CartProviderProps, CartContextType } from "src/types/cart";
import { useLoading } from "./LoadingContext";
import { useSnackbar } from "notistack";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";


const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const { setLoading } = useLoading();
  const [isGuest, setIsGuest] = useState<boolean>(true);
  const { enqueueSnackbar } = useSnackbar();
  // State để điều khiển Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState<(() => void) | null>(null);

  // Mở Dialog xác nhận
  const openConfirmDialog = (action: () => void) => {
    setDialogAction(() => action); // Lưu lại hành động cần thực hiện sau khi xác nhận
    setOpenDialog(true);
  };

  // Đóng Dialog
  const closeDialog = () => {
    setOpenDialog(false);
    setDialogAction(null);
  };

  const fetchCartItems = async (): Promise<CartItem[]> => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      return []; // Nếu không có token, trả về mảng rỗng
    }

    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const backendCart = response.data.data;

        // Kiểm tra tồn kho và đồng bộ giỏ hàng với số lượng khả dụng
        const syncCartWithStock = async (cartItems: CartItem[]) => {
          try {
            const stockResponse = await axiosInstance.post(
              "/api/cart/check-cart-stock",
              { cart_items: cartItems },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (stockResponse.status === 200) {
              const updatedCart = cartItems.map((item) => {
                const stockInfo = stockResponse.data.find(
                  (stock: {
                    tb_product_id: number;
                    tb_variant_id: number;
                    available_quantity: number;
                  }) =>
                    stock.tb_product_id === item.tb_product_id &&
                    stock.tb_variant_id === item.tb_variant_id
                );

                if (stockInfo) {
                  return {
                    ...item,
                    quantity: Math.min(item.quantity, stockInfo.available_quantity),
                  };
                }
                return item;
              });

              // Cập nhật state và tổng số lượng giỏ hàng
              setCartItems(updatedCart);
              setTotalQuantity(
                updatedCart.reduce(
                  (sum: number, item: CartItem) => sum + item.quantity,
                  0
                )
              );

              return updatedCart;
            }
          } catch (error) {
            console.error("Lỗi khi đồng bộ tồn kho giỏ hàng:", error);
          }
          return cartItems; // Nếu xảy ra lỗi, giữ nguyên giỏ hàng hiện tại
        };

        // Đồng bộ với tồn kho
        const syncedCart = await syncCartWithStock(backendCart);
        return syncedCart;
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }

    return []; // Trả về mảng rỗng nếu xảy ra lỗi
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setIsGuest(!token); // Nếu không có token, là khách vãng lai
  }, []);

  useEffect(() => {
    const syncCartWithStock = async (cart_items: CartItem[]) => {
      try {
        setLoading(true);
        const response = await axiosInstance.post('/api/cart/check-cart-stock', {
          cart_items,
        });

        const updatedCart = cart_items.map((item) => {
          const stockInfo = response.data.find(
            (stock: { tb_product_id: number; tb_variant_id: number; available_quantity: number }) =>
              stock.tb_product_id === item.tb_product_id &&
              stock.tb_variant_id === item.tb_variant_id
          );

          if (stockInfo) {
            const availableQuantity = stockInfo.available_quantity;

            // Chỉ cập nhật nếu tồn kho không đủ
            if (availableQuantity < item.quantity) {
              return {
                ...item,
                quantity: Math.max(0, availableQuantity),
              };
            }
          }
          return item;
        });

        // Lưu giỏ hàng đã đồng bộ vào state và localStorage
        setCartItems(updatedCart);
        localStorage.setItem("guestCart", JSON.stringify(updatedCart));

        // Cập nhật tổng số lượng sản phẩm
        setTotalQuantity(
          updatedCart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)
        );

        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi đồng bộ giỏ hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isGuest) {
      const localCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      if (localCart.length > 0) {
        syncCartWithStock(localCart);
      } else {
        setCartItems([]);
        setTotalQuantity(0);
        setLoading(false);
      }
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
        // console.log("Added new item to cart:", newItem);
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
      enqueueSnackbar("Thêm sản phẩm thành công", { variant: "success" });
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
          enqueueSnackbar("Thêm sản phẩm thành công", { variant: "success" });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        // Xử lý lỗi trả về từ backend
        if (error.response && error.response.status === 400) {
          const errorMessage = error.response.data.message || "Đã xảy ra lỗi.";
          enqueueSnackbar(errorMessage, { variant: "error" });
        } else {
          console.error("Error adding item to cart:", error);
          enqueueSnackbar("Đã xảy ra lỗi, vui lòng thử lại sau.", {
            variant: "error",
          });
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

      enqueueSnackbar("Sản phẩm đã được xóa khỏi giỏ hàng!", { variant: "info" });
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
          enqueueSnackbar("Sản phẩm đã được xóa khỏi giỏ hàng!", { variant: "info" });
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
      try {
        const response = await axiosInstance.get(`/api/cart/check-stock`, {
          params: { tb_variant_id: id },
        });

        const availableQuantity = response.data.available_quantity;

        // Lấy giỏ hàng hiện tại
        const localCart = JSON.parse(localStorage.getItem("guestCart") || "[]");

        // Kiểm tra số lượng mới
        if (quantity > availableQuantity) {
          enqueueSnackbar(
            `Số lượng yêu cầu vượt quá tồn kho hiện tại là ${availableQuantity}.`,
            { variant: "warning" }
          );
          return;
        }

        // Cập nhật giỏ hàng trong state
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          )
        );

        setTotalQuantity((prevTotal) => prevTotal + 1);

        // Cập nhật giỏ hàng trong localStorage
        const updatedCart = localCart.map((item: CartItem) =>
          item.id === id ? { ...item, quantity: quantity } : item
        );
        localStorage.setItem("guestCart", JSON.stringify(updatedCart));
      } catch (error) {
        console.error("Lỗi khi kiểm tra tồn kho:", error);
      }
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
    const performClearCart = async () => {
      if (isGuest) {
        // Nếu là khách vãng lai, xóa giỏ hàng từ localStorage
        localStorage.removeItem("guestCart");
        setCartItems([]);
        setTotalQuantity(0); // Reset tổng số lượng
        enqueueSnackbar("Giỏ hàng của bạn đã được xóa!", { variant: "info" });
      } else {
        try {
          const token = sessionStorage.getItem("token");
          const response = await axiosInstance.delete("api/cart/del-all-cart", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.status === 200) {
            setCartItems([]);
            setTotalQuantity(0); // Reset tổng số lượng
            enqueueSnackbar("Giỏ hàng của bạn đã được xóa!", { variant: "info" });
          }
        } catch (error) {
          console.error("Error clearing cart:", error);
          enqueueSnackbar("Lỗi khi xóa giỏ hàng, vui lòng thử lại!", { variant: "error" });
        }
      }
    };

    // Mở Dialog xác nhận trước khi thực hiện xóa giỏ hàng
    openConfirmDialog(performClearCart);
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

  const syncCartToBackend = async (localCart: CartItem[], backendCart: CartItem[]) => {
    if (!localCart.length) return;

    const mergedCart = mergeCarts(localCart, backendCart);
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
        if (localCart.length > 0) {
          enqueueSnackbar("Đã đồng bộ giỏ hàng", { variant: "info" });
        }
      }
    } catch (error) {
      console.error("Error syncing cart to backend:", error);
    }
  };

  const handleLogin = async () => {
    const localCart = JSON.parse(localStorage.getItem("guestCart") || "[]");

    // Lấy giỏ hàng từ backend
    const backendCart = await fetchCartItems();

    // Nếu giỏ hàng vãng lai không có sản phẩm, không cần đồng bộ
    if (localCart.length === 0) {
      setCartItems(backendCart); // Cập nhật state với giỏ hàng backend
      setTotalQuantity(
        backendCart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)
      );
      return;
    }

    // Đồng bộ giỏ hàng hợp nhất lên backend
    await syncCartToBackend(localCart, backendCart);
  };


  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalQuantity,
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
      {/* Dialog xác nhận xóa giỏ hàng */}
      <Dialog open={openDialog} onClose={closeDialog}>
        <DialogTitle>Xác nhận xóa giỏ hàng</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng không? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="inherit">
            Hủy
          </Button>
          <Button
            onClick={() => {
              if (dialogAction) dialogAction();
              closeDialog();
            }}
            color="error"
            variant="contained"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
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
