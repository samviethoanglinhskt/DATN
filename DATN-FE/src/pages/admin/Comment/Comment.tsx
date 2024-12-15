import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Popconfirm, message } from "antd";

// Định nghĩa kiểu dữ liệu cho phản hồi từ API
interface Product {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
}

interface Review {
  id: number;
  user_id: number;
  tb_product_id: number;
  order_id: number;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  product: Product;
  user: User;
}

const ReviewList: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Hàm lấy dữ liệu từ API
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/reviews-list");
      setReviews(response.data);  // Lưu dữ liệu vào state
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xóa bình luận
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/reviews-delete/${id}`);
      // Cập nhật lại danh sách bình luận sau khi xóa
      setReviews(reviews.filter((review) => review.id !== id));
      message.success("Xóa bình luận thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa bình luận:", error);
      message.error("Xóa bình luận thất bại!");
    }
  };

  // Gọi fetchReviews khi component được mount
  useEffect(() => {
    fetchReviews();
  }, []);

  // Cột cho bảng
  const columns = [
    {
      title: "Tên Người Dùng",
      dataIndex: ["user", "name"], 
      key: "user.name",
    },
    {
      title: "Tên Sản Phẩm",
      dataIndex: ["product", "name"], 
      key: "product.name",
    },
    {
      title: "Bình Luận",
      dataIndex: "comment",
      key: "comment",
    },
    {
      title: "Hành Động",
      key: "action",
      render: (_: any, record: Review) => (
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa bình luận này?"
          onConfirm={() => handleDelete(record.id)}
          okText="Có"
          cancelText="Không"
        >
          <Button danger >Xóa</Button>
        </Popconfirm>
      ),
    },
  ];        

  return (
    <div>
      <Table
        dataSource={reviews}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
        }}
      />
    </div>
  );
};

export default ReviewList;
