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
    title: "Tên sản phẩm",
    dataIndex: "name",
    key: "name",
    render: (text: string) => (
      <span
        className="text-blue-600 cursor-pointer hover:underline"
      >
        {text}
      </span>
    ),
  },
  {
    title: "Ảnh sản phẩm",
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
    title: "Danh mục",
    dataIndex: "tb_category_id",
    key: "category",
    render: (categoryId: number) =>
      categories.find((c) => c.id === categoryId)?.name || "-",
  },
  {
    title: "Thương hiệu",
    dataIndex: "tb_brand_id",
    key: "brand",
    render: (brandId: number) =>
      brands.find((b) => b.id === brandId)?.name || "-",
  },
  {
    title: "Trạng thái",
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
    title: "Thao tác",
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
         
        </Button>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            handleEdit(record.id);
          }}
        >
         
        </Button>
        <Popconfirm
          title="Xóa sản phẩm"
          description="Bạn có muốn xóa sản phẩm này không?"
          onConfirm={(e) => {
            e?.stopPropagation();
            handleDelete(record.id);
          }}
          okText="Đồng ý"
          cancelText="Không"
          okButtonProps={{ danger: true }}
        >
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={(e) => e.stopPropagation()}
          >
          
          </Button>
        </Popconfirm>
      </Space>
    ),
  },
];