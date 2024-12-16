import React, { useState, useEffect } from "react";
import { Card, Row, Col, Typography, Skeleton, Modal } from "antd";
import { ClockCircleOutlined, FileTextOutlined } from "@ant-design/icons";
import axios from "axios";
import "./Blog.css";

const { Title, Text } = Typography;

const Blog: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [posts, setPosts] = useState<any[]>([]); // Dữ liệu bài viết
  const [loading, setLoading] = useState<boolean>(true); // Trạng thái loading
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // Trạng thái hiển thị modal
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedPost, setSelectedPost] = useState<any>(null); // Bài viết được chọn

  // Hàm lấy dữ liệu từ API hoặc sessionStorage
  const fetchPosts = async () => {
    const cacheKey = "blogPosts"; // Key cache
    const cacheExpirationKey = "blogPosts_expiration"; // Key cho thời gian hết hạn cache
    const cacheDuration = 60 * 60 * 1000; // 1 giờ (ms)

    const now = Date.now();
    const cachedPosts = sessionStorage.getItem(cacheKey);
    const cacheExpiration = sessionStorage.getItem(cacheExpirationKey);

    if (cachedPosts && cacheExpiration && now < parseInt(cacheExpiration, 10)) {
      // Dùng dữ liệu từ cache
      setPosts(JSON.parse(cachedPosts));
      setLoading(false);
    } else {
      // Gọi API nếu không có cache hoặc cache đã hết hạn
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/new");
        const data = response.data;
        console.log(data);

        // Lưu vào cache
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
        sessionStorage.setItem(
          cacheExpirationKey,
          (now + cacheDuration).toString()
        );

        setPosts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    }
  };

  // Load dữ liệu khi component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  // Hàm để cắt nội dung chỉ hiển thị 80 ký tự
  const truncateContent = (content: string) => {
    return content.length > 80 ? content.substring(0, 80) + "..." : content;
  };

  // Hàm hiển thị modal với nội dung đầy đủ
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const showModal = (post: any) => {
    setSelectedPost(post);
    setIsModalVisible(true);
  };

  // Hàm đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <section className="blog-section">
      <div className="container">
        <div className="section-header">
          <Title level={2} className="text-center">
            Bài Viết Về Chúng Tôi
          </Title>
        </div>
        <Row gutter={[16, 16]}>
          {loading ? (
            <Row gutter={[16, 16]} style={{ width: "100%" }}>
              {/* Hiển thị skeleton khi đang tải dữ liệu */}
              <Col xs={24} sm={12} md={8}>
                <Skeleton active />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Skeleton active />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Skeleton active />
              </Col>
            </Row>
          ) : (
            posts.map((post, index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <Card
                  hoverable
                  cover={
                    <div className="post-cover">
                      <img
                        alt="blog-image"
                        src={`http://127.0.0.1:8000/storage/${post.image}`}
                        className="post-image"
                      />
                      <div className="post-overlay">
                        <Text className="post-date">
                          <ClockCircleOutlined />
                          {` ${new Date(post.create_day).toLocaleDateString()}`}
                        </Text>
                        <Title level={4} className="post-title">
                          {post.title}
                        </Title>
                      </div>
                    </div>
                  }
                  onClick={() => showModal(post)}
                  className="post-card"
                >
                  <p className="post-summary">
                    <FileTextOutlined className="summary-icon" />
                    {truncateContent(post.content)}{" "}
                    <a
                      href="#"
                      className="read-more-link"
                      onClick={(e) => {
                        e.preventDefault();
                        showModal(post);
                      }}
                    >
                      Đọc thêm
                    </a>
                  </p>
                </Card>
              </Col>
            ))
          )}
        </Row>
        {selectedPost && (
          <Modal
            title={selectedPost.title}
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={null}
            width={800}
            className="custom-modal"
          >
            <img
              alt="blog-image"
              src={
                selectedPost.image
                  ? `http://127.0.0.1:8000/storage/${selectedPost.image}`
                  : "default-placeholder.jpg"
              }
              className="modal-image"
            />
            <Text className="modal-date">
              <ClockCircleOutlined />{" "}
              {`Ngày tạo: ${new Date(
                selectedPost.create_day
              ).toLocaleDateString()}`}
            </Text>
            <p className="modal-content">{selectedPost.content}</p>
          </Modal>
        )}
      </div>
    </section>
  );
};

export default Blog;
