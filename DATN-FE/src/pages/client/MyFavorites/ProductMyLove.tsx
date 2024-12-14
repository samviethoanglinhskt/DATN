import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, message, Skeleton } from "antd";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "src/config/axiosInstance";
import { DeleteOutlined, RemoveRedEyeOutlined } from "@mui/icons-material";
import "./style.css";
import { useFavorites } from "src/context/FavoriteProduct";
import { Favorite } from "src/types/favorite";


// Interfaces
interface Brand {
  id: number;
  name: string;
}


// ProductCard Component
const ProductCard: React.FC<{
  product: Favorite;
  onRemove: (id: number) => void;
  onClick: (id: number) => void;
}> = React.memo(({ product, onRemove, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className="col-md-4 col-lg-3 mb-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-card h-100">
        <div className="product-img-wrapper">
          {!imageLoaded && (
            <div className="skeleton-loader">
              <Skeleton.Image
                style={{ width: "100%", height: "240px" }}
                active
              />
            </div>
          )}
          <img
            src={`http://127.0.0.1:8000/storage/${product.product.image}`}
            className={`product-img ${imageLoaded ? "loaded" : ""}`}
            alt={product.product.name}
            onClick={() => onClick(product.id)}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
          {isHovered && imageLoaded && (
            <div className="action-buttons-wrapper">
              <button
                className="btn action-btn view-btn"
                onClick={() => onClick(product.id)}
              >
                <RemoveRedEyeOutlined /> Xem chi tiết
              </button>
            </div>
          )}
        </div>
        <div className="product-info">
          <h5 className="product-title" onClick={() => onClick(product.tb_product_id)}>
            {product.product.name}
          </h5>
          <p className="product-description">
            {product.product.description || "Không có mô tả"}
          </p>
          <div className="price-action">
            <span className="price">
              {product.product.variants[0]?.price?.toLocaleString()}đ
            </span>
            <button
              className="btn action-btn remove-btn"
              onClick={(e) => {
                e.stopPropagation();
                if (product.id !== undefined) {
                  onRemove(product.id);
                } else {
                  console.error("favoriteId is undefined");
                }
              }}
            >
              <DeleteOutlined />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

// LoadingState Component
const LoadingState = () => (
  <div className="row">
    {[1, 2, 3, 4].map((key) => (
      <div key={key} className="col-md-4 col-lg-3 mb-4">
        <div className="product-card h-100">
          <Skeleton.Image style={{ width: "100%", height: "240px" }} active />
          <div className="product-info">
            <Skeleton active paragraph={{ rows: 2 }} />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Main FavoritesPage Component
const FavoritesPage: React.FC = () => {
  const { favorites, removeFavorite, loading } = useFavorites();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<number | "all">("all");

  // Fetch brands
  const { data: brands = [] } = useQuery<Brand[]>({
    queryKey: ["brands"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/api/brand");
        return response.data;
      } catch (error) {
        console.error("Error fetching brands:", error);
        message.error("Không thể tải danh sách thương hiệu");
        return [];
      }
    },
  });

  // Filter products
  const filteredProducts = React.useMemo(() => {
    if (!favorites) return [];

    return favorites.filter((product) => {
      const matchesSearch = product.product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesBrand =
        selectedBrand === "all" || product.product.tb_brand_id === selectedBrand;

      return matchesSearch && matchesBrand;
    });
  }, [favorites, searchTerm, selectedBrand]);

  console.log(filteredProducts);

  // Brand filter component
  const renderBrandFilter = () => (
    <div className="flex mb-2 ml-2 mt-2 btnn gap-2">
      <Button
        type={selectedBrand === "all" ? "primary" : "default"}
        onClick={() => setSelectedBrand("all")}
      >
        Tất cả
      </Button>
      {brands.map((brand) => (
        <Button
          key={brand.id}
          type={selectedBrand === brand.id ? "primary" : "default"}
          onClick={() => {
            setSelectedBrand(brand.id);
          }}
        >
          {brand.name}
        </Button>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="favorites-container">
        <div className="page-header">
          <h2 className="mb-0">Sản phẩm yêu thích</h2>
        </div>
        <LoadingState />
      </div>
    );
  }

  const hasFavorites = filteredProducts && filteredProducts.length > 0;

  return (
    <div>
      <div className="container" style={{ marginTop: 80 }}>
        <div className="bread-crumb flex-w p-l-25 p-r-15 p-t-30 p-lr-0-lg">
          <a href="/" className="stext-109 cl8 hov-cl1 trans-04">
            Trang chủ
            <i className="fa fa-angle-right m-l-9 m-r-10" aria-hidden="true" />
          </a>
          <span className="stext-109 cl4">Sản phẩm yêu thích</span>
        </div>
      </div>

      <div className="container favorites">
        <div className="page-header">
          <h2 className="mb-0 titlelove">
            SẢN PHẨM YÊU THÍCH CỦA TÔI: (
            {hasFavorites ? filteredProducts.length : 0}) Sản phẩm
          </h2>
          <button
            className="btn btn-outline-primary"
            onClick={() => navigate("/")}
          >
            Tiếp tục mua sắm
          </button>
        </div>

        <div className="favoritesmunu">
          {renderBrandFilter()}

          <div className="search-container mb-3 flex">
            <Input.Search
              size="large"
              placeholder="Tìm kiếm sản phẩm yêu thích"
              onSearch={(value) => {
                setSearchTerm(value);
              }}
              enterButton
            />
          </div>

          {!hasFavorites ? (
            <div className="empty-state">
              <img
                style={{ width: 200, height: 200 }}
                src="./images/notfound.webp"
                alt="No favorites"
              />
              <p
                style={{ marginTop: 10, fontWeight: "bold", color: "#FF1493" }}
              >
                {searchTerm || selectedBrand !== "all"
                  ? "Không tìm thấy sản phẩm phù hợp!"
                  : "Chưa có sản phẩm yêu thích!"}
              </p>
              <button
                style={{ backgroundColor: "#FFC0CB", borderColor: "#FFC0CB" }}
                className="btn btn-primary btn-lg bg-prink"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedBrand("all");
                  navigate("/");
                }}
              >
                Khám phá sản phẩm
              </button>
            </div>
          ) : (
            <div className="row">
              {filteredProducts.map((product: Favorite) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onRemove={(id) => removeFavorite(id)}
                  onClick={(id) => navigate(`/product/${id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;
