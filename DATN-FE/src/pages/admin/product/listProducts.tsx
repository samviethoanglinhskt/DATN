import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  Card,
  message,
  Modal,
  Spin,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOneOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "src/config/axiosInstance";
import "./ProductList.css";

interface Product {
  id: number;
  name: string;
  image: string;
  tb_category_id: number;
  tb_brand_id: number;
  status: string;
  variants: any[];
}

interface ProductDetail {
  id: number;
  name: string;
  image: string;
  tb_category_id: number;
  tb_brand_id: number;
  status: string;
  description: string;
  variants: Array<{
    id: number;
    tb_size_id: number;
    tb_color_id: number;
    sku: string;
    price: number;
    quantity: number;
    status: string;
    images: string[];
  }>;
}

const BASE_URL = "http://127.0.0.1:8000";
const STORAGE_URL = `${BASE_URL}/storage`;

// Reusable Image Components
const ProductImage = ({
  src,
  size = "100",
}: {
  src: string;
  size?: string;
}) => {
  return (
    <div
      className={`relative w-[${size}px] h-[${size}px] overflow-hidden rounded-lg cursor-pointer`}
      onClick={(e) => {
        e.stopPropagation();
        window.open(`${STORAGE_URL}/${src}`, "_blank");
      }}
    >
      <img
        src={`${STORAGE_URL}/${src}`}
        alt="Product"
        className="w-full h-full object-contain border border-gray-200 hover:opacity-80 transition-all duration-300"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/placeholder-product.png";
        }}
      />
    </div>
  );
};
const DetailImage = ({ src }: { src: string }) => {
  return (
    <div
      className="relative bg-gray-50 rounded-lg overflow-hidden border border-gray-200"
      style={{
        width: "400px",
        height: "400px",
      }}
      onClick={(e) => {
        e.stopPropagation();
        window.open(`${STORAGE_URL}/${src}`, "_blank");
      }}
    >
      <img
        src={`${STORAGE_URL}/${src}`}
        alt="Product detail"
        className="w-full h-full hover:opacity-80 transition-all duration-300 cursor-pointer"
        style={{ objectFit: "contain" }}
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/placeholder-product.png";
        }}
      />
    </div>
  );
};
const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [sizes, setSizes] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductDetail | null>(
    null
  );
  const [detailLoading, setDetailLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch functions - keeping all existing logic
  const fetchInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchBrands(),
        fetchSizes(),
        fetchColors(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  // All your existing fetch functions remain the same
  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("/api/product-list");
      setProducts(response.data.data);
    } catch (error) {
      message.error("Failed to fetch products");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/api/category");
      setCategories(response.data);
    } catch (error) {
      message.error("Failed to fetch categories");
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axiosInstance.get("/api/brand");
      setBrands(response.data);
    } catch (error) {
      message.error("Failed to fetch brands");
    }
  };

  const fetchSizes = async () => {
    try {
      const response = await axiosInstance.get("/api/size");
      setSizes(response.data);
    } catch (error) {
      message.error("Failed to fetch sizes");
    }
  };

  const fetchColors = async () => {
    try {
      const response = await axiosInstance.get("/api/color");
      setColors(response.data);
    } catch (error) {
      message.error("Failed to fetch colors");
    }
  };

  const fetchProductDetail = async (id: number) => {
    try {
      setDetailLoading(true);
      const response = await axiosInstance.get(`/api/product/${id}`);
      setSelectedProduct(response.data);
    } catch (error) {
      message.error("Failed to fetch product details");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/api/product/${id}`);
      message.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      message.error("Failed to delete product");
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/product/edit/${id}`);
  };

  const handleViewDetail = async (id: number) => {
    await fetchProductDetail(id);
    setDetailModalVisible(true);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Product) => (
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
    // Other columns remain exactly the same
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
      render: (_: any, record: Product) => (
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

  const renderDetailModal = () => (
    <Modal
      title={
        <div className="d-flex align-items-center border-bottom pb-3">
          <h4 className="mb-0 text-primary">Chi tiết sản phẩm</h4>
          <span className="ms-2 badge bg-secondary">{selectedProduct?.id}</span>
        </div>
      }
      open={detailModalVisible}
      onCancel={() => setDetailModalVisible(false)}
      width={1200}
      footer={[
        <Button
          key="close"
          onClick={() => setDetailModalVisible(false)}
          className="px-4"
        >
          Close
        </Button>,
      ]}
    >
      {detailLoading ? (
        <div className="d-flex justify-content-center py-5">
          <Spin size="large" />
        </div>
      ) : selectedProduct ? (
        <div className="container-fluid p-0">
          <div className="row g-4 mb-4">
            {/* Basic Information Column */}
            <div className="col-md-7">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title border-bottom pb-3 mb-3">
                    Thông tin cơ bản
                  </h5>
                  <div className="row g-3">
                    <div className="col-12">
                      <div className="d-flex">
                        <span className="fw-semibold text-muted w-25">
                          Name:
                        </span>
                        <span>{selectedProduct.name}</span>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="d-flex">
                        <span className="fw-semibold text-muted w-25">
                          Category:
                        </span>
                        <span>
                          {
                            categories.find(
                              (c) => c.id === selectedProduct.tb_category_id
                            )?.name
                          }
                        </span>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="d-flex">
                        <span className="fw-semibold text-muted w-25">
                          Brand:
                        </span>
                        <span>
                          {
                            brands.find(
                              (b) => b.id === selectedProduct.tb_brand_id
                            )?.name
                          }
                        </span>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="d-flex align-items-center">
                        <span className="fw-semibold text-muted w-25">
                          Status:
                        </span>
                        <span
                          className={`badge ${
                            selectedProduct.status === "còn hàng"
                              ? "bg-success-subtle text-success"
                              : "bg-danger-subtle text-danger"
                          } px-3 py-2`}
                        >
                          {selectedProduct.status}
                        </span>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="d-flex">
                        <span className="fw-semibold text-muted w-25">
                          Description:
                        </span>
                        <span className="text-secondary">
                          {selectedProduct.description || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Image Column */}
            <div className="col-md-5">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body d-flex justify-content-center align-items-center">
                  <DetailImage src={selectedProduct.image} />
                </div>
              </div>
            </div>
          </div>

          {/* Variants Section */}
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                <span>Biến thể sản phẩm</span>
                <span className="badge bg-primary">
                  {selectedProduct.variants.length}
                </span>
              </h5>

              <div
                className="variants-container"
                style={{ maxHeight: "500px", overflowY: "auto" }}
              >
                {selectedProduct.variants.map((variant) => (
                  <div key={variant.id} className="card mb-3 border shadow-sm">
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="row g-2">
                            <div className="col-12">
                              <div className="d-flex">
                                <span className="fw-semibold text-muted w-25">
                                  Size:
                                </span>
                                <span>
                                  {
                                    sizes.find(
                                      (s) => s.id === variant.tb_size_id
                                    )?.name
                                  }
                                </span>
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="d-flex">
                                <span className="fw-semibold text-muted w-25">
                                  Color:
                                </span>
                                <span>
                                  {
                                    colors.find(
                                      (c) => c.id === variant.tb_color_id
                                    )?.name
                                  }
                                </span>
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="d-flex">
                                <span className="fw-semibold text-muted w-25">
                                  SKU:
                                </span>
                                <span>{variant.sku}</span>
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="d-flex">
                                <span className="fw-semibold text-muted w-25">
                                  Price:
                                </span>
                                <span className="text-primary fw-semibold">
                                  ${variant.price.toLocaleString()}
                                </span>
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="d-flex">
                                <span className="fw-semibold text-muted w-25">
                                  Quantity:
                                </span>
                                <span>{variant.quantity}</span>
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="d-flex align-items-center">
                                <span className="fw-semibold text-muted w-25">
                                  Status:
                                </span>
                                <span
                                  className={`badge ${
                                    variant.status === "còn hàng"
                                      ? "bg-success-subtle text-success"
                                      : "bg-danger-subtle text-danger"
                                  } px-3 py-2`}
                                >
                                  {variant.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {variant.images && variant.images.length > 0 && (
                          <div className="col-md-6">
                            <p className="fw-semibold text-muted mb-2">
                              Variant Images:
                            </p>
                            <div className="row g-2">
                              {variant.images && variant.images.length > 0 && (
                                <div className="col-md-6">
                                  <p className="fw-semibold text-muted mb-2">
                                    Variant Images:
                                  </p>
                                  <div className="row g-2">
                                    {variant.images.map((image, imgIndex) => (
                                      <div key={imgIndex} className="col-auto">
                                        <ProductImage src={image} />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-inbox fs-1 d-block mb-3"></i>
          No product details available
        </div>
      )}
    </Modal>
  );

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <span>Quản lý sản phẩm</span>
          <span className="text-gray-500">
            : {products.length} Sản phẩm
          </span>
        </div>
      }
      extra={
        <Button
          type="primary"
          icon={<PlusOneOutlined />}
          onClick={() => navigate("/admin/product/create")}
        >
          Add Product
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        onRow={(record) => ({
          onClick: () => handleEdit(record.id),
          className: "cursor-pointer hover:bg-gray-50",
        })}
      />
      {renderDetailModal()}
    </Card>
  );
};

export default ProductList;
