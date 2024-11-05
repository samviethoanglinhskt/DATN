import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Radio, message } from "antd";

const Payment: React.FC = () => {
  const [form] = Form.useForm();
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const navigate = useNavigate();

  const handleFinish = (values: any) => {
    console.log("Payment Info:", values);
    // Display success message
    message.success("Đặt hàng thành công!");
    // Navigate back to home
    navigate("/");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "20px",
        backgroundColor: "#f0f2f5",
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
        <h2>Thông tin thanh toán</h2>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item label="Tên" name="name">
            <Input placeholder="Nhập tên của bạn" />
          </Form.Item>

          <Form.Item label="Số điện thoại" name="phone">
            <Input placeholder="Nhập số điện thoại của bạn" />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input placeholder="Nhập email của bạn" />
          </Form.Item>

          <Form.Item label="Voucher" name="voucher">
            <Input placeholder="Nhập mã voucher (nếu có)" />
          </Form.Item>

          <Form.Item label="Phương thức thanh toán">
            <Radio.Group
              onChange={(e) => setPaymentMethod(e.target.value)}
              value={paymentMethod}
            >
              <Radio value="cash">Thanh toán bằng tiền mặt</Radio>
              <Radio value="bankTransfer">Thanh toán qua chuyển khoản</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Đặt hàng
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Payment;
