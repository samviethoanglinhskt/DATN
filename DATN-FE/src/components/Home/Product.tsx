import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  Input,
  Row,
  Col,
  Card,
  Pagination,
  Checkbox,
  Slider,
  Breadcrumb,
  Skeleton,
} from "antd";
import instance from "../../config/axiosInstance";
import { Product } from "src/types/product";

const { Option } = Select;

const ProductList = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const itemsPerPage = 6;

  // Query lấy thương hiệu
  const { data: brands, isLoading: loadingBrands } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const response = await instance.get("http://127.0.0.1:8000/api/brand");
      console.log("Thương hiệu:", response.data); // Log thương hiệu
      return response.data;
    },
  });

  // Query lấy sản phẩm
  const { data: allProducts, isLoading: loadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await instance.get(
        "http://127.0.0.1:8000/api/product-list"
      );
      console.log("Tất cả sản phẩm:", response.data.data); // Log tất cả sản phẩm
      return response.data.data;
    },
  });

  // Lọc sản phẩm
  const filteredProductsByCategory = Array.isArray(allProducts)
    ? allProducts.filter(
      (product: Product) => product.tb_category_id === Number(id)
    )
    : [];

  console.log("Sản phẩm theo danh mục:", filteredProductsByCategory);

  const filteredProductsByBrand =
    selectedBrands.length > 0
      ? filteredProductsByCategory.filter((product: Product) =>
        selectedBrands.includes(product.tb_brand_id)
      )
      : filteredProductsByCategory;

  console.log("Sản phẩm theo thương hiệu:", filteredProductsByBrand);

  const filteredByPrice = filteredProductsByBrand.filter((product: Product) => {
    const price = product.variants?.[0]?.price || 0;
    console.log(`Sản phẩm ${product.name} có giá: ${price}`); // Kiểm tra giá sản phẩm
    return price >= priceRange[0] && price <= priceRange[1];
  });

  console.log("Sản phẩm theo giá:", filteredByPrice);

  // Kiểm tra việc tìm kiếm
  const searchedProducts = filteredByPrice.filter((product: Product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log("Sản phẩm tìm kiếm:", searchedProducts);

  // Kiểm tra giá trị của `searchQuery` (giả sử là trống)
  console.log("Tìm kiếm với từ khóa:", searchQuery);

  // Kiểm tra giá trị `priceRange`
  console.log("Khoảng giá:", priceRange);

  const sortedProducts = [...searchedProducts].sort((a, b) => {
    const priceA = a.variants?.[0]?.price || 0;
    const priceB = b.variants?.[0]?.price || 0;
    return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
  });

  console.log("Sản phẩm sắp xếp:", sortedProducts);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  console.log("Sản phẩm phân trang:", paginatedProducts);

  // Skeleton loader
  const renderSkeleton = () => (
    <Col xs={24} sm={12} md={8} lg={6}>
      <Card>
        <Skeleton.Image style={{ width: "100%", height: 300 }} />
        <Skeleton active paragraph={{ rows: 2 }} />
      </Card>
    </Col>
  );

  if (loadingProducts || loadingBrands)
    return (
      <Row gutter={[48, 48]}>
        {Array.from({ length: itemsPerPage }).map((_, index) => (
          <React.Fragment key={index}>{renderSkeleton()}</React.Fragment>
        ))}
      </Row>
    );

  return (
    <section
      className="py-5 bg-light"
      style={{
        minHeight: "100vh",
        padding: "40px 20px", // Giảm padding trên và dưới để cân bằng hơn
        marginTop: "40px", // Thêm marginTop để đẩy phần giao diện xuống
      }}
    >
      <div className="container" style={{ width: "70%" }}>
        {/* Breadcrumb */}
        <Breadcrumb style={{ marginBottom: "20px" }}>
          <Breadcrumb.Item onClick={() => navigate("/")}>
            Trang chủ
          </Breadcrumb.Item>
          <Breadcrumb.Item>Danh mục sản phẩm</Breadcrumb.Item>
          <Breadcrumb.Item>{id ? `ID: ${id}` : "Tất cả"}</Breadcrumb.Item>
        </Breadcrumb>

        <Row gutter={[32, 32]}>
          {/* Sidebar */}
          <Col span={6} style={{ marginTop: "40px" }}>
            <Card style={{ padding: "10px" }}>
              <h5>Sắp xếp giá:</h5>
              <Select
                style={{ width: "100%", marginBottom: "10px" }}
                value={sortOrder}
                onChange={(value) => setSortOrder(value as "asc" | "desc")}
              >
                <Option value="asc">Thấp đến cao</Option>
                <Option value="desc">Cao đến thấp</Option>
              </Select>
              <h5>Chọn thương hiệu:</h5>
              <Checkbox.Group
                options={brands.map((brand: { id: number; name: string }) => ({
                  label: brand.name,
                  value: brand.id,
                }))}
                value={selectedBrands}
                onChange={(checkedValues) =>
                  setSelectedBrands(checkedValues as number[])
                }
              />
              <h5>Khoảng giá:</h5>
              <Slider
                range
                min={0}
                max={10000000}
                step={10}
                defaultValue={priceRange}
                onChange={(value) => setPriceRange(value as [number, number])}
              />
              <div>
                Giá từ: ${priceRange[0]} - ${priceRange[1]}
              </div>
            </Card>
          </Col>

          {/* Product List */}
          <Col span={18} style={{ marginTop: "40px" }}>
            <div className="d-flex justify-content-end mb-4">
              <Input
                style={{ width: 300 }}
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Row gutter={[48, 48]}>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product: Product) => (
                  <div key={product.id} className="col product-item">
                    <div className="card h-100 product-card border-0" style={{ width: "300px" }}>
                      <div className="position-relative">
                        <div className="product-image-wrapper">
                          <img
                            src={`http://127.0.0.1:8000/storage/${product.image}`}
                            className="card-img-top product-image"
                            alt={product.name}
                          />
                          <div className="product-overlay">
                            <button className="btn btn-light buy-button">
                              Mua Ngay
                            </button>
                          </div>
                        </div>
                        {/* <button className="btn wishlist-btn position-absolute top-0 end-0 m-2">
                          <i className="far fa-heart"></i>
                        </button> */}
                      </div>

                      <div className="card-body text-center">
                        <Link to={`/product/${product.id}`} className="product-link">
                          <h5 className="product-title">{product.name}</h5>
                        </Link>
                        <p className="product-price fw-bold">
                          ${product.variants[0]?.price}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center my-5">
                  Không tìm thấy sản phẩm nào khớp với bộ lọc.
                </div>
              )}
            </Row>
            <Pagination
              current={currentPage}
              pageSize={itemsPerPage}
              total={sortedProducts.length}
              onChange={(page) => setCurrentPage(page)}
              style={{ textAlign: "center", marginTop: "40px" }}
            />
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default ProductList;
