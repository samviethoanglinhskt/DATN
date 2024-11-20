import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Card,
  message,
} from "antd";
import {
  PlusOneOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { IProduct, IProductDetail } from "./Type";
import { ProductService } from "./ProductServie";
import { ProductDetailModal } from "./ProductDetail";
import { columns } from "./TableColums";


const ProductListMain: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [sizes, setSizes] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProductDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [products, categories, brands, sizes, colors] = await Promise.all([
        ProductService.getProducts(),
        ProductService.getCategories(),
        ProductService.getBrands(),
        ProductService.getSizes(),
        ProductService.getColors()
      ]);

      setProducts(products);
      setCategories(categories);
      setBrands(brands);
      setSizes(sizes);
      setColors(colors);
    } catch (error) {
      message.error("Failed to fetch initial data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await ProductService.deleteProduct(id);
      message.success("Product deleted successfully");
      fetchInitialData();
    } catch (error) {
      message.error("Failed to delete product");
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/product/edit/${id}`, {
      state: {
        categories,
        brands,
        sizes,
        colors
      }
    });
  };

  const handleViewDetail = async (id: number) => {
    try {
      setDetailLoading(true);
      const productDetail = await ProductService.getProductDetail(id);
      setSelectedProduct(productDetail);
      setDetailModalVisible(true);
    } catch (error) {
      message.error("Failed to fetch product details");
    } finally {
      setDetailLoading(false);
    }
  };

  const tableColumns = columns({
    categories,
    brands,
    handleEdit,
    handleDelete,
    handleViewDetail
  });

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <span>Quản lý sản phẩm</span>
          <span className="text-gray-500">: {products.length} Sản phẩm</span>
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
        columns={tableColumns}
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

      <ProductDetailModal
        visible={detailModalVisible}
        onClose={() => setDetailModalVisible(false)}
        loading={detailLoading}
        product={selectedProduct}
        categories={categories}
        brands={brands}
        sizes={sizes}
        colors={colors}
      />
    </Card>
  );
};

export default ProductListMain;