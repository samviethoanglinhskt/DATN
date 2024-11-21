import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message, Skeleton } from "antd";
import { useUser } from "src/context/User";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "src/config/axiosInstance";
import "./love.css";

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  variants: { price: number }[];
}

const ProductCard: React.FC<{
  product: Product;
  onRemove: (id: number) => void;
  isRemoving: boolean;
  onClick: (id: number) => void;
}> = React.memo(({ product, onRemove, isRemoving, onClick }) => {
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
              <Skeleton.Image style={{ width: "100%", height: "240px" }} active />
            </div>
          )}
          <img
            src={`http://127.0.0.1:8000/storage/${product.image}`}
            className={`product-img ${imageLoaded ? 'loaded' : ''}`}
            alt={product.name}
            onClick={() => onClick(product.id)}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
            //   setImageLoaded(true);
            //   (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
            }}
            loading="lazy"
          />
          {isHovered && imageLoaded && (
            <div className="remove-btn-wrapper">
              <button
                className="btn remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(product.id);
                }}
                disabled={isRemoving}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}
        </div>
        <div className="product-info">
          <h5 className="product-title" onClick={() => onClick(product.id)}>
            {product.name}
          </h5>
          <p className="product-description">
            {product.description || "Không có mô tả"}
          </p>
          <div className="price-action">
            <span className="price">
              {product.variants[0]?.price?.toLocaleString()}đ
            </span>
            <button
              className="btn btn-remove"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(product.id);
              }}
              disabled={isRemoving}
            >
              <i className="fas fa-heart-broken me-1"></i>
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

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

const FavoritesPage: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: favoriteProducts, isLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      if (!user) return [];
      try {
        const favoritesResponse = await axiosInstance.get("/api/favorites", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        
        const favoriteIds = favoritesResponse.data.map(
          (fav: any) => fav.tb_product_id
        );

        const products = await Promise.all(
          favoriteIds.map(async (id: number) => {
            try {
              const { data } = await axiosInstance.get(`/api/product/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
              });
              return {
                ...data,
                favoriteId: favoritesResponse.data.find(
                  (fav: any) => fav.tb_product_id === id
                )?.id,
                isFavorite: true,
              };
            } catch (error) {
              console.error(`Error fetching product ${id}:`, error);
              return null;
            }
          })
        );

        return products.filter(Boolean);
      } catch (error) {
        console.error("Error in favorites query:", error);
        message.error("Không thể tải danh sách yêu thích");
        return [];
      }
    },
    enabled: !!user,
    refetchOnWindowFocus: false,
    staleTime: 30000,
  });

  const removeFromFavorites = useMutation({
    mutationFn: async (productId: number) => {
      console.log(`Removing product with ID: ${productId}`); // Add this for debugging
      return await axiosInstance.delete(`/api/favorites/${productId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    },
    onSuccess: () => {
      message.success("Đã xóa khỏi danh sách yêu thích!");
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: (error) => {
      console.error("Error removing favorite:", error);
      message.error("Không thể xóa khỏi yêu thích. Vui lòng thử lại!");
    },
  });
  if (!user) {
    return (
      <div className="auth-container">
        <h2>Vui lòng đăng nhập để xem danh sách yêu thích</h2>
        <button
          className="btn btn-primary btn-lg mt-3"
          onClick={() => navigate("/login")}
        >
          Đăng nhập
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="favorites-container">
        <div className="page-header">
          <h2 className="mb-0">Sản phẩm yêu thích</h2>
        </div>
        <LoadingState />
      </div>
    );
  }

  const hasFavorites = favoriteProducts && favoriteProducts.length > 0;

  return (
    <div className="favorites-container">
      <div className="page-header">
        <h2 className="mb-0">
          Sản phẩm yêu thích ({hasFavorites ? favoriteProducts.length : 0})
        </h2>
        <button
          className="btn btn-outline-primary"
          onClick={() => navigate("/products")}
        >
          <i className="fas fa-shopping-bag me-2"></i>
          Tiếp tục mua sắm
        </button>
      </div>

      {!hasFavorites ? (
        <div className="empty-state">
          <i className="far fa-heart"></i>
          <p>Chưa có sản phẩm yêu thích</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate("/products")}
          >
            Khám phá sản phẩm
          </button>
        </div>
      ) : (
        <div className="row">
          {favoriteProducts.map((product: Product) => (
            <ProductCard
              key={product.id}
              product={product}
              onRemove={(id) => removeFromFavorites.mutate(id)}
              isRemoving={removeFromFavorites.isPending}
              onClick={(id) => navigate(`/products/${id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;