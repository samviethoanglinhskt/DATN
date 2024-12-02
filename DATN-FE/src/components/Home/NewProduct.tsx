import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import instance from "src/config/axiosInstance";
import "bootstrap/dist/css/bootstrap.min.css";
import "src/components/css/NewProduct.css";
import { FavoriteButton } from "./FavoriteButton";

// Types
import { Product } from "src/types/product";

const NewProduct = () => {
  const INITIAL_VISIBLE_PRODUCTS = 4;
  const [visibleProducts, setVisibleProducts] = useState(INITIAL_VISIBLE_PRODUCTS);
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await instance.get("/api/product_new");
      return response.data;
    },
  });

  if (isLoading) return <div className="text-center my-5">Loading...</div>;
  if (isError)
    return (
      <div className="text-center text-danger my-5">
        Error: {error instanceof Error ? error.message : "Something went wrong"}
      </div>
    );

  const handleToggleProducts = () => {
    if (isExpanded) {
      setVisibleProducts(INITIAL_VISIBLE_PRODUCTS);
      setIsExpanded(false);
    } else {
      setVisibleProducts(products.data.length);
      setIsExpanded(true);
    }
  };

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <h3 className="text-center mb-5">Sản Phẩm Yêu Thích Nhất</h3>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
          {products.data.slice(0, visibleProducts).map((product: Product) => (
            <div key={product.id} className="col product-item">
              <div className="card h-100 product-card border-0">
                <div className="position-relative">
                  <div className="product-image-wrapper">
                    <img
                      src={`http://127.0.0.1:8000/storage/${product.image}`}
                      className="card-img-top product-image"
                      alt={product.name}
                    />
                  </div>
                  <FavoriteButton 
                    productId={product.id} 
                    className="position-absolute top-0 end-0 m-2"
                  />
                </div>
                <div className="card-body text-center">
                  <Link to={`/product/${product.id}`} className="product-link">
                    <h5 className="product-title">{product.name}</h5>
                  </Link>
                  <p className="product-price fw-bold">
                    {product.variants[0]?.price.toLocaleString("vi-VN")}đ
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {products.data.length > INITIAL_VISIBLE_PRODUCTS && (
          <div className="text-center mt-5">
            <button
              className={`btn ${isExpanded ? "btn-outline-danger" : "btn-outline-dark"}`}
              onClick={handleToggleProducts}
            >
              {isExpanded ? "Thu gọn" : "Xem thêm"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewProduct;