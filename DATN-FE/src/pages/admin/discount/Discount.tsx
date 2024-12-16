import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Card,
  message,
  Space,
  Tooltip,
  Tag,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  GiftOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import axiosInstance from "src/config/axiosInstance";
import "bootstrap/dist/css/bootstrap.min.css";

const { RangePicker } = DatePicker;

interface Discount {
  id: number;
  discount_code: string;
  discount_value: number;
  quantity: number;
  max_price: number;
  name: string;
  start_day: string;
  end_day: string;
  created_at: string | null;
  updated_at: string | null;
  status?: 'upcoming' | 'active' | 'expired';
}

const Discount: React.FC = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  // Fetch discounts
  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/discount");
      // Add status to each discount
      const discountsWithStatus = response.data.map((discount: Discount) => ({
        ...discount,
        status: getDiscountStatus(discount)
      }));
      setDiscounts(discountsWithStatus);
    } catch (error: any) {
      message.error("Không thể tải danh sách mã giảm giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  // Get discount status
  const getDiscountStatus = (discount: Discount): 'upcoming' | 'active' | 'expired' => {
    const now = dayjs();
    const start = dayjs(discount.start_day);
    const end = dayjs(discount.end_day);

    if (now.isBefore(start)) return 'upcoming';
    if (now.isAfter(end)) return 'expired';
    return 'active';
  };

  // Custom form validation rules
  const validateDiscountValue = (_: any, value: number) => {
    if (value > 100) {
      return Promise.reject('Giá trị giảm giá không được vượt quá 100%');
    }
    return Promise.resolve();
  };

  const validateMaxPrice = (_: any, value: number) => {
    if (value > 500000) {
      return Promise.reject('Giá trị tối đa không được vượt quá 500,000 VND');
    }
    return Promise.resolve();
  };

  const validateDates = (_: any, dates: any) => {
    if (!dates) return Promise.resolve();
    const [start, end] = dates;
    if (start && end) {
      // Check if dates are in the past
      if (start.isBefore(dayjs(), 'day')) {
        return Promise.reject('Ngày bắt đầu không thể trong quá khứ');
      }
      // Check if end date is before start date
      if (end.isBefore(start)) {
        return Promise.reject('Ngày kết thúc phải sau ngày bắt đầu');
      }
    }
    return Promise.resolve();
  };

  // Handle add/edit discount
  const handleSubmit = async (values: any) => {
    try {
      const formData = {
        ...values,
        start_day: values.dateRange[0].format("YYYY-MM-DD"),
        end_day: values.dateRange[1].format("YYYY-MM-DD"),
        quantity: values.quantity,
        max_price: values.max_price,
      };

      // Additional validation before submission
      if (formData.discount_value > 100) {
        message.error('Giá trị giảm giá không được vượt quá 100%');
        return;
      }

      if (formData.max_price > 500000) {
        message.error('Giá trị tối đa không được vượt quá 500,000 VND');
        return;
      }

      if (editingDiscount) {
        await axiosInstance.put(
          `/api/discount/${editingDiscount.id}`,
          formData
        );
        message.success("Cập nhật mã giảm giá thành công");
      } else {
        await axiosInstance.post("/api/discount", formData);
        message.success("Thêm mã giảm giá thành công");
      }

      setModalVisible(false);
      form.resetFields();
      fetchDiscounts();
    } catch (error: any) {
      console.error("Error submitting form:", error);
      message.error("Có lỗi xảy ra. Vui lòng thử lại");
    }
  };

  // Handle delete discount
  const handleDelete = async (id: number) => {
    try {
      const discountToDelete = discounts.find(d => d.id === id);
      if (discountToDelete?.status === 'active') {
        message.error('Không thể xóa mã giảm giá đang diễn ra');
        return;
      }

      await axiosInstance.delete(`/api/discount/${id}`);
      message.success("Xóa mã giảm giá thành công");
      fetchDiscounts();
    } catch (error) {
      message.error("Không thể xóa mã giảm giá");
    }
  };

  const showModal = (record?: Discount) => {
    setEditingDiscount(record || null);
    if (record) {
      // Check if discount is active before allowing edit
      if (record.status === 'active') {
        message.warning('Không thể chỉnh sửa mã giảm giá đang diễn ra');
        return;
      }
      form.setFieldsValue({
        ...record,
        dateRange: [dayjs(record.start_day), dayjs(record.end_day)],
      });
    } else {
      form.resetFields();
    }
    setModalVisible(true);
  };

  const filteredDiscounts = discounts.filter(
    (discount) =>
      discount.name.toLowerCase().includes(searchText.toLowerCase()) ||
      discount.discount_code.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Mã giảm giá",
      dataIndex: "discount_code",
      key: "discount_code",
      render: (text: string) => (
        <Tag color="blue" icon={<GiftOutlined />} className="px-3 py-1">
          {text.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Giá trị",
      dataIndex: "discount_value",
      key: "discount_value",
      render: (value: number) => (
        <Tag color="green" className="px-3 py-1">
          {value}%
        </Tag>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Giá trị tối đa",
      dataIndex: "max_price",
      key: "max_price",
      render: (value: number) => (
        <Tag color="orange" className="px-3 py-1">
          {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
          }).format(value)}
        </Tag>
      ),
    },
    {
      title: "Tên chương trình",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_day",
      key: "start_day",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "end_day",
      key: "end_day",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_: any, record: Discount) => {
        const statusColors = {
          upcoming: 'warning',
          active: 'success',
          expired: 'error'
        };

        const statusText = {
          upcoming: 'Sắp diễn ra',
          active: 'Đang diễn ra',
          expired: 'Đã kết thúc'
        };

        return (
          <Tag color={statusColors[record.status || 'expired']}>
            {statusText[record.status || 'expired']}
          </Tag>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: Discount) => (
        <Space>
          <Tooltip title={record.status === 'active' ? 'Không thể sửa mã đang diễn ra' : 'Sửa'}>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => showModal(record)}
              size="small"
              disabled={record.status === 'active'}
            />
          </Tooltip>
          <Tooltip title={record.status === 'active' ? 'Không thể xóa mã đang diễn ra' : 'Xóa'}>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
              size="small"
              disabled={record.status === 'active'}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={
        <div className="d-flex justify-content-between align-items-center">
          <span className="h5 mb-0">Quản lý mã giảm giá</span>
          <Space>
            <Input
              placeholder="Tìm theo mã hoặc tên..."
              prefix={<SearchOutlined />}
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
            />
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchText("");
                fetchDiscounts();
              }}
            >
              Làm mới
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal()}
            >
              Thêm mã giảm giá
            </Button>
          </Space>
        </div>
      }
    >
      <Table
        columns={columns}
        dataSource={filteredDiscounts}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showTotal: (total) => `Tổng ${total} mã giảm giá`,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />

      <Modal
        title={editingDiscount ? "Sửa mã giảm giá" : "Thêm mã giảm giá mới"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingDiscount(null);
        }}
        onOk={() => form.submit()}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-3"
        >
          <div className="row">
            <div className="col-md-6">
              <Form.Item
                name="discount_code"
                label="Mã giảm giá"
                rules={[
                  { required: true, message: "Vui lòng nhập mã giảm giá!" },
                  { min: 3, message: "Mã giảm giá phải có ít nhất 3 ký tự" },
                  {
                    pattern: /^[A-Za-z0-9]+$/,
                    message: "Mã giảm giá chỉ được chứa chữ và số"
                  }
                ]}
              >
                <Input placeholder="Nhập mã giảm giá" />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                name="discount_value"
                label="Giá trị (%)"
                rules={[
                  { required: true, message: "Vui lòng nhập giá trị giảm giá!" },
                  { type: 'number', min: 1, message: "Giá trị giảm giá phải lớn hơn 0" },
                  { validator: validateDiscountValue }
                ]}
              >
                <InputNumber
                  placeholder="Nhập giá trị giảm giá"
                  style={{ width: "100%" }}
                  min={1}
                  max={100}
                />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                name="quantity"
                label="Số lượng"
                rules={[
                  { required: true, message: "Vui lòng nhập số lượng!" },
                  { type: 'number', min: 1, message: "Số lượng phải lớn hơn 0" }
                ]}
              >
                <InputNumber
                  placeholder="Nhập số lượng"
                  style={{ width: "100%" }}
                  min={1}
                />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                name="max_price"
                label="Giá trị tối đa (VND)"
                rules={[
                  { required: true, message: "Vui lòng nhập giá trị tối đa!" },
                  { type: 'number', min: 1000, message: "Giá trị tối đa phải lớn hơn 1,000 VND" },
                  { validator: validateMaxPrice }
                ]}
              >
                <InputNumber
                  placeholder="Nhập giá trị tối đa"
                  style={{ width: "100%" }}
                  min={1000}
                  max={500000}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                name="name"
                label="Tên chương trình"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên chương trình!",
                  },
                  {
                    min: 5,
                    message: "Tên chương trình phải có ít nhất 5 ký tự"
                  },
                  {
                    max: 100,
                    message: "Tên chương trình không được vượt quá 100 ký tự"
                  }
                ]}
              >
                <Input placeholder="Nhập tên chương trình" maxLength={100} />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                name="dateRange"
                label="Ngày áp dụng"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ngày áp dụng!"
                  },
                  {
                    validator: validateDates
                  }
                ]}
              >
                <RangePicker
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                  placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                  disabledDate={(current) => {
                    // Disable dates before today
                    return current && current < dayjs().startOf('day');
                  }}
                />
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    </Card>
  );
};

export default Discount;