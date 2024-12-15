import React, { useState, useEffect } from "react";
import { Table, Button, Modal, message, Form, Input, Upload } from "antd";
import axios from "axios";
import { UploadOutlined } from "@ant-design/icons";

// API functions
const API_URL = "http://127.0.0.1:8000/api/new";
const API_UPLOAD_URL = "http://127.0.0.1:8000/api/upload"; // Giả sử đây là URL cho API tải ảnh lên

const fetchArticles = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const createArticle = async (article: any) => {
  const response = await axios.post(API_URL, article);
  return response.data;
};

const updateArticle = async (id: number, article: any) => {
  const response = await axios.put(`${API_URL}/${id}`, article);
  return response.data;
};

const deleteArticle = async (id: number) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

// Main component
const ArticleManager: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    const getArticles = async () => {
      const data = await fetchArticles();
      setArticles(data);
    };
    getArticles();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteArticle(id);
      message.success("Xóa bài viết thành công");
      setArticles(articles.filter((article) => article.id !== id));
    } catch (error) {
      message.error("Xóa bài viết thất bại");
    }
  };

  const handleEdit = (article: any) => {
    setEditingArticle(article);
    form.setFieldsValue(article);
    setFileList(article.image ? [{ url: article.image }] : []); // Set file list for editing
    setIsModalVisible(true);
  };

  const handleCreateNew = () => {
    setEditingArticle(null); // Reset editing article
    form.resetFields(); // Reset form fields for new article
    setFileList([]); // Reset file list for new article
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingArticle(null);
  };

  // Function to upload image when user selects it
  const uploadImage = async (file: any) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(API_UPLOAD_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.url; // Assume the API returns the URL of the uploaded image
    } catch (error) {
      message.error("Tải ảnh lên thất bại");
      throw error;
    }
  };

  // Handle image upload directly when file is selected
  const handleImageChange = async (info: any) => {
    setFileList(info.fileList);
    if (info.file.status === "done") {
      // When image is uploaded successfully, update the image URL
      const imageUrl = info.file.response.url;
      form.setFieldsValue({ image: imageUrl });
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      let data;
      // If editing an existing article
      if (editingArticle) {
        data = await updateArticle(editingArticle.id, values);
      } else {
        // Otherwise create a new article
        data = await createArticle(values);
      }
      message.success("Lưu thành công");
      setArticles((prevArticles) => {
        if (editingArticle) {
          return prevArticles.map((article) =>
            article.id === editingArticle.id ? data : article
          );
        } else {
          return [...prevArticles, data];
        }
      });
      handleCancel();
    } catch (error) {
      message.error("Lưu thất bại");
    }
  };

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Ảnh bài viết",
      dataIndex: "image",
      key: "image",
      render: (image: string) => <img src={image} alt="Article" style={{ width: 100, height: 100, objectFit: 'cover' }} />,
    },
    {
      title: "Mô tả",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Hành động",
      key: "action",
      render: (text: any, record: any) => (
        <>
          <Button
            onClick={() => handleEdit(record)}
            style={{ marginRight: 10 }}
          >
            Sửa
          </Button>
          <Button onClick={() => handleDelete(record.id)} danger>
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={handleCreateNew}  // Button to open modal for creating new article
      >
        Thêm bài viết mới
      </Button>
      <Table
        columns={columns}
        dataSource={articles}
        rowKey="id"
        pagination={false}
      />
      <Modal
        title={editingArticle ? "Sửa bài viết" : "Tạo mới bài viết"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Ảnh bài viết"
            name="image"
            rules={[{ required: true, message: "Vui lòng tải ảnh bài viết!" }]}
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleImageChange}
              maxCount={1} // Limit the number of files to 1
              customRequest={({ file, onSuccess }) => {
                // Handle the image upload here when the file is selected
                uploadImage(file).then((url) => {
                  onSuccess();
                  setFileList([{ url }]);
                  form.setFieldsValue({ image: url });
                });
              }}
            >
              {fileList.length < 1 && <div><UploadOutlined /> Chọn ảnh</div>}
            </Upload>
          </Form.Item>
          <Form.Item
            label="Nội dung"
            name="content"
            rules={[{ required: true, message: "Vui lòng nhập nội dung bài viết!" }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingArticle ? "Cập nhật" : "Tạo mới"}
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleCancel}>
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ArticleManager;
