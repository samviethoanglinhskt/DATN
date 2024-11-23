import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, List, ListItem, Radio, RadioGroup, Typography } from '@mui/material';
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from 'src/context/User';
import { Variant } from 'src/types/product';
import logoVoucher from 'src/assets/images/logo/z6049078466357_4627467cef3023a6ad0594fd0cfdc81e-removebg-preview.png';
import axiosInstance from 'src/config/axiosInstance';
import { Discount } from 'src/types/discount';

interface Product {
  id: number;
  products: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    image: any;
    name: string;
  };
  variant: {
    size?: { name: string };
    color?: { name: string };
    price: number;
  };
  quantity: number;
}

interface CartItem {
  id?: number;
  tb_product_id: number;
  quantity: number;
  name?: string;
  price?: number;
  tb_size_id?: number;
  tb_color_id?: number;
  sku?: string;
  image?: string;
  tb_variant_id: number;
  variant: Variant
  size?: {
    name: string;
    tb_size_id: number;
  };
  color?: {
    name: string;
    tb_color_id: number;
  };
}

interface LocationState {
  selectedProducts: Product[];
  subtotal: number;
  cartId: number[];
  cartItem: CartItem;
}
const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser(); // Get user data from UserContext
  const [loadingUser, setLoadingUser] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [addressError, setAddressError] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const state = location.state as LocationState;
  const selectedProducts = useMemo(() => state?.selectedProducts || [], [state?.selectedProducts]);
  const subtotal = state?.subtotal ?? 0;
  const cartId = state?.cartId || [];
  const cartItem = state?.cartItem;
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [voucherDialogOpen, setVoucherDialogOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<{ id: number; code: string; discount: number } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod', 'vnpay'

  // Phương thức xử lý khi thay đổi lựa chọn phương thức thanh toán
  const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(event.target.value);
  };

  const calculateSubtotal = (cartItem: CartItem): number => {
    const price = cartItem.price ?? 0;
    return price * cartItem.quantity;
  };

  const calculateTotal = (subtotal: number, discountPercent: number): number => {
    const discount = subtotal * (discountPercent / 100);  // Tính số tiền giảm
    return subtotal - discount;  // Tính tổng sau khi giảm giá
  };

  const subtotalCartItem = cartItem ? calculateSubtotal(cartItem) : 0;
  const totalCartItem = cartItem ? calculateTotal(subtotalCartItem, selectedVoucher?.discount || 0) : 0;
  const totalWithDiscount = selectedProducts.length > 0 ? calculateTotal(subtotal, selectedVoucher?.discount || 0) : 0;
  const handleApplyVoucher = (voucher: { id: number; code: string; discount: number }) => {
    setSelectedVoucher(voucher);
    setVoucherDialogOpen(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoadingUser(false);
    } else if (user?.data) {
      setName(user.data.name || '');
      setEmail(user.data.email || '');
      setPhone(user.data.phone || '');
      setAddress(user.data.address || '');
      setLoadingUser(false);
    } else {
      setLoadingUser(false);
    }
    // console.log(cartItem);
    // console.log(selectedProducts);

  }, [user]);

  const validateForm = () => {
    let isValid = true;
    if (!name.trim()) {
      setNameError('Họ tên không được để trống');
      isValid = false;
    } else {
      setNameError('');
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim()) {
      setEmailError('Email không được để trống');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Email không hợp lệ');
      isValid = false;
    } else {
      setEmailError('');
    }

    const phoneRegex = /^0[0-9]{9}$/;
    if (!phone.trim()) {
      setPhoneError('Số điện thoại không được để trống');
      isValid = false;
    } else if (!phoneRegex.test(phone)) {
      setPhoneError('Số điện thoại không hợp lệ');
      isValid = false;
    } else {
      setPhoneError('');
    }

    if (!address.trim()) {
      setAddressError('Địa chỉ không được để trống');
      isValid = false;
    } else {
      setAddressError('');
    }
    return isValid;
  };

  const handleCheckOut = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      let url = token
        ? 'http://localhost:8000/api/cart/check-out-cart'
        : 'http://localhost:8000/api/cart/check-out-guest';
      if (paymentMethod == 'vnpay' && token) {
        url = 'http://localhost:8000/api/payment-online'
      }
      if (paymentMethod == 'vnpay' && !token) {
        url = 'http://localhost:8000/api/payment-guest'
      }

      const totalAmount = selectedProducts.length > 0 ? totalWithDiscount : totalCartItem;
      const tbProductId = selectedProducts.length > 0 ? null : cartItem.tb_product_id;
      const tbVariantId = selectedProducts.length > 0 ? null : cartItem.tb_variant_id;
      const quantity = selectedProducts.length > 0 ? null : cartItem.quantity;
      const cart_items = selectedProducts.length > 0 ? cartId : null;

      const requestBody = {
        name,
        email,
        phone,
        address,
        quantity: quantity,
        tb_product_id: tbProductId,
        tb_variant_id: tbVariantId,
        total_amount: totalAmount,
        cart_items: cart_items,
        tb_discount_id: selectedVoucher?.id,
        // payment_method: paymentMethod, 
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const responseData = await response.json();

        if (paymentMethod === 'vnpay' && responseData.vnpay_url) {
          // Chuyển hướng đến VNPay URL
          window.location.href = responseData.vnpay_url;
        } else {
          navigate("/payment-success"); // Chuyển hướng về trang chủ
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Đặt hàng thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await axiosInstance.get('/api/discount');
        const allDiscounts = response.data;
        const currentDate = new Date();

        // Lọc chỉ voucher còn hiệu lực
        const validDiscounts = allDiscounts.filter((discount: Discount) => {
          const startDate = new Date(discount.start_day);
          const endDate = new Date(discount.end_day);
          return currentDate >= startDate && currentDate <= endDate;
        });

        setDiscounts(validDiscounts);
      } catch (error) {
        console.error('Error fetching discounts:', error);
      }
    };
    fetchDiscounts();
  }, []);

  if (loadingUser) {
    return <div>Đang tải thông tin người dùng...</div>;
  }
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-5 mt-5">
      <div className="container mt-2 mb-5">
        <div className="bread-crumb flex-w p-l-25 p-r-15 p-t-30 p-lr-0-lg">
          <button onClick={() => navigate("/")} className="stext-109 cl8 hov-cl1 trans-04">
            Trang chủ
            <i className="fa fa-angle-right m-l-9 m-r-10" aria-hidden="true"></i>
          </button>
          <button onClick={() => navigate("/cart")} className="stext-109 cl8 hov-cl1 trans-04">
            Giỏ hàng
            <i className="fa fa-angle-right m-l-9 m-r-10" aria-hidden="true"></i>
          </button>
          <span className="stext-109 cl4">Thanh toán</span>
        </div>
      </div>

      <h1 className="h3 mb-4">Thanh Toán</h1>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">Thông tin giao hàng</h5>
              <form>
                <div className="mb-3">
                  <label className="form-label">Họ tên</label>
                  <input
                    type="text"
                    className={`form-control bg-light ${nameError ? 'is-invalid' : ''}`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {nameError && <div className="invalid-feedback">{nameError}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="text"
                    className={`form-control bg-light ${emailError ? 'is-invalid' : ''}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {emailError && <div className="invalid-feedback">{emailError}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Số điện thoại</label>
                  <input
                    type="tel"
                    className={`form-control bg-light ${phoneError ? 'is-invalid' : ''}`}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  {phoneError && <div className="invalid-feedback">{phoneError}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Địa chỉ giao hàng</label>
                  <textarea
                    className={`form-control ${addressError ? 'is-invalid' : ''}`}
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Vui lòng nhập địa chỉ giao hàng chi tiết"
                  />
                  {addressError && <div className="invalid-feedback">{addressError}</div>}
                </div>
              </form>

              {/* Thêm giao diện phương thức thanh toán */}
              <div className="mt-4">
                <h5 className="card-title mb-4">Phương thức thanh toán</h5>
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="payment-method"
                    name="payment-method"
                    value={paymentMethod}
                    onChange={handlePaymentMethodChange}
                  >
                    <FormControlLabel value="cod" control={<Radio />} label="Thanh toán khi nhận hàng (COD)" />
                    <FormControlLabel value="vnpay" control={<Radio />} label="Thanh toán qua VNPay" />
                  </RadioGroup>
                </FormControl>
              </div>

            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">Đơn hàng của bạn</h5>
              <div className="mb-4">
                {/* Kiểm tra nếu selectedProducts có sản phẩm */}
                {selectedProducts.length > 0 && selectedProducts.map((item) => (
                  <div key={item.id} className="d-flex gap-3 mb-3 pb-3 border-bottom">
                    <img src={`http://127.0.0.1:8000/storage/${item.products.image}`} className="rounded" style={{ width: '64px', height: '64px', objectFit: 'cover' }} />
                    <div className="flex-grow-1">
                      <p className="mb-0" style={{ fontSize: 15 }}>{item.products.name}</p>
                      <div>
                        {item.variant?.size && item.variant.size !== null ? (
                          <small>{item.variant.size.name} | SL: {item.quantity}</small>
                        ) : null}
                        {item.variant?.color && item.variant.color !== null ? (
                          <small>{item.variant.color.name} | SL: {item.quantity}</small>
                        ) : null}
                        {!item.variant?.size && !item.variant?.color ? (
                          <small>SL: {item.quantity}</small>
                        ) : null}
                      </div>
                      <span>{item.variant?.price}đ</span>
                    </div>
                  </div>
                ))}

                {/* Kiểm tra nếu cartItem có sản phẩm */}
                {cartItem && (
                  <div key={cartItem.id} className="d-flex gap-3 mb-3 pb-3 border-bottom">
                    <img src={`http://127.0.0.1:8000/storage/${cartItem.image}`} className="rounded" style={{ width: '64px', height: '64px', objectFit: 'cover' }} />
                    <div className="flex-grow-1">
                      <p className="mb-0" style={{ fontSize: 15 }}>{cartItem.name}</p>
                      <div>
                        {cartItem.size && cartItem.size !== null ? (
                          <small>{cartItem.size.name} | SL: {cartItem.quantity}</small>
                        ) : null}
                        {cartItem.color && cartItem.color !== null ? (
                          <small>{cartItem.color.name} | SL: {cartItem.quantity}</small>
                        ) : null}
                        {!cartItem.size && !cartItem.color ? (
                          <small>SL: {cartItem.quantity}</small>
                        ) : null}
                      </div>
                      <span>{cartItem.price}đ</span>
                    </div>
                  </div>
                )}
              </div>

              {selectedProducts.length > 0 && (
                <div className="d-flex justify-content-between mb-3">
                  <span>Tạm tính</span>
                  <span>{subtotal}đ</span>
                </div>
              )}

              {cartItem && (
                <div className="d-flex justify-content-between mb-3">
                  <span>Tạm tính</span>
                  <span>{subtotalCartItem}đ</span>
                </div>
              )}

              {selectedVoucher && selectedProducts.length > 0 && (
                <div className="d-flex justify-content-between mb-3">
                  <span>Giảm giá ({selectedVoucher.code})</span>
                  <span>-{(subtotal * selectedVoucher.discount) / 100}đ</span>
                </div>
              )}
              {selectedVoucher && cartItem && (
                <div className="d-flex justify-content-between mb-3">
                  <span>Giảm giá ({selectedVoucher.code})</span>
                  <span>-{(subtotalCartItem * selectedVoucher.discount) / 100}đ</span>
                </div>
              )}

              {selectedProducts.length > 0 && (
                <div className="d-flex justify-content-between mb-3">
                  <span><strong>Tổng cộng</strong></span>
                  <span><strong>{Number(totalWithDiscount)}đ</strong></span>
                </div>
              )}

              {cartItem && (
                <div className="d-flex justify-content-between mb-3">
                  <span><strong>Tổng cộng</strong></span>
                  <span><strong>{Number(totalCartItem)}đ</strong></span>
                </div>
              )}

              <Button
                variant="outlined"
                color="primary"
                fullWidth
                onClick={() => setVoucherDialogOpen(true)}
                sx={{ marginBottom: 2 }}
              >
                Chọn Voucher
              </Button>
              <button onClick={handleCheckOut} type="button" className="flex-c-m stext-101 cl2 size-118 bg8 bor13 hov-btn3 p-lr-15 trans-04 pointer m-tb-5" style={{ margin: "70px 0 30px 100px" }}>
                Đặt hàng
              </button>

              <Dialog open={voucherDialogOpen} onClose={() => setVoucherDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Chọn giảm giá</DialogTitle>
                <DialogContent>
                  {localStorage.getItem('token') ? (
                    <List>
                      {discounts.map((discount) => (
                        <ListItem
                          key={discount.id}
                          divider
                          onClick={() => handleApplyVoucher({ id: discount.id, code: discount.discount_code, discount: discount.discount_value })}
                          sx={{ display: 'flex', justifyContent: 'space-between' }}
                        >
                          <img src={logoVoucher} alt="" width={150} />
                          <div style={{ marginLeft: -150 }}>
                            <Typography variant="subtitle1">{discount.discount_code}</Typography>
                            <Typography variant="body2" color="textSecondary">
                              Giảm {discount.discount_value}% | HSD: {discount.end_day}
                            </Typography>
                          </div>
                          <Button variant="contained" size="small" sx={{ backgroundColor: "#717FE0" }}>
                            Áp dụng
                          </Button>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body1" color="textSecondary" align="center" sx={{ fontSize: "25px" }}>
                      Hãy đăng nhập để có voucher.
                    </Typography>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setVoucherDialogOpen(false)} color="primary">
                    Đóng
                  </Button>
                </DialogActions>
              </Dialog>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;