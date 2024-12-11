import React, { useState, useEffect } from "react";
import { Card, Row, Col, Typography, Skeleton, Modal } from "antd";
import { ClockCircleOutlined, FileTextOutlined } from "@ant-design/icons"; // Cập nhật icon
import axios from "axios";
import "./Blog.css";

const { Title, Text } = Typography;

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]); // Dữ liệu bài viết
  const [loading, setLoading] = useState<boolean>(true); // Trạng thái loading
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // Trạng thái hiển thị modal
  const [selectedPost, setSelectedPost] = useState<any>(null); // Bài viết được chọn

  // Lấy dữ liệu từ API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/new");
        setPosts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Hàm để cắt nội dung chỉ hiển thị 80 ký tự
  const truncateContent = (content: string) => {
    return content.length > 80 ? content.substring(0, 80) + "..." : content;
  };

  // Hàm hiển thị modal với nội dung đầy đủ
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
                        src={post.image || "https://picsum.photos/200/200"}
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
              src={selectedPost.image || "https://picsum.photos/200/200"}
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
