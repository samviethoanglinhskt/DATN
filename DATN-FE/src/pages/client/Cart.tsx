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

  const handleSelectItem = (id: number | undefined) => {
    if (id === undefined) return; // Thêm kiểm tra undefined
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.id).filter((id) => id !== undefined) as number[]);
    }
  };

  const calculateSelectedTotal = () => {
    return cartItems
      .filter((item) => item.id !== undefined && selectedItems.includes(item.id))
      .reduce((total, item) => total + (item.variant.price || 0) * (item.quantity || 0), 0);
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) return;
    const selectedProducts = cartItems.filter((item) =>
      item.id !== undefined && selectedItems.includes(item.id)
    );

    const subtotal = calculateSelectedTotal();
    // Truyền thêm `cartId` vào navigation
    const cartId = selectedItems;  // Giả sử tất cả các mục trong giỏ hàng có cùng cart_id
    navigate("/checkout", {
      state: { selectedProducts, subtotal, cartId },
    });
  };

  useEffect(() => {
    console.log("Cart Items: ", cartItems);
  }, [cartItems]);

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
          <div className="container" style={{ marginTop: 80 }}>
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
                  <div className="m-r--38 m-lr-0-xl" style={{ marginLeft: "-30px" }}>
                    <div className="wrap-table-shopping-cart" >
                      <table className="table-shopping-cart">
                        <thead>
                          <tr className="table_head">
                            <th style={{ padding: "0 10px" }}>
                              <Checkbox
                                checked={selectedItems.length === cartItems.length}
                                onChange={handleSelectAll}
                              />
                            </th>
                            <th style={{ padding: "20px" }}>Sản phẩm</th>
                            <th style={{ padding: "20px" }}>Loại</th>
                            <th style={{ padding: "20px" }}>Giá</th>
                            <th style={{ padding: "20px" }}>Số lượng</th>
                            <th style={{ padding: "20px" }}>Tổng</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cartItems.map((item) => (
                            <tr key={item.id} className="table_row">
                              <td style={{ padding: "0 10px" }}>
                                <Checkbox
                                  sx={{
                                    "& .MuiSvgIcon-root": {
                                      fontSize: 16, // Đặt kích thước của checkbox ở đây (40px)
                                    },
                                  }}
                                  checked={item.id !== undefined && selectedItems.includes(item.id)}
                                  onChange={() => handleSelectItem(item.id)}
                                />
                              </td>

                              <td style={{ padding: "0 20px" }}>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                  <img
                                    src={`http://127.0.0.1:8000/storage/${item.products.image}`}
                                    width={70}
                                    style={{ display: "flex", marginRight: "10px" }}
                                  />
                                  <div style={{ fontSize: "13px", display: "inline" }}>{item.name}</div>
                                </div>
                                <div style={{ fontSize: "11px", fontWeight: 500, marginTop: "5px" }}>Sku:{item.variant.sku}</div>
                              </td>

                              <td style={{ padding: "0 20px", fontSize: "13px" }}>
                                {item.variant.tb_size_id !== null && item.variant.tb_size_id !== undefined
                                  ? `${item.variant.size.name}`
                                  : item.variant.tb_color_id !== null && item.variant.tb_color_id !== undefined
                                    ? `${item.variant.color.name}`
                                    : ""}
                              </td>

                              <td style={{ padding: "0 20px" }}>
                                {item.variant.price !== undefined && item.variant.price !== null ? `$${item.variant.price}` : "Loading..."}
                              </td>

                              <td style={{ padding: "0 20px" }}>
                                <div className="wrap-num-product flex-w m-l-auto m-r-0">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (item.id !== undefined && item.quantity) {
                                        reduceCartItemQuantity(item.id, item.quantity - 1);
                                      }
                                    }}
                                    disabled={item.quantity === undefined || item.quantity <= 1}
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
                                    onClick={() => {
                                      if (item.id !== undefined && item.quantity) {
                                        upCartItemQuantity(item.id, item.quantity + 1);
                                      }
                                    }}
                                    className="btn-num-product-up cl8 hov-btn3 trans-04 flex-c-m"
                                  >
                                    <i className="fs-16 zmdi zmdi-plus"></i>
                                  </button>
                                </div>
                              </td>

                              <td style={{ padding: "0 20px" }}>
                                {item.variant.price !== undefined && item.quantity !== undefined
                                  ? `$${(item.variant.price * item.quantity)}`
                                  : "Loading..."}
                              </td>

                              <td >
                                <IconButton onClick={() => {
                                  if (item.id !== undefined) {
                                    removeFromCart(item.id);
                                  }
                                }} aria-label="delete" sx={{ padding: "5px", margin: "20px 20px 0 0" }}>
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

                      </div>
                      <button
                        type="button"
                        onClick={clearCart}
                        disabled={loading}
                        className="flex-c-m stext-101 cl2 size-119 bg8 bor13 hov-btn4 p-lr-15 trans-04 pointer m-tb-10"
                      >
                        Xóa toàn bộ giỏ hàng
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-sm-10 col-lg-7 col-xl-5 m-lr-auto m-b-50">
                  <div className="bor10 p-lr-40 p-t-30 p-b-40 m-l-63 m-r-40 m-lr-0-xl p-lr-15-sm">
                    <h4 className="mtext-109 cl2 p-b-30">Thông tin đơn hàng</h4>
                    <div className="flex-w flex-t p-t-27 p-b-33">
                      <div className="size-208">
                        <span className="mtext-101 cl2">
                          Tổng:
                        </span>
                      </div>
                      <div className="size-209 p-t-1">
                        <span className="mtext-110 cl2">
                          {calculateSelectedTotal()}đ
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
                          `Mua hàng`
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