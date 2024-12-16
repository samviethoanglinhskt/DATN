import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "src/context/Cart";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { Checkbox, IconButton } from "@mui/material";
import axiosInstance from "src/config/axiosInstance";

const ShoppingCart: React.FC = () => {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    reduceCartItemQuantity,
    upCartItemQuantity,
    isGuest,
  } = useCart();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

  const handleSelectItem = (id: number | undefined) => {
    if (id === undefined) return; // Thêm kiểm tra undefined
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const selectableItems = cartItems
      .filter((item) => (!isGuest && item.variant.quantity > 0) || (isGuest && item.quantity > 0)) // Chỉ chọn sản phẩm còn hàng
      .map((item) => item.id)
      .filter((id) => id !== undefined) as number[]; // Lọc các id hợp lệ

    if (isAllSelected) {
      setSelectedItems([]); // Bỏ chọn tất cả nếu đã chọn hết
    } else {
      setSelectedItems(selectableItems); // Chọn tất cả các sản phẩm còn hàng
    }

    setIsAllSelected(!isAllSelected); // Cập nhật trạng thái "Chọn tất cả"
  };


  const calculateSelectedTotal = () => {
    return cartItems
      .filter((item) => item.id !== undefined && selectedItems.includes(item.id))
      .reduce((total, item) => total + (item.variant.price || 0) * (item.quantity || 0), 0);
  };

  const handleCheckout = async () => {
    if (selectedItems.length === 0) return;
    // Lọc các sản phẩm đã chọn
    const selectedProducts = cartItems.filter(
      (item) => item.id !== undefined && selectedItems.includes(item.id)
    );

    // Tạo danh sách số lượng từ các sản phẩm được chọn
    const quantities = selectedProducts.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }));

    try {
      // Gửi request kiểm tra tồn kho lên backend qua axiosInstance
      const response = await axiosInstance.post("/api/cart/check-investory", {
        cart_items: selectedProducts,
      });

      if (response.data.success) {
        // Nếu kiểm tra thành công, điều hướng đến trang thanh toán
        const subtotal = calculateSelectedTotal();
        navigate("/checkout", {
          state: { selectedProducts, subtotal, cartId: selectedItems, quantities },
        });
      }
    } catch {
      alert("Sản phẩm đã chọn vượt quá số lượng tồn kho. Đừng lo chúng tôi sẽ đồng bộ lại giúp bạn!")
      window.location.reload();
    }
  };

  useEffect(() => {
    console.log("Cart Items: ", cartItems);
  }, [cartItems]);

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
                                checked={isAllSelected}
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
                            <tr key={item.tb_variant_id} className="table_row">
                              <td style={{ padding: "0 10px" }}>
                                <Checkbox
                                  sx={{
                                    "& .MuiSvgIcon-root": {
                                      fontSize: 16,
                                    },
                                  }}
                                  checked={item.id !== undefined && selectedItems.includes(item.id)}
                                  onChange={() => handleSelectItem(item.id)}
                                  disabled={(!isGuest && item.variant.quantity === 0) || (isGuest && item.quantity === 0)}
                                />
                              </td>

                              <td style={{ padding: "0 20px" }}>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                  <img
                                    src={`http://127.0.0.1:8000/storage/${item?.variant.images[0].name_image}`}
                                    width={70}
                                    style={{ display: "flex", marginRight: "10px" }}
                                  />
                                  <Link to={`/product/${item?.products?.id}`} className="product-link">
                                    <div style={{ fontSize: "13px" }}>{item?.products?.name}</div>
                                  </Link>
                                </div>
                                <span style={{ fontSize: "11px", fontWeight: 500, marginTop: "5px" }}>Sku:{item?.variant?.sku}</span>
                              </td>

                              <td style={{ padding: "0 20px", fontSize: "13px" }}>
                                {item?.variant?.tb_size_id !== null && item?.variant?.tb_size_id !== undefined
                                  ? `${item?.variant?.size?.name}`
                                  : item?.variant?.tb_color_id !== null && item?.variant?.tb_color_id !== undefined
                                    ? `${item?.variant?.color?.name}`
                                    : ""}
                              </td>

                              <td style={{ padding: "0 20px" }}>
                                {(!isGuest && item.variant.quantity === 0) || (isGuest && item.quantity === 0) ? (
                                  ""
                                ) : (
                                  item.variant.price !== undefined && item.variant.price !== null
                                    ? `${(item.variant.price).toLocaleString("vi-VN")}đ`
                                    : "Loading..."
                                )}
                              </td>

                              <td style={{ padding: "0 20px" }}>
                                {(!isGuest && item.variant.quantity === 0) || (isGuest && item.quantity === 0) ? (
                                  <span style={{ color: "red", fontWeight: "bold" }}>Sản phẩm đã hết hàng</span>
                                ) : (
                                  <div className="wrap-num-product flex-w m-l-auto m-r-0">
                                    {/* Nút giảm số lượng */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (item.id !== undefined && item.quantity) {
                                          reduceCartItemQuantity(item.id, Math.max(item.quantity - 1, 1));
                                        }
                                      }}
                                      disabled={item.quantity === undefined || item.quantity <= 1}
                                      className="btn-num-product-down cl8 hov-btn3 trans-04 flex-c-m"
                                    >
                                      <i className="fs-16 zmdi zmdi-minus"></i>
                                    </button>

                                    {/* Hiển thị số lượng */}
                                    <input
                                      type="text"
                                      value={item.quantity}
                                      readOnly
                                      className="mtext-104 cl3 txt-center num-product"
                                    />

                                    {/* Nút tăng số lượng */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (
                                          item.id !== undefined &&
                                          item.quantity !== undefined &&
                                          item.quantity < item.variant.quantity
                                        ) {
                                          upCartItemQuantity(item.id, item.quantity + 1);
                                        } else {
                                          alert(`Số lượng yêu cầu vượt quá tồn kho hiện tại là ${item.variant.quantity}.`)
                                        }
                                      }}
                                      className="btn-num-product-up cl8 hov-btn3 trans-04 flex-c-m"
                                    >
                                      <i className="fs-16 zmdi zmdi-plus"></i>
                                    </button>
                                  </div>
                                )}
                              </td>


                              <td style={{ padding: "0 20px" }}>
                                {(item.variant.quantity === 0) || (isGuest && item.quantity === 0) ? (
                                  ""
                                ) : (
                                  item.variant.price !== undefined && item.quantity !== undefined
                                    ? `${(item.variant.price * item.quantity).toLocaleString("vi-VN")}đ`
                                    : "Loading..."
                                )}
                              </td>

                              <td>
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
                        // disabled={loading}
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
                          {calculateSelectedTotal().toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                    </div>

                    <div className="d-grid gap-2 mt-3">
                      <button
                        type="button"
                        onClick={handleCheckout}
                        disabled={selectedItems.length === 0}
                        className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer"
                      >
                        Mua hàng
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            textAlign: "center",
          }}
        >
          <h1 style={{ marginBottom: "20px" }}>Giỏ hàng của bạn đang trống!</h1>
          <button
            onClick={() => navigate("/")}
            className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer"
            style={{ width: 200 }}
          >
            Quay lại mua sắm
          </button>
        </div>
      )}

    </div>
  );
};

export default ShoppingCart;