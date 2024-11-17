import React, { useState, useEffect } from "react";
import { Card, Row, Col, Typography, Skeleton } from "antd";
import axios from "axios";

const { Title, Text } = Typography;

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]); // Dữ liệu bài viết
  const [loading, setLoading] = useState<boolean>(true); // Trạng thái loading

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

  // Thêm state để quản lý việc hiển thị nội dung đầy đủ
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);

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
            // Hiển thị skeleton khi đang tải dữ liệu
            <>
              <Col span={8}>
                <Skeleton active />
              </Col>
              <Col span={8}>
                <Skeleton active />
              </Col>
              <Col span={8}>
                <Skeleton active />
              </Col>
            </>
          ) : (
            // Hiển thị dữ liệu từ API
            posts.map((post, index) => (
              <Col span={8} key={index}>
                <Card
                  hoverable
                  cover={
                    post.image ? (
                      <img alt="blog-image" src={post.image} />
                    ) : (
                      <img
                        alt="default-image"
                        src="https://picsum.photos/50/50"
                      />
                    )
                  }
                >
                  <Title level={4}>{post.title}</Title>
                  <Text>{`Ngày tạo: ${new Date(
                    post.create_day
                  ).toLocaleDateString()}`}</Text>
                  <p>
                    {expandedPostId === post.id
                      ? post.content // Hiển thị toàn bộ nội dung nếu mở rộng
                      : truncateContent(post.content)}{" "}
                    <a
                      href="#"
                      style={{ color: "#1890ff" }}
                      onClick={(e) => {
                        e.preventDefault();
                        // Nếu bài viết đang được mở rộng, thu gọn
                        setExpandedPostId(
                          expandedPostId === post.id ? null : post.id
                        );
                      }}
                    >
                      {expandedPostId === post.id ? "Thu gọn" : "Đọc thêm"}
                    </a>
                  </p>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </div>
    </section>
  );
};

export default Blog;
