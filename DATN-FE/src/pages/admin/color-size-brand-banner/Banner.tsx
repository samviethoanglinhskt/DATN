import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Tooltip,
  message,
  Modal,
  Form,
  Input,
  Card,
  Space,
  Popconfirm,
  Image,
  Upload,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  FileImageOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axiosInstance from "src/config/axiosInstance";

interface LogoBanner {
  id: number;
  name: string;
  image: string;
  created_at: string | null;
  updated_at: string | null;
}

const LogoBannerManagement: React.FC = () => {
  const [logos, setLogos] = useState<LogoBanner[]>([]);
  const [loading, setLoading] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editingLogo, setEditingLogo] = useState<LogoBanner | null>(null);
  const [addModal, setAddModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fetchLogos = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/logo_banner");
      setLogos(response.data);
    } catch (error: any) {
      message.error("Không thể tải danh sách logo & banner");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogos();
  }, []);

  // Hàm xử lý upload ảnh
  const handleImageSelect = async (file: File) => {
    setSelectedFile(file);
    // Tạo preview URL cho ảnh đã chọn
    const previewURL = URL.createObjectURL(file);
    setPreviewImage(previewURL);
    return false; // Ngăn upload tự động
  };

  // Hàm upload ảnh lên server
  // Cập nhật uploadImage
  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axiosInstance.post("/api/upload-image", formData); // Không cần thiết lập "Content-Type" nếu là FormData
      return response.data.url;
    } catch (error) {
      throw new Error("Không thể tải lên hình ảnh");
    }
  };

  // Xử lý thêm mới
  // Xử lý thêm mới
  const handleAdd = async (values: any) => {
    try {
      setLoading(true);

      if (!selectedFile) {
        message.error("Vui lòng chọn hình ảnh");
        return;
      }

      // Upload ảnh trước
      let imageUrl = "";
            // Log dữ liệu trước khi tạo logo/banner mới
    console.log("Dữ liệu logo/banner cần thêm:", {
      name: values.name.trim(),
      image: imageUrl,
    });

      try {
        const formData = new FormData();
      formData.append('name', values.name.trim());
        formData.append("image", selectedFile);
        const uploadResponse = await axiosInstance.post(
          "/api/upload-image",
          formData
        );
        imageUrl = uploadResponse.data.url;
      } catch (error) {
        message.error("Không thể tải lên hình ảnh");
        return;
      } 

     
      const formData = new FormData();
      formData.append('name', values.name.trim());
      formData.append('image', selectedFile); // selectedFile là file ảnh
      
      fetch('http://localhost:8000/api/upload-image', {
        method: 'POST',
        body: formData,
      }).then((response) => console.log(response));
    } catch (error: any) {
      console.error("Lỗi:", error);
      message.error(error.message || "Không thể thêm logo/banner");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý cập nhật
  const handleEdit = async (values: any) => {
    try {
      setLoading(true);
      let imageUrl = editingLogo?.image;

      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      if (editingLogo) {
        await axiosInstance.put(`/api/logo_banner/${editingLogo.id}`, {
          name: values.name,
          image: imageUrl,
        });
      }

      message.success("Cập nhật logo/banner thành công");
      setEditModal(false);
      form.resetFields();
      setSelectedFile(null);
      setPreviewImage(null);
      fetchLogos();
    } catch (error) {
      message.error("Không thể cập nhật logo/banner");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/api/logo_banner/${id}`);
      message.success("Xóa logo/banner thành công");
      fetchLogos();
    } catch (error) {
      message.error("Không thể xóa logo/banner");
    }
  };

  const resetModal = () => {
    form.resetFields();
    setSelectedFile(null);
    setPreviewImage(null);
  };

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: 120,
      render: (image: string) => (
        <Image
          src={image}
          alt="Logo"
          width={80}
          height={80}
          style={{ objectFit: "cover" }}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADA..."
        />
      ),
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <Space>
          <FileImageOutlined />
          <span className="font-medium">{text}</span>
        </Space>
      ),
      sorter: (a: LogoBanner, b: LogoBanner) => a.name.localeCompare(b.name),
    },
    {
      title: "URL Hình ảnh",
      dataIndex: "image",
      key: "imageUrl",
      ellipsis: true,
      render: (url: string) => (
        <Tooltip title={url}>
          <a href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
        </Tooltip>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "N/A",
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      render: (_: any, record: LogoBanner) => (
        <Space>
          <Tooltip title="Sửa">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => {
                setEditingLogo(record);
                form.setFieldsValue(record);
                setPreviewImage(record.image);
                setEditModal(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa logo/banner"
            description="Bạn có chắc chắn muốn xóa mục này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const renderUploadButton = () => (
    <div>
      <Button icon={<PlusOutlined />}>Chọn ảnh</Button>
      {previewImage && (
        <div style={{ marginTop: 8 }}>
          <img
            src={previewImage}
            alt="preview"
            style={{ maxWidth: "100%", maxHeight: 200 }}
          />
        </div>
      )}
    </div>
  );
  return (
    <Card
      title={
        <Space>
          <FileImageOutlined className="text-xl" />
          <span className="font-bold">Quản lý Logo & Banner</span>
        </Space>
      }
      extra={
        <Space>
          <Input
            placeholder="Tìm kiếm..."
            prefix={<SearchOutlined />}
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />
          <Button icon={<ReloadOutlined />} onClick={fetchLogos}>
            Làm mới
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setAddModal(true);
              resetModal();
            }}
          >
            Thêm mới
          </Button>
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={logos}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showTotal: (total) => `Tổng ${total} mục`,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />

      {/* Add Modal */}
      <Modal
        title="Thêm Logo/Banner mới"
        open={addModal}
        onOk={() => form.submit()}
        onCancel={() => {
          setAddModal(false);
          resetModal();
        }}
        okText="Thêm"
        cancelText="Hủy"
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item
            name="name"
            label="Tên Logo/Banner"
            rules={[
              { required: true, message: "Vui lòng nhập tên logo/banner" },
            ]}
          >
            <Input placeholder="Nhập tên logo/banner" />
          </Form.Item>

          <Form.Item
            label="Chọn Hình Ảnh"
            required
            rules={[{ required: true, message: "Vui lòng tải lên hình ảnh" }]}
          >
            <Upload
              beforeUpload={(file) => handleImageSelect(file)}
              showUploadList={false}
              accept="image/*"
            >
              {renderUploadButton()}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Sửa Logo/Banner"
        open={editModal}
        onOk={() => form.submit()}
        onCancel={() => {
          setEditModal(false);
          resetModal();
        }}
        okText="Cập nhật"
        cancelText="Hủy"
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" onFinish={handleEdit}>
          <Form.Item
            name="name"
            label="Tên Logo/Banner"
            rules={[
              { required: true, message: "Vui lòng nhập tên logo/banner" },
            ]}
          >
            <Input placeholder="Nhập tên logo/banner" />
          </Form.Item>

          <Form.Item label="Chọn Hình Ảnh" required>
            <Upload
              beforeUpload={(file) => handleImageSelect(file)}
              showUploadList={false}
              accept="image/*"
            >
              {renderUploadButton()}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default LogoBannerManagement;
