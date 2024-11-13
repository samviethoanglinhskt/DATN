import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "src/context/Cart";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { Box, Checkbox, IconButton } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';

const ShoppingCart: React.FC = () => {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    reduceCartItemQuantity,
    upCartItemQuantity,
    loading,
  } = useCart();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSelectItem = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.tb_product_id));
    }
  };

  const calculateSelectedTotal = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.tb_product_id))
      .reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0);
  };


  const handleCheckout = () => {
    if (selectedItems.length === 0) return;
    const selectedProducts = cartItems.filter((item) =>
      selectedItems.includes(item.tb_product_id)
    );
    const subtotal = calculateSelectedTotal();
    const total = subtotal;

    navigate("/checkout", {
      state: { selectedProducts, subtotal, total },
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress /> {/* Spinner */}
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
                Home
                <i className="fa fa-angle-right m-l-9 m-r-10" aria-hidden="true"></i>
              </button>
              <span className="stext-109 cl4">Shopping Cart</span>
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
                                checked={selectedItems.length === cartItems.length}
                                onChange={handleSelectAll}
                              />
                            </th>
                            <th style={{ padding: "20px" }}>Product</th>
                            <th style={{ padding: "20px" }}>Price</th>
                            <th style={{ padding: "20px" }}>Quantity</th>
                            <th style={{ padding: "20px" }}>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cartItems.map((item) => (
                            <tr key={item.tb_product_id} className="table_row">
                              <td style={{ padding: "0 10px" }}>
                                <Checkbox
                                  sx={{
                                    "& .MuiSvgIcon-root": {
                                      fontSize: 16, // Đặt kích thước của checkbox ở đây (40px)
                                    },
                                  }}
                                  checked={selectedItems.includes(item.tb_product_id)}
                                  onChange={() => handleSelectItem(item.tb_product_id)}
                                />
                              </td>

                              <td style={{ padding: "0 20px" }}>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                  <img
                                    src="https://picsum.photos/300/300"
                                    width={70}
                                    style={{ display: "flex", marginRight: "10px" }}
                                  />
                                  <div style={{ fontSize: "14px", display: "inline" }}>{item.name}</div>
                                </div>
                              </td>

                              <td style={{ padding: "0 20px" }}>
                                {item.price !== undefined && item.price !== null ? `$${item.price.toFixed(2)}` : "Loading..."}
                              </td>

                              <td style={{ padding: "0 20px" }}>
                                <div className="wrap-num-product flex-w m-l-auto m-r-0">
                                  <button
                                    type="button"
                                    onClick={() => reduceCartItemQuantity(item.tb_product_id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                    className="btn-num-product-down cl8 hov-btn3 trans-04 flex-c-m"
                                  >
                                    <i className="fs-16 zmdi zmdi-minus"></i>
                                  </button>
                                  {item.quantity !== undefined && item.quantity !== null ? (
                                    <input
                                      type="text"
                                      value={item.quantity}
                                      readOnly
                                      className="mtext-104 cl3 txt-center num-product"
                                    />
                                  ) : (
                                    <input
                                      type="text"
                                      value={1}  // Temporary fallback, or consider leaving empty until quantity is defined
                                      readOnly
                                      className="mtext-104 cl3 txt-center num-product"
                                    />
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => upCartItemQuantity(item.tb_product_id, item.quantity + 1)}
                                    className="btn-num-product-up cl8 hov-btn3 trans-04 flex-c-m"
                                  >
                                    <i className="fs-16 zmdi zmdi-plus"></i>
                                  </button>
                                </div>
                              </td>

                              <td style={{ padding: "0 20px" }}>
                                {item.price !== undefined && item.quantity !== undefined
                                  ? `$${(item.price * item.quantity).toFixed(2)}`
                                  : "Loading..."}
                              </td>

                              <td >
                                <IconButton onClick={() => removeFromCart(item.tb_product_id)} aria-label="delete" sx={{ padding: "5px", margin: "20px 20px 0 0" }}>
                                  <CancelOutlinedIcon sx={{ color: "red", cursor: "pointer" }} />
                                </IconButton>
                              </td>

                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex-w flex-sb-m bor15 p-t-18 p-b-15 p-lr-40 p-lr-15-sm">
                      <div className="flex-w flex-m m-r-20 m-tb-5">
                        <input
                          type="text"
                          placeholder="Coupon Code"
                          className="stext-104 cl2 plh4 size-117 bor13 p-lr-20 m-r-10 m-tb-5"
                        />
                        <button type="button" className="flex-c-m stext-101 cl2 size-118 bg8 bor13 hov-btn3 p-lr-15 trans-04 pointer m-tb-5">
                          Apply coupon
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={clearCart}
                        disabled={loading}
                        className="flex-c-m stext-101 cl2 size-119 bg8 bor13 hov-btn4 p-lr-15 trans-04 pointer m-tb-10"
                      >
                        Clear Cart
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-sm-10 col-lg-7 col-xl-5 m-lr-auto m-b-50">
                  <div className="bor10 p-lr-40 p-t-30 p-b-40 m-l-63 m-r-40 m-lr-0-xl p-lr-15-sm">
                    <h4 className="mtext-109 cl2 p-b-30">Giỏ hàng tổng</h4>

                    <div className="flex-w flex-t bor12 p-b-13">
                      <div className="size-208">
                        <span className="stext-110 cl2">Tạm tính:</span>
                      </div>
                      <div className="size-209">
                        <span className="mtext-110 cl2">${calculateSelectedTotal().toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex-w flex-t bor12 p-t-15 p-b-30">
                      <div className="size-208 w-full-ssm">
                        <span className="stext-110 cl2">
                          Giảm giá:
                        </span>
                      </div>
                      <div className="size-209">
                        <span className="mtext-110 cl2">
                          -$0
                        </span>
                      </div>
                    </div>

                    <div className="flex-w flex-t p-t-27 p-b-33">
                      <div className="size-208">
                        <span className="mtext-101 cl2">
                          Tổng:
                        </span>
                      </div>
                      <div className="size-209 p-t-1">
                        <span className="mtext-110 cl2">
                          ${calculateSelectedTotal().toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="d-grid gap-2 mt-3">
                      <button
                        onClick={handleCheckout}
                        disabled={selectedItems.length === 0 || loading}
                        className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer"
                      >
                        {loading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Processing...
                          </>
                        ) : (
                          `Thanh toán`
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <h1>Giỏ hàng của bạn đang trống!</h1>
        </div>
      )}

    </div>
  );
};

export default ShoppingCart;
