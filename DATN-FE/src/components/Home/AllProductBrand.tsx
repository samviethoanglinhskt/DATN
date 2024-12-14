import React, { useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
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
  Skeleton,
  Tooltip,
  Button,
} from "antd";
import {
  HeartOutlined,
  ShoppingCartOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import instance from "../../config/axiosInstance";
import { Brand, Product } from "src/types/product";
import "./Productlist.css";

const { Option } = Select;

const AllProductBrand = () => {
  // Giữ nguyên các state và logic cũ
  const { id: brandId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const itemsPerPage = 8; // Tăng số sản phẩm mỗi trang
  const handleClearFilters = () => {
    navigate("/product");
  };
  // Giữ nguyên các query
  const { data: brands, isLoading: loadingBrands } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const response = await instance.get("http://127.0.0.1:8000/api/brand");
      return response.data;
    },
  });

  const { data: allProducts, isLoading: loadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await instance.get(
        "http://127.0.0.1:8000/api/product-list"
      );
      return response.data.data;
    },
  });

  // Giữ nguyên logic lọc
  const filteredProductsByBrand =
    brandId !== undefined
      ? (allProducts || []).filter(
          (product: Product) => product.tb_brand_id.toString() === brandId
        )
      : allProducts || [];

  const filteredByPrice = (filteredProductsByBrand || []).filter(
    (product: Product) => {
      const price = product.variants?.[0]?.price || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    }
  );

  const searchedProducts = (filteredByPrice || []).filter((product: Product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedProducts = [...searchedProducts].sort((a, b) => {
    const priceA = a.variants?.[0]?.price || 0;
    const priceB = b.variants?.[0]?.price || 0;
    return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Skeleton loader với thiết kế mới
  const renderSkeleton = () => (
    <Col xs={24} sm={12} md={8} lg={6}>
      <Card className="product-card-skeleton">
        <Skeleton.Image style={{ width: "100%", height: 250 }} active />
        <Skeleton active paragraph={{ rows: 2 }} />
      </Card>
    </Col>
  );

  if (loadingProducts || loadingBrands) {
    return (
      <div className="products-container">
        <Row gutter={[24, 24]}>
          {Array.from({ length: itemsPerPage }).map((_, index) => (
            <React.Fragment key={index}>{renderSkeleton()}</React.Fragment>
          ))}
        </Row>
      </div>
    );
  }

  return (
    <div className="products-page">
      {/* Header Area */}
      <div className="products-header">
        <div style={{ marginTop: 10 }}>
          <div className="bread-crumb flex-w p-l-25 p-r-15 p-t-30 p-lr-0-lg">
            <button
              onClick={() => navigate("/")}
              className="stext-109 cl8 hov-cl1 trans-04"
            >
              Trang chủ
              <i
                className="fa fa-angle-right m-l-9 m-r-10"
                aria-hidden="true"
              ></i>
            </button>

            <button
              onClick={() => navigate("/product")}
              className="stext-109 cl8 hov-cl1 trans-04"
            >
              Thương hiệu
              <i
                className="fa fa-angle-right m-l-9 m-r-10"
                aria-hidden="true"
              ></i>
            </button>

            {brandId && brands && (
              <span className="stext-109 cl4">
                {
                  brands.find((brand: Brand) => brand.id.toString() === brandId)
                    ?.name
                }
              </span>
            )}
          </div>
        </div>
        {/* thêm tên thương hiệu ở đuôi và có nút xóa bỏ lọc và reload lại trang product */}
        <div className="header-controls" style={{ marginTop: 100 }}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <Row gutter={24} className="products-content">
        {/* Sidebar Filters */}
        <Col xs={24} md={6}>
          <Card className="filters-card">
            <div className="filter-section">
              <h4>
                <FilterOutlined /> Bộ lọc
              </h4>
              <Button
                style={{ width: "120px" }}
                type="primary"
                danger
                onClick={handleClearFilters}
              >
                Xóa Bộ Lọc
              </Button>

              <div className="filter-group">
                <h5>Sắp xếp giá</h5>
                <Select
                  className="sort-select"
                  value={sortOrder}
                  onChange={(value) => setSortOrder(value as "asc" | "desc")}
                >
                  <Option value="asc">Giá thấp đến cao</Option>
                  <Option value="desc">Giá cao đến thấp</Option>
                </Select>
              </div>

              <div className="filter-group">
                <h5>Thương hiệu</h5>
                <Checkbox.Group
                  className="brand-checkboxes"
                  options={brands.map(
                    (brand: { id: number; name: string }) => ({
                      label: brand.name,
                      value: brand.id,
                    })
                  )}
                  value={selectedBrands}
                  onChange={(checkedValues) =>
                    setSelectedBrands(checkedValues as number[])
                  }
                />
              </div>

              <div className="filter-group">
                <h5>Khoảng giá</h5>
                <Slider
                  range
                  min={0}
                  max={10000000}
                  step={100000}
                  defaultValue={priceRange}
                  onChange={(value) => setPriceRange(value as [number, number])}
                  className="price-slider"
                />
                <div className="price-range-display">
                  {priceRange[0].toLocaleString("vi-VN")}đ -{" "}
                  {priceRange[1].toLocaleString("vi-VN")}đ
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Product Grid */}
        <Col xs={24} md={18}>
          <Row gutter={[24, 24]}>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product: Product) => (
                <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                  <Card
                    className="product-card"
                    cover={
                      <div className="product-image-container">
                        <img
                          src={`http://127.0.0.1:8000/storage/${product.image}`}
                          alt={product.name}
                          className="product-image"
                        />
                        {/* <div className="product-overlay">
                          <div className="product-actions">
                            <Tooltip title="Thêm vào giỏ hàng">
                              <button className="action-button">
                                <ShoppingCartOutlined />
                              </button>
                            </Tooltip>
                            <Tooltip title="Thêm vào yêu thích">
                              <button className="action-button">
                                <HeartOutlined />
                              </button>
                            </Tooltip>
                          </div>
                        </div> */}
                      </div>
                    }
                    actions={[
                      <Link
                        to={`/product/${product.id}`}
                        className="product-link"
                      >
                        <button className="buy-now-button">Xem thêm</button>
                      </Link>,
                    ]}
                  >
                    <Link
                      to={`/product/${product.id}`}
                      className="product-link"
                    >
                      <h3 className="product-name">{product.name}</h3>
                      <div className="product-price">
                        {product.variants[0]?.price?.toLocaleString("vi-VN")}đ
                      </div>
                    </Link>
                  </Card>
                </Col>
              ))
            ) : (
              <div className="no-products">
                <h3>Không tìm thấy sản phẩm nào khớp với bộ lọc.</h3>
              </div>
            )}
          </Row>

          <Pagination
            current={currentPage}
            pageSize={itemsPerPage}
            total={sortedProducts.length}
            onChange={(page) => setCurrentPage(page)}
            className="pagination"
            showSizeChanger={false}
          />
        </Col>
      </Row>
    </div>
  );
};

export default AllProductBrand;
