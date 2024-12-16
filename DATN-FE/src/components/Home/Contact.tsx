import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "src/context/User";
import {
  Form,
  Input,
  Button,
  notification,
  Card,
  Timeline,
  Spin,
  Empty,
  Typography,
  Badge,
  Divider,
  Space
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  MessageOutlined,
  SendOutlined,
  HistoryOutlined
} from "@ant-design/icons";
import moment from "moment-timezone";

const { TextArea } = Input;
const { Title, Text } = Typography;

const Contact: React.FC = () => {
  const { user } = useUser();
  const [form] = Form.useForm();
  const [contacts, setContacts] = useState<any[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.data) {
      form.setFieldsValue({
        name: user.data.user.name || "",
        email: user.data.user.email || "",
        phone: user.data.user.phone || "",
        message: "",
      });
    }
    setLoadingUser(false);
  }, [user, form]);

  const fetchContacts = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const url = token ? "http://127.0.0.1:8000/api/getByUser" : "";
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      if (url) {
        const response = await axios.get(url, { headers });
        const updatedContacts = response.data.data.map((contact: any) => ({
          ...contact,
          created_at: moment(contact.created_at)
            .tz("Asia/Ho_Chi_Minh")
            .format("YYYY-MM-DD HH:mm:ss"),
        }));
        setContacts(updatedContacts);
      } else {
        setContacts([]);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setContacts([]);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    const token = sessionStorage.getItem("token");
    const url = token
      ? "http://127.0.0.1:8000/api/add-contact"
      : "http://127.0.0.1:8000/api/add-contact-guest";
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    try {
      await axios.post(
        url,
        {
          name: values.name,
          email: values.email,
          phone: values.phone,
          content: values.message,
        },
        { headers }
      );

      notification.success({
        message: "Success",
        description: "Bạn đã gửi yêu cầu thành công!",
      });

      if (!token) {
        notification.info({
          message: "Notice",
          description: "Vui lòng đăng nhập để xem yêu cầu hỗ trợ của bạn.",
        });
      }

      form.resetFields();
      fetchContacts();
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: "There was an error sending your message. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="text-center p-5">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="container py-5 mt-5">
      <div style={{ marginTop: 10 }}>
        <div className="bread-crumb flex-w p-l-25 p-r-15 p-t-30 p-lr-0-lg">
          <a
            href="/"
            className="stext-109 cl8 hov-cl1 trans-04"
          >
            Trang chủ
            <i
              className="fa fa-angle-right m-l-9 m-r-10"
              aria-hidden="true"
            ></i>
          </a>
          <span className="stext-109 cl4">Liên hệ</span>
        </div>
      </div>

      <div className="row g-4" style={{ marginTop: 50 }}>
        {/* Contact Form Section */}
        <div className="col-12 col-lg-6">
          <Card
            title={
              <Title level={4} className="text-center mb-0">
                <MessageOutlined className="me-2" />
                Gửi tin nhắn cho chúng tôi
              </Title>
            }
            className="shadow-sm h-100"
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              className="p-3"
            >
              <Form.Item
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
              >
                <Input
                  prefix={<UserOutlined className="text-secondary" />}
                  placeholder="Nhập tên"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" }
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-secondary" />}
                  placeholder="Nhập email"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="phone"
                rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
              >
                <Input
                  prefix={<PhoneOutlined className="text-secondary" />}
                  placeholder="Nhập số điện thoại"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="message"
                rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
              >
                <TextArea
                  placeholder="Chúng tôi có thể giúp gì cho bạn?"
                  rows={4}
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SendOutlined />}
                  loading={submitting}
                  size="large"
                  block
                  className="bg-gradient-to-r from-blue-500 to-blue-700"
                >
                  Gửi yêu cầu
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>

        {/* Contact History Section */}
        <div className="col-12 col-lg-6">
          <Card
            title={
              <Title level={4} className="text-center mb-0">
                <HistoryOutlined className="me-2" />
                Lịch sử yêu cầu hỗ trợ
              </Title>
            }
            className="shadow-sm h-100"
          >
            {contacts.length === 0 ? (
              <Empty
                description="Không có yêu cầu hỗ trợ nào"
                className="py-5"
              />
            ) : (
              <Timeline className="p-4">
                {contacts.map((contact) => (
                  <Timeline.Item
                    key={contact.id}
                    color={contact.status === 'Đã xử lý' ? 'green' : 'blue'}
                  >
                    <Card className="shadow-sm mb-3">
                      <Space direction="vertical" className="w-100">
                        <Badge
                          status={contact.status === 'Đã xử lý' ? 'success' : 'processing'}
                          text={<Text strong>{contact.status}</Text>}
                        />
                        <Divider className="my-2" />
                        <Text><UserOutlined className="me-2" />{contact.name}</Text>
                        <Text><MailOutlined className="me-2" />{contact.email}</Text>
                        <Text><PhoneOutlined className="me-2" />{contact.phone}</Text>
                        <Text strong className="mt-2">Nội dung:</Text>
                        <Text className="bg-gray-50 p-3 rounded">{contact.content}</Text>
                        <Text type="secondary" className="mt-2">
                          Ngày gửi: {contact.created_at}
                        </Text>
                      </Space>
                    </Card>
                  </Timeline.Item>
                ))}
              </Timeline>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;