import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Tooltip, message, Popconfirm, Modal, Form, Input } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import axiosInstance from 'src/config/axiosInstance';
import 'bootstrap/dist/css/bootstrap.min.css';

interface User {
  id: number;
  name: string;
  tb_role_id: number;
  phone: string;
  address: string;
  email: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/users');
      setUsers(response.data);
    } catch (error: any) {
      message.error('Failed to fetch users: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/api/users/${id}`);
      message.success('User deleted successfully');
      fetchUsers();
    } catch (error: any) {
      message.error('Failed to delete user: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        await axiosInstance.put(`/api/users/${editingUser.id}`, values);
        message.success('User updated successfully');
        setEditModalVisible(false);
        form.resetFields();
        fetchUsers();
      }
    } catch (error: any) {
      message.error('Failed to update user: ' + (error.response?.data?.message || error.message));
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase()) ||
    user.phone.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
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
      title: 'Role',
      dataIndex: 'tb_role_id',
      key: 'tb_role_id',
      width: 120,
      render: (roleId: number) => (
        <span className={`badge ${roleId === 1 ? 'bg-success' : 'bg-info'}`}>
          {roleId === 1 ? 'Admin' : 'User'}
        </span>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
      render: (text: string) => (
        <span className="text-muted">
          <i className="bi bi-telephone me-1"></i>
          {text}
        </span>
      ),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
      render: (text: string) => (
        <span className="text-muted">
          <i className="bi bi-geo-alt me-1"></i>
          {text}
        </span>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
      render: (text: string) => (
        <span className="text-muted">
          <i className="bi bi-envelope me-1"></i>
          {text}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: any, record: User) => (
        <Space size="middle">
          <Button
            className="btn btn-outline-primary btn-sm"
            onClick={() => handleEdit(record)}
          >
            <EditOutlined /> Edit
          </Button>
          <Popconfirm
            title="Delete User"
            description="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ className: 'btn btn-danger' }}
            cancelButtonProps={{ className: 'btn btn-outline-secondary' }}
          >
            <Button className="btn btn-outline-danger btn-sm">
              <DeleteOutlined /> Delete
            </Button>
          </Popconfirm>
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
              <Button
                type="primary"
                className="btn btn-primary"
                icon={<PlusOutlined />}
              >
                Add User
              </Button>
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
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} users`,
              className: 'mt-3',
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
            <span>{editingUser ? 'Edit User' : 'Add New User'}</span>
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
        okButtonProps={{ className: 'btn btn-primary' }}
        cancelButtonProps={{ className: 'btn btn-outline-secondary' }}
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
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please input the name!' }]}
              >
                <Input className="form-control" placeholder="Enter name" />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                name="tb_role_id"
                label="Role"
                rules={[{ required: true, message: 'Please select the role!' }]}
              >
                <select className="form-select">
                  <option value={1}>Admin</option>
                  <option value={2}>User</option>
                </select>
              </Form.Item>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <Form.Item
                name="phone"
                label="Phone"
                rules={[{ required: true, message: 'Please input the phone number!' }]}
              >
                <Input className="form-control" placeholder="Enter phone number" />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please input the email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input className="form-control" placeholder="Enter email" />
              </Form.Item>
            </div>
          </div>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: 'Please input the address!' }]}
          >
            <Input.TextArea className="form-control" rows={3} placeholder="Enter address" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserList;    