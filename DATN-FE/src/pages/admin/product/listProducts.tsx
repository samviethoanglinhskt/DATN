import React, { useState, useEffect } from "react";
import { Table, Button, Space, Popconfirm, Card, message, Modal, Spin } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOneOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "src/config/axiosInstance";

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

const BASE_URL = 'http://127.0.0.1:8000';

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [sizes, setSizes] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchProducts(), 
        fetchCategories(), 
        fetchBrands(),
        fetchSizes(),
        fetchColors()
      ]);
    } finally {
      setLoading(false);
    }
  };

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
      render: (image: string) => (
        <div onClick={() => window.open(`${BASE_URL}/${image}`, "_blank")}>
          <img
            src={`${BASE_URL}/${image}`}
            alt="Product"
            className="w-12 h-12 object-cover rounded cursor-pointer hover:opacity-80"
          />
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
      render: (_: any, record: Product) => (
        <Space>
          <Button
            type="primary"
            icon={<VisibilityOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetail(record.id);
            }}
            style={{ backgroundColor: '#8c8c8c' }}
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
      title="Product Detail"
      open={detailModalVisible}
      onCancel={() => setDetailModalVisible(false)}
      width={1000}
      footer={[
        <Button key="close" onClick={() => setDetailModalVisible(false)}>
          Close
        </Button>
      ]}
    >
      {detailLoading ? (
        <div className="flex justify-center py-5">
          <Spin size="large" />
        </div>
      ) : selectedProduct ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {selectedProduct.name}</p>
                <p><span className="font-medium">Category:</span> {categories.find(c => c.id === selectedProduct.tb_category_id)?.name}</p>
                <p><span className="font-medium">Brand:</span> {brands.find(b => b.id === selectedProduct.tb_brand_id)?.name}</p>
                <p>
                  <span className="font-medium">Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded ${
                    selectedProduct.status === "còn hàng" 
                      ? "text-green-500 bg-green-50" 
                      : "text-red-500 bg-red-50"
                  }`}>
                    {selectedProduct.status}
                  </span>
                </p>
                <p><span className="font-medium">Description:</span> {selectedProduct.description || 'N/A'}</p>
              </div>
              <div className="mt-4">
                <span className="font-medium">Product Image:</span>
                <img
                  src={`${BASE_URL}/${selectedProduct.image}`}
                  alt="Product"
                  className="mt-2 max-w-[200px] rounded shadow cursor-pointer hover:opacity-80"
                  onClick={() => window.open(`${BASE_URL}/${selectedProduct.image}`, '_blank')}
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Variants ({selectedProduct.variants.length})</h3>
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {selectedProduct.variants.map((variant, index) => (
                  <Card key={variant.id} size="small" className="w-full">
                    <div className="space-y-2">
                      <p><span className="font-medium">Size:</span> {sizes.find(s => s.id === variant.tb_size_id)?.name}</p>
                      <p><span className="font-medium">Color:</span> {colors.find(c => c.id === variant.tb_color_id)?.name}</p>
                      <p><span className="font-medium">SKU:</span> {variant.sku}</p>
                      <p><span className="font-medium">Price:</span> ${variant.price.toLocaleString()}</p>
                      <p><span className="font-medium">Quantity:</span> {variant.quantity}</p>
                      <p>
                        <span className="font-medium">Status:</span>
                        <span className={`ml-2 px-2 py-1 rounded text-sm ${
                          variant.status === "còn hàng" 
                            ? "text-green-500 bg-green-50" 
                            : "text-red-500 bg-red-50"
                        }`}>
                          {variant.status}
                        </span>
                      </p>
                      {variant.images && variant.images.length > 0 && (
                        <div>
                          <span className="font-medium">Variant Images:</span>
                          <div className="flex gap-2 mt-2">
                            {variant.images.map((image, imgIndex) => (
                              <img
                                key={imgIndex}
                                src={`${BASE_URL}/${image}`}
                                alt={`Variant ${imgIndex + 1}`}
                                className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-80"
                                onClick={() => window.open(`${BASE_URL}/${image}`, '_blank')}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-5">No product details available</div>
      )}
    </Modal>
  );

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <span>Product Management</span>
          <span className="text-gray-500">Total: {products.length} products</span>
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