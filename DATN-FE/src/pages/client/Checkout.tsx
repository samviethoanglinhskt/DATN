import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from 'src/context/User';

interface Product {
  id: number;
  products: {
    name: string;
  };
  variant: {
    size?: { name: string };
    color?: { name: string };
    price: number;
  };
  quantity: number;
}

interface LocationState {
  selectedProducts: Product[];
  subtotal: number;
  total: number;
  cartId: number[];
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
  const total = state?.total ?? 0;
  const cartId = state?.cartId || [];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else if (!selectedProducts.length) {
      navigate("/cart");
    }
  }, [navigate, selectedProducts]);

  useEffect(() => {
    if (user?.data) {
      setName(user.data.name || '');
      setEmail(user.data.email || '');
      setPhone(user.data.phone || '');
      setAddress(user.data.address || '');
      setLoadingUser(false);
    } else {
      setLoadingUser(false);
    }
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
      const response = await fetch('http://localhost:8000/api/cart/check-out-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          address,
          total_amount: total,
          cart_items: cartId,
        })
      });

      if (!response.ok) {
        const errorMessage = await response.text(); // Trích xuất lỗi nếu có
        throw new Error(errorMessage || 'Thanh toán thất bại');
      }
      // navigate('/order-success', {
      //   state: {
      //     orderDetails: { products: selectedProducts, total, address },
      //   },
      // });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


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
            Home
            <i className="fa fa-angle-right m-l-9 m-r-10" aria-hidden="true"></i>
          </button>
          <button onClick={() => navigate("/cart")} className="stext-109 cl8 hov-cl1 trans-04">
            Giỏ hàng
            <i className="fa fa-angle-right m-l-9 m-r-10" aria-hidden="true"></i>
          </button>
          <span className="stext-109 cl4">Shopping Cart</span>
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
                  <label className="form-label">Địa chỉ giao hàng *</label>
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
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">Đơn hàng của bạn</h5>
              <div className="mb-4">
                {selectedProducts.map((item) => (
                  <div key={item.id} className="d-flex gap-3 mb-3 pb-3 border-bottom">
                    <img src="https://picsum.photos/300/300" className="rounded" style={{ width: '64px', height: '64px', objectFit: 'cover' }} />
                    <div className="flex-grow-1">
                      <p className="mb-0" style={{ fontSize: 15 }}>{item.products.name}</p>
                      <div>
                        {item.variant.size && item.variant.size !== null ? (
                          <small>{item.variant.size.name} | SL: {item.quantity}</small>
                        ) : (
                          null
                        )}
                        {item.variant.color && item.variant.color !== null ? (
                          <small>{item.variant.color.name} | SL: {item.quantity}  </small>
                        ) : (
                          null
                        )}
                        {!item.variant.size && !item.variant.color ? (
                          <small>SL: {item.quantity}</small>
                        ) : (
                          null
                        )}
                      </div>

                      {/* Kiểm tra nếu biến thể và giá tồn tại */}
                      <span>{item.variant.price}$</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Tạm tính</span>
                <span>{subtotal.toFixed(2)} $</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span><strong>Tổng cộng</strong></span>
                <span><strong>{Number(total).toFixed(2)} $</strong></span>
              </div>

              <button onClick={handleCheckOut} type="button" className="flex-c-m stext-101 cl2 size-118 bg8 bor13 hov-btn3 p-lr-15 trans-04 pointer m-tb-5" style={{ margin: "70px 0 30px 100px" }}>
                Đặt hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
