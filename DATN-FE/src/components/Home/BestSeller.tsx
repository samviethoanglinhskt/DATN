import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Product } from "src/types/product";
import axiosInstance from "../../config/axiosInstance";
import "bootstrap/dist/css/bootstrap.min.css";
import "src/assets/css/StoreOverview.css";

const StoreOverView = () => {
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/api/product-list");
        return response.data;
      } catch (error) {
        throw new Error("Call API thất bại");
      }
    },
  });

  if (isLoading) return <div className="text-center my-5">Loading...</div>;
  if (isError)
    return (
      <div className="text-center text-danger my-5">
        Error: {error instanceof Error ? error.message : "Something went wrong"}
      </div>
    );

  return (
    <section className="product-section py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="section-title">Related Products</h2>
          <div className="title-underline"></div>
        </div>

        <div className="slider">
          <div className="slide-track">
            {/* Original products */}
            {products.data.map((product: Product) => (
              <div key={product.id} className="slide">
                <div className="product-inner">
                  {product.variants[0]?.images[0] && (
                    <div className="product-image-wrapper">
                      <img
                        src="https://naidecor.vn/wp-content/uploads/2020/07/BST-MP-11.jpg"
                        className="product-image"
                        alt={product.name}
                      />
                      <div className="block2-btn">Mua Ngay</div>
                    </div>
                  )}
                  <div className="product-info">
                    <Link to={`/product/${product.id}`} className="product-link">
                      <h5 className="product-title">{product.name}</h5>
                    </Link>
                    <p className="product-price">
                      ${product.variants[0]?.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {/* Cloned products for seamless loop */}
            {products.data.map((product: Product) => (
              <div key={`clone-${product.id}`} className="slide">
                <div className="product-inner">
                  {product.variants[0]?.images[0] && (
                    <div className="product-image-wrapper">
                      <img
                        src="https://naidecor.vn/wp-content/uploads/2020/07/BST-MP-11.jpg"
                        className="product-image"
                        alt={product.name}
                      />
                      <div className="block2-btn">Mua Ngay</div>
                    </div>
                  )}
                  <div className="product-info">
                    <Link to={`/product/${product.id}`} className="product-link">
                      <h5 className="product-title">{product.name}</h5>
                    </Link>
                    <p className="product-price">
                      ${product.variants[0]?.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreOverView;