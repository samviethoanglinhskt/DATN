import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "src/context/Cart";

// Base styles
const tableHeaderStyles: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "45% 15% 25% 15%", // Adjusted for better quantity control space
  padding: "16px 0",
  borderBottom: "1px solid #e5e7eb",
  alignItems: "center",
  width: "100%",
  maxWidth: "1400px", // Increased max width
  margin: "0 auto",
};

const tableRowStyles: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "45% 15% 25% 15%", // Matching header columns
  padding: "16px 0",
  borderBottom: "1px solid #e5e7eb",
  alignItems: "center",
  width: "100%",
};

const quantityControlStyles: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  width: "100%",
};

const buttonBaseStyles: React.CSSProperties = {
  width: "36px",
  height: "36px",
  border: "1px solid #e5e7eb",
  background: "white",
  borderRadius: "4px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "18px",
};

const Cart: React.FC = () => {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    reduceCartItemQuantity,
    upCartItemQuantity,
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
      .reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateSelectedDelivery = () => {
    return selectedItems.length * 15;
  };

  if (cartItems.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <p style={{ color: "#6b7280", fontSize: "24px" }}>
          Giỏ hàng của bạn đang trống.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1400px", // Increased max width
        margin: "0 auto",
        padding: "24px",
        width: "95%", // Added to ensure some margin on smaller screens
      }}
    >
      <h1
        style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px" }}
      >
        Giỏ hàng
      </h1>

      <div style={tableHeaderStyles}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <input
            type="checkbox"
            checked={selectedItems.length === cartItems.length}
            onChange={handleSelectAll}
            style={{ width: "20px", height: "20px" }}
          />
          <span style={{ color: "#6b7280" }}>Product</span>
        </div>
        <span style={{ textAlign: "center", color: "#6b7280" }}>
          Phí giao hàng
        </span>
        <span style={{ textAlign: "center", color: "#6b7280" }}>Quantity</span>
        <span style={{ textAlign: "center", color: "#6b7280" }}>Total</span>
      </div>

      {cartItems.map((item) => (
        <div key={item.tb_product_id} style={tableRowStyles}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <input
              type="checkbox"
              checked={selectedItems.includes(item.tb_product_id)}
              onChange={() => handleSelectItem(item.tb_product_id)}
              style={{ width: "20px", height: "20px" }}
            />
            <img
              src="/api/placeholder/80/80"
              alt={item.name}
              style={{ width: "80px", height: "80px", objectFit: "cover" }}
            />
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: "bold" }}>
                {item.name}
              </h3>
              <p style={{ color: "#6b7280", fontSize: "14px" }}>
                Product ID: {item.tb_product_id}
              </p>
              <p style={{ color: "#4f46e5", marginTop: "4px" }}>
                ${item.price.toFixed(2)}
              </p>
              <button
                onClick={() => removeFromCart(item.tb_product_id)}
                style={{
                  color: "#dc2626",
                  marginTop: "4px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Xóa
              </button>
            </div>
          </div>

          <div style={{ textAlign: "center" }}>$15.00</div>

          <div style={quantityControlStyles}>
            <button
              onClick={() =>
                reduceCartItemQuantity(item.tb_product_id, item.quantity - 1)
              }
              disabled={item.quantity <= 1}
              style={{
                ...buttonBaseStyles,
                opacity: item.quantity <= 1 ? 0.5 : 1,
              }}
            >
              -
            </button>
            <input
              type="text"
              value={item.quantity}
              readOnly
              style={{
                width: "60px",
                height: "36px",
                textAlign: "center",
                border: "1px solid #e5e7eb",
                borderRadius: "4px",
                fontSize: "16px",
              }}
            />
            <button
              onClick={() =>
                upCartItemQuantity(item.tb_product_id, item.quantity + 1)
              }
              style={buttonBaseStyles}
            >
              +
            </button>
          </div>

          <div
            style={{
              textAlign: "center",
              color: "#4f46e5",
              fontWeight: "bold",
            }}
          >
            ${(item.price * item.quantity).toFixed(2)}
          </div>
        </div>
      ))}

      <div
        style={{
          marginTop: "24px",
          padding: "20px",
          background: "#f9fafb",
          borderRadius: "8px",
          maxWidth: "400px",
          marginLeft: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <span>Tổng đơn hàng đã chọn</span>
          <span>${calculateSelectedTotal().toFixed(2)}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <span>Phí giao hàng</span>
          <span>${calculateSelectedDelivery().toFixed(2)}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #e5e7eb",
            paddingTop: "12px",
            fontWeight: "bold",
          }}
        >
          <span>Total</span>
          <span style={{ color: "#4f46e5" }}>
            $
            {(calculateSelectedTotal() + calculateSelectedDelivery()).toFixed(
              2
            )}
          </span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "16px",
          marginTop: "24px",
        }}
      >
        <button
          onClick={clearCart}
          style={{
            padding: "12px 24px",
            background: "#fee2e2",
            color: "#dc2626",
            border: "none",
            borderRadius: "9999px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Xóa toàn bộ giỏ hàng
        </button>
        <button
          onClick={() => navigate("/payment")}
          disabled={selectedItems.length === 0}
          style={{
            padding: "12px 24px",
            background: "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: "9999px",
            cursor: selectedItems.length === 0 ? "not-allowed" : "pointer",
            opacity: selectedItems.length === 0 ? 0.5 : 1,
            fontSize: "16px",
          }}
        >
          Thanh toán
        </button>
      </div>
    </div>
  );
};

export default Cart;
