import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Select, Button, Input, Row, Col, Card, Pagination, Spin } from "antd";
import instance from "../../config/axiosInstance";
import { Product } from "src/types/product";

const { Option } = Select;

const ProductList = () => {
  const { id } = useParams<{ id: string }>(); // Lấy ID danh mục từ URL
  const navigate = useNavigate(); // Hàm điều hướng

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Sắp xếp
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [searchQuery, setSearchQuery] = useState(""); // Từ khóa tìm kiếm
  const [selectedBrand, setSelectedBrand] = useState<string>(""); // Thương hiệu được chọn
  const itemsPerPage = 6; // Số sản phẩm mỗi trang

  // Lấy danh sách thương hiệu
  const { data: brands, isLoading: loadingBrands } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      try {
        const response = await instance.get("http://127.0.0.1:8000/api/brand");
        return response.data; // Xử lý dữ liệu API trả về
      } catch (error) {
        console.error("Error fetching brands", error);
        return [];
      }
    },
  });

  // Lấy toàn bộ danh sách sản phẩm
  const { data: allProducts, isLoading: loadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        const response = await instance.get(
          "http://127.0.0.1:8000/api/product-list"
        );
        return response.data.data; // Chú ý dùng response.data.data thay vì response.data
      } catch (error) {
        console.error("Error fetching products", error);
        return [];
      }
    },
  });

  // Lọc sản phẩm theo danh mục (category)
  const filteredProductsByCategory = Array.isArray(allProducts)
    ? allProducts.filter(
        (product: Product) => product.tb_category_id === Number(id)
      )
    : [];

  // Lọc theo thương hiệu (nếu có)
  const filteredProductsByBrand = selectedBrand
    ? filteredProductsByCategory.filter(
        (product: Product) => product.tb_brand_id === Number(selectedBrand)
      )
    : filteredProductsByCategory;

  // Lọc theo từ khóa tìm kiếm
  const searchedProducts = filteredProductsByBrand.filter((product: Product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sắp xếp sản phẩm theo giá
  const sortedProducts = [...searchedProducts].sort((a, b) => {
    const priceA = a.variants[0]?.price || 0;
    const priceB = b.variants[0]?.price || 0;
    return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
  });

  // Tính toán phân trang
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

  if (loadingProducts || loadingBrands)
    return <Spin size="large" className="text-center my-5" />; // Thêm loading spinner từ Ant Design

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <h3 className="text-center mb-5" style={{ marginTop: "80px" }}>
          Danh Mục Sản Phẩm
        </h3>

        {/* Bộ lọc */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          {/* Lọc theo thương hiệu */}
          <div>
            <h5>Lọc theo thương hiệu:</h5>
            <Select
              style={{ width: 200 }}
              value={selectedBrand}
              onChange={(value) => setSelectedBrand(value)}
              loading={loadingBrands}
            >
              <Option value="">Tất cả thương hiệu</Option>
              {brands && brands.length > 0 ? (
                brands.map((brand: { id: number; name: string }) => (
                  <Option key={brand.id} value={String(brand.id)}>
                    {brand.name}
                  </Option>
                ))
              ) : (
                <Option disabled>Không có thương hiệu nào</Option>
              )}
            </Select>
          </div>

          {/* Sắp xếp */}
          <Select
            style={{ width: 200 }}
            value={sortOrder}
            onChange={(value) => setSortOrder(value as "asc" | "desc")}
          >
            <Option value="asc">Giá: Thấp đến Cao</Option>
            <Option value="desc">Giá: Cao đến Thấp</Option>
          </Select>

          {/* Tìm kiếm */}
          <div>
            <Input
              style={{ width: 200 }}
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <Row gutter={[16, 16]}>
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((product: Product) => (
              <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  cover={
                    product.variants[0]?.images[0] && (
                      <img
                        alt={product.name}
                        src="https://picsum.photos/50/50"
                      />
                    )
                  }
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <Card.Meta
                    title={product.name}
                    description={`$${product.variants[0]?.price}`}
                  />
                </Card>
              </Col>
            ))
          ) : (
            <div className="text-center my-5">Không có sản phẩm nào.</div>
          )}
        </Row>

        {/* Phân trang */}
        <Pagination
          current={currentPage}
          pageSize={itemsPerPage}
          total={sortedProducts.length}
          onChange={(page) => setCurrentPage(page)}
          style={{ textAlign: "center", marginTop: "20px" }}
        />
      </div>
    </section>
  );
};

export default ProductList;
