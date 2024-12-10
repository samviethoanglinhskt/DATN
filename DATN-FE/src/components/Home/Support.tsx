import React from "react";

const Support = () => {
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

      {/* Right Column: FAQ Section */}
      <div style={{ width: "100%", marginTop: "20px" }}>
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
            gửi email thông báo kết quả. Nếu bạn cần hỗ trợ thêm, vui lòng liên
            hệ qua email.
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
  );
};

export default Support;
