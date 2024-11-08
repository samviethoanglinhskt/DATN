import { List, Button, Typography, Divider, Space } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "src/context/Cart";

const { Title, Text } = Typography;

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    reduceCartItemQuantity,
    upCartItemQuantity,
  } = useCart();
  const navigate = useNavigate();

  // Kiểm tra token trong localStorage để xác định người dùng đã đăng nhập hay chưa
  useEffect(() => {
    const token = localStorage.getItem("token");

    // Nếu không có token (người dùng chưa đăng nhập), chuyển hướng về trang đăng nhập
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return <Text type="secondary" style={{ fontSize: "30px", margin: "100px" }}>Giỏ hàng của bạn đang trống.</Text>;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh", // Full viewport height
        padding: "20px",
        backgroundColor: "#f0f2f5", // Optional: Background color for better visibility
      }}
    >
      <div
        style={{
          maxWidth: 600,
          width: "100%",
          padding: "20px",
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Title level={2}>Giỏ hàng</Title>
        <List
          bordered
          dataSource={cartItems}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  onClick={() =>
                    reduceCartItemQuantity(item.tb_product_id, item.quantity - 1)
                  }
                  disabled={item.quantity <= 1}
                >
                  -
                </Button>,
                <Text>{item.quantity}</Text>,
                <Button
                  onClick={() => upCartItemQuantity(item.tb_product_id, item.quantity + 1)}
                >
                  +
                </Button>,
                <Button
                  onClick={() => removeFromCart(item.tb_product_id)}
                  type="link"
                  danger
                >
                  Xóa
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={<Text strong>{item.name}</Text>}
                description={`Price: $${item.price} x ${item.quantity}`}
              />
            </List.Item>
          )}
        />
        <Divider />
        <Space
          direction="vertical"
          style={{ width: "100%", textAlign: "right" }}
        >
          <Title level={4}>Tổng tiền: ${totalPrice.toFixed(2)}</Title>
          <Button onClick={clearCart} type="primary" danger>
            Xóa toàn bộ giỏ hàng
          </Button>
          <Button
            type="primary"
            style={{ marginTop: "10px" }}
            onClick={() => navigate("/payment")}
          >
            Thanh toán
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default Cart;
