import React, { useState } from "react";

const Support = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    productName: "",
    orderNumber: "",
    reason: "",
    returnMethod: "",
    isUnopened: false,
    additionalInfo: "",
    image: null,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý dữ liệu biểu mẫu (có thể gửi lên server hoặc làm gì đó)
  };

  return (
    <div
      style={{
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
        lineHeight: "1.6",
      }}
    >
      {/* Header */}
      <header
        style={{ textAlign: "center", marginBottom: "30px", marginTop: "50px" }}
      >
        <h1 style={{ fontSize: "36px", color: "#333" }}>
          Tôi có thể trả lại hàng mà tôi đã mua không?
        </h1>
        <p style={{ fontSize: "18px", color: "#777" }}>
          Chúng tôi sẵn lòng trao đổi hoặc hoàn lại tiền cho một mặt hàng bạn đã
          mua từ chúng tôi - chỉ cần liên hệ trong vòng 15 ngày kể từ ngày bạn
          đặt hàng.
        </p>
      </header>

      {/* Chính sách đổi trả hàng */}
      <section style={{ marginBottom: "40px", marginLeft: "20px" }}>
        <h2 style={{ fontSize: "24px", marginBottom: "15px" }}>
          Quy trình đổi trả hàng
        </h2>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          {/* Điều kiện chính sách */}
          <div style={{ width: "48%", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "20px", color: "#333" }}>Đổi ý</h3>
            <p style={{ fontSize: "16px", color: "#555" }}>
              Nếu bạn thay đổi ý, sản phẩm phải còn nguyên vẹn, chưa mở và chưa
              sử dụng.
            </p>
          </div>
          <div style={{ width: "48%", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "20px", color: "#333" }}>Sản phẩm lỗi</h3>
            <p style={{ fontSize: "16px", color: "#555" }}>
              Nếu sản phẩm bạn nhận bị lỗi, vui lòng cung cấp mô tả chi tiết và
              ảnh minh họa.
            </p>
          </div>
          <div style={{ width: "48%", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "20px", color: "#333" }}>Bị dị ứng</h3>
            <p style={{ fontSize: "16px", color: "#555" }}>
              Trong trường hợp dị ứng, ngừng sử dụng ngay và gửi ảnh để chúng
              tôi xử lý.
            </p>
          </div>
          <div style={{ width: "48%", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "20px", color: "#333" }}>
              Sản phẩm không đúng/Hỏng do vận chuyển
            </h3>
            <p style={{ fontSize: "16px", color: "#555" }}>
              Chụp ảnh sản phẩm và liên hệ trong vòng 7 ngày nếu sản phẩm bị
              hỏng hoặc không đúng.
            </p>
          </div>
        </div>
      </section>

      {/* Quy trình đổi trả hàng */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "20px",
        }}
      >
        {/* Left Column: Biểu mẫu yêu cầu đổi trả */}
        <div style={{ width: "48%" }}>
          <h2
            style={{ fontSize: "24px", color: "#6c4f37", marginBottom: "15px" }}
          >
            Biểu mẫu yêu cầu đổi trả
          </h2>
          <p style={{ fontSize: "16px", marginBottom: "15px" }}>
            Vui lòng hoàn thành biểu mẫu này để đổi trả lại sản phẩm. Nếu bạn
            đang trả lại nhiều mặt hàng từ các đơn đặt hàng khác nhau, bạn phải
            thực hiện mỗi biểu mẫu này cho một đơn đặt hàng.
          </p>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {/* Form Fields */}
            <input
              type="text"
              name="firstName"
              placeholder="Họ*"
              value={formData.firstName}
              onChange={handleChange}
              required
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Tên*"
              value={formData.lastName}
              onChange={handleChange}
              required
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="email"
              name="email"
              placeholder="Email*"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Điện thoại*"
              value={formData.phone}
              onChange={handleChange}
              required
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="text"
              name="productName"
              placeholder="Tên sản phẩm*"
              value={formData.productName}
              onChange={handleChange}
              required
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="text"
              name="orderNumber"
              placeholder="Số hoá đơn*"
              value={formData.orderNumber}
              onChange={handleChange}
              required
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            <textarea
              name="reason"
              placeholder="Lý do đổi/trả*"
              value={formData.reason}
              onChange={handleChange}
              required
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                height: "100px",
              }}
            />
            <h5>Phương thức đổi trả</h5>
            <select
              name="returnMethod"
              value={formData.returnMethod}
              onChange={handleChange}
              required
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            >
              <option value="">— Vui lòng chọn —</option>
              <option value="refund">Hoàn tiền</option>
              <option value="exchange">Đổi sản phẩm</option>
            </select>

            <textarea
              name="additionalInfo"
              placeholder="Bạn có thông tin bổ sung gì thêm không?"
              value={formData.additionalInfo}
              onChange={handleChange}
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                height: "100px",
              }}
            />
            <div style={{ marginTop: "10px" }}>
              <label
                style={{
                  display: "inline-block",
                  fontSize: "16px",
                  color: "#333",
                  marginBottom: "5px",
                }}
              >
                Tải ảnh (nếu có)
              </label>
              <input
                type="file"
                accept="image/*"
                // onChange={(e) =>
                //   setFormData({ ...formData, image: e.target.files?.[0] })
                // }
                style={{
                  display: "block",
                  padding: "10px",
                  fontSize: "16px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                backgroundColor: "#6c4f37",
                color: "#fff",
                fontSize: "18px",
                padding: "15px 25px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
                marginTop: "20px",
              }}
            >
              Gửi yêu cầu
            </button>
          </form>
        </div>

        {/* Right Column: FAQ Section */}
        <div style={{ width: "48%" }}>
          <h2
            style={{
              fontSize: "24px",
              color: "#6c4f37",
              marginBottom: "15px",
            }}
          >
            Câu hỏi thường gặp (FAQ)
          </h2>
          <div
            style={{
              backgroundColor: "#f9f9f9",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>
              1. Làm sao để tôi biết được yêu cầu đổi trả của tôi đã được chấp
              nhận?
            </h3>
            <p style={{ fontSize: "16px", color: "#555" }}>
              Sau khi chúng tôi nhận được yêu cầu đổi trả của bạn, chúng tôi sẽ
              gửi email thông báo kết quả. Nếu bạn cần hỗ trợ thêm, vui lòng
              liên hệ qua email.
            </p>

            <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>
              2. Tôi cần gửi lại sản phẩm trong bao lâu?
            </h3>
            <p style={{ fontSize: "16px", color: "#555" }}>
              Bạn cần gửi sản phẩm trong vòng 15 ngày kể từ ngày nhận hàng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
