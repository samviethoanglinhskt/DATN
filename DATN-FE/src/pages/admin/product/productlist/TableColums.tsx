import { Button, Space, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined, VisibilityOutlined } from "@mui/icons-material";
import { IProduct, TableColumnProps } from "./Type";
import { ProductImage } from "./ProductImage";


export const columns = ({
  categories,
  brands,
  handleEdit,
  handleDelete,
  handleViewDetail
}: TableColumnProps) => [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text: string, record: IProduct) => (
      <span
        className="text-blue-600 cursor-pointer hover:underline"
        onClick={() => handleEdit(record.id)}
      >
        {text}
      </span>
    ),
  },
  {
    title: "Image",
    dataIndex: "image",
    key: "image",
    width: 120,
    render: (image: string) => (
      <div className="flex justify-center items-center">
        <ProductImage src={image} />
      </div>
    ),
  },
  {
    title: "Category",
    dataIndex: "tb_category_id",
    key: "category",
    render: (categoryId: number) =>
      categories.find((c) => c.id === categoryId)?.name || "-",
  },
  {
    title: "Brand",
    dataIndex: "tb_brand_id",
    key: "brand",
    render: (brandId: number) =>
      brands.find((b) => b.id === brandId)?.name || "-",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: string) => (
      <span
        className={`px-2 py-1 rounded ${
          status === "còn hàng"
            ? "text-green-500 bg-green-50"
            : "text-red-500 bg-red-50"
        }`}
      >
        {status}
      </span>
    ),
  },
  {
    title: "Actions",
    key: "actions",
    align: "center" as const,
    render: (_: any, record: IProduct) => (
      <Space>
        <Button
          type="primary"
          icon={<VisibilityOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetail(record.id);
          }}
          style={{ backgroundColor: "#8c8c8c" }}
        >
          View
        </Button>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            handleEdit(record.id);
          }}
        >
          Edit
        </Button>
        <Popconfirm
          title="Delete Product"
          description="Are you sure to delete this product?"
          onConfirm={(e) => {
            e?.stopPropagation();
            handleDelete(record.id);
          }}
          okText="Yes"
          cancelText="No"
          okButtonProps={{ danger: true }}
        >
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={(e) => e.stopPropagation()}
          >
            Delete
          </Button>
        </Popconfirm>
      </Space>
    ),
  },
];