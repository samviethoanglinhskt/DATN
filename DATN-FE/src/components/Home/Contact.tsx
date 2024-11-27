import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "src/context/User"; // Import useUser hook
import { notification } from "antd"; // Import Ant Design notification

const Contact: React.FC = () => {
  const { user } = useUser(); // Get user data from UserContext

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loadingUser, setLoadingUser] = useState(true);

  // Set form data based on the user data
  useEffect(() => {
    if (user?.data) {
      setFormData({
        name: user.data.name || "",
        email: user.data.email || "",
        phone: user.data.phone || "",
        message: "", // Initialize with an empty message
      });
      setLoadingUser(false);
    } else {
      setLoadingUser(false); // Set loadingUser to false even if there's no user data
    }
  }, [user]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Lấy token từ localStorage
    const token = localStorage.getItem("token");

    // Kiểm tra token có tồn tại và có định dạng hợp lệ không
    if (!token) {
      console.error("Token không tồn tại.");
      return;
    }

    // Kiểm tra xem token có phải là JWT hợp lệ (3 phần phân cách bằng dấu chấm)
    if (token.split(".").length !== 3) {
      console.error("Token không hợp lệ, vui lòng kiểm tra lại.");
      return;
    }

    // Kiểm tra nếu dữ liệu form không hợp lệ
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.message
    ) {
      console.error("Tất cả các trường thông tin là bắt buộc.");
      return;
    }

    try {
      // Gửi dữ liệu form lên API
      const response = await axios.post(
        "http://127.0.0.1:8000/api/contact",
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          content: formData.message, // API yêu cầu content thay vì message
          status: "new", // Dữ liệu mặc định cho status
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        }
      );

      // Show success notification
      notification.success({
        message: "Success",
        description: "Your message has been sent successfully!",
        onClose: () => {
          window.location.reload(); // Refresh the page after closing the notification
        },
      });

      console.log("Data submitted successfully:", response.data);
    } catch (error: any) {
      console.error("Lỗi khi gửi dữ liệu:", error.response?.data || error);
      notification.error({
        message: "Error",
        description:
          "There was an error sending your message. Please try again.",
      });
    }
  };

  if (loadingUser) {
    return <div>Đang tải thông tin người dùng...</div>;
  }

  return (
    <section className="bg0 p-t-104 p-b-116">
      <div className="container">
        <div className="flex-w flex-tr">
          {/* Form Section */}
          <div className="size-210 bor10 p-lr-70 p-t-55 p-b-70 p-lr-15-lg w-full-md">
            <form onSubmit={handleSubmit}>
              <h4 className="mtext-105 cl2 txt-center p-b-30">
                Gửi tin nhắn cho chúng tôi
              </h4>

              {/* Name Field */}
              <div className="bor8 m-b-20">
                <input
                  className="stext-111 cl2 plh3 size-116 p-lr-28 p-tb-15"
                  type="text"
                  name="name"
                  placeholder="Nhập tên"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              {/* Email Field */}
              <div className="bor8 m-b-20">
                <input
                  className="stext-111 cl2 plh3 size-116 p-lr-28 p-tb-15"
                  type="email"
                  name="email"
                  placeholder="Nhập email của bạn"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Phone Field */}
              <div className="bor8 m-b-20">
                <input
                  className="stext-111 cl2 plh3 size-116 p-lr-28 p-tb-15"
                  type="text"
                  name="phone"
                  placeholder="Nhập số điện thoại"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              {/* Message Field */}
              <div className="bor8 m-b-30">
                <textarea
                  className="stext-111 cl2 plh3 size-120 p-lr-28 p-tb-25"
                  name="message"
                  placeholder="Chúng tôi có thể giúp gì?"
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="flex-c-m stext-101 cl0 size-121 bg3 bor1 hov-btn3 p-lr-15 trans-04 pointer"
              >
                Gửi
              </button>
            </form>
          </div>

          {/* Contact Information Section */}
          <div className="size-210 bor10 flex-w flex-col-m p-lr-93 p-tb-30 p-lr-15-lg w-full-md">
            <div className="flex-w w-full p-b-42">
              <span className="fs-18 cl5 txt-center size-211">
                <span className="lnr lnr-map-marker" />
              </span>
              <div className="size-212 p-t-2">
                <span className="mtext-110 cl2">Địa chỉ của chúng tôi</span>
                <p className="stext-115 cl6 size-213 p-t-18">
                  Trịnh Văn Bô - Nam Từ Liêm
                </p>
              </div>
            </div>
            <div className="flex-w w-full p-b-42">
              <span className="fs-18 cl5 txt-center size-211">
                <span className="lnr lnr-phone-handset" />
              </span>
              <div className="size-212 p-t-2">
                <span className="mtext-110 cl2">Số điện thoại</span>
                <p className="stext-115 cl1 size-213 p-t-18">0352169486</p>
              </div>
            </div>
            <div className="flex-w w-full">
              <span className="fs-18 cl5 txt-center size-211">
                <span className="lnr lnr-envelope" />
              </span>
              <div className="size-212 p-t-2">
                <span className="mtext-110 cl2">Hỗ Trợ</span>
                <p className="stext-115 cl1 size-213 p-t-18">linh@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
