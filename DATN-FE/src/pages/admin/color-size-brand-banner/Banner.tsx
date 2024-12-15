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
import { EditOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
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
    const [addModal, setAddModal] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [form] = Form.useForm();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const fetchLogos = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/api/logo_banner");
        console.log(response.data); 
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

    // Xử lý thêm mới
    const handleAdd = async (values: any) => {
      try {
        setLoading(true);

        if (!selectedFile) {
          message.error("Vui lòng chọn hình ảnh");
          return;
        }
        let imageUrl = "";
        try {
          const formData = new FormData();
          formData.append("name", values.name.trim());
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
        formData.append("name", values.name.trim());
        formData.append("image", selectedFile); 
        // Show success message
        message.success("Thêm logo/banner thành công");

        // Close the modal and reset the form
        setAddModal(false);
        form.resetFields();
        setSelectedFile(null);
        setPreviewImage(null);

        // Refresh the logo/banner list
        fetchLogos();
      } catch (error: any) {
        console.error("Lỗi:", error);
        message.error(error.message || "Không thể thêm logo/banner");
      } finally {
        setLoading(false);
      }
    };

    // Xử lý xóa banner
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
          src={`http://localhost:8000/storage/${image}`}
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
      render: (text: string) => <span className="font-medium">{text}</span>,
      sorter: (a: LogoBanner, b: LogoBanner) => a.name.localeCompare(b.name),
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
            rules={[{ required: true, message: "Vui lòng nhập tên logo/banner" }]}
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
    </Card>
  );
};

export default LogoBannerManagement;
