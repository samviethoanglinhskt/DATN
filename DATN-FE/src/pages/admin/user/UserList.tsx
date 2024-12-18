import React, { useState } from "react";
import {
  Table,
  Space,
  Button,
  message,
  Popconfirm,
  Modal,
  Form,
  Input,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "src/config/axiosInstance";

interface User {
  id: number;
  name: string;
  tb_role_id?: number;
  phone: string;
  address?: string;
  email: string;
}

const UserList: React.FC = () => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  // Query users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/users");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    retry: 2,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => axiosInstance.delete(`/api/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      message.success("User deleted successfully");
    },
    onError: (error: any) => {
      message.error(
        "Failed to delete user: " +
        (error.response?.data?.message || error.message)
      );
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (values: Partial<User> & { id: number }) =>
      axiosInstance.put(`/api/users/${values.id}`, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      message.success("User updated successfully");
      setEditModalVisible(false);
      form.resetFields();
    },
    onError: (error: any) => {
      message.error(
        "Failed to update user: " +
        (error.response?.data?.message || error.message)
      );
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue({ tb_role_id: user.tb_role_id });
    setEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        // Log lại dữ liệu gửi đi
        console.log('Updating user with:', {
          id: editingUser.id,
          tb_role_id: values.tb_role_id,
        });

        // Cập nhật dữ liệu
        const updatedValues = {
          id: editingUser.id,
          tb_role_id: values.tb_role_id,
        };
        updateMutation.mutate(updatedValues);
      }
    } catch (error) {
    }
  };



  const filteredUsers = users.filter(
    (user: User) =>
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Tên người dùng",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <div className="d-flex align-items-center">
          <div className="bg-primary rounded-circle p-2 me-2">
            <UserOutlined className="text-white" />
          </div>
          <span className="fw-semibold">{text}</span>
        </div>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "tb_role_id",
      key: "tb_role_id",
      width: 120,
      render: (roleId: number) => (
        <span
          className={`badge ${roleId === 1
            ? "bg-success"
            : roleId === 3
              ? "bg-warning"
              : "bg-info"
            }`}
        >
          {roleId === 1 ? "Admin" : roleId === 3 ? "Nhân viên" : "User"}
        </span>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 150,
      render: (text: string) => (
        <span className="text-muted">
          <i className="bi bi-telephone me-1"></i>
          {text}
        </span>
      ),
    },

    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
      render: (text: string) => (
        <span className="text-muted">
          <i className="bi bi-envelope me-1"></i>
          {text}
        </span>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      render: (_: any, record: User) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            className="btn btn-outline-primary btn-sm"
            onClick={() => handleEdit(record)}
            loading={updateMutation.isPending}
          ></Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="container-fluid py-4">
      <div className="card shadow-sm">
        <div className="card-header bg-white py-3">
          <div className="row align-items-center">
            <div className="col">
              <h5 className="mb-0">Quản lý người dùng</h5>
            </div>
            <div className="col text-end d-flex justify-content-end gap-2">
              <Input
                placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                prefix={<SearchOutlined />}
                allowClear
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300 }}
                value={searchText}
              />
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="text-muted mb-3">
            Hiển thị {filteredUsers.length} / {users.length} người dùng
          </div>

          <Table
            columns={columns}
            dataSource={filteredUsers}
            rowKey="id"
            loading={isLoading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} users`,
              className: "mt-3",
            }}
            className="table-hover"
            scroll={{ x: true }}
          />
        </div>
      </div>

      <Modal
        title={
          <div className="d-flex align-items-center">
            <UserOutlined className="me-2" />
            <span>{editingUser ? "Edit User" : "Add New User"}</span>
          </div>
        }
        open={editModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => {
          setEditModalVisible(false);
          form.resetFields();
          setEditingUser(null);
        }}
        okText="Save Changes"
        cancelText="Cancel"
        okButtonProps={{
          className: "btn btn-primary",
          loading: updateMutation.isPending,
        }}
        cancelButtonProps={{ className: "btn btn-outline-secondary" }}
        destroyOnClose
        className="bootstrap-modal"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={editingUser || {}}
          className="mt-3"
        >
          <div className="row">
            <div className="col-md-6">
              <Form.Item
                name="tb_role_id"
                label="Vai trò"
                rules={[{ required: true, message: "Please select the role!" }]}
              >
                <select className="form-select">
                  <option value={1}>Admin</option>
                  <option value={2}>Người dùng</option>
                  <option value={3}>Nhân viên</option>
                </select>
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default UserList;

