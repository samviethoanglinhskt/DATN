import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  message,
  Form,
  Input,
  Upload,
  Space,
} from "antd";
import { UploadOutlined, ReloadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import type { RcFile, UploadProps } from "antd/es/upload";

interface Article {
  id: number;
  title: string;
  content: string;
  image: string;
}

interface ArticleFormValues {
  title: string;
  content: string;
  image?: UploadFile[];
}

const ArticleManager: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Fetch articles
  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/api/new");
      if (!response.ok) throw new Error("Failed to fetch articles");
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      message.error("Không thể tải danh sách bài viết");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Handle delete article
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/new/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Delete failed");

      message.success("Xóa bài viết thành công");
      fetchArticles();
    } catch (error) {
      message.error("Xóa bài viết thất bại");
    }
  };

  // Handle edit article
  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    form.setFieldsValue({
      title: article.title,
      content: article.content,
    });
    // Set fileList với ảnh hiện tại
    if (article.image) {
      setFileList([
        {
          uid: "-1",
          name: article.image.split("/").pop() || "current-image.png",
          status: "done",
          url: article.image,
        },
      ]);
    } else {
      setFileList([]);
    }
    setIsModalVisible(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditingArticle(null);
    form.resetFields();
    setFileList([]);
  };

  // Handle form submission
  // Handle form submission
  const handleSubmit = async (values: ArticleFormValues) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("content", values.content);

      // Xử lý ảnh cho cả thêm mới và cập nhật
      if (values.image?.[0]?.originFileObj) {
        // Có file ảnh mới được chọn
        formData.append("image", values.image[0].originFileObj);
      } else if (editingArticle) {
        // Đang cập nhật và không có ảnh mới -> gửi ảnh cũ
        formData.append("image", editingArticle.image);
      }

      // Log data trước khi gửi
      for (let pair of formData.entries()) {
        console.log("FormData:", pair[0], pair[1]);
      }

      const url = editingArticle
        ? `http://127.0.0.1:8000/api/new/${editingArticle.id}`
        : "http://127.0.0.1:8000/api/new";

      const response = await fetch(url, {
        method: editingArticle ? "PUT" : "POST",
        body: formData,
      });

      const responseData = await response.json();
      console.log("Response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.message || "Operation failed");
      }

      message.success(
        `Bài viết đã ${editingArticle ? "cập nhật" : "thêm"} thành công`
      );
      handleModalClose();
      fetchArticles();
    } catch (error) {
      console.error("Error:", error);
      message.error(
        `${editingArticle ? "Cập nhật" : "Thêm"} bài viết thất bại: `
      );
    }
  };
  console.log("fileList", fileList);

  // Upload props
  const uploadProps: UploadProps = {
    beforeUpload: (file: RcFile) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("Chỉ có thể tải lên file ảnh!");
        return Upload.LIST_IGNORE;
      }

      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Ảnh phải nhỏ hơn 2MB!");
        return Upload.LIST_IGNORE;
      }

      return false;
    },
    maxCount: 1,
    fileList: fileList,
    onChange: ({ fileList }) => {
      console.log("FileList changed:", fileList);
      setFileList(fileList);
    },
  };

  // Table columns
  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: "25%",
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      width: "20%",
      render: (image: string) =>
        image ? (
          <img
            src={`http://127.0.0.1:8000/storage/${image}`}
            alt="Article"
            style={{ width: 100, height: 100, objectFit: "cover" }}
          />
        ) : (
          "Không có ảnh"
        ),
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      width: "35%",
      render: (text: string) => (
        <div
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: "20%",
      render: (_: any, record: Article) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Space>
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            Thêm bài viết
          </Button>
          <Button icon={<ReloadOutlined />} onClick={fetchArticles}>
            Làm mới
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={articles}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng số ${total} bài viết`,
        }}
      />

      <Modal
        title={editingArticle ? "Sửa bài viết" : "Thêm bài viết mới"}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ title: "", content: "" }}
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
          >
            <Input placeholder="Nhập tiêu đề bài viết" />
          </Form.Item>

          <Form.Item
            name="image"
            label="Ảnh bài viết"
            rules={[
              {
                required: !editingArticle,
                message: "Vui lòng chọn ảnh!",
              },
            ]}
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e?.fileList;
            }}
          >
            <Upload {...uploadProps} listType="picture-card" accept="image/*">
              {fileList.length < 1 && (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Tải ảnh</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung"
            rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Nhập nội dung bài viết"
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button onClick={handleModalClose}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                {editingArticle ? "Cập nhật" : "Thêm mới"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ArticleManager;
