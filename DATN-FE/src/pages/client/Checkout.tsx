import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from 'src/context/Cart';

interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface LocationState {
  selectedProducts: any[];
  subtotal: number;
  delivery: number;
  total: number;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [addressError, setAddressError] = useState('');

  // Lấy thông tin sản phẩm đã chọn từ location state
  const state = location.state as LocationState;
  const selectedProducts = state?.selectedProducts || [];
  const subtotal = state?.subtotal || 0;
  const delivery = state?.delivery || 0;
  const total = state?.total || 0;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Kiểm tra xem có sản phẩm được chọn không
    if (!selectedProducts || selectedProducts.length === 0) {
      navigate("/cart");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (err) {
        setError('Failed to load user information');
      }
    };

    fetchUserData();
  }, [navigate, selectedProducts]);

  const validateForm = () => {
    let isValid = true;
    
    if (!address.trim()) {
      setAddressError('Địa chỉ không được để trống');
      isValid = false;
    } else {
      setAddressError('');
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!selectedProducts || selectedProducts.length === 0) {
      setError('Không có sản phẩm nào được chọn để thanh toán');
      return;
    }

    if (!userData?.id) {
      setError('Không tìm thấy thông tin người dùng');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem("token");
      const response = await fetch('http://127.0.0.1:8000/api/cart/check-out-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: userData.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          address: address,
          total_amount: total,
          cart_items: selectedProducts.map(item => ({
            product_id: item.tb_product_id,
            quantity: item.quantity
          }))
        })
      });

      if (response.ok) {
        // Xóa các sản phẩm đã thanh toán khỏi giỏ hàng
        clearCart();
        navigate('/order-success', {
          state: {
            orderDetails: {
              products: selectedProducts,
              total: total,
              address: address
            }
          }
        });
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Thanh toán thất bại');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi thanh toán');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <button 
              className="btn btn-link p-0 text-decoration-none"
              onClick={() => navigate("/")}
            >
              Trang chủ
            </button>
          </li>
          <li className="breadcrumb-item">
            <button 
              className="btn btn-link p-0 text-decoration-none"
              onClick={() => navigate("/cart")}
            >
              Giỏ hàng
            </button>
          </li>
          <li className="breadcrumb-item active">Thanh toán</li>
        </ol>
      </nav>

      <h1 className="h3 mb-4">Thanh Toán</h1>

      {/* Thông tin số sản phẩm đã chọn */}
      <div className="alert alert-info mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <span>
            <strong>Thông tin đơn hàng: </strong> 
            {selectedProducts.length} sản phẩm được chọn thanh toán
          </span>
          <button 
            className="btn btn-outline-primary btn-sm"
            onClick={() => navigate("/cart")}
          >
            Chỉnh sửa
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column - Payment Form */}
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">Thông tin giao hàng</h5>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Họ tên</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={userData?.name || ''}
                    
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control bg-light"
                    value={userData?.email || ''}
                   
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Số điện thoại</label>
                  <input
                    type="tel"
                    className="form-control bg-light"
                    value={userData?.phone || ''}
                   
                  />
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
                  {addressError && (
                    <div className="invalid-feedback">
                      {addressError}
                    </div>
                  )}
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      Xác nhận thanh toán 
                      <span className="ms-2">${total.toFixed(2)}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">Đơn hàng của bạn</h5>

              {/* Selected Products */}
              <div className="mb-4">
                {selectedProducts.map((item) => (
                  <div key={item.tb_product_id} className="d-flex gap-3 mb-3 pb-3 border-bottom">
                    <img
                      src="/api/placeholder/80/80"
                      alt={item.name}
                      className="rounded"
                      style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-1">{item.name}</h6>
                      <div className="text-muted small">Số lượng: {item.quantity}</div>
                      <div className="text-primary fw-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="border-top pt-3">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Tạm tính</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Phí vận chuyển</span>
                  <span>${delivery.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between pt-3 border-top mt-3">
                  <span className="fw-bold">Tổng cộng</span>
                  <span className="text-primary fw-bold h5 mb-0">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;