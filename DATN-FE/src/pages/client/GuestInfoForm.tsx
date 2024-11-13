import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Input, Button, List, Typography } from "antd";
import { Product } from "src/types/product";

const GuestInfoForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const products: Product[] = location.state?.products || [];
  const selectedSize = location.state?.selectedSize;
  const selectedColor = location.state?.selectedColor;

  const handleFormSubmit = (values: any) => {
    console.log("Guest Information:", values);
    console.log("Purchased Products:", products);
    alert("Thông tin của bạn đã được gửi thành công!");

    // Navigate to OrderDetails with guest info and products
    navigate("/order-details", {
      state: { guestInfo: values, products, selectedSize, selectedColor },
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
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
        <Typography.Title level={3}>Thông tin khách hàng</Typography.Title>
        <Form layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            label="Tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên của bạn" }]}
          >
            <Input placeholder="Nhập tên của bạn" />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại" },
              { pattern: /^\d+$/, message: "Số điện thoại không hợp lệ" },
            ]}
          >
            <Input placeholder="Nhập số điện thoại của bạn" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email của bạn" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input placeholder="Nhập email của bạn" />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
          >
            <Input.TextArea placeholder="Nhập địa chỉ của bạn" />
          </Form.Item>

          <Typography.Title level={4}>Sản phẩm đã chọn</Typography.Title>
          <List
            dataSource={products}
            renderItem={(product) => (
              <List.Item key={product.id}>
                <Typography.Text>
                  {product.name} - Kích thước:{" "}
                  {product.sizes.find((size) => size.id === selectedSize)
                    ?.name || "Chưa chọn"}{" "}
                  - Giá: {product.variants[0]?.price}$ - Màu sắc:{" "}
                  {product.colors.find((color) => color.id === selectedColor)
                    ?.name || "Chưa chọn"}
                </Typography.Text>
              </List.Item>
            )}
          />

          <Form.Item style={{ marginTop: "20px" }}>
            <Button type="primary" htmlType="submit">
              Gửi thông tin
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default GuestInfoForm;
