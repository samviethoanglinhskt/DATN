import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { Box, Checkbox, IconButton } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import { message } from 'antd';
import { useCart } from "src/context/Cart";

interface CartVariant {
  id: number;
  tb_product_id: number;
  tb_size_id: number;
  tb_color_id: number;
  sku: string;
  price: number;
  quantity: number;
  status: string;
  size: {
    id: number;
    name: string;
  };
  color: {
    id: number;
    name: string;
  };
}

interface CartItem {
  id: number;
  user_id: number;
  tb_product_id: number;
  tb_variant_id: number;
  quantity: number;
  variant: CartVariant;
  created_at: string;
  updated_at: string;
}

interface CartItemState {
  cartItems: CartItem[];
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  reduceCartItemQuantity: (id: number, quantity: number) => void;
  upCartItemQuantity: (id: number, quantity: number) => void;
  loading: boolean;
}

const ShoppingCart: React.FC = () => {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    reduceCartItemQuantity,
    upCartItemQuantity,
    loading,
  } = useCart() as CartItemState;
  
  const navigate = useNavigate();
  const [selectedVariants, setSelectedVariants] = useState<number[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSelectVariant = (variantId: number) => {
    setSelectedVariants((prev) =>
      prev.includes(variantId) 
        ? prev.filter(id => id !== variantId) 
        : [...prev, variantId]
    );
  };

  const handleSelectAll = () => {
    if (selectedVariants.length === cartItems.length) {
      setSelectedVariants([]);
    } else {
      setSelectedVariants(cartItems.map(item => item.tb_variant_id));
    }
  };

  const calculateSelectedTotal = () => {
    return cartItems
      .filter((item) => selectedVariants.includes(item.tb_variant_id))
      .reduce((total, item) => total + item.variant.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    if (selectedVariants.length === 0) {
      message.warning("Vui lòng chọn sản phẩm");
      return;
    }
    
    const selectedProducts = cartItems
      .filter((item) => selectedVariants.includes(item.tb_variant_id))
      .map(item => ({
        id: item.id,
        user_id: item.user_id,
        tb_product_id: item.tb_product_id,
        tb_variant_id: item.tb_variant_id,
        quantity: item.quantity,
        price: item.variant.price,
        variant: item.variant,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

    const subtotal = calculateSelectedTotal();

    navigate("/checkout", {
      state: { 
        selectedProducts,
        selectedVariantIds: selectedVariants,
        subtotal,
        total: subtotal
      },
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      {cartItems.length > 0 ? (
        <div>
          <div className="container mt-5">
            <div className="bread-crumb flex-w p-l-25 p-r-15 p-t-30 p-lr-0-lg">
              <button onClick={() => navigate("/")} className="stext-109 cl8 hov-cl1 trans-04">
                Trang chủ
                <i className="fa fa-angle-right m-l-9 m-r-10" aria-hidden="true"></i>
              </button>
              <span className="stext-109 cl4">Giỏ hàng</span>
            </div>
          </div>

          <form className="bg0 p-t-75 p-b-85">
            <div className="container">
              <div className="row">
                <div className="col-lg-10 col-xl-7 m-lr-auto m-b-50">
                  <div className="m-l-25 m-r--38 m-lr-0-xl">
                    <div className="wrap-table-shopping-cart">
                      <table className="table-shopping-cart">
                        <thead>
                          <tr className="table_head">
                            <th style={{ padding: "0 10px" }}>
                              <Checkbox
                                checked={selectedVariants.length === cartItems.length}
                                onChange={handleSelectAll}
                              />
                            </th>
                            <th style={{ padding: "20px" }}>Sản phẩm</th>
                            <th style={{ padding: "20px" }}>Size</th>
                            <th style={{ padding: "20px" }}>Màu</th>
                            <th style={{ padding: "20px" }}>Giá</th>
                            <th style={{ padding: "20px" }}>Số lượng</th>
                            <th style={{ padding: "20px" }}>Tổng</th>
                            <th style={{ padding: "20px" }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {cartItems.map((item) => (
                            <tr key={item.id} className="table_row">
                              <td style={{ padding: "0 10px" }}>
                                <Checkbox
                                  checked={selectedVariants.includes(item.tb_variant_id)}
                                  onChange={() => handleSelectVariant(item.tb_variant_id)}
                                />
                              </td>
                              <td style={{ padding: "0 20px" }}>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                  <img
                                    src="/api/placeholder/80/80"
                                    alt="Product"
                                    width={70}
                                    style={{ marginRight: "10px" }}
                                  />
                                  <div>Product Name</div>
                                </div>
                              </td>
                              <td style={{ padding: "0 20px" }}>
                                {item.variant.size.name}
                              </td>
                              <td style={{ padding: "0 20px" }}>
                                {item.variant.color.name}
                              </td>
                              <td style={{ padding: "0 20px" }}>
                                ${item.variant.price.toLocaleString()}
                              </td>
                              <td style={{ padding: "0 20px" }}>
                                <div className="wrap-num-product flex-w m-l-auto m-r-0">
                                  <button
                                    type="button"
                                    onClick={() => reduceCartItemQuantity(item.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                    className="btn-num-product-down cl8 hov-btn3 trans-04 flex-c-m"
                                  >
                                    -
                                  </button>
                                  <input
                                    type="text"
                                    value={item.quantity}
                                    readOnly
                                    className="mtext-104 cl3 txt-center num-product"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => upCartItemQuantity(item.id, item.quantity + 1)}
                                    className="btn-num-product-up cl8 hov-btn3 trans-04 flex-c-m"
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                              <td style={{ padding: "0 20px" }}>
                                ${(item.variant.price * item.quantity).toLocaleString()}
                              </td>
                              <td>
                                <IconButton
                                  onClick={() => removeFromCart(item.id)}
                                  sx={{ padding: "5px", margin: "20px 20px 0 0" }}
                                >
                                  <CancelOutlinedIcon sx={{ color: "red" }} />
                                </IconButton>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex-w flex-sb-m bor15 p-t-18 p-b-15 p-lr-40 p-lr-15-sm">
                      <button
                        type="button"
                        onClick={clearCart}
                        disabled={loading}
                        className="flex-c-m stext-101 cl2 size-119 bg8 bor13 hov-btn4 p-lr-15 trans-04 pointer m-tb-10"
                      >
                        Xóa giỏ hàng
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-sm-10 col-lg-7 col-xl-5 m-lr-auto m-b-50">
                  <div className="bor10 p-lr-40 p-t-30 p-b-40 m-l-63 m-r-40 m-lr-0-xl p-lr-15-sm">
                    <h4 className="mtext-109 cl2 p-b-30">Tổng giỏ hàng</h4>

                    <div className="flex-w flex-t p-t-27 p-b-33">
                      <div className="size-208">
                        <span className="mtext-101 cl2">Tổng tiền:</span>
                      </div>
                      <div className="size-209 p-t-1">
                        <span className="mtext-110 cl2">
                          ${calculateSelectedTotal().toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleCheckout}
                      disabled={selectedVariants.length === 0 || loading}
                      className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer"
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Thanh toán"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <h1>Giỏ hàng trống!</h1>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;