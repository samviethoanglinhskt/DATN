import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import instance from "../../config/axiosInstance";
import { Product } from "src/types/product";
import { Select, Input, Button, Pagination } from "antd"; // Import các component từ Ant Design

const { Option } = Select;

const ProductList = () => {
  const { id } = useParams<{ id: string }>(); // Lấy ID danh mục từ URL
  const navigate = useNavigate(); // Hàm điều hướng

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Sắp xếp
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [searchQuery, setSearchQuery] = useState(""); // Từ khóa tìm kiếm
  const itemsPerPage = 6; // Số sản phẩm mỗi trang

  // Lấy toàn bộ danh sách sản phẩm
  const { data: allProducts, isLoading: loadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await instance.get(
        "http://127.0.0.1:8000/api/product-list"
      );
      return response.data;
    },
  });

  // Lọc sản phẩm theo tb_category_id
  const filteredProducts = Array.isArray(allProducts?.data)
    ? allProducts.data.filter(
        (product: Product) => product.tb_category_id === Number(id)
      )
    : [];

  // Lọc sản phẩm theo từ khóa tìm kiếm
  const searchedProducts = filteredProducts.filter((product: any) =>
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

  if (loadingProducts)
    return <div className="text-center my-5">Loading products...</div>;

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <h3 className="text-center mb-5" style={{ marginTop: "80px" }}>
          Danh Mục Sản Phẩm
        </h3>

        {/* Bộ lọc */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          {/* Sắp xếp */}
          <Select
            style={{ width: "200px" }}
            value={sortOrder}
            onChange={(value) => setSortOrder(value as "asc" | "desc")}
          >
            <Option value="asc">Giá: Thấp đến Cao</Option>
            <Option value="desc">Giá: Cao đến Thấp</Option>
          </Select>

          {/* Tìm kiếm */}
          <div className="d-flex">
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "300px", marginRight: "10px" }}
            />
            <Button
              type="primary"
              onClick={() => setCurrentPage(1)} // Reset về trang đầu khi tìm kiếm
            >
              Tìm kiếm
            </Button>
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((product: Product) => (
              <div
                key={product.id}
                className="col product-item"
                onClick={() => navigate(`/product/${product.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="card h-100 product-card border-0">
                  <div className="position-relative">
                    {product.variants[0]?.images[0] && (
                      <img
                        src="https://naidecor.vn/wp-content/uploads/2020/07/BST-MP-11.jpg"
                        className="card-img-top product-image"
                        alt={product.name}
                      />
                    )}
                  </div>
                  <div className="card-body text-center">
                    <h5 className="card-title product-name">{product.name}</h5>
                    <p className="product-price fw-bold">
                      ${product.variants[0]?.price}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center my-5">Không có sản phẩm nào.</div>
          )}
        </div>

        {/* Phân trang */}
        <div className="d-flex justify-content-center mt-4">
          <Pagination
            current={currentPage}
            total={sortedProducts.length}
            pageSize={itemsPerPage}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
          />
        </div>
      </div>
    </section>
  );
};

export default ProductList;
