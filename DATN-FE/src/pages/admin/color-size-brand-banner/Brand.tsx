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
  Tag,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ShopOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import axiosInstance from "src/config/axiosInstance";
import { SearchOutlined } from "@ant-design/icons";

interface Brand {
  id: number;
  name: string;
  created_at: string | null;
  updated_at: string | null;
}

const BrandManagement: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [addModal, setAddModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  // Fetch brands
  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/brand");
      setBrands(response.data);
    } catch (error: any) {
      message.error("Không thể tải danh sách thương hiệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // Add brand
  const handleAdd = async (values: { name: string }) => {
    try {
      await axiosInstance.post("/api/brand", values);
      message.success("Thêm thương hiệu thành công");
      setAddModal(false);
      form.resetFields();
      fetchBrands();
    } catch (error) {
      message.error("Không thể thêm thương hiệu");
    }
  };

  // Edit brand
  const handleEdit = async (values: { name: string }) => {
    try {
      if (editingBrand) {
        await axiosInstance.put(`/api/brand/${editingBrand.id}`, values);
        message.success("Cập nhật thương hiệu thành công");
        setEditModal(false);
        form.resetFields();
        fetchBrands();
      }
    } catch (error) {
      message.error("Không thể cập nhật thương hiệu");
    }
  };

  // Delete brand
  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/api/brand/${id}`);
      message.success("Xóa thương hiệu thành công");
      fetchBrands();
    } catch (error) {
      message.error("Không thể xóa thương hiệu");
    }
  };

  // Filter brands based on search text
  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Tên thương hiệu",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <Space>
          <Tag color="blue" className="text-uppercase font-weight-bold">
            {text}
          </Tag>
        </Space>
      ),
      sorter: (a: Brand, b: Brand) => a.name.localeCompare(b.name),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string | null) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "N/A",
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      render: (_: any, record: Brand) => (
        <Space size="small">
          <Tooltip title="Sửa thương hiệu">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => {
                setEditingBrand(record);
                form.setFieldsValue(record);
                setEditModal(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa thương hiệu"
            description="Bạn có chắc chắn muốn xóa thương hiệu này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa thương hiệu">
              <Button danger icon={<DeleteOutlined />} size="small" />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={
        <Space>
          <ShopOutlined className="fs-4" />
          <span className="fw-bold">Quản lý thương hiệu</span>
        </Space>
      }
      extra={
        <Space>
          <Input
            placeholder="Tìm kiếm thương hiệu"
            prefix={<SearchOutlined />}
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />
          <Button icon={<ReloadOutlined />} onClick={fetchBrands}>
            Làm mới
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setAddModal(true);
              form.resetFields();
            }}
          >
            Thêm thương hiệu
          </Button>
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={filteredBrands}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showTotal: (total) => `Tổng ${total} thương hiệu`,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />

      {/* Add Modal */}
      <Modal
        title={
          <Space>
            <PlusOutlined />
            Thêm thương hiệu mới
          </Space>
        }
        open={addModal}
        onOk={() => form.submit()}
        onCancel={() => {
          setAddModal(false);
          form.resetFields();
        }}
        okText="Thêm"
        cancelText="Hủy"
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item
            name="name"
            label="Tên thương hiệu"
            rules={[
              { required: true, message: "Vui lòng nhập tên thương hiệu!" },
              { min: 2, message: "Tên thương hiệu phải có ít nhất 2 ký tự!" },
            ]}
          >
            <Input
              prefix={<ShopOutlined className="text-secondary" />}
              placeholder="Nhập tên thương hiệu"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title={
          <Space>
            <EditOutlined />
            Sửa thương hiệu
          </Space>
        }
        open={editModal}
        onOk={() => form.submit()}
        onCancel={() => {
          setEditModal(false);
          form.resetFields();
        }}
        okText="Lưu"
        cancelText="Hủy"
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleEdit}>
          <Form.Item
            name="name"
            label="Tên thương hiệu"
            rules={[
              { required: true, message: "Vui lòng nhập tên thương hiệu!" },
              { min: 2, message: "Tên thương hiệu phải có ít nhất 2 ký tự!" },
            ]}
          >
            <Input
              prefix={<ShopOutlined className="text-secondary" />}
              placeholder="Nhập tên thương hiệu"
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default BrandManagement;
