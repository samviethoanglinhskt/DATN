import React, { useState, useEffect } from "react";
import { Card, Row, Col, Typography, Skeleton, Modal } from "antd";
import { CalendarOutlined, ReadOutlined } from "@ant-design/icons";
import axios from "axios";

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

  // Hàm để cắt nội dung chỉ hiển thị 20 ký tự
  const truncateContent = (content: string) => {
    return content.length > 20 ? content.substring(0, 20) + "..." : content;
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
    <section className="sec-blog bg0 p-t-60 p-b-90">
      <div className="container">
        <div className="p-b-66">
          <Title level={3} className="text-center">
            Bài Viết Về Chúng Tôi
          </Title>
        </div>
        <Row gutter={[16, 16]}>
          {loading ? (
            <>
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
            </>
          ) : (
            // Hiển thị dữ liệu từ API
            posts.map((post, index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <Card
                  hoverable
                  cover={
                    <div style={{ position: "relative" }}>
                      <img
                        alt="blog-image"
                        src={post.image || "https://picsum.photos/200/200"}
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          transition: "transform 0.3s ease",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          bottom: "0",
                          background: "rgba(0, 0, 0, 0.5)",
                          color: "#fff",
                          width: "100%",
                          padding: "10px",
                          transition: "all 0.3s ease",
                          borderRadius: "0 0 8px 8px",
                        }}
                      >
                        <Text>
                          <CalendarOutlined
                            style={{
                              fontSize: "200%",
                              paddingRight: "8px",
                            }}
                          />
                          {`Ngày tạo: ${new Date(
                            post.create_day
                          ).toLocaleDateString()}`}
                        </Text>
                        <Title level={4} style={{ margin: 0, color: "#fff" }}>
                          <ReadOutlined style={{ marginRight: "8px" }} />
                          {post.title}
                        </Title>
                      </div>
                    </div>
                  }
                  onClick={() => showModal(post)}
                  style={{
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    transition: "transform 0.3s ease",
                  }}
                >
                  <p>
                    <ReadOutlined
                      style={{ fontSize: "150%", paddingRight: "8px" }}
                    />
                    {truncateContent(post.content)}{" "}
                    <a
                      href="#"
                      style={{ color: "#1890ff" }}
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
          >
            <img
              alt="blog-image"
              src={selectedPost.image || "https://picsum.photos/200/200"}
              style={{
                width: "100%",
                height: "300px",
                objectFit: "cover",
                marginBottom: "20px",
                borderRadius: "8px",
              }}
            />
            <Text style={{ fontSize: "16px", fontWeight: "bold" }}>
              <CalendarOutlined style={{ marginRight: "8px" }} />
              {`Ngày tạo: ${new Date(
                selectedPost.create_day
              ).toLocaleDateString()}`}
            </Text>
            <p style={{ fontSize: "16px", marginTop: "20px" }}>
              {selectedPost.content}
            </p>
          </Modal>
        )}
      </div>
    </section>
  );
};

export default Blog;
