import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Typography, List, Button, Radio, message } from "antd";
import { Product } from "src/types/product";

interface GuestInfo {
  name: string;
  phone: string;
  address: string;
  email: string; // Added email property
}

const OrderDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { guestInfo, products }: { guestInfo: GuestInfo; products: Product[] } =
    location.state || {
      guestInfo: {} as GuestInfo,
      products: [],
    };

  const [paymentMethod, setPaymentMethod] = useState<string>("cash"); // Default payment method

  const handlePayment = () => {
    // Display success message and navigate back to home
    message.success("Đặt hàng thành công!");
    navigate("/");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        background: "#f0f2f5",
        minHeight: "100vh",
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
        <Typography.Title level={2}>Thông tin đặt hàng</Typography.Title>

        <Typography.Title level={4}>Thông tin khách hàng</Typography.Title>
        <Typography.Paragraph>
          <strong>Tên:</strong> {guestInfo.name}
        </Typography.Paragraph>
        <Typography.Paragraph>
          <strong>Số điện thoại:</strong> {guestInfo.phone}
        </Typography.Paragraph>
        <Typography.Paragraph>
          <strong>Địa chỉ:</strong> {guestInfo.address}
        </Typography.Paragraph>
        <Typography.Paragraph>
          <strong>Email:</strong> {guestInfo.email}
        </Typography.Paragraph>

        <Typography.Title level={4}>Sản phẩm đã đặt</Typography.Title>
        <List
          bordered
          dataSource={products}
          renderItem={(product) => (
            <List.Item key={product.id}>
              <Typography.Text>{product.name}</Typography.Text>
              <Typography.Text strong style={{ marginLeft: "auto" }}>
                Giá: ${product.variants[0]?.price}
              </Typography.Text>
              <Typography.Text strong style={{ marginLeft: "auto" }}>
                Kích cỡ: {product.sizes[0]?.name}
              </Typography.Text>
              <Typography.Text strong style={{ marginLeft: "auto" }}>
                Màu sắc: {product.colors[0]?.name}
              </Typography.Text>
            </List.Item>
          )}
        />

        <Typography.Title level={4}>Phương thức thanh toán</Typography.Title>
        <Radio.Group
          onChange={(e) => setPaymentMethod(e.target.value)}
          value={paymentMethod}
          style={{ marginBottom: "20px", display: "block" }}
        >
          <Radio value="cash">Thanh toán bằng tiền mặt</Radio>
          <Radio value="bankTransfer">Thanh toán qua chuyển khoản</Radio>
        </Radio.Group>

        <Button
          type="primary"
          style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
          onClick={handlePayment}
        >
          Thanh toán
        </Button>
        <Button style={{ marginTop: "20px" }}>
          <Link to="/">Trở về trang chủ</Link>
        </Button>
      </div>
    </div>
  );
};

export default OrderDetails;
