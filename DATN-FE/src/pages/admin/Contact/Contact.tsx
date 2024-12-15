import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import axios from 'axios';

interface Contact {
  id: number;
  user_id: number;
  name: string;
  phone: string;
  email: string;
  content: string;
  status: string;
}

const { Option } = Select;

const ContactsList: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch contacts from API
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/list-all');
      setContacts(response.data);
    } catch (error) {
      message.error('Error fetching contacts');
    } finally {
      setLoading(false);
    }
  };

  // Update contact status
  const updateContactStatus = async (id: number, status: string) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/update-contact/${id}`, { status });
      message.success('Status updated successfully');
      fetchContacts(); // Refresh list after update
    } catch (error) {
      message.error('Error updating status');
    }
  };

  // Delete contact
  const deleteContact = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/delete-contact/${id}`);
      message.success('Contact deleted successfully');
      fetchContacts(); // Refresh list after deletion
    } catch (error) {
      message.error('Error deleting contact');
    }
  };

  // Open the edit modal
  const openEditModal = (contact: Contact) => {
    setEditingContact(contact);
    setModalVisible(true);
  };

  // Handle modal form submission
  const handleSubmit = (values: { status: string }) => {
    if (editingContact) {
      updateContactStatus(editingContact.id, values.status);
      setModalVisible(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Content',
      dataIndex: 'content',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status: string, record: Contact) => (
        <Select
          defaultValue={status}
          style={{ width: 120 }}
          onChange={(value) => updateContactStatus(record.id, value)}
        >
          <Option value="new">Liên hệ mới</Option>
          <Option value="in-progress">Đang tiến hành</Option>
          <Option value="resolved">Đã giải quyết</Option>
        </Select>
      ),
    },
    {
      title: 'Action',
      render: (text: string, record: Contact) => (
        <div>
          <Button danger onClick={() => deleteContact(record.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={contacts}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title="Edit Contact Status"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          initialValues={{ status: editingContact?.status }}
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Please select a status!' }]}
          >
            <Select>
              <Option value="new">New</Option>
              <Option value="in-progress">In Progress</Option>
              <Option value="resolved">Resolved</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ContactsList;
