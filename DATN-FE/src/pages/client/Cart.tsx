import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from 'src/context/Cart';

interface CartItem {
  tb_product_id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

const ShoppingCart: React.FC = () => {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    reduceCartItemQuantity,
    upCartItemQuantity,
  } = useCart();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  const handleSelectItem = (id: number) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(item => item.tb_product_id));
    }
  };

  const calculateSelectedTotal = () => {
    return cartItems
      .filter(item => selectedItems.includes(item.tb_product_id))
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateSelectedDelivery = () => {
    return selectedItems.length * 15;
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      return;
    }

    setLoading(true);

    try {
      // Lọc ra các sản phẩm đã chọn
      const selectedProducts = cartItems.filter(item => 
        selectedItems.includes(item.tb_product_id)
      );

      // Tính toán các giá trị
      const subtotal = calculateSelectedTotal();
      const delivery = calculateSelectedDelivery();
      const total = subtotal + delivery;

      // Chuyển đến trang checkout với dữ liệu
      navigate("/checkout", {
        state: {
          selectedProducts,
          subtotal,
          delivery,
          total
        }
      });
    } catch (error) {
      console.error('Error during checkout:', error);
    } finally {
      setLoading(false);
    }
  };

  // Render giỏ hàng trống
  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="card shadow-sm">
          <div className="card-body py-5">
            <h3 className="card-title mb-4">Giỏ hàng của bạn đang trống</h3>
            <p className="text-muted mb-4">Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/")}
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          <li className="breadcrumb-item active">Giỏ hàng</li>
        </ol>
      </nav>

      <h1 className="h3 mb-4">Giỏ hàng của bạn</h1>

      {/* Cart Table */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedItems.length === cartItems.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Sản phẩm</th>
                  <th className="text-center">Đơn giá</th>
                  <th className="text-center">Số lượng</th>
                  <th className="text-center">Tổng tiền</th>
                  <th className="text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.tb_product_id}>
                    <td>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedItems.includes(item.tb_product_id)}
                        onChange={() => handleSelectItem(item.tb_product_id)}
                      />
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={item.image || "/api/placeholder/80/80"}
                          alt={item.name}
                          className="rounded me-3"
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                        />
                        <div>
                          <h6 className="mb-1">{item.name}</h6>
                          <small className="text-muted">ID: {item.tb_product_id}</small>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">${item.price.toFixed(2)}</td>
                    <td>
                      <div className="d-flex justify-content-center align-items-center gap-2">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => reduceCartItemQuantity(item.tb_product_id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <input
                          type="text"
                          className="form-control form-control-sm text-center"
                          style={{ width: '50px' }}
                          value={item.quantity}
                          readOnly
                        />
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => upCartItemQuantity(item.tb_product_id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="text-center fw-bold text-primary">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeFromCart(item.tb_product_id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Cart Summary */}
      <div className="row justify-content-end">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">Tổng đơn hàng</h5>
              <div className="d-flex justify-content-between mb-2">
                <span>Tạm tính ({selectedItems.length} sản phẩm)</span>
                <span>${calculateSelectedTotal().toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Phí vận chuyển</span>
                <span>${calculateSelectedDelivery().toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between border-top pt-3">
                <strong>Tổng cộng</strong>
                <strong className="text-primary">
                  ${(calculateSelectedTotal() + calculateSelectedDelivery()).toFixed(2)}
                </strong>
              </div>

              <div className="d-grid gap-2 mt-3">
                <button
                  className="btn btn-primary"
                  onClick={handleCheckout}
                  disabled={selectedItems.length === 0 || loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Đang xử lý...
                    </>
                  ) : (
                    `Thanh toán (${selectedItems.length} sản phẩm)`
                  )}
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={clearCart}
                  disabled={loading}
                >
                  Xóa toàn bộ giỏ hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;