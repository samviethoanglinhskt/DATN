import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "src/context/User"; // Import useUser hook
import { notification } from "antd"; // Import Ant Design notification
import moment from "moment-timezone"; // Import moment-timezone for date manipulation

const Contact: React.FC = () => {
  const { user } = useUser(); // Get user data from UserContext
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [contacts, setContacts] = useState<any[]>([]); // Initialize as empty array
  const [loadingUser, setLoadingUser] = useState(true);

  // Set form data based on the user data
  useEffect(() => {
    if (user?.data) {
      setFormData({
        name: user.data.user.name || "",
        email: user.data.user.email || "",
        phone: user.data.user.phone || "",
        message: "", // Initialize with an empty message
      });
    }
    setLoadingUser(false);
  }, [user]);

  // Fetch contact list from API for the logged-in user
  const fetchContacts = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const url = token ? "http://127.0.0.1:8000/api/getByUser" : "";

      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      if (url) {
        const response = await axios.get(url, { headers });

        // Convert timestamps to Vietnam timezone (UTC+7) for each contact
        const updatedContacts = response.data.data.map((contact: any) => ({
          ...contact,
          created_at: moment(contact.created_at)
            .tz("Asia/Ho_Chi_Minh")
            .format("YYYY-MM-DD HH:mm:ss"),
        }));

        setContacts(updatedContacts); // Set the contacts with formatted timestamps
      } else {
        setContacts([]); // If no token, do not fetch contacts
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setContacts([]); // In case of error, ensure contacts is still an array
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []); // Run once on mount

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

    const token = sessionStorage.getItem("token");
    const url = token
      ? "http://127.0.0.1:8000/api/add-contact"
      : "http://127.0.0.1:8000/api/add-contact-guest";

    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.message
    ) {
      console.error("All fields are required.");
      return;
    }

    try {
      await axios.post(
        url,
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          content: formData.message,
        },
        { headers }
      );

      notification.success({
        message: "Success",
        description: "Bạn đã gửi yêu cầu thành công!",
      });

      // If the user is a guest, show additional notification to login
      if (!token) {
        notification.info({
          message: "Notice",
          description: "Vui lòng đăng nhập để xem yêu cầu hỗ trợ của bạn.",
        });
      }

      setFormData({ name: "", email: "", phone: "", message: "" }); // Reset form
      fetchContacts();
    } catch (error: any) {
      console.error("Error submitting form:", error.response?.data || error);
      notification.error({
        message: "Error",
        description:
          "There was an error sending your message. Please try again.",
      });
    }
  };

  if (loadingUser) {
    return <div>Loading user information...</div>;
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
                  placeholder="Nhập email"
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
                  placeholder="Chúng tôi có thể giúp gì cho bạn?"
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

          {/* Contact List Section */}
          <div className="size-210 bor10 flex-w flex-col-m p-lr-93 p-tb-30 p-lr-15-lg w-full-md">
            <h4 className="mtext-105 cl2 txt-center p-b-30">
              Yêu cầu hỗ trợ của bạn
            </h4>

            {/* Check if contacts is not empty */}
            {contacts.length === 0 ? (
              <p>Không có yêu cầu nào.</p>
            ) : (
              contacts.map((contact: any) => (
                <div key={contact.id} className="contact-card">
                  <p>
                    <strong>Tên:</strong> {contact.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {contact.email}
                  </p>
                  <p>
                    <strong>Số điện thoại:</strong> {contact.phone}
                  </p>
                  <p>
                    <strong>Yêu cầu hỗ trợ :</strong> {contact.content}
                  </p>
                  <p>
                    <strong>Trạng thái:</strong> {contact.status}
                  </p>
                  <p>
                    <strong>Ngày yêu cầu hỗ trợ:</strong> {contact.created_at}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
